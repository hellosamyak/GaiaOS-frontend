import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- API Configuration ---
// Fixed environment variable access for Vite
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
        return <BlockchainView data={blockchainData} />;
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
              className="text-white focus:outline-none relative w-8 h-8"
            >
              <span
                className={`block w-6 h-0.5 bg-white rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45" : "-translate-y-2"
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45" : "translate-y-2"
                }`}
              ></span>
            </button>
          </div>
          <ul className="hidden md:flex space-x-6 text-lg tracking-wide font-semibold">
            {["wallet", "copilot", "arLens", "blockchain"].map((view) => (
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
            ))}
          </ul>
        </nav>
      </header>

      {/* Fixed Mobile Menu - No transitions, pure CSS */}
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

// --- Background Component ---
function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, dodecahedron, particles;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.position.z = 5;

      // Dodecahedron (spinning shape)
      const dodecahedronGeometry = new THREE.DodecahedronGeometry(1.5, 0);
      const dodecahedronMaterial = new THREE.MeshPhongMaterial({
        color: 0x1c1c3a,
        emissive: 0x0a0a2a,
        shininess: 100,
        flatShading: true,
      });
      dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
      scene.add(dodecahedron);

      // Particle system
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
      }
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x1f2937,
        size: 0.05,
      });
      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x202020);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 1, 1);
      scene.add(directionalLight);

      // Handle window resize
      const onWindowResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onWindowResize);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // Animate dodecahedron
      dodecahedron.rotation.x += 0.005;
      dodecahedron.rotation.y += 0.005;

      // Animate particles
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", () => {});
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000"
    ></canvas>
  );
}

// --- View Components ---

// Landing Page
function LandingPage({ onEnter }) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              Energy Wallet
            </h3>
            <p className="text-gray-400">
              See not just ₹ but also kWh + source on your bill.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-bold text-purple-400 mb-2">
              AI Copilot
            </h3>
            <p className="text-gray-400">
              Smart assistant to guide you on when to save money.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-bold text-teal-400 mb-2">AR Lens</h3>
            <p className="text-gray-400">
              Point your camera at an appliance → see its cost & footprint.
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

