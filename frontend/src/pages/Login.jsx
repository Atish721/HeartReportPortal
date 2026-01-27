import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import '../assets/styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await loginApi(email, password);
      if (res.token) {
        login(res.token);
        navigate("/patient");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="portal-header">
          <div className="portal-title-wrapper">
            <h1 className="portal-main-title">Heart Buddy</h1>
            <h2 className="welcome-title">Welcome Back</h2>
            <p className="welcome-subtitle">Sign in to access your health portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-with-icon">
              <div className="input-icon-left">📧</div>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <p className="portal-brand">The Healthy Heart Portal</p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-with-icon">
              <div className="input-icon-left">🔒</div>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="HeartBuddy"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        <div className="features-section">
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">AI-Powered</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span className="feature-text">Secure</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⏰</span>
            <span className="feature-text">24/7</span>
          </div>
        </div>

        <div className="services-section">
          <div className="service">
            <span className="service-icon">📈</span>
            <span className="service-text">ECG Analysis</span>
          </div>
          <div className="service">
            <span className="service-icon">📊</span>
            <span className="service-text">Health Data</span>
          </div>
          <div className="service">
            <span className="service-icon">👁️</span>
            <span className="service-text">Monitoring</span>
          </div>
        </div>

        <div className="terms-section">
          <p className="terms-text">
            By continuing, you agree to our <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;