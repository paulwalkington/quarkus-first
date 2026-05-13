'use client';

import { useEffect, useState, useCallback } from 'react';
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
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import SpeedIcon from '@mui/icons-material/Speed';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const apis = { lorries: lorryApi, cars: carApi };

import { COLOUR_SWATCHES, avatarColour } from '@/lib/vehicleUtils';

const EMPTY_FILTER = { make: '', model: '', colour: '', year: '', maxMileage: '' };

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VehicleCard({ vehicle, isAdmin, deleting, onNavigate, onDelete }: {
  vehicle: Vehicle;
  isAdmin: boolean;
  deleting: boolean;
  onNavigate: () => void;
  onDelete: () => void;
}) {
  const swatchColour = COLOUR_SWATCHES[vehicle.colour.toLowerCase()] ?? '#9e9e9e';

  return (
    <Card
      variant="outlined"
      onClick={onNavigate}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderTop: `4px solid ${swatchColour}`,
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { boxShadow: 4, transform: 'translateY(-3px)' },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 42, height: 42, bgcolor: avatarColour(vehicle.make), fontSize: 16 }}>
            {vehicle.make[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
              {vehicle.make}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {vehicle.model}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Year</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{vehicle.year}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Colour</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, bgcolor: swatchColour, border: '1px solid rgba(0,0,0,0.15)' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {vehicle.colour}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SpeedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">Mileage</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {vehicle.mileage.toLocaleString()} mi
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 0, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
          <DirectionsCarIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">{vehicle.id.slice(0, 8)}…</Typography>
        </Box>
        {isAdmin && (
          <IconButton
            size="small"
            color="error"
            onClick={e => { e.stopPropagation(); onDelete(); }}
            disabled={deleting}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}

function FilterBar({ filter, isFiltered, onChange, onClear }: {
  filter: typeof EMPTY_FILTER;
  isFiltered: boolean;
  onChange: (field: keyof typeof EMPTY_FILTER) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const searchAdornment = (
    <InputAdornment position="start">
      <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
    </InputAdornment>
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={1} sx={{ alignItems: 'center' }}>
        {(['make', 'model', 'colour'] as const).map(field => (
          <Grid size={{ xs: 12, sm: 'auto' }} key={field} sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              size="small"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={filter[field]}
              onChange={onChange(field)}
              slotProps={{ input: { startAdornment: searchAdornment } }}
            />
          </Grid>
        ))}
        <Grid size={{ xs: 6, sm: 'auto' }} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth size="small" label="Year" type="number"
            value={filter.year} onChange={onChange('year')}
            slotProps={{ htmlInput: { min: 1900, max: 2100 } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 'auto' }} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth size="small" label="Max Mileage" type="number"
            value={filter.maxMileage} onChange={onChange('maxMileage')}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>
        {isFiltered && (
          <Grid size={{ xs: 12, sm: 'auto' }}>
            <Button size="small" startIcon={<ClearIcon />} onClick={onClear}>Clear</Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Props {
  type: 'lorries' | 'cars';
  title: string;
}

export default function VehiclePage({ type, title }: Props) {
  const router = useRouter();
  const api = apis[type];
  const { isAdmin } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filter, setFilter] = useState(EMPTY_FILTER);

  const singularLabel = type === 'lorries' ? 'Lorry' : 'Car';
  const isFiltered = Object.values(filter).some(v => v !== '');

  const filteredVehicles = vehicles.filter(v => {
    if (filter.make && !v.make.toLowerCase().includes(filter.make.toLowerCase())) return false;
    if (filter.model && !v.model.toLowerCase().includes(filter.model.toLowerCase())) return false;
    if (filter.colour && !v.colour.toLowerCase().includes(filter.colour.toLowerCase())) return false;
    if (filter.year && v.year !== Number(filter.year)) return false;
    if (filter.maxMileage && v.mileage > Number(filter.maxMileage)) return false;
    return true;
  });

  const deleteTargetVehicle = vehicles.find(v => v.id === deleteTarget);
  const deleteDescription = deleteTargetVehicle
    ? `This will permanently delete the ${deleteTargetVehicle.year} ${deleteTargetVehicle.make} ${deleteTargetVehicle.model}. This action cannot be undone.`
    : 'This action cannot be undone.';

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

  async function handleAdd(data: VehicleRequest) {
    const created = await api.create(data);
    setVehicles(prev => [...prev, created]);
    setShowForm(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget);
    try {
      await api.delete(deleteTarget);
      setVehicles(prev => prev.filter(v => v.id !== deleteTarget));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  }

  function handleFilterChange(field: keyof typeof EMPTY_FILTER) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFilter(prev => ({ ...prev, [field]: e.target.value }));
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
        {isAdmin && !showForm && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
            Add {singularLabel}
          </Button>
        )}
      </Box>

      {showForm && <AddVehicleForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}

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

      {!loading && !error && (
        <>
          <FilterBar
            filter={filter}
            isFiltered={isFiltered}
            onChange={handleFilterChange}
            onClear={() => setFilter(EMPTY_FILTER)}
          />

          {isFiltered && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Showing {filteredVehicles.length} of {vehicles.length}
            </Typography>
          )}

          {filteredVehicles.length === 0 ? (
            <Typography sx={{ color: 'text.secondary' }}>
              {vehicles.length === 0
                ? `No ${title.toLowerCase()} found. Add one above.`
                : `No ${title.toLowerCase()} match your filter.`}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredVehicles.map(v => (
                <Grid key={v.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <VehicleCard
                    vehicle={v}
                    isAdmin={isAdmin}
                    deleting={deleting === v.id}
                    onNavigate={() => router.push(`/${type}/${v.id}`)}
                    onDelete={() => setDeleteTarget(v.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title={`Delete ${singularLabel}?`}
        description={deleteDescription}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={!!deleting}
      />
    </Box>
  );
}
