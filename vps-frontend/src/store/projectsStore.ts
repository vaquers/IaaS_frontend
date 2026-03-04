import { create } from 'zustand';
import type {
  ChecklistStepId,
  Project,
  ProjectStatus,
  ProjectTab,
  VM
} from '../domain/iaasTypes';

interface UiState {
  selectedProjectId?: string;
  selectedProjectTab: ProjectTab;
  highlightedVmId?: string;
  toast?: { id: number; message: string };
}

export interface ProjectsState extends UiState {
  projects: Project[];
  nextId: number;
  setSelectedProject(projectId: string | undefined): void;
  setProjectTab(tab: ProjectTab): void;
  setHighlightedVm(vmId: string | undefined): void;
  setProjectStatus(projectId: string, status: ProjectStatus): void;
  completeChecklistStep(projectId: string, stepId: ChecklistStepId): void;
  toggleChecklistStep(projectId: string, stepId: ChecklistStepId): void;
  addChecklistStep(
    projectId: string,
    input: { label: string; description: string }
  ): void;
  toggleVmPort(vmId: string, port: number): void;
  setVmPorts(vmId: string, ports: number[]): void;
  addProject(project: Omit<Project, 'id' | 'createdAt' | 'checklist'>): string;
  addToast(message: string): void;
  clearToast(): void;
}

let toastIdCounter = 1;

function createChecklist(): Project['checklist'] {
  const base: { id: ChecklistStepId; label: string; description: string }[] = [
    {
      id: 'connect',
      label: 'Подключить репозиторий или код',
      description: 'Подключите Git или загрузите архив проекта.'
    },
    {
      id: 'upload',
      label: 'Настроить окружение',
      description: 'Выберите образ, переменные окружения и зависимости.'
    },
    {
      id: 'run',
      label: 'Запустить приложение',
      description: 'Опишите команду запуска сервиса.'
    },
    {
      id: 'expose',
      label: 'Открыть доступ',
      description: 'Настройте порты и публичный доступ.'
    }
  ];

  return base.map((item) => ({ ...item, done: item.id === 'connect' }));
}

