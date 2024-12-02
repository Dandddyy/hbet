import React, { useState } from 'react';
import '../UserPage.css';
import { jwtDecode } from "jwt-decode";
import MyBets from "./MyBets";
import Home from "./Home";
import Result from "./Results";
import Bet from "./Bet";
import Account from "./Accaunt";

function UserPage() {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);
    const { money } = decodedToken;
    const { name } = decodedToken;

    const user = {
        name: name,
        balance: money
    };

    const [activePage, setActivePage] = useState('home');
    const [selectedRace, setSelectedRace] = useState(null); // Новое состояние для выбранной гонки

    const renderContent = () => {
        switch (activePage) {
            case 'home':
                return <Home onBetClick={handleBetClick} />; // Передаем функцию для обработки клика по Bet
            case 'results':
                return <Result />;
            case 'myBets':
                return <MyBets />;
            case 'account':
                return <Account />;
            case 'bet':
                return <Bet race={selectedRace} />; // Передаем выбранную гонку в Bet.js
            default:
                return <p>Welcome to the Home page!</p>;
        }
    };

    const handleBetClick = (race) => {
        setSelectedRace(race); // Устанавливаем выбранную гонку
        setActivePage('bet'); // Переходим на страницу ставок
    };

    const buttonStyle = (page) => ({
        backgroundColor: activePage === page ? '#000' : '#ffffff',
        color: activePage === page ? '#ffffff' : '#000000',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: '500',
        transition: 'background-color 0.2s ease',
    });

    return (
        <div className="user-page">
            <header className="header">
                <div className="header-left">HBet</div>
                <div className="header-center">
                    <button style={buttonStyle('home')} onClick={() => setActivePage('home')}>HOME</button>
                    <div className="vertical-line"></div>
                    <button style={buttonStyle('results')} onClick={() => setActivePage('results')}>RESULTS</button>
                    <div className="vertical-line"></div>
                    <button style={buttonStyle('myBets')} onClick={() => setActivePage('myBets')}>MY BETS</button>
                    <div className="vertical-line"></div>
                    <button style={buttonStyle('account')} onClick={() => setActivePage('account')}>ACCOUNT</button>
                </div>
                <div className="header-right">
                    {user.name} - {user.balance}$
                </div>
            </header>

            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default UserPage;
