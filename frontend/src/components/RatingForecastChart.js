import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

const COLORS = [
  "#ff5722", "#2196f3", "#4caf50", "#e91e63", "#ff9800", "#9c27b0"
];

function RatingForecastChart() {
  const [data, setData] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/rating-trend")
      .then(res => res.json())
      .then(raw => {
        setData(raw);
        const r = [...new Set(raw.map(r => r.rating))];
        setRatings(r);
      });
  }, []);

  const groupedData = {};
  data.forEach(({ release_year, rating, content_count }) => {
    if (!groupedData[release_year]) groupedData[release_year] = { release_year };
    groupedData[release_year][rating] = content_count;
  });

  const finalData = Object.values(groupedData);

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        🎬 Forecast: Rating Trends Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={finalData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="release_year" tickMargin={10} />
          <YAxis />
          <Tooltip />
          <Legend />
          {ratings.map((rating, i) => (
            <Line
              key={rating}
              type="monotone"
              dataKey={rating}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RatingForecastChart;
