import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import FacebookLogin from "react-facebook-login";

import Input from "./../../sub-components/input/input";
import { FirebaseContext } from "../../services/firebase/indexx";

import logo from "../../assets/img/camera-white.svg";
import "./singup.scss";

const Singup = ({ history }) => {
  const myContext = useContext(FirebaseContext);
  const [error, setError] = useState({});

  const schema = {
    name: Yup.string().required("Name is required!").trim(),
    email: Yup.string()
      .email("Email is invalid!")
      .required("Email is required!"),
    password: Yup.string()
      .strict()
      .lowercase("Password must contain only lowercase!")
      .min(6, "Password must contain at least 5 chars!")
      .required("Password is required!"),
    password2: Yup.string()
      .equals([Yup.ref("password"), null], "Passwords doesn't match!")
      .required("Password confirm is required!"),
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
      name: "",
      email: "",
      password: "",
      password2: "",
    },
    validationSchema: Yup.object(schema),
    onSubmit: values => {
      doSubmit(values);
    },
  });

  const onFacebook = async () => {
    try {
      await myContext.doSignInWithFacebook();
      history.replace("./");
    } catch (error) {
      console.log(error);
      if (error.code.split("/")[1].includes("account-exists"))
        error.message =
          "An account already exists with the same email address!";
      else error.message = "There is a connection error, please try again!";
      setError(error);
    }
  };

  const doSubmit = async ({ email, password }) => {
    try {
      await myContext.doCreateUserWithEmailAndPassword(email, password);
      history.replace("./");
      //save in the localstorage that the user has othed
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="Singup-form">
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <img src={logo} alt="camera icon" />
          <p>MYSPLASH</p>
        </div>

        <h2 className="welcome">Sing Up</h2>

        <Input
          placeholder="Name"
          type="name"
          error={errors.name}
          touched={touched.name}
          handleInputChange={handleChange}
          name="name"
          value={values.name}
          handleInputBlur={handleBlur}
        />

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

        <Input
          placeholder="Retype Password"
          type="password"
          error={errors.password2}
          touched={touched.password2}
          handleInputChange={handleChange}
          name="password2"
          value={values.password2}
          handleInputBlur={handleBlur}
        />

        <button className="submit-btn" type="submit">
          Sing Up
        </button>

        {error && <div className="firebase-error">{error.message}</div>}

        <div className="log-facebook">
          <p className="or">or</p>
          <p className="facebook-choosen">
            Singup with
            <strong className="fb" onClick={onFacebook}>
              facebook
            </strong>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Singup;
