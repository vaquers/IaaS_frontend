import { Card } from '../components/Card';
import { colors } from '../theme';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

const MOCK_AUDIT = [
  { id: '1', at: '2025-02-25 14:32', who: 'user@acme.com', action: 'create', target: 'VM web-server-2', tenant: 'Acme Corp' },
  { id: '2', at: '2025-02-25 13:10', who: 'admin@startup.io', action: 'delete', target: 'VM old-staging', tenant: 'Startup LLC' },
  { id: '3', at: '2025-02-25 11:00', who: 'dev@devlab.ru', action: 'create', target: 'VM db-replica', tenant: 'Dev Lab' },
  { id: '4', at: '2025-02-24 18:45', who: 'user@acme.com', action: 'stop', target: 'VM llm-inference', tenant: 'Acme Corp' },
  { id: '5', at: '2025-02-24 09:20', who: 'system', action: 'block', target: 'Tenant Test User', tenant: '—' },
];

const actionColor = (action: string) => {
  if (action === 'create') return colors.success;
  if (action === 'delete' || action === 'block') return colors.error;
  return colors.textSecondary;
};

export function AuditLog() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1 style={pageTitle}>Audit log</h1>
      <p style={pageSub}>Кто что создал или удалил</p>

      <Card title="События">
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Время</th>
                <th>Кто</th>
                <th>Действие</th>
                <th>Объект</th>
                <th>Тенант</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_AUDIT.map((row) => (
                <tr key={row.id}>
                  <td style={{ color: colors.textSecondary, fontSize: 13 }}>{row.at}</td>
                  <td>{row.who}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: actionColor(row.action) }}>{row.action}</span>
                  </td>
                  <td>{row.target}</td>
                  <td>{row.tenant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
