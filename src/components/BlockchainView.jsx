import React, { useState, useEffect } from "react";

const BASE_URL =
  import.meta.env?.VITE_API_URL || "https://gaiaos-backend.onrender.com";

export default function BlockchainView({ data }) {
  const mockData = {
    leaderboard: [
      { rank: 1, society: "Green Valley Apartments", savings: "₹2,450" },
      { rank: 2, society: "Solar Heights", savings: "₹2,200" },
      { rank: 3, society: "Eco Gardens", savings: "₹1,980" },
      { rank: 4, society: "Wind Manor", savings: "₹1,750" },
      { rank: 5, society: "Your Society", savings: "₹1,650" },
    ],
    recentTrades: [
      { seller: "House 42", buyer: "EV Station", kwhTraded: "3.2" },
      { seller: "House 17", buyer: "Local School", kwhTraded: "2.8" },
      { seller: "House 93", buyer: "Neighborhood Center", kwhTraded: "4.1" },
      { seller: "House 28", buyer: "EV Station", kwhTraded: "1.9" },
    ],
  };

  const blockchainData = data || mockData;

  if (!blockchainData) return null;

  const [recentTrades, setRecentTrades] = useState(blockchainData.recentTrades);
  const [isLeaderboardAnimating, setIsLeaderboardAnimating] = useState(false);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  const [showRecentTradesFirst, setShowRecentTradesFirst] = useState(false);

  useEffect(() => {
    const tradeInterval = setInterval(() => {
      const newTrade = {
        seller: `House ${Math.floor(Math.random() * 100) + 1}`,
        buyer: ["EV Station", "Neighborhood Center", "Local School"][
          Math.floor(Math.random() * 3)
        ],
        kwhTraded: (Math.random() * 5).toFixed(1),
      };
      setRecentTrades((prevTrades) => [newTrade, ...prevTrades.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(tradeInterval);
  }, []);

  const handleSimulateTrade = async () => {
    setIsProcessingTrade(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`${BASE_URL}/api/trade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller: "Simulated House",
          buyer: "EV Station",
          kwh: 2,
        }),
      });
      if (!response.ok) {
        throw new Error("Trade simulation failed.");
      }
      const newTrade = {
        seller: "Simulated House",
        buyer: "EV Station",
        kwhTraded: "2.0",
      };
      setRecentTrades((prevTrades) => [newTrade, ...prevTrades]);
      setIsLeaderboardAnimating(true);
      setShowRecentTradesFirst(true);
      setTimeout(() => {
        setIsLeaderboardAnimating(false);
      }, 500);
    } catch (error) {
      console.error("Error during trade simulation:", error);
    } finally {
      setIsProcessingTrade(false);
    }
  };

  const recentTradesSection = (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-center mb-4">Recent Trades</h3>
      <ul className="space-y-2 text-sm text-gray-400">
        {recentTrades?.map((trade, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-900 p-2 rounded-lg shadow-sm"
          >
            <span>
              {trade?.seller} → {trade?.buyer}
            </span>
            <span className="font-semibold text-green-400">
              {trade?.kwhTraded} kWh
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const leaderboardSection = (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-center mb-4">
        Community Leaderboard
      </h3>
      <ul className="space-y-2">
        {blockchainData.leaderboard?.map((item, index) => (
          <li
            key={index}
            className={`flex justify-between items-center bg-gray-900 p-3 rounded-lg shadow-sm transition-transform duration-300 ${
              isLeaderboardAnimating ? "animate-pulse" : ""
            }`}
          >
            <span className="font-bold text-lg text-gray-400">
              #{item?.rank}
            </span>
            <span className="text-white text-lg flex-grow pl-4">
              {item?.society}
            </span>
            <span className="text-green-400 font-semibold">
              {item?.savings}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto p-4 animate-fadeIn">
      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold mb-6 text-pink-400">
          Trade (Blockchain) Grid
        </h2>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 mb-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
          <h3 className="text-xl font-semibold text-center mb-4">
            P2P Energy Trade
          </h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4 w-full justify-center">
              <div className="p-4 bg-gray-700 rounded-full shadow-lg">
                <p className="text-xl text-yellow-400 font-bold">House</p>
              </div>
              <svg
                className="w-12 h-12 text-blue-500 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.5 8.5l-4 4-4-4"
                ></path>
              </svg>
              <div className="p-4 bg-gray-700 rounded-full shadow-lg">
                <p className="text-xl text-green-400 font-bold">EV Station</p>
              </div>
            </div>
            <p className="text-gray-300 mt-2">
              Simulate a trade to see the power of the energy grid.
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleSimulateTrade}
              className={`bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
                isProcessingTrade ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessingTrade}
            >
              {isProcessingTrade ? (
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Simulate P2P Trade"
              )}
            </button>
          </div>
        </div>
        {showRecentTradesFirst ? (
          <>
            {recentTradesSection}
            <div className="h-6"></div>
            {leaderboardSection}
          </>
        ) : (
          <>
            {leaderboardSection}
            <div className="h-6"></div>
            {recentTradesSection}
          </>
        )}
      </div>
    </div>
  );
}
