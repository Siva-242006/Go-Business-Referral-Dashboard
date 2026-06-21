import {useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';

import './index.css';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const token = Cookies.get('jwt_token');

    if (token) {
        return <Navigate to="/" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            
            const response = await fetch("https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const responseJson = await response.json();
            if(!response.ok) {
                throw new Error(responseJson.message || "Something went wrong!");
            }
            
            const token = responseJson.data?.token;

            if (!token) {
                throw new Error('Token not found');
            }

            Cookies.set('jwt_token', token);
            navigate('/', { replace: true });
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        } 


    }

    return (
        <main className="login-page">
            <section className="login-card">
                <h1>Go Business</h1>
                <p>Sign in to open your referral dashboard.</p>
                <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign in</button>
                </form>
                {loading && <p className="login-status">Signing in...</p>}
                {error && <p className="login-error" role="alert">{error}</p>}
            </section>
        </main>
     )
}

export default Login;
