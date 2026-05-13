import Chip from '@mui/material/Chip';

export default function RoleChip({ role, sx }: { role: string; sx?: object }) {
  const isAdmin = role === 'admin';
  return (
    <Chip
      label={isAdmin ? 'Admin' : 'User'}
      size="small"
      sx={{
        bgcolor: isAdmin ? 'warning.main' : 'success.main',
        color: 'white',
        fontWeight: 700,
        fontSize: '0.7rem',
        ...sx,
      }}
    />
  );
}
