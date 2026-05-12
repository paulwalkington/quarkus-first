'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function NavBar() {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
        >
          Fleet Manager
        </Typography>
        <Button color="inherit" component={Link} href="/lorries">Lorries</Button>
        <Button color="inherit" component={Link} href="/lorries/search" size="small" sx={{ opacity: 0.8 }}>Search Lorries</Button>
        <Button color="inherit" component={Link} href="/cars">Cars</Button>
        <Button color="inherit" component={Link} href="/cars/search" size="small" sx={{ opacity: 0.8 }}>Search Cars</Button>
      </Toolbar>
    </AppBar>
  );
}
