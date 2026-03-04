import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Tenants } from './pages/Tenants';
import { VMFleet } from './pages/VMFleet';
import { BillingDebt } from './pages/BillingDebt';
import { Templates } from './pages/Templates';
import { InfraHosts } from './pages/InfraHosts';
import { AuditLog } from './pages/AuditLog';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/vm-fleet" element={<VMFleet />} />
        <Route path="/billing-debt" element={<BillingDebt />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/infra" element={<InfraHosts />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
