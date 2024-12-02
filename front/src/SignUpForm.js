import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './LoginForm.module.css';

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
    const handleNameChange = (event) => setName(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            alert('Please fill in all fields.');
            return;
        }

        const userResponse = await fetch(`http://localhost:2525/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await userResponse.json();

        if (users) {
            for (const user of users) {
                if (user.email === email) {
                    alert('Account with this email is already exist.');
                    return;
                }
            }
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordPattern.test(password)) {
            alert('Password must be at least 6 characters long, containing at least one uppercase and one lowercase letter.');
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        const userData = {email, password, name};

        fetch('http://localhost:2525/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Something went wrong');
            })
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));

        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.logo}>HBet</div>
                <h2 className={styles.title}>Sign Up</h2>
                <div className={styles.inputGroup}>
                    <label>Name</label>
                    <input
                        type="name"
                        value={name}
                        onChange={handleNameChange}
                        required
                    />
                </div>
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
                <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.button} onClick={handleSubmit}>Sign Up</button>
                <p className={styles.signUpPrompt}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUpForm;
