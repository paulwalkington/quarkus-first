'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { userApi } from '@/lib/api';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function AddUserPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await userApi.register({ username, password, role });
      setSuccess(`User "${created.username}" created successfully.`);
      setUsername('');
      setPassword('');
      setRole('user');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user.';
      setError(msg.includes('409') || msg.includes('Conflict')
        ? `Username "${username}" is already taken.`
        : 'Failed to create user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = username.trim().length > 0 && password.length > 0;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', mt: 6, px: 2 }}>
      <Paper variant="outlined" sx={{ p: 4, width: '100%', maxWidth: 440 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Add New User</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create a new user account. Only administrators can access this page.
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            autoFocus
            autoComplete="off"
            slotProps={{ htmlInput: { maxLength: 64 } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            autoComplete="new-password"
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={e => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting || !isValid}
          >
            {submitting ? 'Creating…' : 'Create User'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
