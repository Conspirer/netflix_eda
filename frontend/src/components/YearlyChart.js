import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function YearlyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/titles-per-year")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching chart data:", err));
  }, []);

  return (
    <div>
      <h2>📈 Netflix Titles Added Per Year</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="year_added" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Movies" fill="#ff4d4f" />
          <Bar dataKey="TV_Shows" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default YearlyChart;
