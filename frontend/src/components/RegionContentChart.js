import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

const COLORS = [
  "#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0", "#ff5722",
  "#00bcd4", "#8bc34a", "#ffc107", "#673ab7", "#3f51b5", "#f44336"
];

function RegionContentChart() {
  const [data, setData] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/region-content-authority")
      .then(res => res.json())
      .then(raw => {
        setData(raw);
        const r = Object.keys(raw[0] || {}).filter(k => k !== "country");
        setRatings(r);
      });
  }, []);

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        🌍 Regional Content Authority: Rating Stack by Country
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="country"
            angle={-45}
            interval={0}
            height={120}
            tickMargin={15}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {ratings.map((rating, idx) => (
            <Bar
              key={rating}
              dataKey={rating}
              stackId="a"
              fill={COLORS[idx % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RegionContentChart;
