import React from "react";
import Background from "./Background";

export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <Background />
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="space-y-4 mb-10">
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">
            GaiaOS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            The Energy Internet
          </p>
        </div>

        <p className="max-w-3xl text-lg md:text-xl text-gray-400 mb-12">
          Turning abstract electricity into a dynamic, gamified, financial
          ecosystem.
        </p>

        {/* Clickable Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 w-full">
          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 text-left cursor-pointer group hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl text-center font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              Energy Wallet
            </h3>
            <p className="text-gray-400">
              Track your bill, source mix, and get rewarded with GreenCoins.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 text-left cursor-pointer group hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl text-center font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              Seamless Payments
            </h3>
            <p className="text-gray-400 text-center">
              Pay bills instantly and earn GreenCoins with every transaction.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 text-left cursor-pointer group hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl text-center font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              AI Copilot
            </h3>
            <p className="text-gray-400">
              Get smart guidance on when to use appliances and save money.
            </p>
          </div>
        </div>

        <button
          onClick={onEnter}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          Enter GaiaOS
        </button>
      </div>
    </div>
  );
}
