import React, { useState, useEffect } from "react";
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

// Payment Method Selection Modal
const PaymentMethodModal = ({
  isOpen,
  onClose,
  onSelectMethod,
  amount,
  productInfo,
}) => {
  if (!isOpen) return null;

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "📱" },
    { id: "paypal", name: "PayPal", icon: "$" },
    { id: "card", name: "Card", icon: "💳" },
    { id: "wallet", name: "Wallet", icon: "👛" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Choose Payment Method
            </h2>
            <p className="text-gray-400 mt-1">
              Complete your eco-conscious purchase
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Purchase Details */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Product:</span>
              <span className="text-white font-semibold">
                {productInfo.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category:</span>
              <span className="text-white font-semibold">
                {productInfo.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-semibold">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Energy Saved:</span>
              <span className="text-green-400 font-semibold">
                {productInfo.energySaved}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-green-500 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="text-4xl mb-3">{method.icon}</div>
              <div className="text-white font-semibold text-lg">
                {method.name}
              </div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go back
        </button>
      </div>
    </div>
  );
};

// UPI Payment Modal
const UPIPaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  energySavedKwh,
}) => {
  if (!isOpen) return null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm();
        onClose();
        setIsSuccess(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-gray-800 rounded-3xl shadow-lg p-8 w-full max-w-md border border-gray-700 m-4">
        {isSuccess ? (
          <div className="text-center animate-fadeIn">
            <svg
              className="w-24 h-24 mx-auto text-green-500"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                d="M30 50 L45 65 L70 35"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tick-animation"
              />
              <style>{`.tick-animation { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 0.8s ease-out forwards; } @keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
            </svg>
            <h2 className="text-3xl font-bold mt-4 text-white">
              Payment Successful!
            </h2>
            <p className="text-gray-400 mt-2">
              Your purchase of{" "}
              <span className="text-green-400 font-semibold">Energy Bill</span>{" "}
              has been completed.
            </p>
            <div className="mt-6 bg-gray-900 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-white font-semibold">{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Energy Saved:</span>
                <span className="text-green-400 font-semibold">
                  {energySavedKwh} kWh
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white font-semibold">UPI</span>
              </div>
            </div>
            <button
              onClick={() => {
                onConfirm();
                onClose();
                setIsSuccess(false);
              }}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform active:scale-95"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-2 text-white">
              Confirm Payment
            </h2>
            <p className="text-center text-gray-400 mb-6">
              You are paying to GaiaOS Energy
            </p>
            <p className="text-6xl font-extrabold text-center text-blue-400 mb-6">
              {amount}
            </p>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter UPI PIN"
                maxLength="4"
                className="w-full bg-gray-700 text-white text-center text-2xl p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`w-full font-bold py-4 px-8 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg ${
                  isProcessing
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
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
                    Processing...
                  </div>
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-4 text-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Generic Payment Success Modal (for non-UPI methods)
const GenericPaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  method,
  energySavedKwh,
}) => {
  if (!isOpen) return null;

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  }, [isOpen]);

  const handleContinue = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-gray-800 rounded-3xl shadow-lg p-8 w-full max-w-md border border-gray-700 m-4">
        {isProcessing ? (
          <div className="text-center">
            <svg
              className="animate-spin h-16 w-16 mx-auto text-blue-500 mb-4"
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
            <h2 className="text-2xl font-bold text-white">
              Processing Payment...
            </h2>
            <p className="text-gray-400 mt-2">
              Please wait while we process your {method} payment
            </p>
          </div>
        ) : (
          <div className="text-center animate-fadeIn">
            <svg
              className="w-24 h-24 mx-auto text-green-500"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                d="M30 50 L45 65 L70 35"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tick-animation"
              />
              <style>{`.tick-animation { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 0.8s ease-out forwards; } @keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
            </svg>
            <h2 className="text-3xl font-bold mt-4 text-white">
              Payment Successful!
            </h2>
            <p className="text-gray-400 mt-2">
              Your purchase of{" "}
              <span className="text-green-400 font-semibold">Energy Bill</span>{" "}
              has been completed.
            </p>
            <div className="mt-6 bg-gray-900 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-white font-semibold">{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Energy Saved:</span>
                <span className="text-green-400 font-semibold">
                  {energySavedKwh} kWh
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white font-semibold">{method}</span>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform active:scale-95"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function WalletView({ data }) {
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

  // State Management
  const [solarShare, setSolarShare] = useState(
    walletData.current.sourceMix.solar
  );
  const [displayedGreenCoins, setDisplayedGreenCoins] = useState(
    walletData.current.greenCoins
  );
  const [displayedEnergyScore, setDisplayedEnergyScore] = useState(
    walletData.current.energyScore
  );

  // Payment Modal States
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] =
    useState(false);
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [isGenericPaymentModalOpen, setIsGenericPaymentModalOpen] =
    useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Bill calculation helper
  const calculateBill = (mix) => {
    const tariff = { coal: 10, solar: 2, wind: 3 };
    const totalKwh = walletData.current.kwh;
    const coalKwh = totalKwh * (mix.coal / 100);
    const solarKwh = totalKwh * (mix.solar / 100);
    const windKwh = totalKwh * (mix.wind / 100);
    return (
      coalKwh * tariff.coal + solarKwh * tariff.solar + windKwh * tariff.wind
    );
  };

  const [paidBillAmount, setPaidBillAmount] = useState(null);

  const newCoalShare = Math.max(
    0,
    walletData.current.sourceMix.coal -
      (solarShare - walletData.current.sourceMix.solar)
  );
  const newWindShare =
    walletData.current.sourceMix.wind +
    (walletData.current.sourceMix.coal - newCoalShare);
  const totalKwh = walletData.current.kwh;
  const sourceMix = {
    coal: newCoalShare,
    solar: solarShare,
    wind: newWindShare,
  };

  // Calculate current bill dynamically based on slider
  const currentBillAmount = calculateBill(sourceMix);

  // Display paid bill if payment was made, otherwise show dynamic current bill
  const billAmountToDisplay =
    paidBillAmount !== null ? paidBillAmount : currentBillAmount;
  const billAmountDisplay = billAmountToDisplay.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  // Calculate GreenCoins dynamically based on solar share increase
  const greenCoinsFromSolar = Math.floor(
    (solarShare - walletData.current.sourceMix.solar) * 2
  );
  const currentGreenCoins = walletData.current.greenCoins + greenCoinsFromSolar;

  // Calculate energy saved based on renewable usage
  const baselineCoalPercentage = walletData.current.sourceMix.coal; // Original coal usage
  const currentCoalPercentage = newCoalShare; // Current coal usage after slider adjustment
  const coalReduction = baselineCoalPercentage - currentCoalPercentage;
  const energySavedKwh = ((totalKwh * coalReduction) / 100).toFixed(2);

  const productInfo = {
    name: "Energy Bill",
    category: "Utility",
    energySaved: `${energySavedKwh} kWh`,
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setIsPaymentMethodModalOpen(false);

    if (method === "upi") {
      setIsUPIModalOpen(true);
    } else {
      setIsGenericPaymentModalOpen(true);
    }
  };

  // Payment confirmation handler
  const handleConfirmPayment = () => {
    const coinsEarned = 50;
    const startCoins = displayedGreenCoins;
    const endCoins = startCoins + coinsEarned;

    setPaidBillAmount(0);

    let startTime = null;
    const duration = 1000;
    const animateCoins = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      const easedT = 1 - Math.pow(1 - t, 3);
      const coins = Math.floor(startCoins + easedT * (endCoins - startCoins));
      setDisplayedGreenCoins(coins);
      if (progress < duration) {
        requestAnimationFrame(animateCoins);
      }
    };
    requestAnimationFrame(animateCoins);
  };

  const handleSliderChange = (e) => {
    const newSolarShare = parseInt(e.target.value);
    setSolarShare(newSolarShare);

    let newScore = 0;
    if (newSolarShare > 80) newScore = 95;
    else if (newSolarShare > 50) newScore = 80;
    else if (newSolarShare > 20) newScore = 60;
    else newScore = 40;
    setDisplayedEnergyScore(newScore);

    // Update GreenCoins display dynamically
    const greenCoinsFromSolar = Math.floor(
      (newSolarShare - walletData.current.sourceMix.solar) * 2
    );
    setDisplayedGreenCoins(walletData.current.greenCoins + greenCoinsFromSolar);
  };

  const getEnergyScoreVerdict = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Better";
    if (score >= 50) return "Good";
    return "Okay";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
          <p className="font-bold text-lg mb-1">{`Month: ${data.month}`}</p>
          <p className="text-sm text-green-400">{`Consumption: ${data.kwh} kWh`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 animate-fadeIn">
      {/* Payment Method Selection Modal */}
      <PaymentMethodModal
        isOpen={isPaymentMethodModalOpen}
        onClose={() => setIsPaymentMethodModalOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
        amount={billAmountDisplay}
        productInfo={productInfo}
      />

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={isUPIModalOpen}
        onClose={() => setIsUPIModalOpen(false)}
        onConfirm={handleConfirmPayment}
        amount={billAmountDisplay}
        energySavedKwh={energySavedKwh}
      />

      {/* Generic Payment Modal */}
      <GenericPaymentModal
        isOpen={isGenericPaymentModalOpen}
        onClose={() => setIsGenericPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
        amount={billAmountDisplay}
        method={selectedPaymentMethod}
        energySavedKwh={energySavedKwh}
      />

      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold mb-4 text-green-400">
          Energy Wallet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Bill Card with Pay Button */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner text-center transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
            <div>
              <h3 className="text-lg text-gray-400 mb-2">Current Bill</h3>
              <p className="text-4xl font-extrabold text-blue-400">
                {billAmountDisplay}
              </p>
              <p className="text-sm text-gray-300 mt-1">{totalKwh} kWh used</p>
            </div>
            <button
              onClick={() => setIsPaymentMethodModalOpen(true)}
              disabled={paidBillAmount === 0}
              className={`mt-4 w-full font-bold py-2 px-4 rounded-full transition-all duration-300 transform active:scale-95 shadow-md ${
                paidBillAmount === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {paidBillAmount === 0 ? "Bill Paid" : "Pay Bill"}
            </button>
          </div>

          {/* Energy Score Card */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg text-gray-400 mb-2">Energy Score</h3>
            <p className="text-4xl font-extrabold text-green-400">
              {displayedEnergyScore}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              {getEnergyScoreVerdict(displayedEnergyScore)}
            </p>
          </div>

          {/* GreenCoins Card */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg text-gray-400 mb-2">GreenCoins</h3>
            <div className="flex justify-center items-center space-x-2 transition-all duration-300">
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

        {/* Energy Source Mix */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Energy Source Mix
          </h3>
          <div className="relative w-full h-8 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full transition-all duration-700"
              style={{
                width: `${sourceMix.coal}%`,
                backgroundColor: "#ef4444",
              }}
            ></div>
            <div
              className="absolute h-full rounded-full transition-all duration-700"
              style={{
                width: `${sourceMix.solar}%`,
                left: `${sourceMix.coal}%`,
                backgroundColor: "#3b82f6",
              }}
            ></div>
            <div
              className="absolute h-full rounded-full transition-all duration-700"
              style={{
                width: `${sourceMix.wind}%`,
                left: `${sourceMix.coal + sourceMix.solar}%`,
                backgroundColor: "#10b981",
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

        {/* Historical Consumption Chart */}
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
