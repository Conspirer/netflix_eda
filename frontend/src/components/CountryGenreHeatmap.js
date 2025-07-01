import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

function CountryGenreHeatmap() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/country-genre-heatmap")
      .then(res => res.json())
      .then(data => {
        const genres = data.genres;
        const countries = data.countries;
        const matrix = data.matrix;

        // Build column structure
        const baseColumns = [
          { field: 'id', headerName: 'ID', hide: true },
          { field: 'country', headerName: 'Country', width: 150, pinned: 'left' }
        ];

        const genreColumns = genres.map((genre, i) => ({
          field: genre,
          headerName: genre,
          width: 130,
          renderCell: (params) => {
            const value = params.value;
            const max = Math.max(...matrix.flat());
            const intensity = value / max;

            return (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: `rgba(66, 135, 245, ${intensity})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: intensity > 0.5 ? '#fff' : '#000',
                  fontWeight: 500
                }}
              >
                {value}
              </Box>
            );
          }
        }));

        setColumns([...baseColumns, ...genreColumns]);

        // Build rows
        const heatmapRows = countries.map((country, rowIdx) => {
          const row = { id: rowIdx + 1, country };
          genres.forEach((genre, colIdx) => {
            row[genre] = matrix[rowIdx][colIdx];
          });
          return row;
        });

        setRows(heatmapRows);
      })
      .catch(err => console.error("Failed to load heatmap data:", err));
  }, []);

  return (
    <div>
      <h2>🌍 Country vs Genre Heatmap</h2>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          hideFooter
          rowHeight={50}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#e3f2fd',
              fontWeight: 'bold'
            },
            '& .MuiDataGrid-cell': {
              border: '1px solid #e0e0e0'
            }
          }}
        />
      </div>
    </div>
  );
}

export default CountryGenreHeatmap;
