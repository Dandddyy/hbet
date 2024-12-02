import React, { useEffect, useState } from 'react';
import './Result.css';

function Results() {
    const [races, setRaces] = useState([]);
    const [results, setResults] = useState([]);
    const [horses, setHorses] = useState([]);
    const [error, setError] = useState(null);

    const fetchRaces = () => {
        const token = localStorage.getItem('jwtToken');

        fetch('http://localhost:2525/api/race/end', {
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
                    console.error('Expected an array, but got:', data);
                    setError('Unexpected response format');
                }
            })
            .catch(error => {
                console.error('Error fetching races:', error);
                setError('Failed to fetch races');
            });
    };

    const fetchResults = () => {
        const token = localStorage.getItem('jwtToken');

        fetch('http://localhost:2525/api/result', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setResults(data);
                } else {
                    console.error('Expected an array, but got:', data);
                    setError('Unexpected response format');
                }
            })
            .catch(error => {
                console.error('Error fetching results:', error);
                setError('Failed to fetch results');
            });
    };

    const fetchHorses = () => {
        const token = localStorage.getItem('jwtToken');

        fetch('http://localhost:2525/api/horse', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setHorses(data);
                } else {
                    console.error('Expected an array, but got:', data);
                    setError('Unexpected response format');
                }
            })
            .catch(error => {
                console.error('Error fetching horses:', error);
                setError('Failed to fetch horses');
            });
    };

    useEffect(() => {
        fetchRaces();
        fetchResults();
        fetchHorses();
    }, []);

    const getHorseName = (horseId) => {
        const horse = horses.find(h => h.horseId === horseId);
        return horse ? horse.name : 'Unknown Horse';
    };

    const getResultsForRace = (raceId) => {
        return results.filter(result => result.raceId === raceId);
    };

    return (
        <div>
            <div className="result-list">
                {races.map((race) => (
                    <div key={race.raceId} className="result-card">
                        <div className="result-header">
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
                        </div>

                        <div className="result-details">
                            <h4>Results:</h4>
                            {getResultsForRace(race.raceId).map(result => (
                                <div key={result.resultId} className="horse-info">
                                    <span>{getHorseName(result.horseId)}</span>
                                    <span>Position: {result.position}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