// Energy Wallet View with mock data fallback
function WalletView({ data }) {
  // Mock data fallback if backend is not available
  const mockData = {
    current: {
      kwh: 450,
      sourceMix: { coal: 60, solar: 25, wind: 15 },
      greenCoins: 125,
      energyScore: 72,
    },
    history: [
      { month: "Jan", kwh: 420 },
      { month: "Feb", kwh: 380 },
      { month: "Mar", kwh: 450 },
      { month: "Apr", kwh: 390 },
      { month: "May", kwh: 470 },
      { month: "Jun", kwh: 450 },
    ],
  };

  const walletData = data || mockData;

  const [solarShare, setSolarShare] = useState(
    walletData.current.sourceMix.solar
  );
  const [isAnimatingGreenCoins, setIsAnimatingGreenCoins] = useState(false);
  const [displayedGreenCoins, setDisplayedGreenCoins] = useState(
    walletData.current.greenCoins
  );
  const [displayedEnergyScore, setDisplayedEnergyScore] = useState(
    walletData.current.energyScore
  );

  // Recalculate based on slider value
  const newCoalShare = Math.max(
    0,
    walletData.current.sourceMix.coal -
      (solarShare - walletData.current.sourceMix.solar)
  );
  const newWindShare =
    walletData.current.sourceMix.wind +
    (walletData.current.sourceMix.coal - newCoalShare);

  const totalKwh = walletData.current.kwh;
  const coalKwh = totalKwh * (newCoalShare / 100);
  const solarKwh = totalKwh * (solarShare / 100);
  const windKwh = totalKwh * (newWindShare / 100);

  // Mock tariffs: high for coal, low for solar/wind
  const tariff = {
    coal: 10, // ₹ per kWh
    solar: 2,
    wind: 3,
  };

  const newBillAmount =
    coalKwh * tariff.coal + solarKwh * tariff.solar + windKwh * tariff.wind;
  const billAmountDisplay = newBillAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  const newGreenCoins =
    walletData.current.greenCoins +
    Math.floor((solarShare - walletData.current.sourceMix.solar) * 2);

  const sourceMix = {
    coal: newCoalShare,
    solar: solarShare,
    wind: newWindShare,
  };

  // Number rolling animation for GreenCoins
  useEffect(() => {
    if (!isAnimatingGreenCoins) return;

    const start = displayedGreenCoins;
    const end = newGreenCoins;
    const duration = 500;
    let startTime = null;

    const animateRoll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const coins = Math.floor(start + easedT * (end - start));
      setDisplayedGreenCoins(coins);

      if (progress < duration) {
        requestAnimationFrame(animateRoll);
      } else {
        setDisplayedGreenCoins(end);
        setIsAnimatingGreenCoins(false);
      }
    };

    requestAnimationFrame(animateRoll);
  }, [isAnimatingGreenCoins, newGreenCoins, displayedGreenCoins]);

  const handleSliderChange = (e) => {
    const newSolarShare = parseInt(e.target.value);

    setSolarShare(newSolarShare);

    const newCoins =
      walletData.current.greenCoins +
      Math.floor((newSolarShare - walletData.current.sourceMix.solar) * 2);
    setDisplayedGreenCoins(newCoins);
    setIsAnimatingGreenCoins(true);

    // Update energy score verdict
    let newScore = 0;
    if (newSolarShare > 80) newScore = 95;
    else if (newSolarShare > 50) newScore = 80;
    else if (newSolarShare > 20) newScore = 60;
    else newScore = 40;
    setDisplayedEnergyScore(newScore);
  };

  const getEnergyScoreVerdict = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Better";
    if (score >= 50) return "Good";
    return "Okay";
  };

  // Custom tooltip for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80 transition-opacity duration-300">
          <p className="font-bold text-lg mb-1">{`Month: ${data.month}`}</p>
          <p className="text-sm text-green-400">{`Consumption: ${data.kwh} kWh`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 animate-fadeIn">
      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold mb-4 text-green-400">
          Energy Wallet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg text-gray-400 mb-2">Current Bill</h3>
            <p className="text-4xl font-extrabold text-blue-400">
              {billAmountDisplay}
            </p>
            <p className="text-sm text-gray-300 mt-1">{totalKwh} kWh used</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg text-gray-400 mb-2">Energy Score</h3>
            <p className="text-4xl font-extrabold text-green-400">
              {displayedEnergyScore}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              {getEnergyScoreVerdict(displayedEnergyScore)}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg text-gray-400 mb-2">GreenCoins</h3>
            <div
              className={`flex justify-center items-center space-x-2 transition-all duration-500 ${
                isAnimatingGreenCoins ? "scale-110 text-yellow-300" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2a1 1 0 100-2h-2zM4 11a1 1 0 100 2h2a1 1 0 100-2H4zM7 8a1 1 0 11-2 0 1 1 0 012 0zM14 7a1 1 0 100 2h2a1 1 0 100-2h-2zM5 4a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zM3 8a1 1 0 100 2h1a1 1 0 100-2H3zM16 11a1 1 0 100 2h1a1 1 0 100-2h-1z" />
              </svg>
              <p className="text-4xl font-extrabold text-yellow-400">
                {displayedGreenCoins}
              </p>
            </div>
            <p className="text-sm text-gray-300 mt-1">Rewards balance</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Energy Source Mix
          </h3>
          <div className="relative w-full h-8 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full transition-all duration-700"
              style={{
                width: `${sourceMix.coal}%`,
                backgroundColor: "#ef4444", // Red for coal
              }}
            ></div>
            <div
              className="absolute h-full rounded-full transition-all duration-700"
              style={{
                width: `${sourceMix.solar}%`,
                left: `${sourceMix.coal}%`,
                backgroundColor: "#3b82f6", // Blue for solar
              }}
            ></div>
            <div
              className="absolute h-full rounded-full transition-all duration-700"
              style={{
                width: `${sourceMix.wind}%`,
                left: `${sourceMix.coal + sourceMix.solar}%`,
                backgroundColor: "#10b981", // Green for wind
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-300">
            <span>Coal: {sourceMix.coal.toFixed(0)}%</span>
            <span>Solar: {sourceMix.solar.toFixed(0)}%</span>
            <span>Wind: {sourceMix.wind.toFixed(0)}%</span>
          </div>
          <div className="mt-6 flex justify-center">
            <input
              type="range"
              min="0"
              max="100"
              value={solarShare}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-500"
            />
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">
            Increase solar share to reduce your bill!
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Historical Consumption (kWh)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={walletData.history}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="month" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="kwh"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
                name="kWh Consumption"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// AI Copilot View with mock data fallback
function CopilotView({ data, setCopilotData }) {
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

        {/* Suggestion Card */}
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

        {/* Scheduler Simulation */}
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

// AR Lens View with mock data fallback
function ArLensView({ data }) {
  const mockData = {
    appliances: [
      {
        name: "Air Conditioner",
        photoUrl:
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
        costPerDay: "₹45",
        kwhPerDay: "4.5 kWh",
        co2PerDay: "2.1 kg",
      },
      {
        name: "Refrigerator",
        photoUrl:
          "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
        costPerDay: "₹15",
        kwhPerDay: "1.5 kWh",
        co2PerDay: "0.7 kg",
      },
      {
        name: "Washing Machine",
        photoUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        costPerDay: "₹8",
        kwhPerDay: "0.8 kWh",
        co2PerDay: "0.4 kg",
      },
    ],
  };

  const arData = data || mockData;

  if (!arData || !arData.appliances) return null;
  const [activeAppliance, setActiveAppliance] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (appliance) => {
    setIsScanning(true);
    // Simulate a scan delay
    setTimeout(() => {
      setActiveAppliance(appliance);
      setIsScanning(false);
    }, 1500);
  };

  const appliance = activeAppliance || arData.appliances[0];

  return (
    <div className="container mx-auto p-4 animate-fadeIn">
      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold mb-4 text-teal-400">
          AR Energy Lens
        </h2>
        <div className="flex flex-col items-center p-8 bg-gray-800 rounded-2xl shadow-inner border border-gray-700">
          <p className="text-xl text-gray-300 mb-4">
            Select an appliance to see its invisible energy footprint.
          </p>
          <div className="flex space-x-4 mb-8">
            {arData.appliances.map((appliance) => (
              <button
                key={appliance.name}
                onClick={() => handleScan(appliance)}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
              >
                <img
                  src={appliance.photoUrl}
                  alt={appliance.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="relative w-full h-96 rounded-2xl overflow-hidden border-2 border-dashed border-gray-700">
            {isScanning ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <>
                <img
                  src={appliance.photoUrl}
                  alt={appliance.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 p-4 flex flex-col items-center justify-center text-white transition-opacity duration-700">
                  <h3 className="text-xl font-bold mb-2 text-teal-400">
                    {appliance.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      Cost/Day:{" "}
                      <span className="font-semibold text-green-400">
                        {appliance.costPerDay}
                      </span>
                    </p>
                    <p>
                      kWh/Day:{" "}
                      <span className="font-semibold text-blue-400">
                        {appliance.kwhPerDay}
                      </span>
                    </p>
                    <p>
                      CO₂/Day:{" "}
                      <span className="font-semibold text-red-400">
                        {appliance.co2PerDay}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Blockchain View with mock data fallback
function BlockchainView({ data }) {
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

  // Auto-updating trade feed
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
      // Simulate network delay for a more realistic feel
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
      const tradeResult = await response.json();
      console.log("Trade successful:", tradeResult);

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
          Blockchain & Gamification
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
