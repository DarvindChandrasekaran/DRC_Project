import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import "./FinalTestBar.css";
import HomeLogo from "../../assets/DashboardAsset/Dashboard-Logo.svg";
import DashLogoDark from "../../assets/DashboardAsset/DashLogoDark.svg";
import MarketLogo from "../../assets/DashboardAsset/Increase.svg";
import DashLogo from "../../assets/DashboardAsset/Dashboard-Layout.svg";
import LogoutLogo from "../../assets/DashboardAsset/Logout.svg";
import { useNavigate, Link } from "react-router-dom";
import { SiteDataContext } from "../../SiteData";
import ToggleSwitch from "../ModeSwitch/Switch";

export default function AccountMenu(props) {
  const [theme, setTheme] = React.useState("dark");
  const { handleLogout } = useContext(SiteDataContext) || {};
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  function navigatePages(text) {
    switch (text) {
      case "Market":
        navigate("/market");
        break;
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "User Profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  }

  return (
    <React.Fragment>
      <div className="test-bar">
        <div className="responsive-nav-drop">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
              display: "none",
              "@media (max-width: 768px)": {
                display: "block",
                ml: 0,
                px: 2,
              },
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MenuIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        </div>
        <a href="/">
          <img src={DashLogoDark} alt="Home Logo" id="responsive-logo" />
        </a>
        <a href="/">
          <img src={HomeLogo} alt="Home Logo" id="logo" />
        </a>
        <h1 id="responsive-dash-header">{props.titleName}</h1>
        <Tooltip
          title={<Typography fontSize={15}>User's Profile</Typography>}
          placement="right"
          arrow
        >
          <Link className="DP" to="/profile">
            <img src={props.UserDP} alt="User's Profile Picture" id="DP" />
          </Link>
        </Tooltip>
        <Tooltip
          title={<Typography fontSize={15}>Market</Typography>}
          placement="right"
          arrow
        >
          <Link to="/market" className="sidebar-market">
            <img src={MarketLogo} alt="Market Logo" id="Market" />
          </Link>
        </Tooltip>
        <Tooltip
          title={<Typography fontSize={15}>Dashboard</Typography>}
          placement="right"
          arrow
        >
          <Link to="/dashboard" className="sidebar-dashboard">
            <img src={DashLogo} alt="Dashboard Logo" id="Dashboard" />
          </Link>
        </Tooltip>
        <Tooltip
          title={<Typography fontSize={15}>Logout</Typography>}
          placement="right"
          arrow
        >
          <a href="#ey" className="sidebar-logout" onClick={handleLogout}>
            <img src={LogoutLogo} alt="Logout Logo" id="Logout" />
          </a>
        </Tooltip>
      </div>
      <div id="switch-box">
        <ToggleSwitch theme={theme} setTheme={setTheme} />
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            color: "white",
            backgroundColor: "#464646",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            ml: -0.5,

            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 3,
            },
            "& .MuiSvgIcon-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 3,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 12,
              width: 10,
              height: 10,
              bgcolor: "#464646",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem onClick={(e) => navigatePages(e.target.textContent)}>
          <Avatar src={MarketLogo} />
          Market
        </MenuItem>
        <MenuItem onClick={(e) => navigatePages(e.target.textContent)}>
          <Avatar src={DashLogo} />
          Dashboard
        </MenuItem>
        <MenuItem onClick={(e) => navigatePages(e.target.textContent)}>
          <Avatar src={props.UserDP} />
          User Profile
        </MenuItem>
        {/* <MenuItem>
          <NotificationsIcon />
          Notification
        </MenuItem>
        <MenuItem>
          <MailIcon />
          Inbox
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <Avatar src={LogoutLogo} />
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
