import { Card } from '../components/Card';
import { colors } from '../theme';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

const statBox = (label: string, value: string | number, sub?: string) => (
  <div key={label} style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.04)', borderRadius: 16 }}>
    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{value}</div>
    {sub != null && <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{sub}</div>}
  </div>
);

export function Overview() {
  const totalVMs = 47;
  const runningVMs = 32;
  const stoppedVMs = 15;
  const hosts = 8;
  const alerts = 2;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={pageTitle}>Overview</h1>
      <p style={pageSub}>Сводка по флоту и алертам</p>

      <Card title="Виртуальные машины">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {statBox('Всего VM', totalVMs)}
          {statBox('Запущено', runningVMs, 'running')}
          {statBox('Остановлено', stoppedVMs, 'stopped')}
        </div>
      </Card>

      <Card title="Хосты и алерты">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {statBox('Хостов', hosts)}
          {statBox('Алертов', alerts, alerts > 0 ? 'требуют внимания' : 'всё ок')}
        </div>
        {alerts > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              background: 'rgba(255, 59, 48, 0.08)',
              borderRadius: 14,
              border: '1px solid rgba(255, 59, 48, 0.2)',
              fontSize: 14,
              color: colors.text,
            }}
          >
            <strong>Алерты:</strong> host-03 — высокая загрузка CPU; host-05 — мало свободного места на диске.
          </div>
        )}
      </Card>
    </div>
  );
}
