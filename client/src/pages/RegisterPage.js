import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRegistrationMutation } from "../redux/api";
import Input from "../components/Input";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;
  console.log("formData ", formData);

  const [doRegister, error, isLoading] = useRegistrationMutation();

  const handldeChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    doRegister({ name, email, password });
  };

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" action="create-profile.html">
        <div className="form-group">
          <Input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handldeChange}
          />
        </div>
        <div className="form-group">
          <Input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={handldeChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handldeChange}
            minLength="2"
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            onChange={handldeChange}
            minLength="2"
          />
        </div>
        <input
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary"
          value="Register"
        />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  );
};

export default RegisterPage;
