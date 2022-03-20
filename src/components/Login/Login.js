import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menubar from "./../Menubar/Menubar";
import Footer from "./../Footer/Footer";
import "./Login.css";
import { useForm } from "react-hook-form";
import { SiteDataContext } from "../../SiteData";
import classes from '../Home/Home.module.css';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Login = () => {
    const [theme, setTheme] = useState("dark");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { error_message, handleLogin } = useContext(SiteDataContext);
    const { register, handleSubmit, formState } = useForm({ mode: "onchange" });
    const query = useQuery();

    useEffect(() => {
        const error_type = query.get("error");
        if (error_type === "login") {
            setMessage("Unauthorized. Please log in");
        } else if (error_type === "expired") {
            setMessage("Your login has expired. Please relog in.");
        }
    }, []);

    // FOR INPUT VALIDATION
    const onSubmit = async (data, e) => {
        const result = await handleLogin(data);
        e.target.reset();
        if (result) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="login">
            <Menubar theme={theme} setTheme={setTheme} />
            <div className="login-container">
                <div className="inner-container">
                    <div className="login-main-title">Hikers Account Login</div>
                    <div className="login-sub-title links">Welcome Back, Hikers!</div>
                    <div className="err">{error_message}</div>
                    <div className="err">{message}</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {" "}
                        <div className="login-input-title">
                            Email
                            <span className="error-message">
                                {formState.errors?.email?.type === "pattern" && <p>Enter valid email only.</p>}
                                {formState.errors?.email?.type === "required" && <p>This field is required.</p>}
                            </span>
                        </div>
                        <input
                            className="login-input"
                            placeholder="E-mail"
                            {...register("email", {
                                pattern: /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                required: true,
                            })}
                        />
                        <div className="login-input-title">
                            Password
                            <span className="error-message">
                                {formState.errors?.password?.type === "pattern" && (
                                    <p>Only Alphanumeric input accepted.</p>
                                )}
                                {formState.errors.password && (
                                    <p style={{ marginRight: "10px" }}>Password must have at least 8 characters.</p>
                                )}
                                {formState.errors?.password?.type === "required" && <p>This field is required.</p>}
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="login-input"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                                maxLength: 16,
                                pattern: /^[a-zA-Z0-9-_!?]+$/,
                            })}
                        />
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>

                    <div>
                        Not a Hikers?{" "}
                        <Link to="/signup" className="links">
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
            <Footer className={`${classes.home_footer} login-footer`}/>
        </div>
    );
};

export default Login;
