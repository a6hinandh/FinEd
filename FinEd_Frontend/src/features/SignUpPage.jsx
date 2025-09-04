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
        
      } else {
        const result = await signInWithEmailAndPassword(auth,formData.email, formData.password);
        const user = result.user;
        
       
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
      <div style={styles.signupContainer}>
        {/* Logo */}
        <div style={styles.logo}>
          <div>
         <span style={{
           fontSize:  '2rem',
             fontWeight: '800',}} className="logo-fin">Fin</span>
         <span style={{
            fontSize:  '2rem',
             fontWeight: '800',}} className="logo-ed">Ed</span> 
             </div>
          <p style={styles.logoSubtitle}>
            {isSignup ? "Join the Elite Experience" : "Welcome Back to FinEd"}
          </p>
        </div>

        {/* Errors */}
        {errors.general && <div style={styles.generalError}>{errors.general}</div>}

        {/* Form */}
        <div style={styles.form}>
          {isSignup && (
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              error={errors.fullName}
            />
          )}

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={isSignup ? "Create a password" : "Enter your password"}
            error={errors.password}
            hint={isSignup ? "Must be at least 6 characters long" : ""}
          />

          {isSignup && (
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />
          )}

          <ButtonWithHover onClick={handleAuth} disabled={loading} style={styles.signupBtn}>
            {loading
              ? isSignup
                ? "CREATING ACCOUNT..."
                : "SIGNING IN..."
              : isSignup
              ? "CREATE ACCOUNT"
              : "SIGN IN"}
          </ButtonWithHover>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <span>OR</span>
        </div>

        {/* Google Button */}
       
        <GoogleButtonWithHover onClick={handleGoogleAuth} disabled={loading} style={styles.googleBtn}>
          <svg style={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isSignup ? "Continue with Google" : "Sign in with Google"}
        </GoogleButtonWithHover>
     

        {/* Links */}
        <div style={styles.loginLink}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <a href="#" onClick={toggleAuthMode} style={styles.link}>
            {isSignup ? "Sign In" : "Sign Up"}
          </a>
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
        transform: isHovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
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

function InputField({ label, name, type, value, onChange, placeholder, error, hint }) {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...styles.input,
          borderColor: error ? "#ff4444" : "rgba(255, 215, 0, 0.2)"
        }}
      />
      {error && <span style={styles.error}>{error}</span>}
      {hint && <div style={styles.passwordHint}>{hint}</div>}
    </div>
  );
}


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    background: "linear-gradient(to right, #000, #222)"
  },
  signupContainer: {
    width: "100%",
    maxWidth: "400px",
    background: "rgba(0,0,0,0.7)",
    padding: "24px",
    paddingTop: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,215,0,0.2)",
    color: "#fff",
    textAlign: "center"
  },
  logo: { marginBottom: "16px" },
  logoFin: { fontSize: "2rem", fontWeight: "800", color: "#FFD700" },
  logoEd: { fontSize: "2rem", fontWeight: "800", color: "#fff" },
  logoSubtitle: { fontSize: "0.9rem", color: "#aaa", marginTop: "4px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  formGroup: { textAlign: "left" },
  label: { fontSize: "0.85rem", marginBottom: "4px", display: "block" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.8)",
    border: "1px solid rgba(255,215,0,0.2)",
    color: "#FFD700",
    fontSize: "1rem"
  },
  error: { color: "#ff4444", fontSize: "0.75rem" },
  passwordHint: { fontSize: "0.7rem", color: "#888", marginTop: "4px" },
  signupBtn: {
    marginTop: "12px",
    padding: "12px",
    borderRadius: "8px",
    background: "#FFD700",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none"
  },
  divider: {
    margin: "10px 0",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#aaa"
  },
    googleBtn: {
     width: '100%',
     padding: '12px',
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
     marginBottom: '15px'
   },
  googleIcon: { flexShrink: 0 },
  loginLink: { marginTop: "16px", fontSize: "0.85rem" },
  link: { marginLeft: "6px", color: "#FFD700", cursor: "pointer" },
  terms: { marginTop: "12px", fontSize: "0.7rem", color: "#888" }
};

export default AuthPage;