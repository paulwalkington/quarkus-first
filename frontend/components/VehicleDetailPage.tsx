'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { lorryApi, carApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Vehicle, VehicleRequest } from '@/lib/api';
import AddVehicleForm from './AddVehicleForm';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpeedIcon from '@mui/icons-material/Speed';

const apis = { lorries: lorryApi, cars: carApi };

const COLOUR_SWATCHES: Record<string, string> = {
  red: '#e53935', blue: '#1e88e5', black: '#212121', white: '#eeeeee',
  silver: '#bdbdbd', grey: '#757575', gray: '#757575', green: '#43a047',
  orange: '#fb8c00', yellow: '#fdd835', purple: '#8e24aa', brown: '#6d4c41',
  navy: '#1565c0', burgundy: '#b71c1c', khaki: '#afb42b', olive: '#827717',
};

const AVATAR_PALETTE = [
  '#ef5350', '#ec407a', '#ab47bc', '#5c6bc0', '#42a5f5',
  '#26c6da', '#26a69a', '#66bb6a', '#ff7043', '#8d6e63',
];

function avatarColour(make: string): string {
  const hash = [...make].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function StatCard({ icon, label, children }: StatCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
          {label}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
}

interface Props {
  type: 'lorries' | 'cars';
  id: string;
}

export default function VehicleDetailPage({ type, id }: Props) {
  const router = useRouter();
  const api = apis[type];
  const { isAdmin } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    api.getById(id)
      .then(setVehicle)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [api, id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(id);
      router.push(`/${type}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdate = async (data: VehicleRequest) => {
    const updated = await api.update(id, data);
    setVehicle(updated);
    setEditing(false);
  };

  const singularLabel = type === 'lorries' ? 'Lorry' : 'Car';
  const TypeIcon = type === 'lorries' ? LocalShippingIcon : DirectionsCarIcon;

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

      {vehicle && (() => {
        const swatchColour = COLOUR_SWATCHES[vehicle.colour.toLowerCase()] ?? '#9e9e9e';
        return (
          <>
            {/* Hero card */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                borderLeft: `6px solid ${swatchColour}`,
                background: `linear-gradient(135deg, ${swatchColour}18 0%, transparent 55%)`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, fontSize: 26, bgcolor: avatarColour(vehicle.make) }}>
                      {vehicle.make[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
                        {vehicle.make}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                        {vehicle.model}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.75 }}>
                        <Chip icon={<CalendarTodayIcon />} label={vehicle.year} size="small" variant="outlined" />
                        <Chip icon={<TypeIcon />} label={singularLabel} size="small" variant="outlined" />
                      </Box>
                    </Box>
                  </Box>

                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditing(e => !e)}
                      >
                        {editing ? 'Cancel' : 'Edit'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={deleting}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {editing && (
              <AddVehicleForm
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
                initialValues={{ make: vehicle.make, model: vehicle.model, year: vehicle.year, colour: vehicle.colour, mileage: vehicle.mileage }}
              />
            )}

            {!editing && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard icon={<DirectionsCarIcon fontSize="small" />} label="Make">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehicle.make}</Typography>
                  </StatCard>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard icon={<TypeIcon fontSize="small" />} label="Model">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehicle.model}</Typography>
                  </StatCard>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard icon={<CalendarTodayIcon fontSize="small" />} label="Year">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehicle.year}</Typography>
                  </StatCard>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard icon={<ColorLensIcon fontSize="small" />} label="Colour">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Box sx={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        bgcolor: swatchColour,
                        border: '2px solid rgba(0,0,0,0.12)',
                        boxShadow: `0 0 0 3px ${swatchColour}30`,
                      }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                        {vehicle.colour}
                      </Typography>
                    </Box>
                  </StatCard>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard icon={<SpeedIcon fontSize="small" />} label="Mileage">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehicle.mileage.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">miles</Typography>
                  </StatCard>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard icon={<FingerprintIcon fontSize="small" />} label="ID">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', wordBreak: 'break-all' }}>
                      {vehicle.id}
                    </Typography>
                  </StatCard>
                </Grid>
              </Grid>
            )}
          <ConfirmDeleteDialog
            open={deleteDialogOpen}
            title={`Delete ${singularLabel}?`}
            description={`This will permanently delete the ${vehicle.year} ${vehicle.make} ${vehicle.model}. This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteDialogOpen(false)}
            loading={deleting}
          />
          </>
        );
      })()}
    </Box>
  );
}
