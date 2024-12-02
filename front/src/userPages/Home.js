import React, { useEffect, useState } from 'react';
import './Home.css';

function Home({ onBetClick }) {
    const [races, setRaces] = useState([]);
    const [error, setError] = useState(null);

    const fetchRaces = () => {
        const token = localStorage.getItem('jwtToken');

        fetch('http://localhost:2525/api/race/active', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRaces(data);
                } else {
                    setError('Unexpected response format');
                }
            })
            .catch(error => {
                setError('Failed to fetch races');
            });
    };

    useEffect(() => {
        fetchRaces();
    }, []);

    return (
        <div>
            <h2 className="title">Active races</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="race-list">
                {races.map((race) => (
                    <div key={race.raceId} className="race-card">
                        <div className="race-info">
                            <div className="info-section">
                                <span className="label">ID</span>
                                <span className="value">{race.raceId}</span>
                            </div>
                            <div className="info-section">
                                <span className="label">Location</span>
                                <span className="value">{race.location}</span>
                            </div>
                            <div className="info-section">
                                <span className="label">Date</span>
                                <span className="value">{new Date(race.date).toLocaleDateString()}</span>
                            </div>
                            <div className="info-section">
                                <span className="label">Time</span>
                                <span className="value">{race.time}</span>
                            </div>
                        </div>
                        <button className="bet-button" onClick={() => onBetClick(race)}>Bet</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
