import { Card } from '../components/Card';
import { colors } from '../theme';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

type TenantStatus = 'ok' | 'debt' | 'blocked';

interface Tenant {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: TenantStatus;
  vms: number;
}

const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'Acme Corp', email: 'billing@acme.com', balance: 12500, status: 'ok', vms: 12 },
  { id: '2', name: 'Startup LLC', email: 'admin@startup.io', balance: 320, status: 'ok', vms: 3 },
  { id: '3', name: 'Dev Lab', email: 'dev@devlab.ru', balance: -150, status: 'debt', vms: 5 },
  { id: '4', name: 'Test User', email: 'test@test.com', balance: 0, status: 'blocked', vms: 0 },
];

function StatusBadge({ status }: { status: TenantStatus }) {
  const map = {
    ok: { bg: 'rgba(52, 199, 89, 0.15)', color: colors.success },
    debt: { bg: 'rgba(255, 149, 0, 0.2)', color: colors.warning },
    blocked: { bg: 'rgba(255, 59, 48, 0.15)', color: colors.error },
  };
  const labels = { ok: 'OK', debt: 'Долг', blocked: 'Заблокирован' };
  const s = map[status];
  return (
    <span style={{ padding: '4px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600, ...s }}>
      {labels[status]}
    </span>
  );
}

export function Tenants() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1 style={pageTitle}>Tenants / Users</h1>
      <p style={pageSub}>Клиенты, баланс и статус</p>

      <Card title="Клиенты">
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Email</th>
                <th>Баланс</th>
                <th>Статус</th>
                <th>VM</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TENANTS.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>{t.email}</td>
                  <td style={{ color: t.balance < 0 ? colors.error : undefined }}>{t.balance} ₽</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.vms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
