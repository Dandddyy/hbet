import React, {useEffect, useState} from 'react';
import '../UserPage.css';

function BookmakerPage() {
    const [betTypeId, setBetTypeId] = useState('');
    const [newOdd, setNewOdd] = useState('');
    const [betTypes, setBetTypes] = useState([]);
    const [races, setRaces] = useState([]);
    const [horses, setHorses] = useState([]);
    const [newBetType, setNewBetType] = useState({
        raceId: '',
        horseId: '',
        odd: '',
        _first: ''
    });
    const [betTypeMessage, setBetTypeMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {

            fetch(`http://localhost:2525/api/bet-type`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {setBetTypes(data)
                    console.log(data)})
                .catch(error => console.error('Error fetching bets:', error));

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

    const handleOddChange = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        fetch(`http://localhost:2525/api/bet-type/${betTypeId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ odd: newOdd })
        })
            .then(response => {
                if (response.ok) {
                    alert('Odd updated successfully!');
                    setBetTypeId('');
                    setNewOdd('');
                } else {
                    alert('Failed to update odd');
                }
            })
            .catch(error => alert('Error updating odd:', error));
    };

    const handleAddBetType = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        fetch('http://localhost:2525/api/bet-type', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBetType)
        })
            .then(response => response.json())
            .then(data => {
                setBetTypeMessage('BetType added successfully!');
                setNewBetType({ raceId: '', horseId: '', odd: '', _first: '' });
            })
            .catch(error => {
                console.error('Failed to add betType:', error);
                setBetTypeMessage('Failed to add betType');
            });
    };

    return (
        <div className="user-profile">

            <form onSubmit={handleOddChange}>
                <h2>Update Bet Type Odd</h2>
                <input type="text" placeholder="Bet Type ID" value={betTypeId}
                       onChange={e => setBetTypeId(e.target.value)}/>
                <input type="number" placeholder="New Odd" value={newOdd} onChange={e => setNewOdd(e.target.value)}/>
                <button type="submit">Update Odd</button>
            </form>

            <h2>Add New BetType</h2>
            <form onSubmit={handleAddBetType}>
                <input
                    type="text"
                    placeholder="Race ID"
                    value={newBetType.raceId}
                    onChange={e => setNewBetType({...newBetType, raceId: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Horse ID"
                    value={newBetType.horseId}
                    onChange={e => setNewBetType({...newBetType, horseId: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Odd"
                    value={newBetType.odd}
                    onChange={e => setNewBetType({...newBetType, odd: e.target.value})}
                />
                <select

                    value={newBetType._first}
                    onChange={e => setNewBetType({...newBetType, _first: e.target.value === 'true'})}
                >
                    <option value="" disabled selected>Position</option>
                    <option value="true">First</option>
                    <option value="false">Last</option>
                </select>
                <button type="submit">Add BetType</button>
            </form>
            {betTypeMessage && <p>{betTypeMessage}</p>}

            <h2>Bet Types</h2>
            <table className="bets-table">
                <thead>
                <tr>
                    <th>Bet Type ID</th>
                    <th>Race ID</th>
                    <th>Horse Id</th>
                    <th>Odd</th>
                    <th>Is First</th>
                </tr>
                </thead>
                <tbody>
                {betTypes.map(betType => (
                    <tr key={betType.betTypeId}>
                        <td>{betType.betTypeId}</td>
                        <td>{betType.raceId}</td>
                        <td>{betType.horseId}</td>
                        <td>${betType.odd.toFixed(2)}</td>
                        <td>{betType._first.toString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
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

export default BookmakerPage;
