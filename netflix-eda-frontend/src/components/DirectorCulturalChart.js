import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

function DirectorCulturalChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/global-director-metrics")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error fetching director metrics:", err));
  }, []);

  return (
    <div style={{ marginTop: '3rem' }}>
      <Typography variant="h5" gutterBottom>
        🌍 Global Director Cultural Versatility
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 180, bottom: 30 }}
          barCategoryGap={20}
        >
          <XAxis type="number" />
          <YAxis dataKey="director" type="category" width={160} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Countries" fill="#4caf50" barSize={20} />
          <Bar dataKey="Ratings" fill="#2196f3" barSize={20} />
          <Bar dataKey="Genres" fill="#9c27b0" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DirectorCulturalChart;
