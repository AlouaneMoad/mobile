import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { userOperations, initDB } from '../utils/db';
import './Login.css';

// Password strength indicator component
const PasswordStrengthIndicator = ({ strength }) => {
  return (
    <div className="strength-indicator">
      <div className="strength-bar-container">
        <div
          className="strength-bar-fill"
          style={{
            width: `${strength.score}%`,
            backgroundColor: strength.color
          }}
        />
      </div>
      <span className="strength-label" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
};

// Input field component with validation
const FormField = ({ label, name, type = 'text', value, onChange, onBlur, error, touched, placeholder }) => {
  const hasError = touched && error;
  const showSuccess = touched && !error && value;

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">{label}</label>
      <div className="input-wrapper">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`form-input ${hasError ? 'error' : ''} ${showSuccess ? 'success' : ''}`}
        />
        {showSuccess && <span className="validation-icon success">✓</span>}
        {hasError && <span className="validation-icon error">!</span>}
      </div>
      {hasError && <span className="error-message">{error}</span>}
    </div>
  );
};

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Login form validation
  const loginForm = useFormValidation({
    username: '',
    password: ''
  });

  // Register form validation
  const registerForm = useFormValidation({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    initDB().catch(err => console.error('DB init error:', err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    try {
      const user = await userOperations.login(loginForm.values.username, loginForm.values.password);

      if (user) {
        setSuccessMessage('Login successful!');
        localStorage.setItem('currentUser', JSON.stringify(user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setServerError('Invalid username or password');
      }
    } catch (error) {
      setServerError('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    try {
      console.log('Starting registration...');

      // Check if username exists
      const existingUser = await userOperations.getByUsername(registerForm.values.username);
      console.log('Username check:', existingUser);
      if (existingUser) {
        setServerError('Username already exists');
        return;
      }

      // Check if email exists
      const existingEmail = await userOperations.getByEmail(registerForm.values.email);
      console.log('Email check:', existingEmail);
      if (existingEmail) {
        setServerError('Email already registered');
        return;
      }

      // Create new user
      const newUser = {
        username: registerForm.values.username,
        email: registerForm.values.email,
        password: registerForm.values.password,
        createdAt: new Date().toISOString()
      };

      console.log('Creating user:', newUser);
      const userId = await userOperations.create(newUser);
      console.log('User created with ID:', userId);

      setSuccessMessage('Registration successful! Redirecting to login...');

      // Reset register form and switch to login
      registerForm.resetForm();
      setTimeout(() => {
        setIsRegister(false);
        setSuccessMessage('');
      }, 2000);

    } catch (error) {
      setServerError('Registration failed. Please try again: ' + error.message);
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo and Title */}
        <div className="login-header">
          <div className="logo-container">
            <svg viewBox="0 0 100 100" className="logo-svg">
              <circle cx="50" cy="50" r="45" fill="url(#gradient)" />
              <path d="M30 60 Q40 30 50 50 T70 40" stroke="white" strokeWidth="4" fill="none" className="logo-path" />
              <circle cx="50" cy="50" r="8" fill="white" className="logo-dot" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="app-title">Weight Manager</h1>
          <p className="app-subtitle">Track your journey to a healthier you</p>
        </div>

        {/* Tab switcher */}
        <div className="tab-switcher">
          <button
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        {/* Messages */}
        {serverError && (
          <div className="message error-message-banner">
            {serverError}
          </div>
        )}
        {successMessage && (
          <div className="message success-message-banner">
            {successMessage}
          </div>
        )}

        {/* Login Form */}
        {!isRegister && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="auth-form">
            <FormField
              label="Username"
              name="username"
              value={loginForm.values.username}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              error={loginForm.errors.username}
              touched={loginForm.touched.username}
              placeholder="Enter your username"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={loginForm.values.password}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              error={loginForm.errors.password}
              touched={loginForm.touched.password}
              placeholder="Enter your password"
            />

            <button type="submit" className="submit-btn" disabled={loginForm.isSubmitting}>
              {loginForm.isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <p className="form-footer">
              Don't have an account?{' '}
              <button type="button" className="link-btn" onClick={() => setIsRegister(true)}>
                Register here
              </button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {isRegister && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="auth-form">
            <FormField
              label="Username"
              name="username"
              value={registerForm.values.username}
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              error={registerForm.errors.username}
              touched={registerForm.touched.username}
              placeholder="4-20 characters (letters, numbers, _)"
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={registerForm.values.email}
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              error={registerForm.errors.email}
              touched={registerForm.touched.email}
              placeholder="your.email@example.com"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={registerForm.values.password}
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              error={registerForm.errors.password}
              touched={registerForm.touched.password}
              placeholder="8+ characters with letters & numbers"
            />

            {registerForm.values.password && (
              <PasswordStrengthIndicator strength={registerForm.passwordStrength} />
            )}

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={registerForm.values.confirmPassword}
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              error={registerForm.errors.confirmPassword}
              touched={registerForm.touched.confirmPassword}
              placeholder="Re-enter your password"
            />

            <button type="submit" className="submit-btn" disabled={registerForm.isSubmitting}>
              {registerForm.isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="form-footer">
              Already have an account?{' '}
              <button type="button" className="link-btn" onClick={() => setIsRegister(false)}>
                Login here
              </button>
            </p>
          </form>
        )}

        {/* Demo user hint */}
        <div className="demo-hint">
          <p>Demo: Register a new account or use any username/password</p>
        </div>
      </div>

      {/* Animated background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
};

export default Login;
