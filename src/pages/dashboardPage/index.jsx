import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

import './index.css';

import MetricCard from '../../components/metricCard';

function DashboardPage() {
    const navigate = useNavigate();
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isASC, setIsASC] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError("");
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?search=${searchTerm}&sort=${isASC ? 'asc' : 'desc'}`;

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const responseJson = await response.json();
                if (!response.ok) {
                    throw new Error(`${responseJson.message || 'Failed to fetch referral data'} (${response.status})`);
                }
                setReferralData(responseJson.data);
                setCurrentPage(1);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [searchTerm, isASC]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const formatDate = (date) => {
        return date ? date.replaceAll('-', '/') : '';
    };

    const formatProfit = (profit) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(profit);
    };

    const openReferralDetails = (referralId) => {
        navigate(`/referral/${referralId}`);
    };

    const handleReferralKeyDown = (event, referralId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openReferralDetails(referralId);
        }
    };

    const referrals = referralData?.referrals || [];
    const rowsPerPage = 10;
    const totalEntries = referrals.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleReferrals = referrals.slice(startIndex, endIndex);
    const from = totalEntries === 0 ? 0 : startIndex + 1;
    const to = Math.min(endIndex, totalEntries);

    return (
        <main className="dashboard-page">
            {error && <p role="alert" style={{color: 'red'}}>{error}</p>}

            <header className="dashboard-header">
                <h1>Referral Dashboard</h1>
                <p>Track your referrals, earnings, and partner activity in one place.</p>
            </header>

            
            <section className="dashboard-section" role="region" aria-label="Overview metrics">
                <h2>Overview</h2>
                <div className="metrics-container">
                    {referralData ? (
                        referralData.metrics.map((metric, index) => (
                            <MetricCard key={index} label={metric.label} value={metric.value} />
                        ))
                    ) : (
                        <p>No metrics available</p>
                    )}
                </div>
            </section>

            <section className="dashboard-section" aria-label="Service summary">
                <h2>Service summary</h2>

                {referralData && referralData.serviceSummary ? (
                    <div className="summary-grid">
                        <p>
                            <strong>Service</strong> <br /> {referralData.serviceSummary.service}
                        </p>
                        <p>
                            <strong>Your Referrals</strong> {referralData.serviceSummary.yourReferrals}
                        </p>
                        <p>
                            <strong>Active Referrals</strong> {referralData.serviceSummary.activeReferrals}
                        </p>
                        <p>
                            <strong>Total Ref. Earnings</strong> {referralData.serviceSummary.totalRefEarnings}
                        </p>
                    </div>
                ) : (
                    <p>No service summary available</p>
                )}
            </section>

            <section className="dashboard-section" aria-label="Share referral">
                <h2>Refer friends and earn more</h2>

                {referralData && referralData.referral ? (
                    <div className="share-grid">
                        <div className="share-field">
                            <label htmlFor="referralLink">Your Referral Link</label>
                            <input
                                id="referralLink"
                                type="text"
                                value={referralData.referral.link}
                                readOnly
                            />
                            <button type="button" onClick={() => handleCopy(referralData.referral.link)}>
                                Copy
                            </button>
                        </div>

                        <div className="share-field">
                            <label htmlFor="referralCode">Your Referral Code</label>
                            <input
                                id="referralCode"
                                type="text"
                                value={referralData.referral.code}
                                readOnly
                            />
                            <button type="button" onClick={() => handleCopy(referralData.referral.code)}>
                                Copy
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>No referral details available</p>
                )}
            </section>

            <section className="dashboard-section referrals-section">
                <h2>All referrals</h2>

                <div className="table-controls">
                    <label>
                        Search
                        <input
                            type="search"
                            placeholder={"Name or service\u2026"}
                            aria-label="Search referrals"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </label>

                    <label>
                        Sort by date
                        <select
                            value={isASC ? 'asc' : 'desc'}
                            onChange={(e) => {
                                setIsASC(e.target.value === 'asc');
                                setCurrentPage(1);
                            }}
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>
                </div>

                <table className="referrals-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleReferrals.length > 0 ? (
                            visibleReferrals.map((referral) => (
                                <tr
                                    key={referral.id}
                                    tabIndex="0"
                                    role="button"
                                    onClick={() => openReferralDetails(referral.id)}
                                    onKeyDown={(event) => handleReferralKeyDown(event, referral.id)}
                                >
                                    <td>{referral.name}</td>
                                    <td>{referral.serviceName}</td>
                                    <td>{formatDate(referral.date)}</td>
                                    <td>{formatProfit(referral.profit)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No matching entries</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p className="pagination-summary">
                    Showing {from}{'\u2013'}{to} of {totalEntries} entries
                </p>

                {totalPages > 1 && (
                    <div className="pagination-actions">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                type="button"
                                onClick={() => setCurrentPage(index + 1)}
                                disabled={currentPage === index + 1}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>

            <footer className="dashboard-footer">
                <p>Go Business</p>
                <nav aria-label="Footer">
                    <a href="#about">About</a>
                    <a href="#privacy">Privacy</a>
                </nav>
                <p>&copy; 2024 Go Business</p>
            </footer>
        </main>
    );
}

export default DashboardPage;
