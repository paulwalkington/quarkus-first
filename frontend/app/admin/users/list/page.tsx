'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { userApi, User } from '@/lib/api';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

interface EditState {
  username: string;
  role: string;
  password: string;
}

export default function UserListPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editState, setEditState] = useState<EditState>({ username: '', role: 'user', password: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace('/');
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (authLoading || !isAdmin) return;
    userApi.listAll()
      .then(setUsers)
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, [authLoading, isAdmin]);

  function openEdit(user: User) {
    setEditUser(user);
    setEditState({ username: user.username, role: user.role, password: '' });
    setEditError(null);
  }

  function closeEdit() {
    setEditUser(null);
    setEditError(null);
  }

  async function handleDelete() {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await userApi.delete(deleteUser.id);
      setUsers(prev => prev.filter(u => u.id !== deleteUser.id));
      setDeleteUser(null);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave() {
    if (!editUser) return;
    setSaving(true);
    setEditError(null);
    try {
      const updated = await userApi.update(editUser.id, {
        username: editState.username,
        role: editState.role,
        ...(editState.password ? { password: editState.password } : {}),
      });
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      closeEdit();
    } catch {
      setEditError('Failed to save changes. The username may already be taken.');
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Users</Typography>
        <Button variant="contained" component={Link} href="/admin/users">Add User</Button>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.78rem' }}>ID</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => {
                const admin = user.role === 'admin';
                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Avatar
                        src={user.profilePicture ?? undefined}
                        sx={{ width: 36, height: 36, bgcolor: admin ? 'warning.dark' : 'primary.dark', fontSize: 16, fontWeight: 700 }}
                      >
                        {!user.profilePicture && user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.username}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={admin ? 'Admin' : 'User'}
                        size="small"
                        sx={{ bgcolor: admin ? 'warning.main' : 'success.main', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                        {user.id}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton size="small" onClick={() => openEdit(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleteUser(user)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!editUser} onClose={closeEdit} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {editError && <Typography color="error" variant="body2">{editError}</Typography>}
          <TextField
            label="Username"
            value={editState.username}
            onChange={e => setEditState(s => ({ ...s, username: e.target.value }))}
            autoComplete="off"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="edit-role-label">Role</InputLabel>
            <Select
              labelId="edit-role-label"
              value={editState.role}
              label="Role"
              onChange={e => setEditState(s => ({ ...s, role: e.target.value }))}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="New Password"
            type="password"
            value={editState.password}
            onChange={e => setEditState(s => ({ ...s, password: e.target.value }))}
            placeholder="Leave blank to keep current"
            autoComplete="new-password"
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEdit} disabled={saving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !editState.username.trim()}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteUser?.username}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteUser(null)} disabled={deleting}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
