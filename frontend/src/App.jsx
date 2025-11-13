import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Wip from "./pages/WIP.jsx";
import Registro from "./pages/Registro.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Login from "./pages/Login.jsx";
import QuienesSomos from "./pages/QuienesSomos.jsx";
import UserPage from "./pages/UserPage.jsx";
import AtencionAlCliente from "./pages/AtencionCliente.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/wip" element={<Wip />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/perfil" element={<UserPage />} />
            <Route path="/atencion" element={<AtencionAlCliente />} />
        </Routes>
    );
}

export default App;