import React from "react";

import "./input.scss";

const Input = ({
  error,
  touched,
  handleInputChange,
  handleInputBlur,
  ...rest
}) => {
  return (
    <div className="Input">
      <input {...rest} onChange={handleInputChange} onBlur={handleInputBlur} />
      {touched && error && <div className="my-alert">{error}</div>}
    </div>
  );
};

export default Input;
