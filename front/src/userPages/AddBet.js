import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import '../UserPage.css';

function AddBet() {
    const [betData, setBetData] = useState({
        userId: 0,
        betTypeId: '',
        amount: '',
        status: 'none',
        potential_win: 0
    });

    const [betTypeData, setBetTypeData] = useState({
        odd: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBetData(prevState => ({
            ...prevState,
            [name]: value,
            potential_win: betTypeData.odd * betData.amount
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            const { id } = decoded;

            fetch(`http://localhost:2525/api/bet-type/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    setBetTypeData({ odd: data.odd });
                    console.log(data);
                })
                .catch(error => console.error('Error fetching bets:', error));
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const { id } = decoded;
        if (betTypeData.odd !== null) {
            setBetData(prevData => ({
                ...prevData,
                userId: id,
            }));
        }
    }, [betTypeData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');

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
                console.log(data);
            })
            .catch(error => {
                console.error('Error adding bet:', error);
            });
    };

    return (
        <div className="user-profile">
            <h2>Add New Bet</h2>
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
                <button type="submit">Add Bet</button>
            </form>
        </div>
    );
}

export default AddBet;
