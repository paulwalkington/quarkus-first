'use client';

import { useEffect, useState } from 'react';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { userApi, User } from '@/lib/api';

function Field({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
      <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            mt: 0.25,
            fontFamily: mono ? 'monospace' : 'inherit',
            fontSize: mono ? '0.78rem' : '0.95rem',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userApi.getMe()
      .then(setUser)
      .catch(() => setError('Failed to load account details.'));
  }, []);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', mt: 6, px: 2 }}>
      <Paper
        elevation={3}
        sx={{ width: '100%', maxWidth: 440, borderRadius: 3, overflow: 'hidden' }}
      >
        {/* Gradient header banner */}
        <Box
          sx={{
            height: 120,
            background: isAdmin
              ? 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          }}
        />

        {/* Avatar — overlaps the banner */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '-52px', px: 3, pb: 3 }}>
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: isAdmin ? 'warning.dark' : 'primary.dark',
              border: '4px solid white',
              boxShadow: 3,
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 1.5 }}>
            {user.username}
          </Typography>

          <Chip
            label={isAdmin ? 'Admin' : 'User'}
            size="small"
            sx={{
              mt: 0.75,
              bgcolor: isAdmin ? 'warning.main' : 'success.main',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.05em',
            }}
          />

          <Divider sx={{ width: '100%', mt: 3, mb: 1 }} />

          <Box sx={{ width: '100%' }}>
            <Field
              icon={<BadgeOutlinedIcon fontSize="small" />}
              label="USER ID"
              value={user.id}
              mono
            />
            <Divider />
            <Field
              icon={<PersonOutlinedIcon fontSize="small" />}
              label="USERNAME"
              value={user.username}
            />
            <Divider />
            <Field
              icon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
              label="ROLE"
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
