import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { jwtDecode } from "jwt-decode";

function LoginForm() {

    localStorage.clear();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === '' || password === '') {
            alert('Please fill in all fields.');
            return;
        }

        const userData = {
            email: email,
            password: password
        };

        fetch('http://localhost:2525/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('jwtToken', data.token);
                    navigateBasedOnRole(data.token);
                } else {
                    console.error('Login failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const navigateBasedOnRole = (token) => {
        const decodedToken = jwtDecode(token);
        const { role } = decodedToken;

        switch (role) {
            case 'admin':
                navigate('/admin');
                break;
            case 'bookmaker':
                navigate('/bookmaker');
                break;
            case 'user':
                navigate('/user');
                break;
            default:
                navigate('/login');
                break;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.logo}>
                    HBet
                </div>
                <h2 className={styles.title}>Welcome</h2>
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.button} onClick={handleSubmit}>Login</button>
                <p className={styles.signUpPrompt}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
