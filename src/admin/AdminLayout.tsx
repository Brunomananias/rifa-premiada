import AdminNavbar from './AdminNavbar';

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNavbar />
      <main style={{ flexGrow: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
