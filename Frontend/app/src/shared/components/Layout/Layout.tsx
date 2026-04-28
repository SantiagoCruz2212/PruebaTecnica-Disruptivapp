import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CreateTicketModal from '../../../features/tickets/components/CreateTicketModal';

export default function Layout() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Sidebar onCreateNew={() => setCreateOpen(true)} />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <CreateTicketModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
        }}
      />
    </div>
  );
}
