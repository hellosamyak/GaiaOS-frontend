import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import ArLensView from "./components/ArLensView";
import BlockchainView from "./components/BlockchainView";
import CopilotView from "./components/CopilotView";
import WalletView from "./components/WalletView";
import BriefingView from "./components/BriefingView";

// --- API Configuration ---
const BASE_URL =
  import.meta.env?.VITE_API_URL || "https://gaiaos-backend.onrender.com";

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState("wallet");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [copilotData, setCopilotData] = useState(null);
  const [arLensData, setArLensData] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [walletRes, copilotRes, arLensRes, blockchainRes] =
        await Promise.all([
          fetch(`${BASE_URL}/api/wallet`),
          fetch(`${BASE_URL}/api/copilot`),
          fetch(`${BASE_URL}/api/ar-lens`),
          fetch(`${BASE_URL}/api/blockchain`),
        ]);

      if (
        !walletRes.ok ||
        !copilotRes.ok ||
        !arLensRes.ok ||
        !blockchainRes.ok
      ) {
        throw new Error("Failed to fetch data from one or more endpoints.");
      }

      const wallet = await walletRes.json();
      const copilot = await copilotRes.json();
      const arLens = await arLensRes.json();
      const blockchain = await blockchainRes.json();

      setWalletData(wallet);
      setCopilotData(copilot);
      setArLensData(arLens);
      setBlockchainData(blockchain);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
          <p className="text-xl">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-red-400">
          <p className="text-xl">Error: {error}</p>
          <p className="text-sm mt-2">
            Make sure your backend server is running and the URL is correct.
          </p>
        </div>
      );
    }

    switch (activeView) {
      case "wallet":
        return <WalletView data={walletData} />;
      case "copilot":
        return (
          <CopilotView data={copilotData} setCopilotData={setCopilotData} />
        );
      case "arLens":
        return <ArLensView data={arLensData} />;
      case "blockchain":
        return (
          <BlockchainView
            data={blockchainData}
            setBlockchainData={setBlockchainData}
          />
        );
      case "briefing":
        return <BriefingView />;
      default:
        return <WalletView data={walletData} />;
    }
  };

  const statusColor = error ? "bg-red-500" : "bg-green-500";
  const statusText = error ? "Disconnected" : "Connected";

  if (showLandingPage) {
    return <LandingPage onEnter={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-inter">
      <header className="p-4 bg-gray-900 shadow-lg relative z-20">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              GaiaOS
            </h1>
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`}
              ></span>
              <span className="text-sm text-gray-400">{statusText}</span>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 text-white focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md transition-all duration-300 hover:scale-110"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              <span
                className={`block w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2.5"
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
                  isMenuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
                  isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2.5"
                }`}
              ></span>
            </button>
          </div>
          <ul className="hidden md:flex space-x-6 text-lg tracking-wide font-semibold">
            {["wallet", "copilot", "arLens", "blockchain", "briefing"].map(
              (view) => (
                <li key={view}>
                  <button
                    onClick={() => {
                      setActiveView(view);
                      setIsMenuOpen(false);
                    }}
                    className={`py-2 px-4 rounded-full transition-all duration-300 ${
                      activeView === view
                        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg transform active:scale-95"
                        : "text-gray-300 hover:text-white hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-1 active:scale-95"
                    }`}
                  >
                    {view === "arLens"
                      ? "AR Lens"
                      : view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-4xl"
            >
              &times;
            </button>
          </div>
          <ul className="flex flex-col items-center justify-center h-full text-3xl space-y-8">
            {["wallet", "copilot", "arLens", "blockchain"].map((view) => (
              <li key={view}>
                <button
                  onClick={() => {
                    setActiveView(view);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {view === "arLens"
                    ? "AR Lens"
                    : view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full transition-all duration-500">
        {renderView()}
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm bg-gray-900 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} GaiaOS. All Rights Reserved.</p>
        <p className="mt-1">Powered by Team Krishna</p>
      </footer>
    </div>
  );
}
