import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card/Card";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import classes from "./ToLoginModal.module.css";

const ToLoginModal = (props) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: `${props.display}` }}>
      <div
        className={classes.backdrop}
        onClick={() => props.setDisplay("none")}
      />
      <div className={classes.popup}>
        <Card className={classes.modal}>
          {props.onMessage ? (
            <>
              <div className={classes.title}>{props.onMessage}</div>
              <DoneAllRoundedIcon sx={{ color: `#609D45`, fontSize: 55 }} />
              <div className={classes.welcome_message}>
                <p className={classes.msg_title}>Welcome aboard, Hikers!</p>
                <p className={classes.msg_desc}>
                  Thank you for signing up with us.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={classes.title}>{props.onErrorMessage}</div>
              <ErrorOutlineIcon sx={{ color: `red`, fontSize: 55 }} />
              <div className={classes.welcome_message}>
                <p className={classes.msg_title}>Ops! Something went wrong.</p>
                <p className={classes.msg_desc}>
                  Please check your input fields.
                </p>
              </div>
            </>
          )}

          <div className={classes.buttons}>
            <span
              className={classes.home_btn}
              onClick={() => props.setDisplay("none")}
            >
              Back
            </span>
            <button
              className={classes.to_login_btn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ToLoginModal;
