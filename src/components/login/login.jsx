import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Input from "./../../sub-components/input/input";

import logo from "../../assets/img/camera-white.svg";
import "./login.scss";

const Login = ({ history }) => {
  const schema = {
    email: Yup.string()
      .email("Email is invalid!")
      .required("Email is required!"),
    password: Yup.string()
      .strict()
      .lowercase("Password must contain only lowercase!")
      .min(6, "Password must contain at least 5 chars!")
      .required("Password is required!"),
  };

  const {
    handleSubmit,
    touched,
    errors,
    handleChange,
    values,
    handleBlur,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object(schema),
    onSubmit: values => {
      console.log("Submitted!");
      console.log(values);
    },
  });

  const redirectToSingup = () => {
    history.push("/singup");
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <img src={logo} alt="camera icon" />
          <p>MYSPLASH</p>
        </div>

        <h2 className="welcome">Welcome Back</h2>

        <Input
          placeholder="Email Adress"
          type="email"
          error={errors.email}
          touched={touched.email}
          handleInputChange={handleChange}
          name="email"
          value={values.email}
          handleInputBlur={handleBlur}
        />

        <Input
          placeholder="Password"
          type="password"
          error={errors.password}
          touched={touched.password}
          handleInputChange={handleChange}
          name="password"
          value={values.password}
          handleInputBlur={handleBlur}
        />

        <button className="submit-btn" type="submit">
          Login
        </button>

        <span className="go-singup">
          Don't have an account yet?{" "}
          <strong onClick={redirectToSingup}>Sing up</strong>
        </span>

        <div className="log-facebook">
          <p className="or">or</p>
          <p className="facebook-choosen">Login with facebook</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
