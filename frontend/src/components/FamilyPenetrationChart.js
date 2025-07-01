import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

function FamilyPenetrationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/family-penetration")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load family penetration data:", err));
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        👨‍👩‍👧‍👦 Family Penetration Score by Country
      </Typography>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" domain={[0, 100]} />
          <YAxis 
              dataKey="country" 
              type="category" 
              width={150}
             interval={0}         // 🔥 Show every label
             tick={{ fontSize: 13 }} 
        />

          <Tooltip />
          <Bar dataKey="family_penetration" fill="#82ca9d" name="Family %"/>
        </BarChart>
      </ResponsiveContainer>

      {/* Table */}
      <Paper style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Total Titles</strong></TableCell>
              <TableCell><strong>Family Titles</strong></TableCell>
              <TableCell><strong>Family Penetration %</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.family}</TableCell>
                <TableCell>{row.family_penetration.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default FamilyPenetrationChart;
