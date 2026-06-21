import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Cookies from 'js-cookie';

import './index.css';

function ReferralDetails() {
    const {id} = useParams();
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchReferralDetails() {
            setLoading(true);
            setError("");
            setNotFound(false);

            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await fetch(`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const responseJson = await response.json();

                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true);
                        return;
                    }

                    throw new Error(`${responseJson.message || 'Failed to fetch referral details'} (${response.status})`);
                }

                const matchedReferral = getReferralFromResponse(responseJson, id);

                if (!matchedReferral) {
                    setNotFound(true);
                    return;
                }

                setReferral(matchedReferral);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        }

        fetchReferralDetails();
    }, [id]);

    const getReferralFromResponse = (responseJson, referralId) => {
        const data = responseJson.data;
        const referralIdText = String(referralId);

        if (!data) {
            return null;
        }

        if (Array.isArray(data)) {
            return data.find((item) => String(item.id) === referralIdText) || null;
        }

        if (data.id !== undefined && String(data.id) === referralIdText) {
            return data;
        }

        if (Array.isArray(data.referrals)) {
            return data.referrals.find((item) => String(item.id) === referralIdText) || null;
        }

        return null;
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (notFound) {
        return (
            <main className="detail-page">
                <h1>Referral not found</h1>
                <Link to="/">Back to dashboard</Link>
            </main>
        );
    }

    return (
        <main className="detail-page">
            {error && <p role="alert" style={{color: 'red'}}>{error}</p>}

            {referral && (
                <>
                    <Link className="back-link" to="/">Back to dashboard</Link>
                    <h1>Referral Details</h1>
                    <p>Full information for this referral partner.</p>

                    <section className="detail-card">
                    <h2>{referral.name}</h2>
                    <span>{referral.serviceName}</span>

                    <dl>
                        <dt>Referral ID</dt>
                        <dd>{referral.id}</dd>

                        <dt>Service Name</dt>
                        <dd>{referral.serviceName}</dd>

                        <dt>Date</dt>
                        <dd>{formatDate(referral.date)}</dd>

                        <dt>Profit</dt>
                        <dd>{formatProfit(referral.profit)}</dd>
                    </dl>
                    </section>

                </>
            )}
        </main>
    );
}

export default ReferralDetails;
