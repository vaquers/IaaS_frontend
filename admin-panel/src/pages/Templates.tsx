import { Card } from '../components/Card';

const pageTitle = { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' };
const pageSub = { margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.85)' };

const MOCK_IMAGES = [
  { id: '1', name: 'Ubuntu 22.04 LTS', type: 'Базовый образ', version: '2025.02', size: '2.1 GB' },
  { id: '2', name: 'Docker host', type: 'Заготовка', version: '1.0', size: '4.5 GB' },
  { id: '3', name: 'GPU placeholder', type: 'Заготовка', version: '1.0', size: '3.0 GB' },
  { id: '4', name: 'LLM-inference preset', type: 'Заготовка', version: '1.2', size: '12 GB' },
  { id: '5', name: 'Debian 12', type: 'Базовый образ', version: '2025.01', size: '1.8 GB' },
];

export function Templates() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={pageTitle}>Templates / Images</h1>
      <p style={pageSub}>Базовые образы и заготовки</p>

      <Card title="Образы">
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Тип</th>
                <th>Версия</th>
                <th>Размер</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_IMAGES.map((img) => (
                <tr key={img.id}>
                  <td style={{ fontWeight: 600 }}>{img.name}</td>
                  <td>{img.type}</td>
                  <td>{img.version}</td>
                  <td>{img.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
