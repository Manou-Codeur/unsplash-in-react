import React from "react";

const Input = props => {
  const { label, type = "text", errors, handleInputChange, ...rest } = props;

  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      <input
        {...rest}
        type={type}
        className="form-control"
        id={label}
        onChange={handleInputChange}
      />
      {errors.title && <div className="alert alert-danger">{errors.title}</div>}
    </div>
  );
};

export default Input;
