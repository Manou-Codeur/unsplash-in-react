import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Input from "./../../sub-components/input/input";

import "./login.scss";

const Login = () => {
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

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          error={errors.email}
          touched={touched.email}
          handleInputChange={handleChange}
          name="email"
          value={values.email}
          handleInputBlur={handleBlur}
        />

        <Input
          type="password"
          error={errors.password}
          touched={touched.password}
          handleInputChange={handleChange}
          name="password"
          value={values.password}
          handleInputBlur={handleBlur}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
