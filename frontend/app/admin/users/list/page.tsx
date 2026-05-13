'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { userApi, User } from '@/lib/api';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RoleChip from '@/components/RoleChip';
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EditState {
  username: string;
  role: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function UserRow({ user, onEdit, onDelete }: {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const isAdmin = user.role === 'admin';
  return (
    <TableRow hover>
      <TableCell>
        <Avatar
          src={user.profilePicture ?? undefined}
          sx={{ width: 36, height: 36, bgcolor: isAdmin ? 'warning.dark' : 'primary.dark', fontSize: 16, fontWeight: 700 }}
        >
          {!user.profilePicture && user.username.charAt(0).toUpperCase()}
        </Avatar>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.username}</Typography>
      </TableCell>
      <TableCell>
        <RoleChip role={user.role} />
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
          {user.id}
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        <IconButton size="small" onClick={() => onEdit(user)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(user)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function EditUserDialog({ user, editState, saving, error, onClose, onSave, onChange }: {
  user: User | null;
  editState: EditState;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof EditState, value: string) => void;
}) {
  return (
    <Dialog open={!!user} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <TextField
          label="Username"
          value={editState.username}
          onChange={e => onChange('username', e.target.value)}
          autoComplete="off"
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="edit-role-label">Role</InputLabel>
          <Select
            labelId="edit-role-label"
            value={editState.role}
            label="Role"
            onChange={e => onChange('role', e.target.value)}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="New Password"
          type="password"
          value={editState.password}
          onChange={e => onChange('password', e.target.value)}
          placeholder="Leave blank to keep current"
          autoComplete="new-password"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={saving || !editState.username.trim()}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteUserDialog({ user, deleting, onClose, onDelete }: {
  user: User | null;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Dialog open={!!user} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{user?.username}</strong>? This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={deleting}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

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
              {users.map(user => (
                <UserRow key={user.id} user={user} onEdit={openEdit} onDelete={setDeleteUser} />
              ))}
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

      <EditUserDialog
        user={editUser}
        editState={editState}
        saving={saving}
        error={editError}
        onClose={closeEdit}
        onSave={handleSave}
        onChange={(field, value) => setEditState(s => ({ ...s, [field]: value }))}
      />

      <DeleteUserDialog
        user={deleteUser}
        deleting={deleting}
        onClose={() => setDeleteUser(null)}
        onDelete={handleDelete}
      />
    </Box>
  );
}
