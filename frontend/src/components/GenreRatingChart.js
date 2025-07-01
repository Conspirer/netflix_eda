import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

function GenreRatingChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/genre-rating")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load genre-rating data:", err));
  }, []);

  // Transform to grouped bar format by genre (X) and multiple ratings per bar
  const genreMap = new Map();
  const ratings = new Set();

  data.forEach(({ listed_in, rating, count }) => {
    ratings.add(rating);
    if (!genreMap.has(listed_in)) genreMap.set(listed_in, {});
    genreMap.get(listed_in)[rating] = count;
  });

  const transformedData = Array.from(genreMap.entries()).map(([genre, counts]) => ({
    genre,
    ...counts
  }));

  const colors = {
    'TV-G': '#4caf50',
    'TV-Y': '#8bc34a',
    'TV-Y7': '#cddc39',
    'PG': '#03a9f4',
    'PG-13': '#00bcd4',
    'TV-PG': '#2196f3',
    'TV-14': '#3f51b5',
    'TV-MA': '#f44336',
    'R': '#9c27b0'
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <Typography variant="h5" gutterBottom>
        🎬 Genre-Rating Sweet Spot Analysis
      </Typography>
      <ResponsiveContainer width="100%" height={550}>
        <BarChart
  data={transformedData.slice(0, 15)}
  layout="vertical"
  margin={{ top: 20, right: 40, left: 150, bottom: 30 }}
  barCategoryGap={20}   // 👈 Add vertical space between categories
  barGap={4}            // 👈 Space between stacks in same category
>

          <XAxis type="number" />
          <YAxis dataKey="genre" type="category" width={140} />
          <Tooltip />
          <Legend />
          {[...ratings].map((rating) => (
            <Bar
              key={rating}
              dataKey={rating}
              stackId="a"
              fill={colors[rating] || "#8884d8"}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GenreRatingChart;
