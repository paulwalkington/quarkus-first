'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function NavBar() {
  const { isAuthenticated, username, role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700, mr: 2 }}
        >
          Fleet Manager
        </Typography>
        <Button color="inherit" component={Link} href="/lorries">Lorries</Button>
        <Button color="inherit" component={Link} href="/cars">Cars</Button>

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={role === 'admin' ? 'Admin' : 'User'}
              size="small"
              sx={{
                bgcolor: role === 'admin' ? 'warning.main' : 'success.main',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
            <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.9 }}>
              {username}
            </Typography>
            <Button color="inherit" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
