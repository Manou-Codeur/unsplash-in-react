import React from "react";

import check from "../../assets/img/check.png";
import closeRed from "../../assets/img/close-red.png";
import "./input.scss";

const Input = React.memo(
  ({
    error,
    touched,
    handleInputChange,
    handleInputBlur,
    placeholder,
    ...rest
  }) => {
    const renderInputName = ({ target }) => {
      target.parentNode.childNodes[0].className += " render-placeholder";
      target.placeholder = "";
    };

    return (
      <div className="Input">
        <span className="input-name">{placeholder}</span>

        <input
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          onFocus={renderInputName}
          className={touched && error ? "red" : ""}
          {...rest}
        />

        {touched && error && (
          <img src={closeRed} className="close-red" alt="red close icon" />
        )}

        {touched && error && <div className="error-msg">{error}</div>}

        {touched && !error && (
          <img src={check} className="check-green" alt="green check icon" />
        )}
      </div>
    );
  }
);
export default Input;
