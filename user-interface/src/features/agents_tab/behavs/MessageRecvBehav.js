import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";

import ActionEditor from "../editors/ActionEditor";
import { useDispatch, useSelector } from "react-redux";
import { addAction, resetScope, selectActions, resetActions } from "../editors/editorSlice";
import { selectMessageTypes, addName } from "../../simulationSlice";
import { addBehav } from "../agentsTabSlice";
import { validateBehavName, errorCodes } from "../../../app/utils";

export const MessageRecvBehav = (props) => {
  const { onClose } = props;
  const [behavName, setBehavName] = useState("");

  const [selectedMsg, setSelectedMsg] = useState(0);

  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorText, setNameErrorText] = useState("");
  const [actionError, setActionError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const dispatch = useDispatch();
  const actions = useSelector(selectActions);
  const messages = useSelector(selectMessageTypes);
  const onActionDialogClose = (action) => {
    if (action !== null) {
      dispatch(addAction(action));
    }
    dispatch(resetScope);
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
    if(messages[selectedMsg] === undefined){
      err_flag = true;
      setMessageError(true);
    }
    if (!err_flag) {
      let code =
        "BEHAV " +
        behavName +
        ",msg_rcv," +
        messages[selectedMsg].name +
        "," +
        messages[selectedMsg].type +
        "\n";
      actions.forEach((el) => (code += el.code));
      code += "EBEHAV\n";
      let behav = {
        name: behavName,
        actions: [...actions],
        code: code,
      };
      dispatch(addBehav(behav));
      dispatch(resetScope);
      dispatch(resetActions);
      dispatch(addName(behavName));
      onClose();
    }
  };

  return (
    <>
      <ActionEditor
        open={actionDialogOpen}
        onClose={onActionDialogClose}
        rcvMsg={messages[selectedMsg]}
      />

      <FormControl fullWidth>
        <TextField
          variant="outlined"
          label="Name"
          id="behav_name"
          value={behavName}
          onChange={(e) => setBehavName(e.target.value)}
        />
        <TextField
          value={selectedMsg}
          onChange={(e) => setSelectedMsg(e.target.value)}
          label="Message type"
          select
          sx={{ marginTop: 2 }}
        >
          {messages.map((el, index) => {
            return (
              <MenuItem value={index}>
                {" "}
                {el.name}_{el.type}{" "}
              </MenuItem>
            );
          })}
        </TextField>
      </FormControl>
      <p>
        <b>Actions: </b>
      </p>
      {actions.map((el, index) => {
        return <p> {el.name} </p>;
      })}
    {
      nameError ?
        <Alert severity="error" onClose={(e) => setNameError(false)}>
          Name Error! {nameErrorText}
        </Alert>
      :
      <></>
    }
    {
      actionError ?
        <Alert severity="error" onClose={(e) => setActionError(false)}>
          Error saving! Please add some actions!
        </Alert>
      :
      <></>
    }
    {
      messageError ?
        <Alert severity="error" onClose={(e) => setMessageError(false)}>
          Erro saving! Please select a valid message type!
        </Alert>
      :
      <></>
    }

      <Button onClick={(e) => setActionDialogOpen(true)}> Add Action </Button>
      <Button onClick={saveBehaviour}> Add Behaviour </Button>
    </>
  );
};

export default MessageRecvBehav;
