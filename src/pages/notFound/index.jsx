import {Link} from 'react-router-dom';

import './index.css';

function NotFound() {
    return (
        <main className="not-found-page">
            <h1>404 - Page Not Found</h1>
            <p>Page not found</p>
            <Link to="/">Back to dashboard</Link>
        </main>
    );
}

export default NotFound;
