'use client';

import { useEffect, useRef, useState } from 'react';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pwOpen, setPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  function handlePwToggle() {
    setPwOpen(o => !o);
    setPwError(null);
    setPwSuccess(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwSaving(true);
    setPwError(null);
    setPwSuccess(false);
    try {
      await userApi.updatePassword(currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPwError('Current password is incorrect.');
    } finally {
      setPwSaving(false);
    }
  }

  useEffect(() => {
    userApi.getMe()
      .then(setUser)
      .catch(() => setError('Failed to load account details.'));
  }, []);

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploading(true);
      try {
        const updated = await userApi.uploadPicture(base64);
        setUser(updated);
      } catch {
        setError('Failed to upload picture.');
      } finally {
        setUploading(false);
        // reset so the same file can be re-selected
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  }

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
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 440, borderRadius: 3, overflow: 'hidden' }}>

        {/* Gradient header banner */}
        <Box
          sx={{
            height: 120,
            background: isAdmin
              ? 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '-52px', px: 3, pb: 3 }}>

          {/* Clickable avatar with camera overlay */}
          <Tooltip title="Change photo" placement="right">
            <Box
              onClick={handleAvatarClick}
              sx={{ position: 'relative', cursor: 'pointer', display: 'inline-flex' }}
            >
              <Avatar
                src={user.profilePicture ?? undefined}
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
                {!user.profilePicture && user.username.charAt(0).toUpperCase()}
              </Avatar>

              {/* Camera icon overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: uploading ? 1 : 0,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              >
                {uploading
                  ? <CircularProgress size={28} sx={{ color: 'white' }} />
                  : <CameraAltIcon sx={{ color: 'white', fontSize: 28 }} />}
              </Box>
            </Box>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

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
            <Field icon={<BadgeOutlinedIcon fontSize="small" />} label="USER ID" value={user.id} mono />
            <Divider />
            <Field icon={<PersonOutlinedIcon fontSize="small" />} label="USERNAME" value={user.username} />
            <Divider />
            <Field
              icon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
              label="ROLE"
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            />
          </Box>

          <Divider sx={{ width: '100%', mt: 2, mb: 1 }} />

          <Box sx={{ width: '100%' }}>
            <Button
              startIcon={<LockOutlinedIcon />}
              onClick={handlePwToggle}
              size="small"
              sx={{ textTransform: 'none', fontWeight: 600, mb: 1 }}
            >
              {pwOpen ? 'Cancel' : 'Change Password'}
            </Button>

            <Collapse in={pwOpen}>
              {pwSuccess && <Alert severity="success" sx={{ mb: 2 }}>Password updated successfully.</Alert>}
              {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
              <Box component="form" onSubmit={handlePwSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
                >
                  {pwSaving ? 'Saving…' : 'Update Password'}
                </Button>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
