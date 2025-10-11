import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
  Treemap,
} from "recharts";

// --- Data Provided ---
const electricityProduction2025 = [
  { source: "Coal", value: 1331.6, type: "Non-Renewable" },
  { source: "Gas", value: 31.4, type: "Non-Renewable" },
  { source: "Oil", value: 0.4, type: "Non-Renewable" },
  { source: "Nuclear", value: 56.7, type: "Non-Renewable" },
  { source: "Hydro", value: 160.2, type: "Renewable" },
  { source: "Solar", value: 144.2, type: "Renewable" },
  { source: "Wind", value: 83.4, type: "Renewable" },
  { source: "Bio Energy", value: 15.9, type: "Renewable" },
];

const solarWindGrowth2025 = [
  { month: "Jan", solar: 23.2, wind: 10.5 },
  { month: "Feb", solar: 24.1, wind: 11.2 },
  { month: "Mar", solar: 25.5, wind: 12.7 },
  { month: "Apr", solar: 27.6, wind: 13.0 },
  { month: "May", solar: 22.4, wind: 18.0 },
  { month: "Jun", solar: 21.4, wind: 17.8 },
];

const hourlyGenerationProfile = [
  { hour: "00:00", coal: 78, solar: 0, wind: 6, hydro: 10, nuclear: 4, gas: 2 },
  { hour: "06:00", coal: 75, solar: 2, wind: 6, hydro: 11, nuclear: 4, gas: 2 },
  { hour: "12:00", coal: 62, solar: 18, wind: 5, hydro: 8, nuclear: 5, gas: 2 },
  { hour: "15:00", coal: 65, solar: 16, wind: 6, hydro: 6, nuclear: 5, gas: 2 },
  { hour: "18:00", coal: 74, solar: 2, wind: 8, hydro: 11, nuclear: 3, gas: 2 },
  { hour: "21:00", coal: 80, solar: 0, wind: 8, hydro: 7, nuclear: 3, gas: 2 },
];

const citations = [
  {
    id: 1,
    url: "https://www.sec.gov/Archives/edgar/data/2067602/000110465925095987/tm2513686-20_f1a.htm",
  },
  {
    id: 2,
    url: "https://www.sec.gov/Archives/edgar/data/2067602/000110465925089346/tm2513686-17_f1a.htm",
  },
  {
    id: 3,
    url: "https://www.sec.gov/Archives/edgar/data/2067602/000110465925086235/tm2513686-13_f1a.htm",
  },
  {
    id: 4,
    url: "https://www.sec.gov/Archives/edgar/data/2067602/000110465925079112/tm2513686-9_f1.htm",
  },
  {
    id: 5,
    url: "https://www.sec.gov/Archives/edgar/data/2040733/000182912625007780/greensolarenergy_f1a.htm",
  },
  {
    id: 6,
    url: "https://www.sec.gov/Archives/edgar/data/2040733/000182912625005001/greensolarenergy_f1a.htm",
  },
  {
    id: 7,
    url: "https://www.sec.gov/Archives/edgar/data/2040733/000182912625004652/greensolarenergy_f1a.htm",
  },
  { id: 8, url: "https://www.nature.com/articles/s41598-025-11316-z" },
  {
    id: 9,
    url: "https://www.tandfonline.com/doi/full/10.1080/15567036.2025.2505193",
  },
  { id: 10, url: "https://www.ijfmr.com/research-paper.php?id=53900" },
  { id: 11, url: "https://journalajr2p.com/index.php/AJR2P/article/view/202" },
  { id: 12, url: "https://www.nature.com/articles/s43247-025-02632-3" },
  { id: 13, url: "https://ijrpr.com/uploads/V6ISSUE4/IJRPR42746.pdf" },
  { id: 14, url: "https://journalwjaets.com/node/331" },
  { id: 15, url: "https://www.mdpi.com/2076-3417/15/12/6397" },
  { id: 16, url: "https://www.ijfmr.com/research-paper.php?id=43349" },
  { id: 17, url: "https://ieeexplore.ieee.org/document/11040915/" },
  {
    id: 18,
    url: "https://linkinghub.elsevier.com/retrieve/pii/S2589004222006708",
  },
  {
    id: 19,
    url: "https://www.tandfonline.com/doi/pdf/10.1080/14786451.2023.2285170?needAccess=true",
  },
  { id: 20, url: "https://arxiv.org/pdf/2211.05934.pdf" },
];

