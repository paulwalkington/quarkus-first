'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { loginApi } from '@/lib/api';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

const EMPTY_FORM = { username: '', password: '' };

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await loginApi(form.username, form.password);
      login(token);
      router.push('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Sign In</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={form.username}
          onChange={e => setField('username', e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
          autoComplete="username"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={form.password}
          onChange={e => setField('password', e.target.value)}
          sx={{ mb: 3 }}
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading || !form.username || !form.password}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </Box>
    </Paper>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LoginPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <LoginForm />
    </Box>
  );
}
