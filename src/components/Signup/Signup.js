import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import Footer from "./../Footer/Footer";
import Menubar from "../Menubar/Menubar";
import { useForm } from "react-hook-form";
import ToLoginModal from "../Modal/ToLoginModal";
import { BASE_URL } from "../ApiBinance/HikersAPI";
import classes from "../Home/Home.module.css";

const Signup = () => {
  const [theme, setTheme] = useState("dark");
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    // reset,
    clearErrors,
    formState,
  } = useForm({ mode: "onchange" });
  const [is_ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [err_message, setErrorMessage] = useState("");
  const [display, setDisplay] = useState("none");
  const toLoginHandler = () => {
    setDisplay("unset");
  };

  //Send to backend for registration
  const userRegister = (data) => {
    setReady(false);
    const userInfo = {
      ...data,
      date_joined: new Date().toLocaleString(),
    };

    const req = new Request(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(userInfo),
    });
    fetch(req).then((res) => {
      res.json().then((data) => {
        setReady(true);
        if (data.message) {
          return setMessage(data.message);
        } else {
          return setErrorMessage(data.error);
        }
      });
    });
  };

  // FOR VALIDATION
  const onSubmit = (data, e) => {
    userRegister(data);
    // reset();
    toLoginHandler();
  };

  return (
    <div className="signup-container">
      {is_ready && (
        <ToLoginModal
          display={display}
          setDisplay={setDisplay}
          onMessage={message}
          onErrorMessage={err_message}
        />
      )}
      <Menubar theme={theme} setTheme={setTheme} />
      <div className="signbox">
        <div className="signup-inner-container">
          <div className="signup-main-title">Create Hikers Account</div>
          <div className="signup-sub-title links">
            Be part of Hikers and start gaining!
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {" "}
              <label className="signup-input-title">
                Username
                <span className="error-message">
                  {" "}
                  {formState.errors.username && (
                    <p>{formState.errors?.username.message}</p>
                  )}
                  {formState.errors?.username?.type === "pattern" && (
                    <p>Only alphanumeric and underscores are accepted.</p>
                  )}
                </span>
              </label>
              <input
                placeholder="Username"
                className="signup-input"
                {...register("username", {
                  required: "This field is required.",
                  maxLength: {
                    value: 16,
                    message: "username cannot be more than 16 characters",
                  },
                  pattern: /^[a-zA-Z0-9-_]+$/,
                })}
              />
              <label className="signup-input-title">
                Full Name
                <span className="error-message">
                  {" "}
                  {formState.errors.fullname && (
                    <p>{formState.errors?.fullname.message}</p>
                  )}
                  {formState.errors?.fullname?.type === "pattern" && (
                    <p>Alphabetical characters only.</p>
                  )}
                </span>
              </label>
              <input
                placeholder="Full Name"
                className="signup-input"
                {...register("fullname", {
                  required: "This field is required.",
                  maxLength: {
                    value: 50,
                    message: "max. 50 characters",
                  },
                  pattern: /^[a-zA-Z ]*$/,
                })}
              />
              <label className="signup-input-title">
                Email
                <span className="error-message">
                  {formState.errors?.email?.type === "pattern" && (
                    <p>Enter valid email only.</p>
                  )}
                  {formState.errors.email && (
                    <p>{formState.errors?.email.message}</p>
                  )}
                </span>
              </label>
              <input
                className="signup-input"
                placeholder="Email"
                {...register("email", {
                  pattern:
                    /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  required: "This field is required.",
                })}
              />
              <label className="signup-input-title">
                Password
                <span className="error-message">
                  {" "}
                  {formState.errors?.password?.type === "pattern" && (
                    <p>Only Alphanumeric and underscores are accepted.</p>
                  )}
                  {formState.errors.password && (
                    <p>{formState.errors?.password.message}</p>
                  )}
                </span>
              </label>
              <input
                className="signup-input"
                type="password"
                placeholder="Password"
                {...register("password", {
                  onChange: (e) => {
                    if (e.target.value !== getValues("confirm_password")) {
                      setError("password", {
                        type: "manual",
                        message: "Password must match.",
                      });
                    } else {
                      clearErrors(["password", "confirm_password"]);
                    }
                  },
                  required: "This field is required.",
                  minLength: {
                    value: 8,
                    message:
                      "Password must have at least 8 characters and only alphanumeric and '_' are accepted.",
                  },
                  maxLength: {
                    value: 16,
                    message:
                      "Password cannot be more than 16 characters and only alphanumeric and '_' are accepted.",
                  },
                  pattern: /^[a-zA-Z0-9-_!?]+$/,
                })}
              />
              <label className="signup-input-title">
                Confirm Password
                <span className="error-message">
                  {" "}
                  {formState.errors?.confirm_password?.type === "pattern" && (
                    <p>Only Alphanumeric and underscores are accepted.</p>
                  )}
                  {formState.errors.confirm_password && (
                    <p>{formState.errors?.password.message}</p>
                  )}
                </span>
              </label>
              <input
                className="signup-input"
                placeholder="Re-type password"
                type="password"
                {...register("confirm_password", {
                  onChange: (e) => {
                    if (e.target.value !== getValues("password")) {
                      setError("confirm_password", {
                        type: "manual",
                        message: "Password must match.",
                      });
                    } else {
                      clearErrors(["password", "confirm_password"]);
                    }
                  },
                  required: "This field is required.",
                  minLength: {
                    value: 8,
                    message:
                      "Password must have at least 8 characters and only alphanumeric and '_' are accepted.",
                  },
                  maxLength: {
                    value: 16,
                    message:
                      "Password cannot be more than 16 characters and only alphanumeric and '_' are accepted.",
                  },
                  pattern: /^[a-zA-Z0-9-_!?]+$/,
                })}
              />
              <div id="create-acc">
                <button
                  type="submit"
                  // disabled={formState.isDirty}
                  className="signup-button"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>

          <div id="reg">
            Already registered?{" "}
            <Link to="/login" className="links">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <Footer className={`${classes.home_footer} signup-footer`} />
    </div>
  );
};

export default Signup;
