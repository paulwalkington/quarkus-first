'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { lorryApi, carApi } from '@/lib/api';
import type { Vehicle } from '@/lib/api';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

const apis = { lorries: lorryApi, cars: carApi };

interface Props {
  type: 'lorries' | 'cars';
  id: string;
}

interface DetailRowProps {
  label: string;
  value: string | number;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box sx={{ display: 'flex', py: 1.5 }}>
      <Typography sx={{ width: 120, color: 'text.secondary', flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  );
}

export default function VehicleDetailPage({ type, id }: Props) {
  const router = useRouter();
  const api = apis[type];
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.getById(id)
      .then(setVehicle)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [api, id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    setDeleting(true);
    try {
      await api.delete(id);
      router.push(`/${type}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
    }
  };

  const singularLabel = type === 'lorries' ? 'Lorry' : 'Car';

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(`/${type}`)}
        sx={{ mb: 3 }}
      >
        Back to {type === 'lorries' ? 'Lorries' : 'Cars'}
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {vehicle && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={deleting}
            >
              Delete {singularLabel}
            </Button>
          </Box>

          <Paper variant="outlined" sx={{ px: 3, py: 1 }}>
            <DetailRow label="Make" value={vehicle.make} />
            <Divider />
            <DetailRow label="Model" value={vehicle.model} />
            <Divider />
            <DetailRow label="Year" value={vehicle.year} />
            <Divider />
            <DetailRow label="Colour" value={vehicle.colour} />
            <Divider />
            <DetailRow label="Mileage" value={`${vehicle.mileage.toLocaleString()} mi`} />
            <Divider />
            <DetailRow label="ID" value={vehicle.id} />
          </Paper>
        </>
      )}
    </Box>
  );
}