function createMockProjects(): Project[] {
  const now = new Date().toISOString();

  const project1: Project = {
    id: 'p1',
    name: 'Мой SaaS',
    description: 'Трёхзвенная SaaS-платформа для клиентов.',
    template: 'SaaS',
    region: 'Германия',
    status: 'running',
    createdAt: now,
    checklist: createChecklist(),
    resources: {
      vms: [
        {
          id: 'vm1',
          projectId: 'p1',
          name: 'frontend-1',
          role: 'frontend',
          os: 'Ubuntu 24.04',
          cpu: 2,
          ram: 4,
          disk: 50,
          publicIp: '203.0.113.10',
          privateIp: '10.0.10.11',
          state: 'running',
          monthlyCost: 24,
          portsOpen: [80, 443]
        },
        {
          id: 'vm2',
          projectId: 'p1',
          name: 'backend-1',
          role: 'backend',
          os: 'Ubuntu 24.04',
          cpu: 2,
          ram: 4,
          disk: 80,
          privateIp: '10.0.10.21',
          state: 'running',
          monthlyCost: 26,
          portsOpen: [8000]
        },
        {
          id: 'vm3',
          projectId: 'p1',
          name: 'db-1',
          role: 'db',
          os: 'Ubuntu 24.04',
          cpu: 2,
          ram: 8,
          disk: 120,
          privateIp: '10.0.10.31',
          state: 'running',
          monthlyCost: 30,
          portsOpen: [5432]
        }
      ],
      networks: [
        {
          id: 'net-public-1',
          projectId: 'p1',
          name: 'Public network',
          cidr: '0.0.0.0/0',
          type: 'public'
        },
        {
          id: 'net-private-1',
          projectId: 'p1',
          name: 'Private app network',
          cidr: '10.0.10.0/24',
          type: 'private'
        }
      ],
      volumes: [
        {
          id: 'vol-app-1',
          projectId: 'p1',
          name: 'app-data',
          sizeGB: 50,
          attachedToVmId: 'vm2'
        },
        {
          id: 'vol-db-1',
          projectId: 'p1',
          name: 'db-data',
          sizeGB: 120,
          attachedToVmId: 'vm3'
        }
      ],
      ips: [
        {
          id: 'pip-1',
          projectId: 'p1',
          ip: '203.0.113.10',
          attachedToVmId: 'vm1'
        }
      ]
    }
  };

  const project2: Project = {
    id: 'p2',
    name: 'VPN для команды',
    description: 'VPN-сервер WireGuard для удалённого доступа.',
    template: 'VPN',
    region: 'Польша',
    status: 'running',
    createdAt: now,
    checklist: createChecklist(),
    resources: {
      vms: [
        {
          id: 'vm4',
          projectId: 'p2',
          name: 'vpn-gateway',
          role: 'vpn',
          os: 'Ubuntu 24.04',
          cpu: 1,
          ram: 2,
          disk: 30,
          publicIp: '198.51.100.25',
          privateIp: '10.0.20.10',
          state: 'running',
          monthlyCost: 12,
          portsOpen: [22, 51820]
        }
      ],
      networks: [
        {
          id: 'net-public-2',
          projectId: 'p2',
          name: 'Public network',
          cidr: '0.0.0.0/0',
          type: 'public'
        }
      ],
      volumes: [],
      ips: [
        {
          id: 'pip-2',
          projectId: 'p2',
          ip: '198.51.100.25',
          attachedToVmId: 'vm4'
        }
      ]
    }
  };

  const project3: Project = {
    id: 'p3',
    name: 'AI inference',
    description: 'Сервис инференса модели на CPU.',
    template: 'AI Inference',
    region: 'Нидерланды',
    status: 'provisioning',
    createdAt: now,
    checklist: createChecklist(),
    resources: {
      vms: [
        {
          id: 'vm5',
          projectId: 'p3',
          name: 'api-gateway',
          role: 'frontend',
          os: 'Ubuntu 24.04',
          cpu: 2,
          ram: 4,
          disk: 50,
          publicIp: '203.0.113.55',
          privateIp: '10.0.30.11',
          state: 'provisioning',
          monthlyCost: 28,
          portsOpen: [80, 443]
        },
        {
          id: 'vm6',
          projectId: 'p3',
          name: 'inference-worker',
          role: 'worker',
          os: 'Ubuntu 24.04',
          cpu: 4,
          ram: 16,
          disk: 200,
          privateIp: '10.0.30.21',
          state: 'provisioning',
          monthlyCost: 60,
          portsOpen: [8000]
        }
      ],
      networks: [
        {
          id: 'net-public-3',
          projectId: 'p3',
          name: 'Public network',
          cidr: '0.0.0.0/0',
          type: 'public'
        },
        {
          id: 'net-private-3',
          projectId: 'p3',
          name: 'Private inference',
          cidr: '10.0.30.0/24',
          type: 'private'
        }
      ],
      volumes: [],
      ips: [
        {
          id: 'pip-3',
          projectId: 'p3',
          ip: '203.0.113.55',
          attachedToVmId: 'vm5'
        }
      ]
    }
  };

  return [project1, project2, project3];
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: createMockProjects(),
  nextId: 4,
  selectedProjectId: undefined,
  selectedProjectTab: 'overview',
  highlightedVmId: undefined,
  toast: undefined,

  setSelectedProject(projectId) {
    set({ selectedProjectId: projectId, selectedProjectTab: 'overview' });
  },

  setProjectTab(tab) {
    set({ selectedProjectTab: tab });
  },

  setHighlightedVm(vmId) {
    set({ highlightedVmId: vmId });
  },

  setProjectStatus(projectId, status) {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, status } : project
      )
    }));
  },

  completeChecklistStep(projectId, stepId) {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              checklist: project.checklist.map((step) =>
                step.id === stepId ? { ...step, done: true } : step
              )
            }
      )
    }));
  },

  toggleChecklistStep(projectId, stepId) {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              checklist: project.checklist.map((step) =>
                step.id === stepId ? { ...step, done: !step.done } : step
              )
            }
      )
    }));
  },

  addChecklistStep(projectId, input) {
    const id: ChecklistStepId = `custom-${Date.now()}`;

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              checklist: [
                ...project.checklist,
                {
                  id,
                  label: input.label,
                  description: input.description,
                  done: false
                }
              ]
            }
      )
    }));
  },

  toggleVmPort(vmId, port) {
    set((state) => ({
      projects: state.projects.map((project) => ({
        ...project,
        resources: {
          ...project.resources,
          vms: project.resources.vms.map((vm) =>
            vm.id !== vmId
              ? vm
              : {
                  ...vm,
                  portsOpen: vm.portsOpen.includes(port)
                    ? vm.portsOpen.filter((p) => p !== port)
                    : [...vm.portsOpen, port]
                }
          )
        }
      }))
    }));
  },

  setVmPorts(vmId, ports) {
    set((state) => ({
      projects: state.projects.map((project) => ({
        ...project,
        resources: {
          ...project.resources,
          vms: project.resources.vms.map((vm) =>
            vm.id !== vmId ? vm : { ...vm, portsOpen: ports }
          )
        }
      }))
    }));
  },

  addProject(input) {
    const id = `p${get().nextId}`;
    const createdAt = new Date().toISOString();
    const project: Project = {
      id,
      createdAt,
      checklist: createChecklist(),
      ...input
    };

    set((state) => ({
      projects: [...state.projects, project],
      nextId: state.nextId + 1,
      selectedProjectId: id,
      selectedProjectTab: 'overview'
    }));

    return id;
  },

  addToast(message) {
    const id = toastIdCounter++;
    set({ toast: { id, message } });
  },

  clearToast() {
    if (!get().toast) return;
    set({ toast: undefined });
  }
}));

export function findProjectVmById(
  state: ProjectsState,
  vmId: string
): { projectId: string; vm: VM } | undefined {
  for (const project of state.projects) {
    const vm = project.resources.vms.find((v) => v.id === vmId);
    if (vm) {
      return { projectId: project.id, vm };
    }
  }
  return undefined;
}

