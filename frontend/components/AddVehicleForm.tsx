'use client';

import { useState } from 'react';
import type { VehicleRequest } from '@/lib/api';

interface Props {
  onAdd: (data: VehicleRequest) => Promise<void>;
  onCancel: () => void;
}

const empty: VehicleRequest = { make: '', model: '', year: new Date().getFullYear(), colour: '', mileage: 0 };

export default function AddVehicleForm({ onAdd, onCancel }: Props) {
  const [form, setForm] = useState<VehicleRequest>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof VehicleRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: field === 'year' || field === 'mileage' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onAdd(form);
      setForm(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Vehicle</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(['make', 'model', 'colour'] as const).map(field => (
          <label key={field} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-600 capitalize">{field}</span>
            <input
              required
              value={form[field]}
              onChange={set(field)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        ))}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Year</span>
          <input
            required
            type="number"
            min={1900}
            max={2100}
            value={form.year}
            onChange={set('year')}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Mileage</span>
          <input
            required
            type="number"
            min={0}
            value={form.mileage}
            onChange={set('mileage')}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
