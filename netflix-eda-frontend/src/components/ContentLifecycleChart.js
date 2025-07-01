import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Legend, ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

function ContentLifecycleChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/content-lifecycle-roi")
      .then(res => res.json())
      .then(setData);
  }, []);

  // Separate Movie and TV Show data
  const movieData = data.filter(d => d.type === "Movie");
  const tvData = data.filter(d => d.type === "TV Show");

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        ⏳ Content Lifecycle ROI: Avg Years Before Acquisition
      </Typography>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={movieData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="rating"
  angle={-45}
  interval={0}
  height={100}
  tickMargin={15}  // 👈 This adds space between the bars and labels
/>

          <YAxis label={{ value: "Avg Years Between Release & Addition", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg_acquisition_lag" name="Movies" fill="#f57c00" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={tvData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="rating"
  angle={-45}
  interval={0}
  height={100}
  tickMargin={15}  // 👈 This adds space between the bars and labels
/>

          <YAxis label={{ value: "Avg Years Between Release & Addition", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg_acquisition_lag" name="TV Shows" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ContentLifecycleChart;
