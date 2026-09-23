import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import BrandMark from "../components/ui/BrandMark";
import AuthIcon from "../components/ui/AuthIcon";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setErrorMessage("");
        if (formData.email === "admin@cms.com" && formData.password === "admin123") {
            navigate("/admin-dashboard");
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await api.post("/students/login", formData);
            localStorage.setItem("student", JSON.stringify(response.data));
            navigate("/student-dashboard");
        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Please check your credentials.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-showcase" aria-label="CCMS overview">
                <div className="auth-showcase-content">
                    <div className="auth-product-mark">
                        <BrandMark inverse />
                        <span>CCMS</span>
                    </div>
                    <p className="auth-eyebrow">Campus Complaint Management System</p>
                    <h1>Clearer campus support, from report to resolution.</h1>
                    <p className="auth-showcase-copy">Submit concerns, follow their progress, and stay informed through one dependable workspace.</p>
                    <div className="auth-feature-list" aria-label="Platform benefits">
                        <span>Structured reporting</span>
                        <span>Transparent progress</span>
                        <span>Campus-first support</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel" aria-labelledby="login-title">
                <div className="auth-form-wrap">
                    <p className="auth-kicker">Student access</p>
                    <h2 id="login-title">Welcome back</h2>
                    <p className="auth-description">Sign in to manage your campus complaints.</p>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {errorMessage && (
                            <div className="auth-alert" role="alert">{errorMessage}</div>
                        )}

                        <label className="auth-field">
                            <span>Email address</span>
                            <span className="auth-input-wrap">
                                <AuthIcon type="email" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="you@example.edu"
                                    className="form-control"
                                    onChange={handleChange}
                                    aria-invalid={isSubmitted && !formData.email}
                                    aria-describedby={isSubmitted && !formData.email ? "login-email-help" : undefined}
                                    disabled={isSubmitting}
                                />
                            </span>
                            {isSubmitted && !formData.email && (
                                <small id="login-email-help">Email is required.</small>
                            )}
                        </label>

                        <label className="auth-field">
                            <span>Password</span>
                            <span className="auth-input-wrap">
                                <AuthIcon type="password" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    placeholder="Enter your password"
                                    className="form-control auth-password-input"
                                    onChange={handleChange}
                                    aria-invalid={isSubmitted && !formData.password}
                                    aria-describedby={isSubmitted && !formData.password ? "login-password-help" : undefined}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={isSubmitting}
                                >
                                    <AuthIcon type={showPassword ? "eyeOff" : "eyeOn"} className="password-toggle-icon" />
                                </button>
                            </span>
                            {isSubmitted && !formData.password && (
                                <small id="login-password-help">Password is required.</small>
                            )}
                        </label>

                        <button className="btn-green auth-submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        New to CCMS? <Link to="/register">Create an account</Link>
                    </p>

                    <div className="admin-info">
                        <p>Administrator access</p>
                        <small>Use the existing administrator credentials to open the admin dashboard.</small>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;
