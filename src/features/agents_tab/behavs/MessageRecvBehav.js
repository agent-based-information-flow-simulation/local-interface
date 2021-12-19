import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

import ActionEditor from "../editors/ActionEditor";
import { useDispatch, useSelector } from "react-redux";
import { addAction, resetScope, selectActions, resetActions } from "../editors/editorSlice";
import { selectMessageTypes, addName } from "../../simulationSlice";
import { addBehav } from "../agentsTabSlice";
import { validateQualifiedName } from "../../../app/utils";

export const MessageRecvBehav = (props) => {
  const { onClose } = props;
  const [behavName, setBehavName] = useState("");

  const [selectedMsg, setSelectedMsg] = useState(0);

  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [actionError, setActionError] = useState(false);
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
    if (!validateQualifiedName(behavName)) {
      err_flag = true;
      setNameError(true);
    }
    if (actions.length === 0) {
      err_flag = true;
      setActionError(true);
    }
    if (!err_flag) {
      let code =
        "BEHAV " +
        behavName +
        ",msg_recv," +
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
      <Button onClick={(e) => setActionDialogOpen(true)}> Add Action </Button>
      <Button onClick={saveBehaviour}> Add Behaviour </Button>
    </>
  );
};

export default MessageRecvBehav;
