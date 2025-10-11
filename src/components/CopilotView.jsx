import React, { useState } from "react";

const BASE_URL =
  import.meta.env?.VITE_API_URL || "https://gaiaos-backend.onrender.com";

export default function CopilotView({ data, setCopilotData }) {
  const mockData = {
    title: "Shift Your Dishwasher Usage",
    tip: "Run your dishwasher during off-peak hours (11 PM - 6 AM) when electricity rates are lower",
    savings: 85,
    co2Reduction: 12,
  };

  const copilotData = data || mockData;

  const [isShifted, setIsShifted] = useState(false);
  const initialTime = "8:00 PM";
  const shiftedTime = "2:30 AM";
  const savings = isShifted ? copilotData.savings : 0;
  const co2Reduction = isShifted ? copilotData.co2Reduction : 0;

  const handleShift = () => {
    setIsShifted(!isShifted);
  };

  const fetchNewTip = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/copilot`);
      if (!response.ok) {
        throw new Error("Failed to fetch new tip.");
      }
      const newTip = await response.json();
      setCopilotData(newTip);
    } catch (err) {
      console.error("Error fetching new tip:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fadeIn">
      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold mb-4 text-purple-400">
          AI Energy Copilot
        </h2>
        <div className="bg-gray-800 p-6 rounded-2xl mb-8 shadow-inner border border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
          <h3 className="text-xl font-semibold text-center mb-4">
            Energy Saving Tip
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="w-12 h-12 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 10a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold">{copilotData.title}</p>
              <p className="text-gray-400 mt-1">{copilotData.tip}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-center">
            <div className="bg-gray-900 p-4 rounded-xl shadow-inner">
              <p className="text-green-400 text-2xl font-bold">₹{savings}</p>
              <p className="text-sm text-gray-400">Savings</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl shadow-inner">
              <p className="text-green-400 text-2xl font-bold">
                {co2Reduction}%
              </p>
              <p className="text-sm text-gray-400">CO₂ Reduction</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={fetchNewTip}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              Generate Another Tip
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4">Scheduler Simulation</h3>
          <div className="relative w-full h-12 bg-gray-600 rounded-full overflow-hidden mb-6">
            <div
              className={`absolute h-full rounded-full transition-all duration-700 ease-in-out ${
                isShifted
                  ? "w-1/4 left-1/4 bg-green-500"
                  : "w-1/4 left-1/2 bg-blue-500"
              }`}
            ></div>
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold transition-all duration-700 ${
                isShifted ? "text-white" : "text-white"
              }`}
            >
              Device Usage
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-gray-400">
              <p className="font-semibold">Current Time:</p>
              <p className="text-lg text-white">{initialTime}</p>
            </div>
            <div className="text-gray-400">
              <p className="font-semibold">Optimized Time:</p>
              <p className="text-lg text-green-400">{shiftedTime}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleShift}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              Simulate Shift
            </button>
          </div>
          {isShifted && (
            <p className="text-green-400 mt-4 text-xl animate-pulse">
              Projected Savings: ₹{savings}!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
