import { Card } from '../components/Card';
import { colors } from '../theme';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

const MOCK_HOSTS = [
  { id: '1', name: 'host-01', cpuTotal: 32, cpuFree: 8, ramTotal: 128, ramFree: 24, storageTotal: 2000, storageFree: 450 },
  { id: '2', name: 'host-02', cpuTotal: 32, cpuFree: 12, ramTotal: 128, ramFree: 48, storageTotal: 2000, storageFree: 620 },
  { id: '3', name: 'host-03', cpuTotal: 64, cpuFree: 4, ramTotal: 256, ramFree: 32, storageTotal: 4000, storageFree: 120 },
  { id: '4', name: 'host-04', cpuTotal: 32, cpuFree: 20, ramTotal: 128, ramFree: 64, storageTotal: 2000, storageFree: 890 },
];

function pct(used: number, total: number) {
  if (total === 0) return 0;
  return Math.round((1 - used / total) * 100);
}

export function InfraHosts() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={pageTitle}>Infra / Hosts</h1>
      <p style={pageSub}>Мощность и свободные ресурсы (мок)</p>

      <Card title="Хосты">
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Хост</th>
                <th>CPU (свободно)</th>
                <th>RAM (свободно)</th>
                <th>Storage (свободно)</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_HOSTS.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600 }}>{h.name}</td>
                  <td>
                    {h.cpuFree} / {h.cpuTotal} vCPU
                    <span style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 12 }}>
                      ({pct(h.cpuFree, h.cpuTotal)}% свободно)
                    </span>
                  </td>
                  <td>
                    {h.ramFree} / {h.ramTotal} GB
                    <span style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 12 }}>
                      ({pct(h.ramFree, h.ramTotal)}% свободно)
                    </span>
                  </td>
                  <td>
                    {h.storageFree} / {h.storageTotal} GB
                    <span style={{ marginLeft: 8, color: colors.textSecondary, fontSize: 12 }}>
                      ({pct(h.storageFree, h.storageTotal)}% свободно)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
