import React, {useEffect, useState} from 'react';
import '../UserPage.css';

function AdminPage() {
    const [raceId, setRaceId] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [races, setRaces] = useState([]);
    const [horses, setHorses] = useState([]);
    const [newResult, setNewResult] = useState({
        raceId: '',
        horseId: '',
        position: ''
    });
    const [resultMessage, setResultMessage] = useState('');
    const [newRace, setNewRace] = useState({
        date: '',
        time: '',
        location: ''
    });
    const [raceMessage, setRaceMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {

            fetch(`http://localhost:2525/api/race`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {setRaces(data)})
                .catch(error => console.error('Error fetching races:', error));

            fetch(`http://localhost:2525/api/horse`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {setHorses(data)
                    console.log(data)})
                .catch(error => console.error('Error fetching horses:', error));
        }
    }, []);

    const handleStatusChange = (newStatus) => {
        const token = localStorage.getItem('jwtToken');
        fetch(`http://localhost:2525/api/race/${raceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => response.json())
            .then(data => setStatusMessage(data.message))
            .catch(error => {
                console.error('Failed to update race status:', error);
                setStatusMessage('Failed to update race status');
            });
    };

    const handleAddResult = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        fetch('http://localhost:2525/api/result', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newResult)
        })
            .then(response => response.json())
            .then(data => {
                setResultMessage('Result added successfully!');
                setNewResult({raceId: '', horseId: '', position: ''});
            })
            .catch(error => {
                console.error('Failed to add result:', error);
                setResultMessage('Failed to add result');
            });

        try {
            const betTypeResponse = await fetch(`http://localhost:2525/api/bet-type/list/${newResult.raceId}/${newResult.horseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!betTypeResponse.ok) {
                throw new Error('Failed to fetch bet types');
            }

            const betTypes = await betTypeResponse.json();

            for (const betType of betTypes) {
                const betResponse = await fetch(`http://localhost:2525/api/bet/list/${betType.betTypeId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!betResponse.ok) {
                    throw new Error('Failed to fetch bets');
                }

                const bets = await betResponse.json();

                if (bets) {
                    if ((!!betType._first === true && newResult.position === '1') || (!!betType._first === false && Number(newResult.position) === Number(horses.length))) {
                        for (const bet of bets) {
                            bet.status = "win";

                            const userResponse = await fetch(`http://localhost:2525/api/user/${bet.userId}`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (!userResponse.ok) {
                                throw new Error('Failed to fetch bet types');
                            }

                            const user = await userResponse.json();

                            user.money = (user.money + bet.potential_win).toFixed(2);

                            fetch(`http://localhost:2525/api/user/${user.userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ money: user.money, name: user.name })
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
                        }
                    }
                    else {
                        for (const bet of bets) {
                            bet.status = "lose";
                        }
                    }

                    for (const bet of bets) {

                        fetch(`http://localhost:2525/api/bet/${bet.betId}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status: bet.status })
                        })
                            .then(response => {
                                if (response.ok) {
                                    alert('Bet status updated successfully!');
                                } else {
                                    alert('Failed to update bet status');
                                }
                            })
                            .catch(error => alert('Error updating bet status:', error));
                    }
                }
            }
            setResultMessage('Result added successfully');

        } catch (error) {
            console.error('Failed to fetch bet types or bets:', error);
            setResultMessage('Failed to add result and fetch bets');
        }
    };

    const handleAddRace = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        fetch('http://localhost:2525/api/race', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRace)
        })
            .then(response => response.json())
            .then(data => {
                setRaceMessage('Race added successfully!');
                setNewRace({ date: '', time: '', location: '' });
            })
            .catch(error => {
                console.error('Failed to add race:', error);
                setRaceMessage('Failed to add race');
            });
    };

    return (
        <div className="user-profile">
            <div>
                <h2>Enter Race ID:</h2>
                <input
                    id="text"
                    type="text"
                    value={raceId}
                    onChange={e => setRaceId(e.target.value)}
                />
                <button type="submit" onClick={() => handleStatusChange('active')}>Set Active</button>
                <button type="submit" onClick={() => handleStatusChange('end')}>Set End</button>
            </div>
            {statusMessage && <p>{statusMessage}</p>}

            <h2>Add New Result</h2>
            <form onSubmit={handleAddResult}>
                <input
                    type="text"
                    placeholder="Race ID"
                    value={newResult.raceId}
                    onChange={e => setNewResult({...newResult, raceId: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Horse ID"
                    value={newResult.horseId}
                    onChange={e => setNewResult({...newResult, horseId: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={newResult.position}
                    onChange={e => setNewResult({...newResult, position: e.target.value})}
                />
                <button type="submit">Add Result</button>
            </form>
            {resultMessage && <p>{resultMessage}</p>}

            <h2>Add New Race</h2>
            <form onSubmit={handleAddRace}>
                <input
                    type="date"
                    placeholder="Date"
                    value={newRace.date}
                    onChange={e => setNewRace({...newRace, date: e.target.value})}
                />
                <input
                    type="time"
                    placeholder="Time"
                    value={newRace.time}
                    onChange={e => setNewRace({...newRace, time: e.target.value + ":00"})}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={newRace.location}
                    onChange={e => setNewRace({...newRace, location: e.target.value})}
                />
                <button type="submit">Add Race</button>
            </form>
            {raceMessage && <p>{raceMessage}</p>}

            <h2>Races</h2>
            <table className="bets-table">
                <thead>
                <tr>
                    <th>Race ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {races.map(race => (
                    <tr key={race.raceId}>
                        <td>{race.raceId}</td>
                        <td>{new Date(race.date).toLocaleDateString()}</td>
                        <td>{race.time}</td>
                        <td>{race.location}</td>
                        <td>{race.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h2>Horses</h2>
            <table className="bets-table">
                <thead>
                <tr>
                    <th>Horse ID</th>
                    <th>Name</th>
                    <th>Age</th>
                </tr>
                </thead>
                <tbody>
                {horses.map(horse => (
                    <tr key={horse.horseId}>
                        <td>{horse.horseId}</td>
                        <td>{horse.name}</td>
                        <td>{horse.age}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;
