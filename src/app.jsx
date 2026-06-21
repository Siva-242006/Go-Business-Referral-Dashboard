import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './pages/login';
import DashboardPage from './pages/dashboardPage';
import ReferralDetails from './pages/referralDetails';
import NotFound from './pages/notFound';
import ProtectedRoute from './components/protectedRoutes';
import Navbar from './components/navbar';

import './app.css';



function App() {
    const basename = window.location.hostname.includes('github.io') ? '/Go-Business-Referral-Dashboard' : '';

    return (
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/" element={<ProtectedRoute>
                    <Navbar/>
                    <DashboardPage/>
                </ProtectedRoute>} />
                <Route path="/referral/:id" element={<ProtectedRoute>
                    <Navbar/>
                    <ReferralDetails/>
                </ProtectedRoute>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    )
}


export default App
