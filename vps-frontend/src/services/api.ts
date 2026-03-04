import type { Project } from '../domain/iaasTypes';
import type { ProjectTemplate } from '../domain/iaasTypes';

export interface VmSpec {
  name: string;
  role: string;
  os: string;
  cpu: number;
  ram: number;
  disk: number;
  portsOpen: number[];
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  template: ProjectTemplate;
  region: string;
  vms: VmSpec[];
  cidr?: string;
  sshPublicKey?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`[API] ${path} → ${resp.status}: ${text}`);
  }
  if (resp.status === 204) return undefined as T;
  return resp.json() as Promise<T>;
}

export const api = {
  listProjects(): Promise<Project[]> {
    return request<Project[]>('/projects');
  },

  createProject(payload: CreateProjectPayload): Promise<Project> {
    return request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getProject(id: string): Promise<Project> {
    return request<Project>(`/projects/${id}`);
  },

  deleteProject(id: string): Promise<void> {
    return request<void>(`/projects/${id}`, { method: 'DELETE' });
  },

  getVmMetrics(vmName: string): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(`/vms/${vmName}/metrics`);
  },
};
