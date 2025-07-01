import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

function ContentLagChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/lifecycle-lag")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error fetching lag data:", err));
  }, []);

  return (
    <div style={{ marginTop: '3rem' }}>
      <Typography variant="h5" gutterBottom>
        ⏳ Content Lifecycle Lag: Release Year vs Netflix Addition
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 180, bottom: 30 }}
          barCategoryGap={15}
        >
          <XAxis type="number" label={{ value: "Avg. Lag (Years)", position: "insideBottomRight", offset: -10 }} />
          <YAxis
            type="category"
            dataKey={(d) => `${d.rating} - ${d.type}`}
            width={200}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="lag_years" fill="#ff9800" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ContentLagChart;
