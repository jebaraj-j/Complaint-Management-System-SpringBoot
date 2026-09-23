import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import BrandMark from "../components/ui/BrandMark";
import AuthIcon from "../components/ui/AuthIcon";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", department: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fields = [
        ["name", "Full name", "Enter your name", "user"],
        ["email", "Email address", "you@example.edu", "email"],
        ["department", "Department", "Enter your department", "department"],
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setErrorMessage("");
        try {
            setIsSubmitting(true);
            await api.post("/students/register", formData);
            setFormData({ name: "", email: "", password: "", department: "" });
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed. Please try again.";
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
                    <h1>Help shape a more responsive campus.</h1>
                    <p className="auth-showcase-copy">Create your account to report campus issues with clarity and track progress in one place.</p>
                    <div className="auth-feature-list" aria-label="Platform benefits">
                        <span>Simple reporting</span>
                        <span>Clear updates</span>
                        <span>Better outcomes</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel" aria-labelledby="register-title">
                <div className="auth-form-wrap">
                    <p className="auth-kicker">Student registration</p>
                    <h2 id="register-title">Create your account</h2>
                    <p className="auth-description">Enter your details to start using CCMS.</p>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {errorMessage && (
                            <div className="auth-alert" role="alert">{errorMessage}</div>
                        )}

                        {fields.map(([name, label, placeholder, icon]) => (
                            <label className="auth-field" key={name}>
                                <span>{label}</span>
                                <span className="auth-input-wrap">
                                    <AuthIcon type={icon} />
                                    <input
                                        type={name === "email" ? "email" : "text"}
                                        name={name}
                                        value={formData[name]}
                                        placeholder={placeholder}
                                        className="form-control"
                                        onChange={handleChange}
                                        aria-invalid={isSubmitted && !formData[name]}
                                        aria-describedby={isSubmitted && !formData[name] ? `${name}-help` : undefined}
                                        disabled={isSubmitting}
                                    />
                                </span>
                                {isSubmitted && !formData[name] && (
                                    <small id={`${name}-help`}>{label} is required.</small>
                                )}
                            </label>
                        ))}

                        <label className="auth-field">
                            <span>Password</span>
                            <span className="auth-input-wrap">
                                <AuthIcon type="password" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    placeholder="Create a password"
                                    className="form-control auth-password-input"
                                    onChange={handleChange}
                                    aria-invalid={isSubmitted && !formData.password}
                                    aria-describedby={isSubmitted && !formData.password ? "register-password-help" : undefined}
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
                                <small id="register-password-help">Password is required.</small>
                            )}
                        </label>

                        <button className="btn-green auth-submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Register;
