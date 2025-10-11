import React, { useState } from "react";

export default function ArLensView({ data }) {
  const mockData = {
    appliances: [
      {
        name: "Air Conditioner",
        photoUrl:
          "https://images.unsplash.com/photo-1718203862467-c33159fdc504?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWlyJTIwY29uZGl0aW9uZXJ8ZW58MHx8MHx8fDA%3D",
        costPerDay: "₹45",
        kwhPerDay: "4.5 kWh",
        co2PerDay: "2.1 kg",
      },
      {
        name: "Refrigerator",
        photoUrl:
          "https://images.unsplash.com/photo-1721613877687-c9099b698faa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        costPerDay: "₹15",
        kwhPerDay: "1.5 kWh",
        co2PerDay: "0.7 kg",
      },
      {
        name: "Washing Machine",
        photoUrl:
          "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
