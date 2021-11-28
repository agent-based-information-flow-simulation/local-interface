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
import BehavDialog from "./BehavDialog";
import SelectList from "../components/SelectList";
import DisplayList from "../components/DisplayList";
import { useSelector } from "react-redux";

import { selectParameters, addParam, selectBehaviours } from "./agentsTabSlice";
import { selectMessageTypes } from "../simulationSlice"

export function AgentsTab(props) {
  const paramListOptions = [
    { value: "float", display: "Float" },
    { value: "enum", display: "Enumerable" },
    { value: "list", display: "Connections/Messages" },
  ];

  const behavListOptions = [
    { value: "onSetup", display: "Setup"},
    { value: "onEvent", display: "OneTime/OnEvent"},
  ];

  const [paramDialogOpen, setParamDialogOpen] = React.useState(false);
  const [behavDialogOpen, setBehavDialogOpen] = React.useState(false);
  const [paramDialogType, setParamDialogType] = React.useState("");
  const [behavDialogType, setBehavDialogType] = React.useState("");
  const [notifyError, setNotifyError] = React.useState(false);

  const params = useSelector(selectParameters);
  const behavs = useSelector(selectBehaviours);
  const messages = useSelector(selectMessageTypes);

  const handleParamTypeChange = (e) => {
    setParamDialogType(e.target.dataset.value);
    setParamDialogOpen(true);
  };

  const handleBehavTypeChange = (e) => {
    setBehavDialogType(e.target.dataset.value);
    setBehavDialogOpen(true);
  }

  const handleBehavClose = (error) => {
    setNotifyError(error);
    setBehavDialogOpen(false);
  }

  const handleParamClose = (error) => {
    setNotifyError(error);
    setParamDialogOpen(false);
  };

  const handleNotifyClose = () => {
    setNotifyError(false);
  };

  return (
    <>
      <ParamsDialog open={paramDialogOpen} onClose={handleParamClose} type={paramDialogType} addParam={addParam} />
      <BehavDialog open={behavDialogOpen} onClose={handleBehavClose} type={behavDialogType} />
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
          name="Created Agents"
          collection={["Agent one", "Agent two"]}
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
                label="Agent Type Name"
                id="agent_type_input"
              />
            </Box>
            <Stack direction="row">
              <SelectList
                name="Parameters"
                collection={params}
                options={paramListOptions}
                handleParamTypeChange={handleParamTypeChange}
              />
              <SelectList
                name="Behaviours"
                collection={behavs}
                options={behavListOptions}
                handleParamTypeChange={handleBehavTypeChange}
              />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
