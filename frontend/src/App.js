import React, { useEffect, useState } from 'react';
import { Element } from 'react-scroll';

import Sidebar from './components/Sidebar';
import { useTheme } from './context/ThemeContext';
import './components/Sidebar.css';

import YearlyChart from './components/YearlyChart';
import GenreTrendChart from './components/GenreTrendChart';
import CountryGenreHeatmap from './components/CountryGenreHeatmap';
import FamilyPenetrationChart from './components/FamilyPenetrationChart';
import ContentTimingChart from './components/ContentTimingChart';
import GenreRatingChart from './components/GenreRatingChart';
import DirectorCulturalChart from './components/DirectorCulturalChart';
import ContentLagChart from './components/ContentLagChart';
import GenreSweetSpotChart from "./components/GenreSweetSpotChart";
import TalentEffectChart from "./components/TalentEffectChart";
import ContentLifecycleChart from "./components/ContentLifecycleChart";
import RegionContentChart from "./components/RegionContentChart";
import ContentGapHeatmap from "./components/ContentGapHeatmap";
import GenreForecastChart from "./components/GenreForecastChart";
import RatingForecastChart from "./components/RatingForecastChart";
import CountryForecastChart from "./components/CountryForecastChart";

function App() {
  const [summary, setSummary] = useState(null);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetch("http://localhost:5000/api/summary")
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Error fetching summary:", err));
  }, []);

  const wrapperStyle = {
    marginLeft: '220px',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: darkMode ? '#1e1e1e' : '#f0f2f5',
    minHeight: '100vh',
    width: 'calc(100vw - 220px)',
    boxSizing: 'border-box',
    color: darkMode ? '#fff' : '#000'
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: darkMode ? '0 4px 10px rgba(255,255,255,0.1)' : '0 4px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  return (
    <div style={{ display: 'flex', overflowX: 'hidden', width: '100vw' }}>
      <Sidebar />
      <div style={wrapperStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>📊 Netflix EDA Dashboard</h1>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#555' : '#ddd',
              color: darkMode ? '#fff' : '#000',
              marginBottom: '2rem'
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Summary */}
        <Element name="summary">
          <div style={cardStyle}>
            {summary ? (
              <div>
                <p><strong>Total Titles:</strong> {summary.total_titles}</p>
                <p><strong>Total Movies:</strong> {summary.total_movies}</p>
                <p><strong>Total TV Shows:</strong> {summary.total_shows}</p>
                <p><strong>Earliest Release:</strong> {summary.earliest_year}</p>
                <p><strong>Latest Release:</strong> {summary.latest_year}</p>
              </div>
            ) : (
              <p>Loading summary data...</p>
            )}
          </div>
        </Element>

        {/* EDA Charts */}
        <Element name="titles-per-year"><div style={cardStyle}><YearlyChart /></div></Element>
        <Element name="genre-trend"><div style={cardStyle}><GenreTrendChart /></div></Element>
        <Element name="country-genre"><div style={cardStyle}><CountryGenreHeatmap /></div></Element>

        {/* Strategy */}
        <Element name="family-penetration"><div style={cardStyle}><FamilyPenetrationChart /></div></Element>
        <Element name="content-timing"><div style={cardStyle}><ContentTimingChart /></div></Element>
        <Element name="genre-rating"><div style={cardStyle}><GenreRatingChart /></div></Element>
        <Element name="director-reach"><div style={cardStyle}><DirectorCulturalChart /></div></Element>
        <Element name="content-lag"><div style={cardStyle}><ContentLagChart /></div></Element>
        <Element name="genre-sweetspot"><div style={cardStyle}><GenreSweetSpotChart /></div></Element>
        <Element name="talent-effect"><div style={cardStyle}><TalentEffectChart /></div></Element>
        <Element name="content-lifecycle"><div style={cardStyle}><ContentLifecycleChart /></div></Element>
        <Element name="region-content"><div style={cardStyle}><RegionContentChart /></div></Element>
        <Element name="gap-heatmap"><div style={cardStyle}><ContentGapHeatmap /></div></Element>

        {/* Forecast */}
        <Element name="genre-forecast"><div style={cardStyle}><GenreForecastChart /></div></Element>
        <Element name="rating-forecast"><div style={cardStyle}><RatingForecastChart /></div></Element>
        <Element name="country-forecast"><div style={cardStyle}><CountryForecastChart /></div></Element>
      </div>
    </div>
  );
}

export default App;
