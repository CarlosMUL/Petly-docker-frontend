import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../app/Layout";
import Mapa from "../pages/Mapa";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PetRegistrationPage from "../pages/PetRegistrationPage";
import MisMascotas from "../pages/MisMascotas";
import Perfil from "../pages/ProfilePage";
import MisReportes from "../pages/MyReport";
import ReportFlowPage from "../pages/ReportFlowPage";
import Reportes from "../pages/Reportes";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home/>} />
                    <Route path="/Mapa" element={<Mapa/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/agregar-mascota" element={<PetRegistrationPage/>} />
                    <Route path="/mis-mascotas" element={<MisMascotas/>} />
                    <Route path="/perfil" element={<Perfil/>} />
                    <Route path="/mis-reportes" element={<MisReportes/>} />
                    <Route path="/reportes" element={<Reportes/>} />
                    <Route path="/reportar/:tipo" element={<ReportFlowPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
