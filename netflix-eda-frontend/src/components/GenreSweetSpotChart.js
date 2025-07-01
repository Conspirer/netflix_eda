import React, { useEffect, useState } from "react";
import {
  ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Scatter, ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

function GenreSweetSpotChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sweet-spot")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        🎯 Genre-Rating Sweet Spot Finder
      </Typography>
      <ResponsiveContainer width="100%" height={550}>
        <ScatterChart
          margin={{ top: 20, right: 40, bottom: 60, left: 80 }}
        >
          <XAxis
            type="number"
            dataKey="country_count"
            name="Country Spread"
            label={{ value: "🌍 Country Count", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="avg_duration"
            name="Avg Duration"
            label={{ value: "⏱️ Avg Duration (min)", angle: -90, position: "insideLeft" }}
          />
          <ZAxis type="number" dataKey="content_count" range={[60, 400]} />
          <Tooltip
  cursor={{ strokeDasharray: "3 3" }}
  content={({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
          <p><strong>🎭 Genre:</strong> {data.genre}</p>
          <p><strong>🔖 Rating:</strong> {data.rating}</p>
          <p><strong>🌍 Countries:</strong> {data.country_count}</p>
          <p><strong>⏱️ Avg Duration:</strong> {Math.round(data.avg_duration)} min</p>
          <p><strong>📦 Content Count:</strong> {data.content_count}</p>
        </div>
      );
    }
    return null;
  }}
/>

          <Scatter
            name="Genre-Rating"
            data={data}
            fill="#673ab7"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GenreSweetSpotChart;
