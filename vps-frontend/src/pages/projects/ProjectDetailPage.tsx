import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { ProjectTab } from '../../domain/iaasTypes';
import { useProjectsStore } from '../../store/projectsStore';
import './ProjectsPages.css';
import '../ServersPage.css';
import { ProjectGraphTab } from './ProjectGraphTab';
import { ProjectFilesTab } from './ProjectFilesTab';
import { ProjectLaunchTab } from './ProjectLaunchTab';
import { ProjectNetworkTab } from './ProjectNetworkTab';
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
  const toggleChecklistStep = useProjectsStore((state) => state.toggleChecklistStep);
  const addChecklistStep = useProjectsStore((state) => state.addChecklistStep);
  const selectedTab = (query.get('tab') as ProjectTab) ?? 'overview';
  const setVmPorts = useProjectsStore((state) => state.setVmPorts);

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  const setSelectedProject = useProjectsStore((state) => state.setSelectedProject);

  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepLabel, setNewStepLabel] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');

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

  const handleToggleStep = (stepId: string) => {
    toggleChecklistStep(project.id, stepId);
  };

  const handleStartAddingStep = () => {
    setIsAddingStep(true);
  };

  const handleSubmitNewStep: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const trimmedLabel = newStepLabel.trim();
    const trimmedDescription = newStepDescription.trim();

    if (!trimmedLabel) {
      return;
    }

    addChecklistStep(project.id, {
      label: trimmedLabel,
      description: trimmedDescription || 'Описание шага'
    });

    setNewStepLabel('');
    setNewStepDescription('');
    setIsAddingStep(false);
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

          <div className="project-checklist">
            {project.checklist.map((step) => (
              <button
                key={step.id}
                type="button"
                className="project-checklist-item project-checklist-item-button"
                aria-label={step.label}
                aria-pressed={step.done}
                onClick={() => handleToggleStep(step.id)}
              >
                <div
                  className={
                    step.done
                      ? 'project-checklist-bullet project-checklist-bullet-done'
                      : 'project-checklist-bullet'
                  }
                  aria-hidden="true"
                />
                <div className="project-checklist-text">
                  <div
                    className={
                      step.done
                        ? 'project-checklist-label project-checklist-label-done'
                        : 'project-checklist-label'
                    }
                  >
                    {step.label}
                  </div>
                  <div className="project-checklist-description">
                    {step.description}
                  </div>
                </div>
                <div
                  className={
                    step.done
                      ? 'project-checklist-status project-checklist-status-done'
                      : 'project-checklist-status project-checklist-status-todo'
                  }
                >
                  {step.done ? 'Готово' : 'Сделать'}
                </div>
              </button>
            ))}

            {isAddingStep ? (
              <form
                className="project-checklist-add-form"
                onSubmit={handleSubmitNewStep}
              >
                <div className="project-checklist-bullet" aria-hidden="true" />
                <div className="project-checklist-text">
                  <input
                    className="project-checklist-input"
                    placeholder="Новый шаг"
                    value={newStepLabel}
                    onChange={(event) => setNewStepLabel(event.target.value)}
                    autoFocus
                  />
                  <input
                    className="project-checklist-input project-checklist-input-secondary"
                    placeholder="Краткое описание (опционально)"
                    value={newStepDescription}
                    onChange={(event) => setNewStepDescription(event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="project-checklist-status project-checklist-status-todo"
                >
                  Добавить
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="project-checklist-add-btn"
                onClick={handleStartAddingStep}
              >
                + Добавить шаг
              </button>
            )}
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
                <article key={vm.id} className="server-card" role="row">
                  <div className="server-row">
                    <div className="server-col server-col-server">
                      <div className="server-label">Сервер</div>
                      <div className="server-divider" />
                      <div className="server-value server-value-name">
                        {vm.name}
                      </div>
                    </div>

                    <div className="server-col server-col-project">
                      <div className="server-label">Роль</div>
                      <div className="server-divider" />
                      <div className="server-value">
                        {vm.role}
                      </div>
                    </div>

                    <div className="server-col server-col-os">
                      <div className="server-label">Операционная система</div>
                      <div className="server-divider" />
                      <div className="server-value server-os-text">
                        {vm.os}
                      </div>
                    </div>

                    <div className="server-col server-col-ip">
                      <div className="server-label">IP-адреса</div>
                      <div className="server-divider" />
                      <div className="server-value server-ip-text server-value-mono">
                        {vm.publicIp ?? vm.privateIp ?? '—'}
                      </div>
                    </div>

                    <div className="server-col server-col-price">
                      <div className="server-label">Стоимость</div>
                      <div className="server-divider" />
                      <div className="server-value server-price">
                        {vm.monthlyCost.toFixed(0)} BYN/мес
                      </div>
                    </div>
                  </div>

                  <div className="server-actions">
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
                </article>
              ))}
            </div>
          )}

          {selectedTab === 'graph' && <ProjectGraphTab project={project} />}

          {selectedTab === 'files' && <ProjectFilesTab project={project} />}

          {selectedTab === 'launch' && <ProjectLaunchTab project={project} />}

          {selectedTab === 'network' && <ProjectNetworkTab project={project} />}
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

