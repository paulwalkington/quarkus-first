'use client';

import Box from '@mui/material/Box';
import { AuthProvider } from '@/lib/auth';
import NavBar from './NavBar';
import ProtectedRoute from './ProtectedRoute';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      <Box component="main" sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 4 }}>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </Box>
    </AuthProvider>
  );
}
