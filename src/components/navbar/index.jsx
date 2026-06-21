import {Link, useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';

import './index.css';


function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('jwt_token');
        navigate('/login', { replace: true });
     }

    return (
        <nav className="navbar" aria-label="Primary">
            <Link className="navbar-brand" to="/" aria-label="Go to dashboard home">Go Business</Link>
            <div className="navbar-actions">
                <Link className="navbar-link" to="/">Home</Link>
                <button className="navbar-trial" type="button">Try for free</button>
                <button className="navbar-logout" onClick={handleLogout}>Log out</button>
            </div>
            
        </nav>
    )
}


export default Navbar;
