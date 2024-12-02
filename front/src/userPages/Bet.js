import React, { useEffect, useState } from 'react';
import './Bet.css';
import {jwtDecode} from "jwt-decode";

function Bet({ race }) {
    const [betTypes, setBetTypes] = useState([]);
    const [horses, setHorses] = useState([]);
    const [error, setError] = useState(null);
    const [betTypeData, setBetTypeData] = useState(null);
    const [userBalance, setUserBalance] = useState(0);
    const [userName, setUserName] = useState(0);

    const [betData, setBetData] = useState({
        userId: 0,
        betTypeId: '',
        amount: '',
        status: 'none',
        potential_win: 0
    });


    const fetchBetTypes = () => {
        const token = localStorage.getItem('jwtToken');

        fetch(`http://localhost:2525/api/bet-type/list/${race.raceId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBetTypes(data);
                } else {
                    console.error('Expected an array, but got:', data);
                    setError('Unexpected response format');
                }
            })
            .catch(error => {
                console.error('Error fetching bet types:', error);
                setError('Failed to fetch bet types');
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

    const fetchBetTypeDetails = (betTypeId) => {
        const token = localStorage.getItem('jwtToken');
        fetch(`http://localhost:2525/api/bet-type/${betTypeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setBetTypeData(data);
                calculatePotentialWin(data.odd, betData.amount); // Пересчет выигрыша при обновлении коэффициента
            })
            .catch(error => {
                console.error('Error fetching bet type details:', error);
                setError('Failed to fetch bet type details');
            });
    };

    useEffect(() => {
        if (race) {
            fetchBetTypes();
            fetchHorses();
        }
    }, [race]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const { id } = decoded;
        const { money } = decoded
        const { name } = decoded
        setBetData(prevData => ({
            ...prevData,
            userId: id,
        }));

        setUserBalance(money);
        setUserName(name);

    }, [betTypeData]);

    const getHorseName = (horseId) => {
        const horse = horses.find(h => h.horseId === horseId);
        return horse ? horse.name : 'Unknown Horse';
    };

    const getHorseAge = (horseId) => {
        const horse = horses.find(h => h.horseId === horseId);
        return horse ? horse.age : 'Unknown Horse';
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBetData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'betTypeId' && value) {
            fetchBetTypeDetails(value);
        }

        if (name === 'amount' && betTypeData) {
            calculatePotentialWin(betTypeData.odd, value);
        }
    };

    const calculatePotentialWin = (odd, amount) => {
        const potentialWin = (odd * amount).toFixed(2);
        setBetData(prevState => ({
            ...prevState,
            potential_win: parseFloat(potentialWin)
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (betData.amount > userBalance) {
            alert('Insufficient balance!');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        const updatedBalance = userBalance - betData.amount;

        fetch('http://localhost:2525/api/bet', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(betData)
        })
            .then(response => response.json())
            .then(data => {
                alert('Bet added successfully!');
                setUserBalance(updatedBalance);
                updateUserBalance(updatedBalance);
                console.log(data);
            })
            .catch(error => {
                console.error('Error adding bet:', error);
            });
    };

    const updateUserBalance = (newBalance) => {
        console.log(newBalance);
        const token = localStorage.getItem('jwtToken');
        fetch(`http://localhost:2525/api/user/${betData.userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ money: newBalance, name: userName })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user');
                }
                return fetch(`http://localhost:2525/api/user/${betData.userId}/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            })
            .then(response => response.text())
            .then(data => {
                if (data) {
                    localStorage.setItem('jwtToken', data);
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Balance updated successfully');
                } else {
                    console.error('Failed to update balance');
                }
            })
            .catch(error => {
                console.error('Error updating balance:', error);
            });
    };

    return (
        <div>
            <h2 className="title">Betting</h2>
            {error && <p className="error-message">{error}</p>}

            {race && (
                <div>
                    <div className="race-card">
                        <div className="race-card-list">
                            <div className="race-info">
                                <div className="info-section">
                                    <span className="label">Race ID</span>
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

                            <div className="add-bet-form">
                                <h3>Add New Bet</h3>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label>Bet Type ID:</label>
                                        <input
                                            type="text"
                                            name="betTypeId"
                                            value={betData.betTypeId}
                                            onChange={handleInputChange}
                                            className="add-bet-form-input"
                                        />
                                    </div>
                                    <div>
                                        <label>Amount:</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={betData.amount}
                                            onChange={handleInputChange}
                                            className="add-bet-form-input"
                                        />
                                    </div>
                                    <div>
                                        <label>Potential Win:</label>
                                        <input
                                            type="number"
                                            name="potential_win"
                                            value={betData.potential_win}
                                            readOnly
                                            className="add-bet-form-input"
                                        />
                                    </div>
                                    <button className="add-button" type="submit">Add Bet</button>
                                </form>
                            </div>
                        </div>

                        <div className="bet-list">
                            {betTypes.map((bet) => (
                                <div key={bet.betTypeId} className="bet-card">
                                    <div className="bet-info">
                                        <div className="info-section">
                                            <span className="label">Bet Type ID</span>
                                            <span className="value">{bet.betTypeId}</span>
                                        </div>
                                        <div className="info-section">
                                            <span className="label">Horse Name</span>
                                            <span className="value">{getHorseName(bet.horseId)}</span>
                                        </div>
                                        <div className="info-section">
                                            <span className="label">Horse Age</span>
                                            <span className="value">{getHorseAge(bet.horseId)}</span>
                                        </div>
                                        <div className="info-section">
                                            <span className="label">Odds</span>
                                            <span className="value">{bet.odd}</span>
                                        </div>
                                        <div className="info-section">
                                            <span className="label">Place</span>
                                            <span className="value">{bet._first ? 'First' : 'Last'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bet;
