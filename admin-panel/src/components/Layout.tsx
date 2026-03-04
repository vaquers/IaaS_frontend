import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', end: true },
  { path: '/tenants', label: 'Tenants', end: true },
  { path: '/vm-fleet', label: 'VM Fleet', end: true },
  { path: '/billing-debt', label: 'Billing', end: true },
  { path: '/templates', label: 'Templates', end: true },
  { path: '/infra', label: 'Infra', end: true },
  { path: '/audit', label: 'Audit', end: true },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-logo">IaaS Admin</h1>
        <nav className="layout-nav" aria-label="Навигация">
          {NAV_ITEMS.map(({ path, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `layout-nav-item ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
}
