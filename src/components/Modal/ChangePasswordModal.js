import React, { useContext, useState } from "react";
import Card from "../Card/Card";
import classes from "./ChangePasswordModal.module.css";
import { useForm } from "react-hook-form";
import { SiteDataContext } from "../../SiteData";
import { BASE_URL } from "../ApiBinance/HikersAPI";
import { useNavigate } from "react-router-dom";

const ChangePasswordModal = (props) => {
  const { user_data, is_data_ready, checkJWT } = useContext(SiteDataContext);
  const [message, setMessage] = useState("");
  const [error_msg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    reset,
    clearErrors,
    formState,
  } = useForm();

  const passwordChangeHandler = (data) => {
    let is_authenticated = checkJWT();
    if (is_authenticated) {
      const loginid = user_data.loginid;
      const userPassword = {
        ...data,
        token: user_data.token,
      };
      const req = new Request(`${BASE_URL}/user/update-password/${loginid}`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(userPassword),
      });
      fetch(req).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            setErrorMsg(data.error);
          } else {
            setMessage(data.message);
          }
        });
      });
    } else {
      navigate("/login");
    }
  };

  //Check if user_data is ready
  if (!is_data_ready) {
    return <h1>Loading..</h1>;
  }

  // FOR INPUT VALIDATION
  const onSubmit = (data, e) => {
    passwordChangeHandler(data);
    reset();
    setErrorMsg("");
    setMessage("");
  };

  return (
    <div style={{ display: `${props.display}` }}>
      <div
        className={classes.backdrop}
        onClick={() => props.setDisplay("none")}
      />
      <div className={classes.popup}>
        <Card className={classes.modal}>
          <h3 className={classes.title}>Change Password</h3>
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.pwd_box}>
              <div className={classes.pwdTitle}>Current password</div>
              <input
                className={classes.pwdInputArea}
                type="password"
                placeholder="Current password..."
                {...register("old_password", {
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
              <div className={classes.err_msg}>
                {formState.errors.curr_password && (
                  <span>{formState.errors?.curr_password.message}</span>
                )}
              </div>
            </div>
            <hr className={classes.line} />
            <div className={classes.pwd_box}>
              <div className={classes.pwdTitle}>New Password</div>
              <input
                className={classes.pwdInputArea}
                type="password"
                placeholder="New password..."
                {...register("new_password", {
                  onChange: (e) => {
                    if (e.target.value !== getValues("retype_password")) {
                      setError("new_password", {
                        type: "manual",
                        message: "Password must match.",
                      });
                    } else {
                      clearErrors(["new_password", "retype_password"]);
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
              <div className={classes.err_msg}>
                {formState.errors?.new_password && (
                  <span>{formState.errors?.new_password.message}</span>
                )}
              </div>
            </div>
            <div className={classes.pwd_box}>
              <div className={classes.pwdTitle}>Re-type Password</div>
              <input
                className={classes.pwdInputArea}
                type="password"
                placeholder="Re-type new password..."
                {...register("retype_password", {
                  onChange: (e) => {
                    if (e.target.value !== getValues("new_password")) {
                      setError("retype_password", {
                        type: "manual",
                        message: "Password must match.",
                      });
                    } else {
                      clearErrors(["new_password", "retype_password"]);
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
              <div className={classes.err_msg}>
                {formState.errors?.retype_password && (
                  <span>{formState.errors?.retype_password.message}</span>
                )}
              </div>
            </div>

            <div className={classes.buttons}>
              <span
                className={classes.cancel_btn}
                onClick={() => props.setDisplay("none")}
              >
                Cancel
              </span>
              <button className={classes.pwd_btn} type="submit">
                Change password
              </button>
            </div>
          </form>
          <div className={error_msg ? classes.err_msgs : classes.messages}>
            {error_msg ? error_msg : message}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
