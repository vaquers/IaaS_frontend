import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProjectsStore } from '../store/projectsStore';
import './ServersPage.css';
import './projects/ProjectsPages.css';
import { ServerFileManager } from '../components/ServerFileManager';

type ServerDetailTab = 'dashboard' | 'backups' | 'metrics' | 'firewall' | 'files' | 'console';

const SERVER_TABS: { id: ServerDetailTab; label: string }[] = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'backups', label: 'Бэкапы' },
  { id: 'metrics', label: 'Графики' },
  { id: 'firewall', label: 'Firewall' },
  { id: 'files', label: 'Файлы' },
  { id: 'console', label: 'Консоль' }
];

export function ServerDetailPage() {
  const { vmId } = useParams<{ vmId: string }>();
  const navigate = useNavigate();

  const projects = useProjectsStore((state) => state.projects);

  const found = useMemo(() => {
    for (const project of projects) {
      const vm = project.resources.vms.find((candidate) => candidate.id === vmId);
      if (vm) {
        return { project, vm };
      }
    }
    return undefined;
  }, [projects, vmId]);

  const [selectedTab, setSelectedTab] = useState<ServerDetailTab>('dashboard');

  if (!found) {
    return (
      <section className="page">
        <h1 className="page-title">Сервер не найден</h1>
        <p className="page-text">
          Возможно, он был удалён или ссылка некорректна.
        </p>
        <button
          type="button"
          className="project-card-open-btn"
          onClick={() => navigate('/servers')}
        >
          ← Все сервера
        </button>
      </section>
    );
  }

  const { project, vm } = found;

  return (
    <section className="servers-root" aria-label="Сервер">
      <div className="projects-root">
        <aside className="projects-sidebar">
          <div className="projects-sidebar-panel">
            <Link to="/servers" className="project-card-open-btn" style={{ marginBottom: 10 }}>
              ← Все сервера
            </Link>
            <h1 className="projects-title">{vm.name}</h1>
            <p className="page-text">
              {project.name} • {project.region}
            </p>
            <p className="projects-empty-text">
              ОС: {vm.os} • ≈ {vm.monthlyCost.toFixed(0)} BYN/мес
            </p>
          </div>
        </aside>

        <section className="projects-content">
          <div className="projects-header-row">
            <div className="projects-filters">
              {SERVER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className="project-card-open-btn"
                  onClick={() => setSelectedTab(tab.id)}
                  style={
                    selectedTab === tab.id
                      ? {
                          background: 'linear-gradient(135deg, #FF0023, #FF0023)',
                          color: '#ffffff'
                        }
                      : undefined
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {selectedTab === 'dashboard' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Дашборд сервера</h2>
              <p className="projects-empty-text">
                Здесь появится обзор по ресурсам, статусам и быстрым действиям для этого сервера.
              </p>
            </div>
          )}

          {selectedTab === 'backups' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Бэкапы</h2>
              <p className="projects-empty-text">
                В этой вкладке будут расписания и список бэкапов, а также кнопки создания и восстановления.
              </p>
            </div>
          )}

          {selectedTab === 'metrics' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Графики и метрики</h2>
              <p className="projects-empty-text">
                Здесь будет визуализация нагрузки по CPU, RAM, диску и сети за разные периоды времени.
              </p>
            </div>
          )}

          {selectedTab === 'firewall' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Firewall</h2>
              <p className="projects-empty-text">
                На этой вкладке появится управление правилами доступа, открытые порты и профили безопасности.
              </p>
            </div>
          )}

          {selectedTab === 'files' && (
            <ServerFileManager serverName={vm.name} basePath="/home/botuser" />
          )}

          {selectedTab === 'console' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Онлайн‑консоль</h2>
              <p className="projects-empty-text">
                В этом разделе появится веб‑терминал для работы с сервером прямо из браузера.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

