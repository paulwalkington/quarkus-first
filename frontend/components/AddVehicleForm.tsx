'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import type { VehicleRequest } from '@/lib/api';

interface Props {
  onSubmit: (data: VehicleRequest) => Promise<void>;
  onCancel: () => void;
  initialValues?: VehicleRequest;
}

const empty: VehicleRequest = { make: '', model: '', year: new Date().getFullYear(), colour: '', mileage: 0 };

export default function AddVehicleForm({ onSubmit, onCancel, initialValues }: Props) {
  const [form, setForm] = useState<VehicleRequest>(initialValues ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof VehicleRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: field === 'year' || field === 'mileage' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
      setForm(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!initialValues;

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {(['make', 'model', 'colour'] as const).map(field => (
            <Grid size={{ xs: 12, sm: 4 }} key={field}>
              <TextField
                required
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={set(field)}
                size="small"
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              required
              fullWidth
              label="Year"
              type="number"
              slotProps={{ htmlInput: { min: 1900, max: 2100 } }}
              value={form.year}
              onChange={set('year')}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              required
              fullWidth
              label="Mileage"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={form.mileage}
              onChange={set('mileage')}
              size="small"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Save'}
          </Button>
          <Button variant="text" onClick={onCancel}>Cancel</Button>
        </Box>
      </Box>
    </Paper>
  );
}
