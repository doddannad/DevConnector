import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRegistrationMutation } from "../redux/api";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import { setError } from "../redux";

const RegisterPage = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;

  const [doRegister, { isLoading, isError, isSuccess, error }] =
    useRegistrationMutation();

  const handldeChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    doRegister({ name, email, password });
  };

  const handleSetError = useCallback(() => {
    isError && dispatch(setError({ errors: error.data, type: "danger" }));
  }, [isError, error]);

  useEffect(() => {
    handleSetError();

    return () => {};
  }, [handleSetError]);

  if (isLoading) {
    return <Loading />;
  }

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
            value={name}
          />
        </div>
        <div className="form-group">
          <Input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={handldeChange}
            value={email}
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
            value={password}
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            onChange={handldeChange}
            minLength="2"
            value={password2}
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
