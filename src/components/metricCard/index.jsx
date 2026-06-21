

import './index.css';


function MetricCard({ label, value }) {
    return (
        <div className="metric-card">
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    );
}


export default MetricCard;