// --- Custom Components for Charts ---

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
        <p className="font-bold text-lg mb-2">{`${
          payload[0].payload.month || `Time: ${label}`
        }`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
            {`${entry.name}: ${entry.value.toFixed(1)}${entry.unit || ""}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

const CustomizedTreemapContent = React.memo(
  ({ root, depth, x, y, width, height, index, colors, name, value }) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: "#111827",
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {width > 80 && height > 25 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
          >
            {name} ({value.toFixed(0)} TWh)
          </text>
        ) : null}
      </g>
    );
  }
);

// --- Main Component Code ---

export default function BriefingView() {
  const treemapData = electricityProduction2025.map((d) => ({
    name: d.source,
    size: d.value,
  }));

  return (
    <div className="container mx-auto p-4 animate-fadeIn space-y-6">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        India's Energy Landscape (FY 2024-25)
      </h2>

      {/* New Energy Insights Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-400">
          Energy Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Solar Insights Card */}
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              ☀️ Solar Energy Insights
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <strong>Rapid Growth:</strong> India's installed solar capacity
                has crossed 100 GW, making it a key part of the national grid.
              </li>
              <li>
                <strong>Daytime Powerhouse:</strong> Most effective for daytime
                generation, directly reducing CO₂ emissions and helping meet
                sustainability goals.
              </li>
              <li>
                <strong>Durable & Flexible:</strong> Panels last over 25 years
                and can be paired with batteries to shift energy usage to the
                evening.
              </li>
              <li>
                <strong>Policy Dependent:</strong> Rooftop solar growth relies
                on government incentives and is sensitive to regulatory changes
                and costs.
              </li>
            </ul>
          </div>

          {/* Wind Insights Card */}
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              💨 Wind Energy Insights
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <strong>Major Contributor:</strong> Accounts for ~40% of India's
                renewable capacity, providing a huge share of clean electricity.
              </li>
              <li>
                <strong>Natural Complement to Solar:</strong> Generates power
                during the night and monsoon season, balancing the grid when
                solar is unavailable.
              </li>
              <li>
                <strong>Seasonal Potential:</strong> Wind power density is
                highest in June and lowest around October, influencing energy
                planning.
              </li>
              <li>
                <strong>Tech Advances:</strong> Modern turbine technology is
                constantly improving the efficiency and output of wind farms
                across India.
              </li>
            </ul>
          </div>

          {/* Integration Insights Card */}
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-4 text-green-400">
              🔗 Integration & Sustainability
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <strong>A Powerful Combination:</strong> Together, solar and
                wind could meet up to 90% of India's electricity demand by 2050
                with proper grid integration.
              </li>
              <li>
                <strong>Hybrid is the Future:</strong> Combining solar, wind,
                and battery storage creates a stable and reliable power supply,
                crucial for decarbonization.
              </li>
              <li>
                <strong>Key to Green Transport:</strong> These hybrid systems
                are vital for supporting the adoption of electric vehicles in
                cities by providing clean, reliable charging.
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-green-400">
              Key Takeaways
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">●</span>
                <div>
                  <strong className="text-white">The Solar Surge:</strong> Solar
                  power is the fastest-growing renewable source and nearly
                  equals hydro's contribution, crucial for daytime energy needs.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">●</span>
                <div>
                  <strong className="text-white">The Daily Challenge:</strong>{" "}
                  The grid heavily relies on coal to ramp up production after
                  sunset when solar generation drops to zero. This is the core
                  problem GaiaOS helps solve.
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-center text-purple-400">
              Solar vs. Wind Generation (H1 2025)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={solarWindGrowth2025}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="month" stroke="#cbd5e0" />
                <YAxis
                  stroke="#cbd5e0"
                  label={{
                    value: "TWh",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#cbd5e0",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="wind"
                  barSize={20}
                  fill="#8884d8"
                  name="Wind"
                  unit=" TWh"
                />
                <Line
                  type="monotone"
                  dataKey="solar"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Solar"
                  unit=" TWh"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-center text-teal-400">
              Electricity Generation Mix (TWh)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={treemapData}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={
                  <CustomizedTreemapContent
                    colors={[
                      "#ef4444",
                      "#f97316",
                      "#eab308",
                      "#84cc16",
                      "#22c55e",
                      "#14b8a6",
                      "#06b6d4",
                      "#3b82f6",
                    ]}
                  />
                }
              />
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-center text-blue-400">
              Typical Summer Day Generation Profile (%)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyGenerationProfile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="hour" stroke="#cbd5e0" />
                <YAxis stroke="#cbd5e0" unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="coal"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  name="Coal"
                  unit="%"
                />
                <Area
                  type="monotone"
                  dataKey="solar"
                  stackId="1"
                  stroke="#f9b208"
                  fill="#f9b208"
                  name="Solar"
                  unit="%"
                />
                <Area
                  type="monotone"
                  dataKey="wind"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Wind"
                  unit="%"
                />
                <Area
                  type="monotone"
                  dataKey="hydro"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="Hydro"
                  unit="%"
                />
                <Area
                  type="monotone"
                  dataKey="nuclear"
                  stackId="1"
                  stroke="#a855f7"
                  fill="#a855f7"
                  name="Nuclear"
                  unit="%"
                />
                <Area
                  type="monotone"
                  dataKey="gas"
                  stackId="1"
                  stroke="#f472b6"
                  fill="#f472b6"
                  name="Gas"
                  unit="%"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Citations Section (FIXED) */}
      <div className="mt-6 bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-gray-400">
          Data Sources & Citations
        </h3>
        <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 list-decimal list-inside text-xs text-gray-500">
          {citations.map((citation) => (
            <li key={citation.id} className="truncate">
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-200"
                aria-label={`Reference ${citation.id} source link`}
              >
                Reference [{citation.id}]
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
