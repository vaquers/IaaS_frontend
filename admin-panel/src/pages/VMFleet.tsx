import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors } from '../theme';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

type VMState = 'running' | 'stopped';

interface VMRow {
  id: string;
  name: string;
  tenant: string;
  state: VMState;
  host: string;
  flavor: string;
}

const MOCK_FLEET: VMRow[] = [
  { id: '1', name: 'web-server-1', tenant: 'Acme Corp', state: 'running', host: 'host-01', flavor: '2 vCPU / 4 GB' },
  { id: '2', name: 'docker-host', tenant: 'Acme Corp', state: 'running', host: 'host-02', flavor: '4 vCPU / 8 GB' },
  { id: '3', name: 'llm-inference', tenant: 'Startup LLC', state: 'stopped', host: 'host-03', flavor: '8 vCPU / 32 GB' },
  { id: '4', name: 'db-primary', tenant: 'Dev Lab', state: 'running', host: 'host-01', flavor: '4 vCPU / 16 GB' },
  { id: '5', name: 'staging', tenant: 'Dev Lab', state: 'stopped', host: 'host-04', flavor: '2 vCPU / 4 GB' },
];

export function VMFleet() {
  const [vms, setVms] = useState<VMRow[]>(MOCK_FLEET);
  const [filterState, setFilterState] = useState<'all' | 'running' | 'stopped'>('all');
  const [filterTenant, setFilterTenant] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = vms.filter((vm) => {
    if (filterState !== 'all' && vm.state !== filterState) return false;
    if (filterTenant && !vm.tenant.toLowerCase().includes(filterTenant.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((v) => v.id)));
  };

  const bulkStop = () => {
    setVms((prev) =>
      prev.map((v) => (selected.has(v.id) ? { ...v, state: 'stopped' as VMState } : v))
    );
    setSelected(new Set());
  };

  const bulkStart = () => {
    setVms((prev) =>
      prev.map((v) => (selected.has(v.id) ? { ...v, state: 'running' as VMState } : v))
    );
    setSelected(new Set());
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={pageTitle}>VM Fleet</h1>
      <p style={pageSub}>Все VM, фильтры и массовые операции</p>

      <Card title="Фильтры">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: colors.textSecondary }}>Состояние:</span>
          {(['all', 'running', 'stopped'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterState(s)}
              className="app-btn-secondary"
              style={{
                padding: '8px 16px',
                fontSize: 14,
                background: filterState === s ? 'rgba(0, 136, 255, 0.15)' : undefined,
                borderColor: filterState === s ? colors.primary : undefined,
              }}
            >
              {s === 'all' ? 'Все' : s === 'running' ? 'Запущены' : 'Остановлены'}
            </button>
          ))}
          <input
            type="text"
            placeholder="Клиент..."
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
            className="app-input"
            style={{ width: 180 }}
          />
        </div>
      </Card>

      <Card title="Массовые действия">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Button variant="small" onClick={bulkStart} disabled={selected.size === 0}>
            Запустить выбранные ({selected.size})
          </Button>
          <Button variant="small" onClick={bulkStop} disabled={selected.size === 0}>
            Остановить выбранные
          </Button>
        </div>
      </Card>

      <Card title="Все VM">
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>
                  <label className="app-checkbox-label">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={selectAll}
                    />
                    <span />
                  </label>
                </th>
                <th>VM</th>
                <th>Клиент</th>
                <th>Состояние</th>
                <th>Хост</th>
                <th>Flavor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vm) => (
                <tr key={vm.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(vm.id)}
                      onChange={() => toggleSelect(vm.id)}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{vm.name}</td>
                  <td>{vm.tenant}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: vm.state === 'running' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(142, 142, 147, 0.2)',
                        color: vm.state === 'running' ? colors.success : colors.textSecondary,
                      }}
                    >
                      {vm.state === 'running' ? 'running' : 'stopped'}
                    </span>
                  </td>
                  <td>{vm.host}</td>
                  <td>{vm.flavor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
