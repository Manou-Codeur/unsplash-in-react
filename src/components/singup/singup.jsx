import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Input from "./../../sub-components/input/input";

import logo from "../../assets/img/camera-white.svg";
import "./singup.scss";

const Singup = () => {
  const schema = {
    name: Yup.string().required("Name is required!"),
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
      console.log("Submitted!");
      console.log(values);
    },
  });

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

        <div className="log-facebook">
          <p className="or">or</p>
          <p className="facebook-choosen">
            Singup with <strong className="fb">facebook</strong>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Singup;
