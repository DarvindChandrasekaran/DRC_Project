import React, { useContext, useState } from "react";
import ChangePasswordModal from "../Modal/ChangePasswordModal";
import classes from "./Profile.module.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useForm } from "react-hook-form";
import ProfBar from "../Menubar/HeaderBar";
import { SiteDataContext } from "../../SiteData";
import { BASE_URL } from "../ApiBinance/HikersAPI";
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
  const [theme, setTheme] = React.useState("dark");
  const { user_data, is_data_ready, checkJWT } = useContext(SiteDataContext);
  const [display, setDisplay] = useState("none");
  const pwdPopupHandler = () => {
    setDisplay("unset");
  };
  const [error_message, setErrorMessage] = useState("");
  const [messages, setMessages] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //REQ TO BE FOR UPDATE USER DETAILS
  const updateUser = (data) => {
    let is_authenticated = checkJWT();

    if (is_authenticated) {
      const { loginid } = user_data;
      const user_info = {
        token: user_data.token,
        loginid: user_data.loginid,
        ...data,
      };

      const req = new Request(`${BASE_URL}/user/profile/update/${loginid}`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(user_info),
      });
      fetch(req).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            setErrorMessage(data.error);
          } else {
            setMessages(
              "Data sucessfully saved. Changes will take effect on your next login."
            );
          }
        });
      });
    } else {
      navigate("/login");
    }
  };

  const onSubmit = (data) => {
    updateUser(data);
  };

  //Check if user_data is ready
  if (!is_data_ready) {
    return <h1>Loading..</h1>;
  }

  return (
    <div className={classes.profile_bg}>
      <div className={classes.main_wrapper}>
        <div className={classes.profile_header}>
          <ProfBar titleName={"Profile"} theme={theme} setTheme={setTheme} />
        </div>
        <ChangePasswordModal display={display} setDisplay={setDisplay} />
        <div className={classes.user_container}>
          <div className={classes.photo_box}>
            <img src={props.avatarSample} id={classes.avatar} alt="avatar" />
          </div>
          <div className={classes.container1}>
            <div className={classes.username}>@{user_data.username}</div>
            <div className={classes.date_joined}>
              Date joined:
              <span style={{ paddingLeft: "10px" }}>
                {user_data.date_joined}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <span className={classes.error_message}>
              {errors?.full_name && <p>{errors?.full_name.message}</p>}
              {errors?.full_name?.type === "pattern" && (
                <p>Alphabetical characters only</p>
              )}
            </span>
            <div className={classes.form_boxes}>
              <div className={classes.headers}>Full Name :</div>
              <input
                className={classes.InputBox}
                defaultValue={!user_data.full_name ? "" : user_data.full_name}
                placeholder="Name..."
                {...register("full_name", {
                  required: "This field is required.",
                  maxLength: {
                    value: 50,
                    message: "Full name cannot exceed 50 characters",
                  },
                  pattern: /^[a-zA-Z ]*$/,
                })}
              />
            </div>

            <div className={classes.form_spacing} />
            <span className={classes.error_message}>
              {errors?.email?.type === "pattern" && (
                <p>Enter valid email only</p>
              )}
              {errors?.email && <p>{errors?.email.message}</p>}
            </span>
            <div className={classes.form_boxes}>
              <div className={classes.headers}>Email :</div>
              <input
                className={classes.InputBox}
                defaultValue={!user_data.email ? "" : user_data.email}
                placeholder="Email..."
                {...register("email", {
                  required: "This field is required.",
                  pattern:
                    /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                })}
              />
            </div>

            <div className={classes.form_spacing}></div>

            <span className={classes.error_message}>
              {errors?.phone?.type === "pattern" && (
                <p>Valid Mobile Number only.</p>
              )}
              {errors?.phone && <p>{errors?.phone.message}</p>}
            </span>
            <div className={classes.form_boxes}>
              <div className={classes.headers}>Mobile Number :</div>
              <input
                className={classes.InputBox}
                defaultValue={!user_data.phone ? "" : user_data.phone}
                placeholder={"Phone number..."}
                {...register("phone", {
                  minLength: {
                    value: 9,
                    message:
                      "Ops! format should be +6012345678910 or 609876543123456789",
                  },
                  maxLength: {
                    value: 17,
                    message:
                      "Ops! format should be +6012345678910 or 609876543123456789",
                  },
                  pattern:
                    /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/,
                })}
              />
            </div>

            <div className={classes.form_spacing}></div>

            <div className={classes.form_boxes}>
              <div className={classes.headers}>Password :</div>
              <div className={classes.InputBox_p}>
                <span className={classes.pwd_bullet}>
                  <span id={classes.pass_placeholder}>
                    &bull;&bull;&bull;&bull;&bull;&bull;&bull;
                  </span>
                  <EditRoundedIcon
                    fontSize="medium"
                    sx={{
                      color: "white",
                    }}
                    onClick={pwdPopupHandler}
                  />
                </span>
              </div>
            </div>
            <div className={classes.form_boxes}>
              <button className={classes.Save_Button}>Save </button>
            </div>
          </form>
          <div className={`${classes.backend_error} ${classes.backend_msg}`}>
            {error_message ? error_message : messages}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
