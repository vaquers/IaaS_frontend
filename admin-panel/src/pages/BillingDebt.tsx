import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors } from '../theme';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

export function BillingDebt() {
  const [debtThreshold, setDebtThreshold] = useState('-500');
  const [policy, setPolicy] = useState<'stop' | 'delete'>('stop');

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={pageTitle}>Billing & Debt rules</h1>
      <p style={pageSub}>Пороги долга и политика при неплатеже</p>

      <Card title="Порог долга">
        <p style={{ margin: '0 0 12px', fontSize: 14, color: colors.textSecondary }}>
          При достижении этого баланса (₽) клиент переводится в статус «Долг» и применяется выбранная политика.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="number"
            className="app-input"
            value={debtThreshold}
            onChange={(e) => setDebtThreshold(e.target.value)}
            style={{ width: 140 }}
          />
          <span style={{ color: colors.text }}>₽</span>
          <Button variant="secondary">Сохранить</Button>
        </div>
      </Card>

      <Card title="Политика при долге">
        <p style={{ margin: '0 0 16px', fontSize: 14, color: colors.textSecondary }}>
          Что делать с ресурсами клиента при неплатеже:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="app-checkbox-label">
            <input
              type="radio"
              name="policy"
              checked={policy === 'stop'}
              onChange={() => setPolicy('stop')}
            />
            <span><strong>Stop</strong> — остановить VM, данные сохранить. После пополнения клиент может запустить снова.</span>
          </label>
          <label className="app-checkbox-label">
            <input
              type="radio"
              name="policy"
              checked={policy === 'delete'}
              onChange={() => setPolicy('delete')}
            />
            <span><strong>Delete</strong> — удалить VM и диски после периода ожидания (крайняя мера).</span>
          </label>
        </div>
        <Button variant="secondary" style={{ marginTop: 8 }}>Применить политику</Button>
      </Card>
    </div>
  );
}
