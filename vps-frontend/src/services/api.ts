// Заглушка слоя API для будущей интеграции с бэкендом.
// Сейчас вся логика и данные находятся в zustand-store.

import type { Project } from '../domain/iaasTypes';

export interface CreateProjectPayload {
  name: string;
  description: string;
  template: Project['template'];
  region: string;
}

// Пример интерфейса для дальнейшей реализации
export const api = {
  async createProject(_payload: CreateProjectPayload): Promise<Project> {
    // В реальном приложении здесь будет HTTP-запрос к бэкенду.
    // В прототипе создание проекта происходит напрямую в zustand-store.
    throw new Error('Not implemented in prototype');
  }
};

