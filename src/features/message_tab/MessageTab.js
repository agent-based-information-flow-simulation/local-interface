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
import ParamsDialog from "../components/ParamsDialog";
import SelectList from "../components/SelectList";
import DisplayList from "../components/DisplayList";
import ParamInspector from "../components/ParamInspector";

import { useSelector, useDispatch } from "react-redux";

import {
  selectParameters,
  addParam,
  selectCurrentParam,
  setCurrentParam,
} from "../message_tab/messageTabSlice";

import { selectMessageTypes, addMessage } from "../simulationSlice";

export function MessageTab() {
  const dispatch = useDispatch();
  const paramListOptions = [
    { value: "float", display: "Float" },
    { value: "enum", display: "Enumerable" },
    { value: "list", display: "Connections/Messages" },
  ];

  const FIPACommActs = [
    "Accept Proposal",
    "Agree",
    "Cancel",
    "Call for Proposal",
    "Confirm",
    "Disconfirm",
    "Failure",
    "Inform",
    "Inform If",
    "Inform Ref",
    "Not Understood",
    "Propagate",
    "Propose",
    "Proxy",
    "Query if",
    "Query ref",
    "Refuse",
    "Reject Proposal",
    "Request",
    "Request When",
    "Request Whenever",
    "Subscribe",
  ];

  const [fipaType, setFipaType] = useState(7);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [msgName, setMsgName] = useState("");
  const [notifyError, setNotifyError] = useState(false);

  const params = useSelector(selectParameters);
  const curParam = useSelector(selectCurrentParam);
  const messages = useSelector(selectMessageTypes);

  const handleParamTypeChange = (e) => {
    setDialogType(e.target.dataset.value);
    setOpen(true);
  };

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
    let newMsg = {};
    newMsg.name = msgName;
    newMsg.type = FIPACommActs[fipaType];
    newMsg.params = params;
    dispatch(addMessage(newMsg));
  };

  return (
    <>
      <ParamsDialog
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
                onChange={(e) => setMsgName(e.target.value)}
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
        {curParam ? <ParamInspector param={curParam} /> : <></>}
      </Stack>
    </>
  );
}
