import React, { useState } from "react";
import { FormControl, TextField, Button, Alert } from "@mui/material";

import ActionEditor from "../editors/ActionEditor";
import { useDispatch, useSelector } from "react-redux";
import { addAction, resetScope, selectActions } from "../editors/editorSlice";
import { addBehav } from "../agentsTabSlice";
import { validateBehavName, errorCodes } from "../../../app/utils";
import { addName } from "../../simulationSlice";

export const OnSetupBehav = (props) => {
  const { onClose } = props;

  const [behavName, setBehavName] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorText, setNameErrorText] = useState("");
  const [actionError, setActionError] = useState(false);
  const dispatch = useDispatch();
  const actions = useSelector(selectActions);

  const onActionDialogClose = (action) => {
    console.log("RUUUUU");
    dispatch(resetScope());
    if (action !== null) {
      dispatch(addAction(action));
    }
    setActionDialogOpen(false);
  };

  const saveBehaviour = () => {
    let err_flag = false;
    if (validateBehavName(behavName) !== 0) {
      err_flag = true;
      const code = validateBehavName(behavName);
      const error = errorCodes.find((el) => el.code === code);
      setNameErrorText(error.info);
      setNameError(true);
    }
    if (actions.length === 0) {
      err_flag = true;
      setActionError(true);
    }
    if (!err_flag) {
      let code = "BEHAV " + behavName + ", setup\n";
      actions.forEach((el) => (code += el.code));
      code += "EBEHAV\n";
      let behav = {
        name: behavName,
        actions: [...actions],
        code: code,
      };
      dispatch(addBehav(behav));
      dispatch(resetScope);
      dispatch(addName(behavName));
      onClose();
    }
  };

  return (
    <>
      <ActionEditor open={actionDialogOpen} onClose={onActionDialogClose} />
      <FormControl fullWidth>
        <TextField
          variant="outlined"
          label="Name"
          id="behav_name"
          value={behavName}
          onChange={(e) => setBehavName(e.target.value)}
        />
      </FormControl>
      <p>
        <b>Actions: </b>
      </p>
      {actions.map((el, index) => {
        return <p> {el.name} </p>;
      })}
      {nameError ? (
        <Alert severity="error" onClose={(e) => setNameError(false)}>
          Name Error! {nameErrorText}
        </Alert>
      ) : (
        <></>
      )}
      {actionError ? (
        <Alert severity="error" onClose={(e) => setActionError(false)}>
          Error saving! Please add some actions!
        </Alert>
      ) : (
        <></>
      )}
      <Button onClick={(e) => setActionDialogOpen(true)}> Add Action </Button>
      <Button onClick={saveBehaviour}> Add Behaviour </Button>
    </>
  );
};

export default OnSetupBehav;
