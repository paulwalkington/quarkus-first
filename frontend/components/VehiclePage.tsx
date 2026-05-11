'use client';

import { useEffect, useState, useCallback } from 'react';
import { lorryApi, carApi } from '@/lib/api';
import type { Vehicle, VehicleRequest } from '@/lib/api';
import AddVehicleForm from './AddVehicleForm';

const apis = { lorries: lorryApi, cars: carApi };

interface Props {
  type: 'lorries' | 'cars';
  title: string;
}

export default function VehiclePage({ type, title }: Props) {
  const api = apis[type];
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVehicles(await api.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data: VehicleRequest) => {
    const created = await api.create(data);
    setVehicles(prev => [...prev, created]);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Add {title.slice(0, -1)}
          </button>
        )}
      </div>

      {showForm && (
        <AddVehicleForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {loading && <p className="text-gray-400 text-sm">Loading…</p>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
          <button onClick={load} className="ml-3 underline">Retry</button>
        </div>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <p className="text-gray-400 text-sm">No {title.toLowerCase()} found. Add one above.</p>
      )}

      {vehicles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Make', 'Model', 'Year', 'Colour', 'Mileage', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{v.make}</td>
                  <td className="px-4 py-3 text-gray-700">{v.model}</td>
                  <td className="px-4 py-3 text-gray-700">{v.year}</td>
                  <td className="px-4 py-3 text-gray-700 capitalize">{v.colour}</td>
                  <td className="px-4 py-3 text-gray-700">{v.mileage.toLocaleString()} mi</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(v.id)}
                      disabled={deleting === v.id}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 font-medium transition-colors"
                    >
                      {deleting === v.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
