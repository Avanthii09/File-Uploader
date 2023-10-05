import React, { useState } from "react";
import { Form, Field } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Error } from "@progress/kendo-react-labels";
import "@progress/kendo-theme-material/dist/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";  
import { useNavigate } from "react-router-dom";
import MyNavBar from "./NavBar";

import "../styles/Login.css";

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value) =>
  emailRegex.test(value) ? "" : "Please enter a valid email.";

const emailInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const PasswordInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-container">
      <Input
        type={showPassword ? "text" : "password"}
        className="k-input"
        {...others}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}

      <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </div>
    </div>
  );
};

function MyLogin({ handleLogin}) {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  


  const handleSubmit = async (dataItem) => {
    const email = dataItem.email;
    const password = dataItem.password;
    const loginSuccess = await handleLogin(email, password );

    if (loginSuccess) {
      // Redirect based on successful login (handled in App component)
      navigate("/");
    } else {
      setLoginError("Invalid email or password");
    }
  };
  const handleLogout = () => {
    // Call the handleLogout function passed from props
    navigate("/");
    // Additional logic if needed...
  };

  return (
    <div className="login-container">
      <MyNavBar handleLogout={handleLogout} />
      <div className="login-content">
        <div className="form-title">
          <p>LOGIN</p>
        </div>
        <Form
          onSubmit={handleSubmit}
          render={(formRenderProps) => (
            <form onSubmit={formRenderProps.onSubmit}>
              <Field
                id={"email"}
                name={"email"}
                label={"Enter Email"}
                component={emailInput}
                validator={emailValidator}
              />
              <Field
                id={"Password"}
                name={"password"}
                label={"Enter Password"}
                component={PasswordInput}
              />
              {loginError && <p className="error-message">{loginError}</p>}
              <div className="k-form-buttons">
                <button
                  type="submit"
                  className="login-button"
                  disabled={!formRenderProps.allowSubmit}
                >
                  LOGIN
                </button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
}

export default MyLogin;
