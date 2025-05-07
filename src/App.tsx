import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RifaPage from './pages/RifaPage';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import NotFound from './pages/NotFound';
import RifasAdmin from './admin/RifasAdmin';
import CheckoutPage from './pages/CheckoutPage'; 
import PixPage from './pages/PixPage';
import ComoFuncionaPage from './pages/ComoFuncionaPage';
import RifasDisponiveis from './pages/RifasDisponiveis';
import PublicLayout from './components/PublicLayout';
import AdminGatewayConfig from './admin/AdminGatewayConfig';
import ContatoPage from './pages/ContatoPage';
import ComprasPage from './admin/ComprasPage';
import PagamentoConcluidoPage from './pages/PagamentoConcluido';
import MaiorMenorCotaPage from './admin/MaiorMenorCota';
import ClientesPage from './admin/ClientesPage';
import Roleta from './components/Roleta';
import SorteioPage from './admin/SorteioPage';
import PlanosPage from './pages/PlanosPage';
import RegisterPage from './admin/RegisterPage';
import ProtectedRoute from './contexts/ProtectedRoute';
import PlanoPage from './admin/PlanoPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PixMercadoPagoPage from './admin/PixMercadoPagoPage';
import PagamentoConcluidoAdmin from './admin/PagamentoConcluidoAdmin';
import AdminRaffleEditPage from './admin/AdminRaffleEditPage';

const App = () => {
  return (
    <><ToastContainer /><Routes>
      {/* Layout público com Navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/como-funciona" element={<ComoFuncionaPage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route path="/rifas" element={<RifasDisponiveis />} />
        <Route path="/rifa/:id" element={<RifaPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pix" element={<PixPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/pagamento-concluido" element={<PagamentoConcluidoPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/roleta" element={<Roleta/>} />

      </Route>
      <Route path="/admin" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rifas/:id/edit" element={<AdminRaffleEditPage />} />
        <Route path="/admin/rifas" element={<RifasAdmin />} />
        <Route path="/admin/gateway-config" element={<AdminGatewayConfig />} />
        <Route path="/admin/compras" element={<ComprasPage />} />
        <Route path="/admin/menor-maior-cota" element={<MaiorMenorCotaPage />} />
        <Route path="/admin/clientes" element={<ClientesPage />} />
        <Route path="/admin/sorteio" element={<SorteioPage />} />
        <Route path="/admin/plano" element={<PlanoPage />} />
        <Route path="/admin/pixMercadoPago" element={<PixMercadoPagoPage />} />
        <Route path="/admin/pagamento-concluido-admin" element={<PagamentoConcluidoAdmin />} />
      </Route>

    </Routes></>
  );
};

export default App;
