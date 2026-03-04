# IaaS Admin Panel

Админ-панель в том же стиле, что и пользовательский портал (React, TypeScript, CSS — Apple 26 / glass cards).

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5175

## Разделы

- **Overview** — всего VM, running/stopped, хосты, алерты
- **Tenants / Users** — список клиентов, баланс, статус (ok / debt / blocked)
- **VM Fleet** — все VM, фильтры по состоянию и клиенту, массовые операции (запуск/остановка)
- **Billing & Debt rules** — порог долга, политика при неплатеже (stop / delete)
- **Templates / Images** — базовые образы, заготовки, версии
- **Infra / Hosts** — мощность хостов, свободные CPU/RAM/storage (мок)
- **Audit log** — кто что создал/удалил (мок)

## Сборка

```bash
npm run build
npm run preview
```
