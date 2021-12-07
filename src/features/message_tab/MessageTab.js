import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
  DialogActions,
  DialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
} from "@mui/material";
import SelectList from "../components/SelectList";
import DisplayList from "../components/DisplayList";
import { MessageParamsDialog } from "../components/MessageParamsDialog";
import { useSelector, useDispatch } from "react-redux";

import {
  selectParameters,
  addParam,
  setCurrentParam,
  clearParams,
} from "../message_tab/messageTabSlice";

import { selectMessageTypes, addMessage } from "../simulationSlice";
import { validateQualifiedName } from "../../app/utils";

export function MessageTab() {
  const dispatch = useDispatch();
  const paramListOptions = [
    { value: "float", display: "Float" },
  ];

  const FIPACommActs = [
    "AcceptProposal",
    "Agree",
    "Cancel",
    "CallForProposal",
    "Confirm",
    "Disconfirm",
    "Failure",
    "Inform",
    "InformIf",
    "InformRef",
    "NotUnderstood",
    "Propagate",
    "Propose",
    "Proxy",
    "QueryIf",
    "QueryRef",
    "Refuse",
    "RejectProposal",
    "Request",
    "RequestWhen",
    "RequestWhenever",
    "Subscribe",
  ];

  const [fipaType, setFipaType] = useState(7);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState(paramListOptions[0].value);
  const [msgName, setMsgName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [notifyError, setNotifyError] = useState(false);
  const params = useSelector(selectParameters);

  const messages = useSelector(selectMessageTypes);

  const handleParamTypeChange = (e) => {
    setDialogType(e.target.dataset.value);
    setOpen(true);
  };

  const handleNameChange = (name) => {
    setNameError(false);
    setMsgName(name);
  }

  const handleClose = (error) => {
    setNotifyError(error);
    setOpen(false);
  };

  const handleNotifyClose = () => {
    setNotifyError(false);
  };

  const paramClick = (index) => {
    dispatch(setCurrentParam(index));
  };

  const addMessageClick = () => {
    let err_flag = false;
    if(!validateQualifiedName(msgName) || messages.findIndex(el => el.name === msgName) !== -1){
      err_flag = true;
      setNameError(true);
    }
    if(!err_flag){
      setNameError(false);
      let newMsg = {};
      newMsg.name = msgName;
      newMsg.type = FIPACommActs[fipaType];
      newMsg.params = params;
      let code = "MESSAGE " + msgName + ',' + FIPACommActs[fipaType] +"\n";
      params.forEach(el => code += "PRM " + el.name + ",float\n");
      dispatch(clearParams());
      code += "EMESSAGE";
      console.log(code);
      newMsg.code = code;
      setMsgName("");
      setFipaType(7);
      dispatch(addMessage(newMsg));
    }
  };

  return (
    <>
      <MessageParamsDialog
        open={open}
        onClose={handleClose}
        type={dialogType}
        addParam={addParam}
      />
      <Dialog open={notifyError} onClose={handleNotifyClose}>
        <DialogTitle> Error while saving </DialogTitle>
        <DialogContent>
          <DialogContentText>
            An error occured while attempting to save your data. This may be a
            result of incorrectly filling out the form.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotifyClose}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Stack
        direction="row"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ color: "black", borderColor: "black", borderWidth: 1 }}
          />
        }
        spacing={2}
      >
        <DisplayList name="Created Messages" collection={messages.map((it)=> it.name)} />
        <Box
          sx={{
            width: "100%",
            height: 700,
            maxWidth: 800,
            bgcolor: "background.paper",
            display: "inline-block",
            paddingTop: 9,
            marginLeft: 10,
          }}
        >
          <Stack>
            <Box sx={{ textAlign: "left" }}>
              <TextField
                variant="outlined"
                label="Message Type Name"
                id="message_name_input"
                value={msgName}
                onChange={(e) => handleNameChange(e.target.value)}
                error={nameError}
                helperText="Name empty, not unique or invalid"
              />
              <Select
                value={fipaType}
                onChange={(e) => setFipaType(e.target.value)}
                sx={{ width: 250 }}
              >
                {FIPACommActs.map((key, index) => {
                  return <MenuItem value={index}> {key} </MenuItem>;
                })}
              </Select>
            </Box>
            <Stack direction="row">
              <SelectList
                name="Parameters"
                collection={params}
                collectionItemClick={paramClick}
                options={paramListOptions}
                handleParamTypeChange={handleParamTypeChange}
              />
            </Stack>
            <Button
              variant="contained"
              sx={{ margin: 2 }}
              onClick={addMessageClick}
            >
              {" "}
              Add message{" "}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
