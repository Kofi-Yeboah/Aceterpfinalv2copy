import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";

const MEL_SECTIONS = [
  { id: "stats", label: "Statistics Cards" },
  { id: "gender", label: "Gender Distribution" },
  { id: "donor", label: "Funding by Donor Type" },
  { id: "indicator", label: "Indicator Achievement Trend" },
  { id: "grant", label: "Grant Utilization" },
  { id: "compliance", label: "Reporting Compliance Rate" },
  { id: "beneficiary", label: "Beneficiary Reach" },
];

export function MELDashboard() {
  const [dateFilter, setDateFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [donorFilter, setDonorFilter] = useState("all");
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(MEL_SECTIONS);

  // Gender distribution data
  const genderData = [
    { name: "Female", value: 163, color: "#E900AB" },
    { name: "Male", value: 102, color: "#0346FF" },
  ];

  // Funding by donor type data
  const donorData = [
    { name: "Government", value: 31000, color: "#FFC803" },
    { name: "Foundations", value: 23900, color: "#1DAB4B" },
    { name: "Bilateral", value: 14500, color: "#075985" },
    { name: "Private Sector", value: 39850, color: "#6B21A8" },
    { name: "Multilateral", value: 35000, color: "#00B3DB" },
  ];

  // Grant utilization data
  const grantData = [
    { name: "Grant A", utilization: 75.0 },
    { name: "Grant B", utilization: 80.0 },
    { name: "Grant C", utilization: 66.7 },
    { name: "Grant D", utilization: 66.7 },
    { name: "Grant E", utilization: 86.4 },
  ];

  // Indicator Achievement Trend Data
  const indicatorTrendData = [
    { month: "Jan", targetCount: 150, actualCount: 142 },
    { month: "Feb", targetCount: 165, actualCount: 168 },
    { month: "Mar", targetCount: 180, actualCount: 175 },
    { month: "Apr", targetCount: 195, actualCount: 198 },
    { month: "May", targetCount: 210, actualCount: 205 },
    { month: "Jun", targetCount: 225, actualCount: 230 },
  ];

  // Project Performance by Outcome Data
  const outcomePerformanceData = [
    { outcome: "Education", targetVal: 1200, achieved: 1150 },
    { outcome: "Health", targetVal: 980, achieved: 1020 },
    { outcome: "Livelihoods", targetVal: 750, achieved: 680 },
    { outcome: "Governance", targetVal: 450, achieved: 475 },
    { outcome: "Infrastructure", targetVal: 320, achieved: 315 },
  ];

  // Reporting Compliance Rate Data
  const reportingComplianceData = [
    { quarter: "Q1 2024", compliance: 88 },
    { quarter: "Q2 2024", compliance: 92 },
    { quarter: "Q3 2024", compliance: 85 },
    { quarter: "Q4 2024", compliance: 95 },
  ];

  // Data Quality Score Data
  const dataQualityData = [
    { project: "West Africa Study", score: 92 },
    { project: "Digital Economy", score: 88 },
    { project: "Climate Finance", score: 95 },
    { project: "Urban Dev Strategy", score: 85 },
    { project: "Health Systems", score: 90 },
  ];

  // Beneficiary Reach Progress Data
  const beneficiaryReachData = [
    { category: "Women", targetVal: 15000, actualVal: 14200 },
    { category: "Youth", targetVal: 12000, actualVal: 13100 },
    { category: "Elderly", targetVal: 8000, actualVal: 7500 },
    { category: "PWD", targetVal: 5000, actualVal: 5200 },
    { category: "Refugees", targetVal: 3000, actualVal: 2800 },
  ];

  // Filter grant data based on selected filters
  const filteredGrantData = grantData.filter(grant => {
    if (projectFilter !== "all" && !grant.name.includes(projectFilter)) return false;
    return true;
  });

  // Calculate total funding
  const totalFunding = donorData.reduce((sum, donor) => sum + donor.value, 0);

  // Filter donor data
  const filteredDonorData = donorFilter === "all" 
    ? donorData 
    : donorData.filter(donor => donor.name.toLowerCase() === donorFilter);

  return (
    <div className="p-8 bg-white overflow-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">MEL Dashboard</h1>
        
        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Grants</option>
            <option value="A">Grant A</option>
            <option value="B">Grant B</option>
            <option value="C">Grant C</option>
            <option value="D">Grant D</option>
            <option value="E">Grant E</option>
          </select>

          <select
            value={donorFilter}
            onChange={(e) => setDonorFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Donors</option>
            <option value="government">Government</option>
            <option value="foundations">Foundations</option>
            <option value="bilateral">Bilateral</option>
            <option value="private sector">Private Sector</option>
            <option value="multilateral">Multilateral</option>
          </select>
          <DashboardConfigPanel sections={MEL_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
        </div>
      </div>

      {/* Statistics Cards */}
      {isVisible("stats") && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-5">
          <div className="flex gap-6">
            {/* Total Active Projects */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                  <svg className="w-5 h-5 text-[#0901A3]" fill="currentColor" viewBox="0 0 19 19">
                    <path d="M3.297 2.507C2.371 3.432 2.371 4.923 2.371 7.903v3.161c0 2.98 0 4.471.926 5.397.926.926 2.416.926 5.396.926h1.581c2.98 0 4.471 0 5.397-.926.911-.911.925-2.368.926-5.254l-2.228 2.227a3.792 3.792 0 01-2.755 1.442c-.237.108-.472.186-.758.281l-1.827.61c-.592.197-1.244.043-1.685-.398-.441-.441-.595-1.093-.398-1.685l.216-.649.375-1.126.018-.052c.095-.286.173-.521.281-.758a3.792 3.792 0 011.442-2.755l3.166-3.166.879-.879.1-.1c.566-.566 1.307-.849 2.048-.848-.12-.815-.35-1.393-.798-1.84C14.745 1.58 13.254 1.58 10.274 1.58H8.693c-2.98 0-4.47 0-5.396.926zm2.433 4.606c0-.328.265-.593.593-.593h5.137c.327 0 .593.265.593.593 0 .327-.266.592-.593.592H6.323a.593.593 0 01-.593-.592zm0 3.161c0-.327.265-.592.593-.592h1.975c.328 0 .593.265.593.592 0 .328-.265.593-.593.593H6.323a.593.593 0 01-.593-.593zm0 3.162c0-.328.265-.593.593-.593h1.185c.328 0 .593.265.593.593 0 .327-.265.592-.593.592H6.323a.593.593 0 01-.593-.592z" />
                    <path d="M13.055 13.041c.138-.108.264-.233.515-.484l3.127-3.127c.076-.076.04-.206-.06-.241a3.793 3.793 0 01-1.359-1.188 3.793 3.793 0 01-.818-1.188c-.035-.101-.165-.137-.241-.06l-3.127 3.127c-.251.251-.377.376-.485.514a3.793 3.793 0 00-.674 1.52c-.076.194-.132.362-.244.699l-.145.435-.231.691-.216.649c-.055.165-.012.348.111.472.124.123.307.166.472.11l.649-.215.691-.232.435-.145c.337-.112.505-.168.664-.243a3.793 3.793 0 001.52-.675c.138-.107.263-.232.514-.483z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Total Active Projects</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">325</p>
            </div>

            <div className="w-px bg-slate-200" />

            {/* Upcoming Reporting Deadlines */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                  <svg className="w-5 h-5 text-purple-800" fill="none" viewBox="0 0 19 19">
                    <path d="M1.581 9.484c0 4.365 3.439 7.903 7.903 7.903 4.365 0 7.903-3.538 7.903-7.903S13.849 1.58 9.484 1.58" stroke="currentColor" strokeWidth="1.185" strokeLinecap="round" />
                    <path d="M9.484 7.113v3.161h3.161" stroke="currentColor" strokeWidth="1.185" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    <circle cx="9.484" cy="9.484" r="7.903" stroke="currentColor" strokeWidth="1.185" strokeDasharray="0.4 2.77" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Upcoming Reporting Deadlines</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">12</p>
            </div>

            <div className="w-px bg-slate-200" />

            {/* Budget Burn Rate */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                  <svg className="w-5 h-5 text-[#00B3DB]" fill="currentColor" viewBox="0 0 19 19">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.089 16.597h.79c2.98 0 4.471 0 5.397-.926.926-.926.926-2.416.926-5.397V5.531h-.395-12.646H2.766v4.743c0 2.98 0 4.471.926 5.397.926.926 2.417.926 5.397.926zm-1.916-7.81a.593.593 0 00-.06.698c0 .367 0 .551.06.697a.593.593 0 00.427.427c.145.06.33.06.698.06h2.371c.368 0 .552 0 .698-.06a.593.593 0 00.427-.427c.06-.146.06-.33.06-.698 0-.367 0-.551-.06-.697a.593.593 0 00-.427-.427c-.146-.06-.33-.06-.698-.06H8.298c-.368 0-.552 0-.698.06a.593.593 0 00-.427.427z" />
                    <path d="M1.58 3.953c0-.745 0-1.118.232-1.35.23-.23.603-.23 1.349-.23h12.645c.745 0 1.118 0 1.349.231.231.231.231.604.231 1.349 0 .745 0 1.118-.231 1.349-.231.231-.604.231-1.349.231H3.161c-.746 0-1.118 0-1.35-.231-.23-.231-.23-.604-.23-1.349z" opacity="0.5" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Overall Portfolio Budget Burn Rate (%)</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">52%</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Gender Distribution */}
        {isVisible("gender") && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="font-semibold text-slate-900 mb-4 pb-4 border-b border-slate-200">
            Gender Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {genderData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Funding By Donor Type */}
        {isVisible("donor") && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="font-semibold text-slate-900 mb-4 pb-4 border-b border-slate-200">
            Funding By Donor Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredDonorData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {filteredDonorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {filteredDonorData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}: Ghs {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Grant Utilization Chart */}
      {isVisible("grant") && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Grant Utilization: % Spent vs. Budget for Active Grants
          </h2>
          <div className="mt-6">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={filteredGrantData} 
                  layout="vertical"
                  margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80}
                    tick={{ fill: '#64748b', fontSize: 14 }}
                  />
                  <Tooltip 
                    formatter={(value: any) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="utilization" 
                    fill="#0B01D0" 
                    radius={[0, 4, 4, 0]}
                    label={{ 
                      position: 'right', 
                      formatter: (value: any) => `${value}%`,
                      fill: '#1e293b',
                      fontSize: 14
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Indicator Achievement Trend */}
        {isVisible("indicator") && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-900 mb-2">INDICATOR ACHIEVEMENT TREND</h2>
          <p className="text-sm text-slate-600 mb-4">Tracking monthly target vs. actual indicator achievement across all projects</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={indicatorTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Indicators Achieved', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${value} indicators`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="targetCount" stroke="#94a3b8" strokeWidth={2} name="Target Indicators" dot={{ fill: '#94a3b8', r: 4 }} />
              <Line type="monotone" dataKey="actualCount" stroke="#0B01D0" strokeWidth={2} name="Actual Achievement" dot={{ fill: '#0B01D0', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        )}

        {/* Project Performance by Outcome */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-900 mb-2">OUTCOME AREA PERFORMANCE</h2>
          <p className="text-sm text-slate-600 mb-4">Beneficiary targets vs. actual reach by outcome area</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={outcomePerformanceData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Number of Beneficiaries', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <YAxis 
                dataKey="outcome" 
                type="category" 
                width={100} 
                stroke="#64748b" 
                style={{ fontSize: '11px' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${value.toLocaleString()} beneficiaries`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="targetVal" fill="#94a3b8" name="Target" radius={[0, 4, 4, 0]} />
              <Bar dataKey="achieved" fill="#0B01D0" name="Achieved" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Reporting Compliance Rate */}
        {isVisible("compliance") && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-900 mb-2">REPORTING COMPLIANCE RATE</h2>
          <p className="text-sm text-slate-600 mb-4">Percentage of reports submitted on time by quarter</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportingComplianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="quarter" 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
                label={{ value: 'Compliance Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${value}%`, 'Compliance Rate']}
              />
              <Bar 
                dataKey="compliance" 
                fill="#0B01D0" 
                name="Compliance Rate" 
                radius={[4, 4, 0, 0]}
                label={{ 
                  position: 'top', 
                  formatter: (value: any) => `${value}%`,
                  fill: '#1e293b',
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}

        {/* Data Quality Score */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-900 mb-2">DATA QUALITY SCORE BY PROJECT</h2>
          <p className="text-sm text-slate-600 mb-4">Data quality assessment scores (0-100) for active projects</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataQualityData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Quality Score', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <YAxis 
                dataKey="project" 
                type="category" 
                width={130} 
                stroke="#64748b" 
                style={{ fontSize: '11px' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`Score: ${value}/100`, '']}
              />
              <Bar 
                dataKey="score" 
                fill="#0B01D0" 
                name="Quality Score" 
                radius={[0, 4, 4, 0]}
                label={{ 
                  position: 'right', 
                  formatter: (value: any) => `${value}`,
                  fill: '#1e293b',
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Beneficiary Reach Progress */}
      {isVisible("beneficiary") && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-900 mb-2">BENEFICIARY REACH PROGRESS BY CATEGORY</h2>
          <p className="text-sm text-slate-600 mb-4">Comparing target vs. actual beneficiaries reached across demographic categories</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={beneficiaryReachData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="category" 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Beneficiary Category', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Number of Beneficiaries', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${value.toLocaleString()} beneficiaries`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="targetVal" fill="#94a3b8" name="Target" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actualVal" fill="#0B01D0" name="Actual Reached" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}