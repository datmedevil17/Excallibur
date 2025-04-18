import React, { useState } from "react";

export default function CharacterSetup() {
  const [characterColor, setCharacterColor] = useState(50);
  const [gunColor, setGunColor] = useState(50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Header: Stats + Name Input */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div className="bg-gray-100 rounded-lg px-5 py-3 shadow-inner text-gray-700 font-semibold">
                TOKEN: <span className="text-blue-500">0</span>
              </div>
              <div className="bg-gray-100 rounded-lg px-5 py-3 shadow-inner text-gray-700 font-semibold">
                LEAGUE: <span className="text-indigo-500">Rookie</span>
                <span className="ml-2 text-gray-500">XP: 0/100</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your hero name"
                className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex flex-col lg:flex-row justify-between lg:space-x-12 space-y-8 lg:space-y-0">
          {/* Character Display */}
          <div
            className="relative p-6 bg-gradient-to-tr rounded-xl shadow-2xl"
            style={{ backgroundColor: `hsl(${characterColor * 3.6}, 40%, 90%)` }}
          >
            <div
              className="w-40 h-80 rounded-lg shadow-inner flex items-center justify-center"
              style={{ backgroundColor: `hsl(${characterColor * 3.6}, 40%, 60%)` }}
            >
              <span className="text-white font-bold text-lg uppercase tracking-wider">
                Hero
              </span>
            </div>
          </div>

          {/* Gun Preview */}
          <div
            className="relative p-6 bg-gradient-to-tr rounded-xl shadow-2xl flex flex-col items-center"
            style={{ backgroundColor: `hsl(${gunColor * 3.6}, 40%, 90%)` }}
          >
            <div
              className="w-48 h-24 rounded-lg shadow-inner flex items-center justify-center"
              style={{ backgroundColor: `hsl(${gunColor * 3.6}, 40%, 40%)` }}
            >
              <span className="text-white font-semibold uppercase tracking-wide">
                Rifle
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Character Color</label>
            <div className="w-full max-w-xl">
              <input
                type="range"
                min="0"
                max="100"
                value={characterColor}
                onChange={(e) => setCharacterColor(+e.target.value)}
                className="w-full h-2 rounded-full accent-indigo-500 cursor-pointer transition"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Gun Color</label>
            <div className="w-full max-w-xl">
              <input
                type="range"
                min="0"
                max="100"
                value={gunColor}
                onChange={(e) => setGunColor(+e.target.value)}
                className="w-full h-2 rounded-full accent-pink-500 cursor-pointer transition"
              />
            </div>
          </div>
        </div>

        {/* Play Button */}
        <div className="text-center">
          <button className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold uppercase tracking-wide py-3 px-12 rounded-full shadow-lg transform hover:scale-105 transition">
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
