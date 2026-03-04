import { useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { ProjectTab } from '../../domain/iaasTypes';
import { useProjectsStore } from '../../store/projectsStore';
import './ProjectsPages.css';
import '../ServersPage.css';
import { ProjectGraphTab } from './ProjectGraphTab';
import { AIAssistantWidget } from '../../components/AIAssistantWidget';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TABS: { id: ProjectTab; label: string }[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'graph', label: 'Граф' },
  { id: 'files', label: 'Файлы' },
  { id: 'launch', label: 'Запуск' },
  { id: 'network', label: 'Сеть' }
];

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useQuery();

  const projects = useProjectsStore((state) => state.projects);
  const selectedTab = (query.get('tab') as ProjectTab) ?? 'overview';
  const setVmPorts = useProjectsStore((state) => state.setVmPorts);

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  const setSelectedProject = useProjectsStore((state) => state.setSelectedProject);

  if (!project) {
    return (
      <section className="page">
        <h1 className="page-title">Проект не найден</h1>
        <p className="page-text">
          Возможно, он был удалён или ссылка некорректна.
        </p>
      </section>
    );
  }

  const vmCount = project.resources.vms.length;
  const monthlyCost = project.resources.vms.reduce(
    (sum, vm) => sum + vm.monthlyCost,
    0
  );

  const changeTab = (tab: ProjectTab) => {
    const searchParams = new URLSearchParams(query);
    searchParams.set('tab', tab);
    navigate({ pathname: `/projects/${project.id}`, search: searchParams.toString() });
  };

  return (
    <section className="servers-root" aria-label="Проект">
      <div className="projects-root">
        <aside className="projects-sidebar">
          <div className="projects-sidebar-panel">
            <Link
              to="/projects"
              className="project-card-open-btn"
              style={{ marginBottom: 10 }}
              onClick={() => setSelectedProject(undefined)}
            >
              ← Все проекты
            </Link>
            <h1 className="projects-title">{project.name}</h1>
            <p className="page-text">
              {project.template} • {project.region}
            </p>
            <p className="projects-empty-text">
              VM: {vmCount} • ≈ {monthlyCost.toFixed(0)} BYN/мес
            </p>
          </div>
        </aside>

        <section className="projects-content">
          <div className="projects-header-row">
            <div className="servers-title">Чеклист запуска</div>
          </div>

          <div className="servers-list">
            {project.checklist.map((step) => (
              <article key={step.id} className="server-card">
                <div className="server-card-grid-row">
                  <div className="server-cell">
                    <span className="server-cell-title">{step.label}</span>
                  </div>
                  <div className="server-cell">
                    <span>{step.description}</span>
                  </div>
                  <div className="server-cell server-actions">
                    <button
                      type="button"
                      className="server-btn server-btn-secondary"
                    >
                      {step.done ? 'Готово' : 'Сделать'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="projects-header-row">
            <div className="projects-filters">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className="project-card-open-btn"
                  onClick={() => changeTab(tab.id)}
                    style={
                      selectedTab === tab.id
                        ? {
                            background:
                              'linear-gradient(135deg, #FF0023, #FF0023)',
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

          {selectedTab === 'overview' && (
            <div className="servers-list">
              {project.resources.vms.map((vm) => (
                <article key={vm.id} className="server-card">
                  <div className="server-card-grid-header" aria-hidden="true">
                    <span>Сервер</span>
                    <span>Роль</span>
                    <span>ОС</span>
                    <span>IP</span>
                    <span>Стоимость</span>
                    <span />
                  </div>
                  <div className="server-card-grid-row">
                    <div className="server-cell">
                      <span className="server-cell-title">{vm.name}</span>
                    </div>
                    <div className="server-cell">
                      <span>{vm.role}</span>
                    </div>
                    <div className="server-cell">
                      <span>{vm.os}</span>
                    </div>
                    <div className="server-cell">
                      <span>{vm.publicIp ?? vm.privateIp ?? '—'}</span>
                    </div>
                    <div className="server-cell">
                      <span className="server-price">
                        {vm.monthlyCost.toFixed(0)} BYN/мес
                      </span>
                    </div>
                    <div className="server-cell server-actions">
                      <button
                        type="button"
                        className="server-btn server-btn-primary"
                      >
                        Смотреть
                      </button>
                      <button
                        type="button"
                        className="server-btn server-btn-secondary"
                      >
                        SSH
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedTab === 'graph' && <ProjectGraphTab project={project} />}

          {selectedTab === 'files' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Файлы проекта</h2>
              <p className="projects-empty-text">
                Файловый менеджер появится здесь позже. В прототипе это заглушка.
              </p>
            </div>
          )}

          {selectedTab === 'launch' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Шаги запуска</h2>
              <p className="projects-empty-text">
                В этом разделе будут готовые команды для запуска приложения (apt
                update, установка зависимостей, запуск сервиса).
              </p>
            </div>
          )}

          {selectedTab === 'network' && (
            <div className="projects-empty">
              <h2 className="projects-empty-title">Сеть и порты</h2>
              <p className="projects-empty-text">
                Здесь вы сможете включать и выключать порты (HTTP, HTTPS, SSH, База и
                Custom). Порты будут синхронизироваться с VM.
              </p>
            </div>
          )}
        </section>
      </div>
      <AIAssistantWidget
        mode="project"
        environment={{
          openTab: (tab) => changeTab(tab),
          highlightVm: () => {
            // подсветка обрабатывается внутри графа через стор
          },
          suggestPorts: (vmId, ports) => setVmPorts(vmId, ports)
        }}
        attachedVmIds={project.resources.vms.map((vm) => vm.id)}
      />
    </section>
  );
}

