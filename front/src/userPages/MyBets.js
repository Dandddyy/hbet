import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Bet.css';

function MyBets() {
    const [bets, setBets] = useState([]);
    const [betTypes, setBetTypes] = useState({});
    const [races, setRaces] = useState({});
    const [horses, setHorses] = useState({});
    const [error, setError] = useState(null);

    const fetchBets = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            const { id } = decoded;

            fetch(`http://localhost:2525/api/bet/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBets(data);
                    } else {
                        console.error('Expected an array, but got:', data);
                        setError('Unexpected response format');
                    }
                })
                .catch(error => {
                    console.error('Error fetching bets:', error);
                    setError('Failed to fetch bets');
                });
        }
    };

    const fetchBetType = (betTypeId) => {
        const token = localStorage.getItem('jwtToken');
        return fetch(`http://localhost:2525/api/bet-type/${betTypeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching bet type:', error);
                return null;
            });
    };

    const fetchRace = (raceId) => {
        const token = localStorage.getItem('jwtToken');
        return fetch(`http://localhost:2525/api/race/${raceId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching race:', error);
                return null;
            });
    };

    const fetchHorse = (horseId) => {
        const token = localStorage.getItem('jwtToken');
        return fetch(`http://localhost:2525/api/horse/${horseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching horse:', error);
                return null;
            });
    };

    useEffect(() => {
        fetchBets();
    }, []);

    useEffect(() => {
        if (bets.length > 0) {
            bets.forEach(async (bet) => {
                if (!betTypes[bet.betTypeId]) {
                    const betType = await fetchBetType(bet.betTypeId);
                    setBetTypes(prev => ({
                        ...prev,
                        [bet.betTypeId]: betType
                    }));

                    if (betType && !races[betType.raceId]) {
                        const race = await fetchRace(betType.raceId);
                        setRaces(prev => ({
                            ...prev,
                            [betType.raceId]: race
                        }));
                    }

                    if (betType && betType.horseId && !horses[betType.horseId]) {
                        const horse = await fetchHorse(betType.horseId);
                        setHorses(prev => ({
                            ...prev,
                            [betType.horseId]: horse
                        }));
                    }
                }
            });
        }
    }, [bets]);

    const getHorseName = (horseId) => {
        const horse = horses[horseId];
        return horse ? horse.name : 'Unknown Horse';
    };

    const getStatusClass = (status) => {
        if (status.toLowerCase() === 'win') return 'status-win';
        if (status.toLowerCase() === 'lose') return 'status-lose';
        return '';
    };

    return (
        <div className="my-bets-container">
            {error && <p className="error-message">{error}</p>}

            {bets.map((bet) => {
                const betType = betTypes[bet.betTypeId];
                const race = betType ? races[betType.raceId] : null;
                const horseId = betType ? betType.horseId : null;

                return (
                    <div key={bet.betId} className="bet-card">
                        <div className="bet-info">
                            <div className="info-section">
                                <span className="label">Status</span>
                                <span className={`value ${getStatusClass(bet.status)}`}>
                                    {bet.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="info-section">
                                <span className="label">Amount</span>
                                <span className="value">{bet.amount}$</span>
                            </div>
                            <div className="info-section">
                                <span className="label">Potential Win</span>
                                <span className="value">{bet.potential_win}$</span>
                            </div>
                            {betType && (
                                <>
                                    {horseId && (
                                        <div className="info-section">
                                            <span className="label">Horse</span>
                                            <span className="value">{getHorseName(horseId)}</span>
                                        </div>
                                    )}
                                    <div className="info-section">
                                        <span className="label">Betting Place</span>
                                        <span className="value">{betType._first ? 'First' : 'Last'}</span>
                                    </div>
                                </>
                            )}
                            {race && (
                                <>
                                    <div className="info-section">
                                        <span className="label">Race Location</span>
                                        <span className="value">{race.location}</span>
                                    </div>
                                    <div className="info-section">
                                        <span className="label">Race Date</span>
                                        <span className="value">{new Date(race.date).toLocaleDateString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyBets;
