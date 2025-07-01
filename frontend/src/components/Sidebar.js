import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { useTheme } from '../context/ThemeContext'; // 👈 import theme context
import './Sidebar.css';

function Sidebar() {
  const { darkMode } = useTheme(); // 👈 get dark mode status
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openStrategy, setOpenStrategy] = useState(true);
  const [openForecast, setOpenForecast] = useState(true);

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
      {/* DASHBOARD */}
      <div className="sidebar-section">
        <h2 onClick={() => setOpenDashboard(!openDashboard)} style={{ cursor: 'pointer' }}>
          📂 Dashboard {openDashboard ? '▾' : '▸'}
        </h2>
        {openDashboard && (
          <div className="sidebar-links">
            <Link to="summary" smooth={true} duration={500}>📋 Summary</Link>
            <Link to="titles-per-year" smooth={true} duration={500}>📈 Titles Per Year</Link>
            <Link to="genre-trend" smooth={true} duration={500}>🎭 Genre Trend</Link>
            <Link to="country-genre" smooth={true} duration={500}>🌍 Country vs Genre</Link>
          </div>
        )}
      </div>

      {/* STRATEGY */}
      <div className="sidebar-section">
        <h2 onClick={() => setOpenStrategy(!openStrategy)} style={{ cursor: 'pointer' }}>
          📊 Strategy {openStrategy ? '▾' : '▸'}
        </h2>
        {openStrategy && (
          <div className="sidebar-links">
            <Link to="family-penetration" smooth={true} duration={500}>👪 Family Penetration</Link>
            <Link to="content-timing" smooth={true} duration={500}>⏳ Content Timing</Link>
            <Link to="genre-rating" smooth={true} duration={500}>⭐ Genre Rating</Link>
            <Link to="director-reach" smooth={true} duration={500}>🎬 Director Reach</Link>
            <Link to="content-lag" smooth={true} duration={500}>⏱️ Content Lag</Link>
            <Link to="genre-sweetspot" smooth={true} duration={500}>🍬 Genre Sweet Spot</Link>
            <Link to="talent-effect" smooth={true} duration={500}>🎭 Talent Effect</Link>
            <Link to="content-lifecycle" smooth={true} duration={500}>📆 Content Lifecycle</Link>
            <Link to="region-content" smooth={true} duration={500}>🌎 Regional Content</Link>
            <Link to="gap-heatmap" smooth={true} duration={500}>📉 Content Gaps</Link>
          </div>
        )}
      </div>

      {/* FORECAST */}
      <div className="sidebar-section">
        <h2 onClick={() => setOpenForecast(!openForecast)} style={{ cursor: 'pointer' }}>
          🔮 Forecast {openForecast ? '▾' : '▸'}
        </h2>
        {openForecast && (
          <div className="sidebar-links">
            <Link to="genre-forecast" smooth={true} duration={500}>🔮 Genre Forecast</Link>
            <Link to="rating-forecast" smooth={true} duration={500}>🔮 Rating Forecast</Link>
            <Link to="country-forecast" smooth={true} duration={500}>🔮 Country Forecast</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
