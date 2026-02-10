import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:p-8 mt-14 lg:mt-16 pb-20 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
