import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Input from "./../../sub-components/input/input";
import { FirebaseContext } from "../../services/firebase/indexx";

import logo from "../../assets/img/camera-white.svg";
import "./login.scss";
import { Redirect } from "react-router-dom";

const Login = ({ history, userAuth, location }) => {
  const myContext = useContext(FirebaseContext);
  const [error, setError] = useState({});
  const [goSingUp, setGoSingUp] = useState(false);
  const [fb, setFB] = useState(false);
  const [singing, setSinging] = useState(false);

  useEffect(() => {
    //redirect to where the user comes from if he's already authed
    if (userAuth && location.state && !fb) history.replace(location.state.from);
    else if (userAuth && !location.state && !fb) history.replace("/");
  });

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

  const { handleSubmit, touched, errors, handleChange, values, handleBlur } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object(schema),
      onSubmit: values => {
        doSubmit(values);
      },
    });

  const doSubmit = async ({ email, password }) => {
    setSinging(true);
    try {
      await myContext.doSignInWithEmailAndPassword(email, password);
      setFB(true);
      location.state
        ? history.replace(location.state.from)
        : history.replace("/");
    } catch (error) {
      setError(error);
    }
    setSinging(false);
  };

  const redirectToSingup = () => {
    setGoSingUp(true);
  };

  const onFacebook = async () => {
    setFB(true);
    try {
      const data = await myContext.doSignInWithFacebook();
      if (data.additionalUserInfo.isNewUser) {
        setError({
          message: "You haven't registered yet, go to singup page please!",
        });
        await myContext.deleteUser();
      } else {
        location.state
          ? history.replace(location.state.from)
          : history.replace("/");
      }
    } catch (error) {
      if (error.code.split("/")[1].includes("account-exists"))
        error.message =
          "An account already exists with the same email address!";
      else error.message = "There is a connection error, please try again!";
      setError(error);
    }
  };

  //redirect user if the user want to singup
  if (goSingUp && location.state)
    return (
      <Redirect
        to={{ pathname: "/singup", state: { from: location.state.from } }}
      />
    );
  else if (goSingUp && !location.state) {
    return <Redirect to="/singup" />;
  }

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

        <button className="submit-btn" type="submit" disabled={singing}>
          {!singing ? "Sing In" : "Singing..."}
        </button>

        {error && <div className="firebase-error">{error.message}</div>}

        <span className="go-singup">
          Don't have an account yet?
          <strong onClick={redirectToSingup}> Sing up</strong>
        </span>

        <div className="log-facebook">
          <p className="or">or</p>
          <p className="facebook-choosen">
            Login with
            <strong className="fb" onClick={onFacebook}>
              facebook
            </strong>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
