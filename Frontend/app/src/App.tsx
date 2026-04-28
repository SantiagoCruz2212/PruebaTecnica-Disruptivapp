import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import TicketsPage from './features/tickets/pages/TicketsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
