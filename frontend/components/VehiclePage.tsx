'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { lorryApi, carApi } from '@/lib/api';
import type { Vehicle, VehicleRequest } from '@/lib/api';
import AddVehicleForm from './AddVehicleForm';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const apis = { lorries: lorryApi, cars: carApi };

interface Props {
  type: 'lorries' | 'cars';
  title: string;
}

export default function VehiclePage({ type, title }: Props) {
  const router = useRouter();
  const api = apis[type];
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVehicles(await api.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data: VehicleRequest) => {
    const created = await api.create(data);
    setVehicles(prev => [...prev, created]);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  let addLabel: string;
  switch (type) {
    case 'lorries': addLabel = 'Lorry'; break;
    default: addLabel = title.slice(0, -1);
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
        {!showForm && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
            Add {addLabel}
          </Button>
        )}
      </Box>

      {showForm && <AddVehicleForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <Typography sx={{ color: 'text.secondary' }}>No {title.toLowerCase()} found. Add one above.</Typography>
      )}

      {vehicles.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'grey.50' } }}>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Colour</TableCell>
                <TableCell>Mileage</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map(v => (
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
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={e => { e.stopPropagation(); handleDelete(v.id); }}
                      disabled={deleting === v.id}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
