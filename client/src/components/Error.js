import React, { useCallback, useEffect, useState } from "react";
import { removeError } from "../redux";
import { useDispatch, useSelector } from "react-redux";

const Error = () => {
  // TODO shouldRemoveErr stuff
  const dispatch = useDispatch();

  const errors = useSelector((state) => state.errors);
  const [startRemove, setStartRemove] = useState(false);
  const [showErrors, setShowErrors] = useState([]);

  // remove errors one by one
  const clearError = useCallback(
    async (id) => {
      // remove from main state
      dispatch(removeError(id));
      let updatedErrors = [...errors];
      const removeIndex = updatedErrors.map((e) => e.id).indexOf(id);
      updatedErrors.splice(removeIndex, 1);
      setShowErrors(updatedErrors);
    },
    [dispatch, errors]
  );
  // handle remove errors
  const handleRemoveErrors = useCallback(async () => {
    console.log("===handleRemoveErrors===");
    for (let i = 0; i < errors.length; i++) {
      const id = errors[i].id;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearError(id);
    }
  }, [errors, clearError]);

  useEffect(() => {
    startRemove && handleRemoveErrors();
    errors.length < 1 && setStartRemove(false);
    return () => {};
  }, [startRemove, errors, handleRemoveErrors]);

  // display errors one by one

  const handleDisplayErrors = useCallback(async () => {
    console.log("handleDisplayErrors ===");
    let myElements = [];
    for (let i = 0; i < errors.length; i++) {
      const err = errors[i];
      await new Promise((resolve) => setTimeout(resolve, 1000));
      myElements.push(err);
      setShowErrors([...myElements]);
    }
    console.log("start remove");
    setStartRemove(true);
  }, [errors]);

  useEffect(() => {
    !startRemove && errors.length > 0 && handleDisplayErrors();
    return () => {};
  }, [startRemove, errors, handleDisplayErrors]);

  return (
    <>
      {showErrors !== null && showErrors.length > 0 && (
        <div>
          {showErrors.map((err, i) => {
            return (
              <div
                key={i}
                className={`alert alert-${err.type}`}
                onClick={() => clearError(err.id)}
              >
                {err.msg}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Error;
