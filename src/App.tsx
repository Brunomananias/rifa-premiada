import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RifaPage from './pages/RifaPage';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import NotFound from './pages/NotFound';
import RifasAdmin from './admin/RifasAdmin';
import CheckoutPage from './pages/CheckoutPage'; 
import PixPage from './pages/PixPage';
import RifasDisponiveis from './pages/RifasDisponiveis';
import PublicLayout from './components/PublicLayout';
import AdminGatewayConfig from './admin/AdminGatewayConfig';

const App = () => {
  return (
    <Routes>
      {/* Layout público com Navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rifas" element={<RifasDisponiveis />} />
        <Route path="/rifa/:id" element={<RifaPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pix" element={<PixPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Rotas sem navbar (Admin) */}

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/rifas" element={<RifasAdmin />} />
      <Route path="/admin/gateway-config" element={<AdminGatewayConfig />} />
    </Routes>
  );
};

export default App;
