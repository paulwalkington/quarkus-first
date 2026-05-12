'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lorryApi, carApi } from '@/lib/api';
import type { Vehicle, SearchParams } from '@/lib/api';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

const apis = { lorries: lorryApi, cars: carApi };

interface Props {
  type: 'lorries' | 'cars';
}

const empty: SearchParams = { make: '', model: '', year: undefined, colour: '', maxMileage: undefined };

export default function VehicleSearchPage({ type }: Props) {
  const router = useRouter();
  const api = apis[type];
  const [form, setForm] = useState<SearchParams>(empty);
  const [results, setResults] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof SearchParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(prev => ({
      ...prev,
      [field]: (field === 'year' || field === 'maxMileage') ? (val === '' ? undefined : Number(val)) : val,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setResults(await api.search(form));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const title = type === 'lorries' ? 'Lorries' : 'Cars';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Search {title}</Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch}>
          <Grid container spacing={2}>
            {(['make', 'model', 'colour'] as const).map(field => (
              <Grid size={{ xs: 12, sm: 4 }} key={field}>
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field] ?? ''}
                  onChange={set(field)}
                  size="small"
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                slotProps={{ htmlInput: { min: 1900, max: 2100 } }}
                value={form.year ?? ''}
                onChange={set('year')}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Max Mileage"
                type="number"
                slotProps={{ htmlInput: { min: 0 } }}
                value={form.maxMileage ?? ''}
                onChange={set('maxMileage')}
                size="small"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loading}>
              Search
            </Button>
            <Button variant="text" onClick={() => { setForm(empty); setResults(null); }}>Clear</Button>
          </Box>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {results !== null && !loading && (
        results.length === 0
          ? <Typography sx={{ color: 'text.secondary' }}>No {title.toLowerCase()} found matching your search.</Typography>
          : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'grey.50' } }}>
                    <TableCell>Make</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Colour</TableCell>
                    <TableCell>Mileage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map(v => (
                    <TableRow
                      key={v.id}
                      hover
                      onClick={() => router.push(`/${type}/${v.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{v.make}</TableCell>
                      <TableCell>{v.model}</TableCell>
                      <TableCell>{v.year}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{v.colour}</TableCell>
                      <TableCell>{v.mileage.toLocaleString()} mi</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
      )}
    </Box>
  );
}
