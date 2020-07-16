import React from "react";

import check from "../../assets/img/check.png";
import closeRed from "../../assets/img/close-red.png";
import "./input.scss";

const Input = ({
  error,
  touched,
  handleInputChange,
  handleInputBlur,
  placeholder,
  ...rest
}) => {
  const renderPlaceholder = ({ target }) => {
    target.parentNode.childNodes[0].className += " render-placeholder";
    target.placeholder = "";
  };

  return (
    <div className="Input">
      <span className="input-name">{placeholder}</span>
      <input
        {...rest}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        onFocus={renderPlaceholder}
        className={touched && error ? "red" : ""}
      />
      {touched && error && <img src={closeRed} className="close-red" />}
      {touched && !error && <img src={check} className="check-green" />}
      {touched && error && <div className="error-msg">{error}</div>}
    </div>
  );
};
export default Input;
