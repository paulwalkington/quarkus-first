'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { lorryApi, carApi } from '@/lib/api';
import type { Vehicle, VehicleRequest } from '@/lib/api';
import AddVehicleForm from './AddVehicleForm';
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

interface Props {
  type: 'lorries' | 'cars';
  title: string;
}

const emptyFilter = { make: '', model: '', colour: '', year: '', maxMileage: '' };

export default function VehiclePage({ type, title }: Props) {
  const router = useRouter();
  const api = apis[type];
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState(emptyFilter);

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

  const setField = (field: keyof typeof emptyFilter) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(prev => ({ ...prev, [field]: e.target.value }));

  const isFiltered = Object.values(filter).some(v => v !== '');

  const filteredVehicles = vehicles.filter(v => {
    if (filter.make && !v.make.toLowerCase().includes(filter.make.toLowerCase())) return false;
    if (filter.model && !v.model.toLowerCase().includes(filter.model.toLowerCase())) return false;
    if (filter.colour && !v.colour.toLowerCase().includes(filter.colour.toLowerCase())) return false;
    if (filter.year && v.year !== Number(filter.year)) return false;
    if (filter.maxMileage && v.mileage > Number(filter.maxMileage)) return false;
    return true;
  });

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
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={1} sx={{ alignItems: 'center' }}>
              {(['make', 'model', 'colour'] as const).map(field => (
                <Grid size={{ xs: 12, sm: 'auto' }} key={field} sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={filter[field]}
                    onChange={setField(field)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment>,
                      },
                    }}
                  />
                </Grid>
              ))}
              <Grid size={{ xs: 6, sm: 'auto' }} sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth size="small" label="Year" type="number"
                  value={filter.year} onChange={setField('year')}
                  slotProps={{ htmlInput: { min: 1900, max: 2100 } }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 'auto' }} sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth size="small" label="Max Mileage" type="number"
                  value={filter.maxMileage} onChange={setField('maxMileage')}
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>
              {isFiltered && (
                <Grid size={{ xs: 12, sm: 'auto' }}>
                  <Button size="small" startIcon={<ClearIcon />} onClick={() => setFilter(emptyFilter)}>
                    Clear
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>

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
              {filteredVehicles.map(v => {
                const swatchColour = COLOUR_SWATCHES[v.colour.toLowerCase()] ?? '#9e9e9e';
                return (
                  <Grid key={v.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                      variant="outlined"
                      onClick={() => router.push(`/${type}/${v.id}`)}
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
                          <Avatar sx={{ width: 42, height: 42, bgcolor: avatarColour(v.make), fontSize: 16 }}>
                            {v.make[0]}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
                              {v.make}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {v.model}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ mb: 1.5 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Year</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{v.year}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Colour</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <Box sx={{
                                width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                                bgcolor: swatchColour,
                                border: '1px solid rgba(0,0,0,0.15)',
                              }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {v.colour}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <SpeedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                              <Typography variant="body2" color="text.secondary">Mileage</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {v.mileage.toLocaleString()} mi
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 0, pb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
                          <DirectionsCarIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">{v.id.slice(0, 8)}…</Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={e => { e.stopPropagation(); handleDelete(v.id); }}
                          disabled={deleting === v.id}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
