import React from "react";
import { useNavigate, } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();
  return (
    <div className="ui fixed menu headerPadding">
      <div className="logout" onClick={() => navigate("/transaction/upload")}>
        <i className="upload alternate icon" />
        Send
      </div>
      <div className="logout" onClick={() => navigate("/transaction/result/view/all")}>
        <i className="tasks icon leftMargin" />
        Checked
      </div>
      <div className="logout" onClick={() => navigate("/operator")} >
        <i className="home icon leftMargin" />
        Home
      </div>


      <div className="ui container center">
        <h2>TransactionScanner</h2>
      </div>
      <div className="logout" onClick={props.logout} >
        <i className="sign out alternate icon" />
        Logout
      </div>

    </div>
  );
};

export default Header;