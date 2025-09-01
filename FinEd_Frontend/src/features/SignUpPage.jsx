import React, { useState } from 'react';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase Auth functions (Replace these with actual Firebase imports in your project)
// const createUserWithEmailAndPassword = async (email, password) => {
//   // Simulate Firebase auth
//   await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//   return new Promise((resolve) => {
//     setTimeout(() => resolve({ user: { email } }), 1500);
//   });
// };

// const signInWithEmailAndPassword = async (email, password) => {
  
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (email === "test@test.com" && password === "123456") {
//         resolve({ user: { email } });
//       } else {
//         reject(new Error("Invalid credentials"));
//       }
//     }, 1500);
//   });
// };

// const signInWithPopup = async () => {
//   // Simulate Google auth
//   return new Promise((resolve) => {
//     setTimeout(() => resolve({ user: { email: "user@gmail.com" } }), 1000);
//   });
// };

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignup && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignup && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      if (isSignup) {
        const result = await createUserWithEmailAndPassword(auth,formData.email, formData.password);
        const user = result.user;
        await updateProfile(user, {
      displayName: formData.fullName
    });
        alert(`Account created successfully! Welcome ${result.user.displayName}`);
      } else {
        const result = await signInWithEmailAndPassword(auth,formData.email, formData.password);
        const user = result.user;
        
        alert(`Welcome back ${result.user.displayName}!`);
      }
      navigate('/features');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      const result = await signInWithPopup(auth,googleProvider);
      const user = result.user;
      await updateProfile(user, {
      displayName: formData.fullName ? formData.fullName : user.displayName
    });
      alert(`${isSignup ? 'Account created' : 'Signed in'} successfully with Google! Welcome ${result.user.displayName}`);
      navigate('/features');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setErrors({});
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.signupContainer}>
        <div style={styles.logo}>
          <h1 style={styles.logoTitle}>FinEd</h1>
          <p style={styles.logoSubtitle}>
            {isSignup ? 'Join the Elite Experience' : 'Welcome Back to FinEd'}
          </p>
        </div>

        {errors.general && (
          <div style={styles.generalError}>
            {errors.general}
          </div>
        )}

        <div style={styles.form}>
          {isSignup && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={{
                  ...styles.input,
                  borderColor: errors.fullName ? '#ff4444' : 'rgba(255, 215, 0, 0.2)'
                }}
              />
              {errors.fullName && <span style={styles.error}>{errors.fullName}</span>}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={{
                ...styles.input,
                borderColor: errors.email ? '#ff4444' : 'rgba(255, 215, 0, 0.2)'
              }}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isSignup ? "Create a password" : "Enter your password"}
              style={{
                ...styles.input,
                borderColor: errors.password ? '#ff4444' : 'rgba(255, 215, 0, 0.2)'
              }}
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
            {isSignup && (
              <div style={styles.passwordHint}>
                Must be at least 6 characters long
              </div>
            )}
          </div>

          {isSignup && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                style={{
                  ...styles.input,
                  borderColor: errors.confirmPassword ? '#ff4444' : 'rgba(255, 215, 0, 0.2)'
                }}
              />
              {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
            </div>
          )}

          <ButtonWithHover
            onClick={handleAuth}
            disabled={loading}
            style={styles.signupBtn}
          >
            {loading ? 
              (isSignup ? 'CREATING ACCOUNT...' : 'SIGNING IN...') : 
              (isSignup ? 'CREATE ACCOUNT' : 'SIGN IN')
            }
          </ButtonWithHover>
        </div>

        <div style={styles.divider}>
          <span>OR</span>
        </div>

        <GoogleButtonWithHover
          onClick={handleGoogleAuth}
          disabled={loading}
          style={styles.googleBtn}
        >
          <svg style={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isSignup ? 'Continue with Google' : 'Sign in with Google'}
        </GoogleButtonWithHover>

        <div style={styles.loginLink}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"} 
          <a href="#" onClick={toggleAuthMode} style={styles.link}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </a>
        </div>

        <div style={styles.terms}>
          By {isSignup ? 'signing up' : 'signing in'}, you agree to our 
          <a href="#" style={styles.link}>Terms of Service</a> and 
          <a href="#" style={styles.link}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

// Button components with hover effects
const ButtonWithHover = ({ children, onClick, style, disabled, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        transform: isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered && !disabled ? '0 10px 25px rgba(255, 215, 0, 0.4)' : style.boxShadow
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const GoogleButtonWithHover = ({ children, onClick, style, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        background: isHovered && !disabled ? 'rgba(255, 215, 0, 0.1)' : style.background,
        borderColor: isHovered && !disabled ? 'rgba(255, 215, 0, 0.5)' : style.borderColor
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#ffffff',
    padding: '20px',
    position: 'relative'
  },
  
  backgroundPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
    `,
    zIndex: -1
  },

  signupContainer: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 30px rgba(255, 215, 0, 0.1),
      inset 0 1px 0 rgba(255, 215, 0, 0.1)
    `,
    backdropFilter: 'blur(10px)',
    width: '100%',
    maxWidth: '450px',
    position: 'relative'
  },

  logo: {
    textAlign: 'center',
    marginBottom: '30px'
  },

  logoTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
    backgroundSize: '200% 200%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px'
  },

  logoSubtitle: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: '1rem',
    fontWeight: '300'
  },

  form: {
    width: '100%'
  },

  formGroup: {
    marginBottom: '25px',
    position: 'relative'
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#FFD700',
    fontWeight: '500',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  input: {
    width: '100%',
    padding: '15px 20px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  },

  passwordHint: {
    fontSize: '0.8rem',
    color: 'rgba(255, 215, 0, 0.6)',
    marginTop: '8px',
    paddingLeft: '5px'
  },

  error: {
    color: '#ff4444',
    fontSize: '0.8rem',
    marginTop: '5px',
    display: 'block'
  },

  generalError: {
    background: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    color: '#ff4444',
    fontSize: '0.9rem',
    textAlign: 'center'
  },

  signupBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    border: 'none',
    borderRadius: '12px',
    color: '#000000',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
    position: 'relative',
    overflow: 'hidden'
  },

  divider: {
    textAlign: 'center',
    margin: '25px 0',
    position: 'relative',
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: '0.9rem',
    fontWeight: '500'
  },

  googleBtn: {
    width: '100%',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '25px'
  },

  googleIcon: {
    width: '20px',
    height: '20px'
  },

  loginLink: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    marginBottom: '20px'
  },

  link: {
    color: '#FFD700',
    textDecoration: 'none',
    fontWeight: '500',
    marginLeft: '5px',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  },

  terms: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: '1.4'
  },

  forgotPassword: {
    textAlign: 'right',
    marginTop: '10px'
  },

  forgotLink: {
    color: 'rgba(255, 215, 0, 0.8)',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: '400',
    cursor: 'pointer'
  }
};

export default AuthPage;