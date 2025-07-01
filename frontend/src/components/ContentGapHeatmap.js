import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, Tooltip
} from "recharts";
import {
  Typography, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList
} from "recharts";

function ContentGapHeatmap() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/content-gap-arbitrage")
      .then(res => res.json())
      .then(raw => {
        setData(raw);
        const topCountry = [...new Set(raw.map(r => r.country))][0];
        setSelectedCountry(topCountry);
      });
  }, []);

  const countries = [...new Set(data.map(d => d.country))];

  const filtered = data
    .filter(d => d.country === selectedCountry)
    .sort((a, b) => b.content_count - a.content_count)
    .slice(0, 25); // Limit for readability

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        📉 Content Gap Arbitrage: Underserved Genre-Rating Niches
      </Typography>

      <FormControl fullWidth style={{ maxWidth: 300, marginBottom: "1rem" }}>
        <InputLabel>Country</InputLabel>
        <Select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countries.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={filtered}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey={(d) => `${d.genre} (${d.rating})`}
            width={180}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="content_count" fill="#673ab7" name="Content Count">
            <LabelList dataKey="content_count" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ContentGapHeatmap;
