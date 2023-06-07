import React, { useCallback, useEffect, useState } from "react";
import { removeError } from "../redux";
import { useDispatch, useSelector } from "react-redux";

const Error = () => {
  // TODO shouldRemoveErr stuff
  const dispatch = useDispatch();

  const errors = useSelector((state) => state.errors);

  const [startRemove, setStartRemove] = useState(false);
  const [showErrors, setShowErrors] = useState([]);
  console.log("startRemove ", startRemove);

  // remove errors one by one
  const clearError = useCallback(
    async (id) => {
      // remove from main state
      dispatch(removeError(id));
    },
    [dispatch]
  );
  // handle remove errors
  const handleRemoveErrors = useCallback(async () => {
    let removeIndex;
    let updatedErrors;
    for (let i = 0; i < errors.length; i++) {
      removeIndex = i;
      const id = errors[i].id;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearError(id);
      updatedErrors = [...showErrors];
      updatedErrors.splice(removeIndex, 1);
      setShowErrors(updatedErrors);
    }
  }, [errors, showErrors, clearError]);

  useEffect(() => {
    startRemove && errors.length > 0 && handleRemoveErrors();
    startRemove && errors.length < 1 && setStartRemove(false);
    return () => {};
  }, [startRemove, errors, handleRemoveErrors]);

  // display errors one by one

  const handleDisplayErrors = useCallback(async () => {
    let myElements = [];
    for (let i = 0; i < errors.length; i++) {
      const err = errors[i];
      await new Promise((resolve) => setTimeout(resolve, 1000));
      myElements.push(
        <div
          key={i}
          className={`alert alert-${err.type}`}
          onClick={() => clearError(err.id)}
        >
          {err.msg}
        </div>
      );
      setShowErrors([...myElements]);
      if (i === errors.length - 1) {
        setStartRemove(true);
      }
    }
  }, [errors, clearError]);

  useEffect(() => {
    !startRemove && errors.length > 0 && handleDisplayErrors();
    return () => {};
  }, [startRemove, errors, handleDisplayErrors]);

  return (
    <>
      {showErrors !== null && showErrors.length > 0 && (
        <div>
          {showErrors.map((err, i) => {
            return <div key={i}>{err}</div>;
          })}
        </div>
      )}
    </>
  );
};

export default Error;
