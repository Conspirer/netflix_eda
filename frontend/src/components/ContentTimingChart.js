import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

function ContentTimingChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/content-timing")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load content timing data:", err));
  }, []);

  // Transform to grouped bar format
  const groupedData = [];
  const ratings = new Set();

  data.forEach(item => {
    ratings.add(item.rating);
    const monthIndex = groupedData.findIndex(d => d.month === item.month);
    if (monthIndex >= 0) {
      groupedData[monthIndex][item.rating] = item.count;
    } else {
      groupedData.push({ month: item.month, [item.rating]: item.count });
    }
  });

  const colors = {
  'TV-MA': '#f44336',
  'TV-14': '#ff9800',
  'TV-PG': '#ffc107',
  'PG': '#4caf50',
  'PG-13': '#9c27b0', // 🔥 New
  'R': '#607d8b',     // 🔥 New
  'TV-G': '#03a9f4',
  'TV-Y7': '#673ab7',
  'TV-Y': '#009688'
};


  return (
  <div style={{ marginTop: '3rem' }}>
    <Typography variant="h5" gutterBottom>
      📅 Cultural Content Timing Strategy
    </Typography>

    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={groupedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // enough room for angled months
      >
        <XAxis 
          dataKey="month" 
          angle={-45} 
          textAnchor="end" 
          interval={0} 
        />
        <YAxis />
        <Tooltip />
        {[...ratings].map((rating) => (
          <Bar
            key={rating}
            dataKey={rating}
            stackId="a"
            fill={colors[rating] || "#8884d8"}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>

    {/* Custom Legend (outside) */}
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
      {[...ratings].map((rating) => (
        <div key={rating} style={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 12, height: 12, backgroundColor: colors[rating] || '#8884d8',
            marginRight: 6, borderRadius: 2
          }} />
          <span style={{ fontSize: 13 }}>{rating}</span>
        </div>
      ))}
    </div>
  </div>
);

}

export default ContentTimingChart;
