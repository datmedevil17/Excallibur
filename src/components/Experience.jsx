import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { useEffect, useState } from "react";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";

export const Experience = ({ downgradedPerformance = false, playerData }) => {
  // Store players in a map for deterministic ordering
  const [playersMap, setPlayersMap] = useState({});

  useEffect(() => {
    // Register join handler before starting
    onPlayerJoin((state) => {
      // Create joystick for this player
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });

      // Initialize core stats
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);

      // If this is the local player, apply the full profile
      const isMe = state.id === myPlayer()?.id;
      if (isMe) {
        state.setState("profile2", {
          name:     playerData.name,
          address:  playerData.address,
          weapon:   playerData.weapon,
          color:    playerData.color,
          league:   playerData.league,
          photo:    playerData.photo,
          xp:       playerData.xp,
          roomCode: playerData.roomCode,
          token:    playerData.token,
        });
      }
      // Otherwise, do NOT override: remote clients will set their own profile2

      // Insert into our players map
      setPlayersMap((prev) => ({
        ...prev,
        [state.id]: { state, joystick },
      }));

      // Clean up when this player leaves
      state.onQuit(() => {
        setPlayersMap((prev) => {
          const next = { ...prev };
          delete next[state.id];
          return next;
        });
      });
    });

    // Finally, join the game
    insertCoin({ skipLobby: true }).catch(console.error);
  }, []);

  // Local bullet/hit state
  const [bullets, setBullets] = useState([]);
  const [hits, setHits] = useState([]);

  // Network-synced state
  const [networkBullets, setNetworkBullets] = useMultiplayerState("bullets", []);
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet) => setBullets((b) => [...b, bullet]);
  const onHit = (id, position) => {
    setBullets((b) => b.filter((x) => x.id !== id));
    setHits((h) => [...h, { id, position }]);
  };
  const onHitEnded = (id) => setHits((h) => h.filter((x) => x.id !== id));

  useEffect(() => setNetworkBullets(bullets), [bullets]);
  useEffect(() => setNetworkHits(hits), [hits]);

  const onKilled = (_victim, killer) => {
    const killerState = playersMap[killer]?.state;
    if (killerState) {
      killerState.setState(
        "kills",
        killerState.state.kills + 1
      );
    }
  };

  // Build render list: local first, then sorted remotes
  const localId = myPlayer()?.id;
  const localEntry = localId && playersMap[localId] ? [playersMap[localId]] : [];
  const others = Object.entries(playersMap)
    .filter(([id]) => id !== localId)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, entry]) => entry);
  const players = [...localEntry, ...others];

  return (
    <>
      <Map />
      {players.map(({ state, joystick }) => (
        <CharacterController
          key={state.id}
          state={state}
          userPlayer={state.id === localId}
          joystick={joystick}
          onFire={onFire}
          onKilled={onKilled}
          downgradedPerformance={downgradedPerformance}
        />
      ))}

      {/* Bullets & Hits */}
      {(isHost() ? bullets : networkBullets).map((b) => (
        <Bullet key={b.id} {...b} onHit={(pos) => onHit(b.id, pos)} />
      ))}
      {(isHost() ? hits : networkHits).map((h) => (
        <BulletHit key={h.id} {...h} onEnded={() => onHitEnded(h.id)} />
      ))}

      <Environment preset="sunset" />
    </>
  );
};
