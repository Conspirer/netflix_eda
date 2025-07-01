import React, { useEffect, useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

function TalentEffectChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/talent-effect")
    .then(res => res.json())
    .then(raw => {
      const sorted = raw.sort((a, b) => b.content_count - a.content_count);
      setData(sorted.slice(0, 12));  // 👈 show only top 12 directors
    });
}, []);


  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        🎬 Talent Network Effect: Directors with Rating Reach
      </Typography>
      <ResponsiveContainer width="100%" height={550}>
        <ScatterChart
          margin={{ top: 20, right: 40, bottom: 80, left: 80 }}
        >
          <CartesianGrid />
          <XAxis
            type="category"
            dataKey="director"
            name="Director"
            angle={-45}
            interval={0}
            height={120}
          />
          <YAxis
            type="number"
            dataKey="rating_diversity"
            name="Rating Diversity"
            label={{ value: "Number of Unique Ratings", angle: -90, position: "insideLeft" }}
          />
          <ZAxis type="number" dataKey="content_count" range={[60, 400]} name="Total Shows/Movies" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const d = payload[0].payload;
                return (
                  <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <p><strong>🎬 Director:</strong> {d.director}</p>
                    <p><strong>🎯 Rating Diversity:</strong> {d.rating_diversity}</p>
                    <p><strong>📦 Content Pieces:</strong> {d.content_count}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Director" data={data} fill="#f50057" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TalentEffectChart;
