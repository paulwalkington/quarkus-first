import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

export default function Home() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
        Fleet Manager
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 5 }}>
        Manage your lorries and cars inventory.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
        <Link href="/lorries" style={{ textDecoration: 'none' }}>
          <Button variant="contained" size="large">View Lorries</Button>
        </Link>
        <Link href="/cars" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" size="large">View Cars</Button>
        </Link>
      </Stack>
    </Box>
  );
}
