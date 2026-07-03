import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [logs, setLogs] = useState([]);
  const [criticalLogs, setCriticalLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [level, setLevel] = useState("INFO");
  const [message, setMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const loadData = () => {
    setLastUpdated(new Date());
  axios
    .get("https://ai-logpulse.onrender.com/dashboard")
    .then((response) => {
      setDashboard(response.data);
    });

  axios
    .get("https://ai-logpulse.onrender.com/logs")
    .then((response) => {
      setLogs(response.data);
    });

  axios
    .get("https://ai-logpulse.onrender.com/dashboard/errors")
    .then((response) => {
      setCriticalLogs(response.data);
    });
};
useEffect(() => {
  loadData();

  const interval = setInterval(() => {
    loadData();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const addLog = () => {
  axios
    .post("https://ai-logpulse.onrender.com/logs", {
      level,
      message,
    })
    .then(() => {
  setMessage("");
  loadData();
})
    .catch((err) => console.log(err));
};

  if (!dashboard) {
    return <h1>Loading...</h1>;
  }

  const chartData = {
    labels: ["Error", "Warning", "Info"],
    datasets: [
      {
        data: [
          dashboard.error_logs,
          dashboard.warning_logs,
          dashboard.info_logs,
        ],
        backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"],
      },
    ],
  };

  const barData = {
    labels: ["Error", "Warning", "Info"],
    datasets: [
      {
        label: "Number of Logs",
        data: [
          dashboard.error_logs,
          dashboard.warning_logs,
          dashboard.info_logs,
        ],
        backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"],
      },
    ],
  };
  const filteredLogs = logs.filter((log) => {
  const matchesSearch = log.message
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "ALL" || log.level === filter;

  return matchesSearch && matchesFilter;
});
  return (
  <div className="dashboard">
      <div className="header">

  <div className="logo-section">

    <img
      src="/ai_logpulse_symbol_only.png"
      alt="AI LogPulse Logo"
      className="logo"
    />
    <div>
      <h1>
        <span className="ai-text">AI</span> LogPulse
      </h1>
      <p>AI Powered Log Monitoring & Anomaly Detection</p>
    </div>
  </div>
  <div className="live-status">
    <span className="dot"></span>
    Live Monitoring
  </div>
</div>
      <div className="add-log-card">
  <h2>➕ Add New Log</h2>

  <select
  className="log-input"
  value={level}
  onChange={(e) => setLevel(e.target.value)}
>
  <option>INFO</option>
  <option>WARNING</option>
  <option>ERROR</option>
</select>

  <input
  className="log-input"
  type="text"
  placeholder="Enter log message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>

  <button
  className="add-btn"
  onClick={addLog}
>
  ➕ Add Log
</button>
</div>  


      {/* Dashboard Cards */}

      <div className="cards">
        <div className="card">
          <h3>Total Logs</h3>
          <h1>{dashboard.total_logs}</h1>
        </div>

        <div className="card">
          <h3>Error Logs</h3>
          <h1>{dashboard.error_logs}</h1>
        </div>

        <div className="card">
          <h3>Warning Logs</h3>
          <h1>{dashboard.warning_logs}</h1>
        </div>

        <div className="card">
          <h3>Info Logs</h3>
          <h1>{dashboard.info_logs}</h1>
        </div>
      </div>

<div className="analytics-grid">

  {/* Pie Chart */}
  <div className="chart-card pie-card">
    <h2>📊 Log Distribution</h2>
    <Pie data={chartData} />
  </div>

  {/* Bar Chart */}
  <div className="chart-card">
    <h2>📈 Logs Overview</h2>
    <Bar data={barData} />
  </div>

  {/* Live Monitoring */}
  <div className="live-monitor-card">
    <h3>🟢 Live Monitoring</h3>

    <div className="monitor-row">
      <span>Backend</span>
      <span className="online">🟢 Online</span>
    </div>

    <div className="monitor-row">
      <span>Database</span>
      <span className="online">🟢 Connected</span>
    </div>

    <div className="monitor-row">
      <span>Auto Refresh</span>
      <span>5 sec</span>
    </div>

    <div className="monitor-row">
      <span>Last Updated</span>
      <span>{lastUpdated.toLocaleTimeString()}</span>
    </div>
  </div>

</div>
      {/* Critical Alerts */}

<div
  style={{
    marginTop: "40px",
    background: "#1e293b",
    borderRadius: "15px",
    padding: "25px",
    border: "1px solid #334155",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  }}
>
  <h2
    style={{
      color: "#ef4444",
      marginBottom: "20px",
    }}
  >
    🚨 Critical Alerts ({criticalLogs.length})
  </h2>

  {criticalLogs.length === 0 ? (
    <p style={{ color: "#94a3b8" }}>No Critical Alerts</p>
  ) : (
    criticalLogs.map((log) => (
      <div
        key={log.id}
        style={{
          background: "#334155",
          color: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "15px",
          borderLeft: "6px solid red",
        }}
      >
        <h3>{log.message}</h3>

        <p style={{ color: "#cbd5e1" }}>
          {log.timestamp}
        </p>

        <strong style={{ color: "#ef4444" }}>
          {log.risk}
        </strong>
      </div>
    ))
  )}
</div>
<div className="search-section">
  <input
  className="search-box"
  type="text"
  placeholder="🔍 Search logs..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
</div>
<div
  style={{
    marginTop: "15px",
    marginBottom: "20px",
  }}
>
  {["ALL", "ERROR", "WARNING", "INFO"].map((item) => (
    <button
      key={item}
      onClick={() => setFilter(item)}
      className={filter === item ? "filter-btn active" : "filter-btn"}
    >
      {item}
    </button>
  ))}
</div>


      {/* Recent Logs */}

      <h2 style={{ marginTop: "40px" }}>Recent Logs</h2>

      <div className="logs-card">

<h2>📋 Recent Logs</h2>

<div className="table-container">

<table className="logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Level</th>
            <th>Message</th>
            <th>Risk</th>
            <th>Timestamp</th>
          </tr>
        </thead>

<tbody>
  {filteredLogs.map((log) => (
    <tr key={log.id}>
      <td>{log.id}</td>

      <td>
        <span
          className={
            log.level === "ERROR"
              ? "badge error"
              : log.level === "WARNING"
              ? "badge warning"
              : "badge info"
          }
        >
          {log.level}
        </span>
      </td>

      <td>{log.message}</td>

      <td>
        <span
          className={
            log.risk === "CRITICAL"
              ? "badge critical"
              : log.risk === "MEDIUM"
              ? "badge warning"
              : "badge info"
          }
        >
          {log.risk}
        </span>
      </td>

      <td>{log.timestamp}</td>
    </tr>
  ))}
</tbody>
      </table>

</div>

</div>
<footer className="footer">
  <p>🚀 AI LogPulse | Developed by Sujan P
    React | FastAPI • PostgreSQL • Chart.js
  </p>
</footer>
    </div>
  );
}
export default App;