import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { Typography } from "@mui/material";

const COLORS = [
  "#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0", "#00bcd4"
];

function CountryForecastChart() {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/country-trend")
      .then(res => res.json())
      .then(raw => {
        setData(raw);
        const c = [...new Set(raw.map(r => r.country))];
        setCountries(c);
      });
  }, []);

  const groupedData = {};
  data.forEach(({ release_year, country, content_count }) => {
    if (!groupedData[release_year]) groupedData[release_year] = { release_year };
    groupedData[release_year][country] = content_count;
  });

  const finalData = Object.values(groupedData);

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        🌍 Country Content Output Trends (2000–Now)
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
          {countries.map((c, i) => (
            <Line
              key={c}
              type="monotone"
              dataKey={c}
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

export default CountryForecastChart;
