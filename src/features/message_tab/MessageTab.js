import React from "react";
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
} from "@mui/material";
import ParamsDialog from "../components/ParamsDialog";
import SelectList from "../components/SelectList";
import DisplayList from "../components/DisplayList";
import ParamInspector from "../components/ParamInspector"

import { useSelector, useDispatch } from "react-redux";

import { selectParameters, addParam, selectCurrentParam, setCurrentParam} from "../message_tab/messageTabSlice";

export function MessageTab() {
  const dispatch = useDispatch()
  const paramListOptions = [
    { value: "float", display: "Float" },
    { value: "enum", display: "Enumerable" },
    { value: "list", display: "Connections/Messages" },
  ];

  const [open, setOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState("");
  const [notifyError, setNotifyError] = React.useState(false);

  const params = useSelector(selectParameters);
  const curParam = useSelector(selectCurrentParam);

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
    dispatch(setCurrentParam(index))
  }

  return (
    <>
      <ParamsDialog open={open} onClose={handleClose} type={dialogType} addParam={addParam} />
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
        <DisplayList
          name="Created Messages"
          collection={["Message one", "Message two"]}
        />
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
                id="message_type_input"
              />
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
          </Stack>
        </Box>
        {
          curParam ?
          <ParamInspector param={curParam}/>
          :
          <></>
        }
      </Stack>
    </>
  );
}
