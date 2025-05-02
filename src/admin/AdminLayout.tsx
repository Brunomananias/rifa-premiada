import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Botão visível apenas em telas pequenas */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 9999,
          backgroundColor: '#ffd700',
          border: 'none',
          padding: '0.5rem 1rem',
          fontSize: '1.2rem',
          display: window.innerWidth < 768 ? 'block' : 'none',
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          position: window.innerWidth < 768 ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          height: '100%',
          width: '220px',
          zIndex: 9998,
          backgroundColor: '#111',
        }}
      >
        <AdminNavbar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <main
          style={{
            flexGrow: 1,
            padding: '2rem',
            paddingTop: window.innerWidth < 768 ? '4rem' : '2rem', // espaço extra no topo em telas pequenas
          }}
        >
          {children}
        </main>
    </div>
  );
};

export default AdminLayout;
