import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function GenreTrendChart() {
  const [topGenres, setTopGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Get top 5 genres
  useEffect(() => {
    fetch("http://localhost:5000/api/top-genres")
      .then(res => res.json())
      .then(data => {
        setTopGenres(data);
        setSelectedGenre(data[0]); // Default: first genre selected
      });
  }, []);

  // Get genre over time chart data when selection changes
  useEffect(() => {
    if (!selectedGenre) return;

    fetch("http://localhost:5000/api/genres-over-time")
      .then(res => res.json())
      .then(raw => {
        const filtered = raw.filter(item => item.genre === selectedGenre);

        const grouped = {};
        filtered.forEach(item => {
          const year = item.year_added;
          const count = item.count;
          if (!grouped[year]) grouped[year] = { year_added: year, count };
          else grouped[year].count += count;
        });

        const processed = Object.values(grouped).sort((a, b) => a.year_added - b.year_added);
        setChartData(processed);
      });
  }, [selectedGenre]);

  return (
    <div>
      <h2>📈 Genre Popularity Over Time</h2>

      {/* Display Top 5 Genres */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>Top Genres:</strong>
        <ul>
          {topGenres.map((genre, idx) => (
            <li key={idx}>{genre}</li>
          ))}
        </ul>
      </div>

      {/* Dropdown to Select Genre */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Select Genre:</strong>{' '}
          <select
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {topGenres.map((genre, idx) => (
              <option key={idx} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="year_added" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name={selectedGenre}
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GenreTrendChart;
