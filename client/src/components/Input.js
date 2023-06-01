import React from "react";

const Input = ({ type, value, name, placeholder, ...rest }) => {
  return <input type={type} placeholder={placeholder} name={name} {...rest} />;
};

export default Input;
