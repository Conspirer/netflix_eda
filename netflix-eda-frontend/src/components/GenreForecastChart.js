import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

const COLORS = [
  "#ff5722", "#2196f3", "#4caf50", "#e91e63", "#ff9800", "#9c27b0"
];

function GenreForecastChart() {
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/genre-trend")
      .then(res => res.json())
      .then(raw => {
        setData(raw);
        const uniqueGenres = [...new Set(raw.map(r => r.genre))];
        setGenres(uniqueGenres);
      });
  }, []);

  const groupedData = {};
  data.forEach(({ release_year, genre, content_count }) => {
    if (!groupedData[release_year]) groupedData[release_year] = { release_year };
    groupedData[release_year][genre] = content_count;
  });

  const finalData = Object.values(groupedData);

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        🔮 Forecast: Genre Growth Over Time (2000–Now)
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
          {genres.map((g, i) => (
            <Line
              key={g}
              type="monotone"
              dataKey={g}
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

export default GenreForecastChart;
