import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import './Home.css';

function Account() {
    const [user, setUser] = useState({ name: '', email: '', money: ''});
    const [isEditing, setIsEditing] = useState(false);
    const [updatedName, setUpdatedName] = useState('');
    const [error, setError] = useState(null);

    const fetchUser = () => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        fetch(`http://localhost:2525/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setUpdatedName(data.name); // Для отображения текущего имени в поле редактирования
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
            });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        fetch(`http://localhost:2525/api/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: updatedName, email: user.email, money: user.money})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user');
                }
                return fetch(`http://localhost:2525/api/user/${userId}/refresh-token`, {
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
                    setUser({ name: updatedName, email: user.email, money: user.money});
                    setIsEditing(false);
                }
            })
            .catch(error => {
                console.error('Error updating user:', error);
                setError('Failed to update user');
            });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="race-card">
            {error && <p className="error-message">{error}</p>}
            <div className="race-info">
                <div className="info-section">

                    <span className="label">Name</span>
                    {isEditing ? (
                        <input
                            className="form-input"
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />
                    ) : (
                        <span className="value">{user.name}</span>
                    )}
                </div>
                <div className="info-section">
                    <span className="label">Email</span>
                    <span className="value">{user.email}</span>
                </div>
                <div className="info-section">
                    <span className="label">Balance</span>
                    <span className="value">{user.money}$</span>
                </div>
            </div>
            <div className="account-actions">
                {isEditing ? (
                    <button className="bet-button" onClick={handleSave}>Save</button>
                ) : (
                    <button className="bet-button" onClick={handleEdit}>Edit</button>
                )}
            </div>
        </div>
    );
}

export default Account;
