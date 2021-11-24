import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import {
  DialogActions,
  FormControl,
  DialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import ParamsDialog from "../components/ParamsDialog";
import SelectList from "../components/SelectList";
import DisplayList from "../components/DisplayList";
import { useSelector } from "react-redux";

import { selectParameters } from "./agentsTabSlice";

export function AgentsTab(props) {
  const paramListOptions = [
    { value: "float", display: "Float" },
    { value: "enum", display: "Enumerable" },
    { value: "list", display: "Connections/Messages" },
  ];

  const [open, setOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState("");
  const [notifyError, setNotifyError] = React.useState(false);

  const params = useSelector(selectParameters);

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

  return (
    <>
      <ParamsDialog open={open} onClose={handleClose} type={dialogType} />
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
              {/* TODO change to SelectList */}
              <Box
                sx={{
                  minHeight: 600,
                  maxHeight: 600,
                  maxWidth: 360,
                  minWidth: 360,
                  bgcolor: "background.paper",
                  overflow: "auto",
                  display: "inline-block",
                }}
              >
                <nav aria-label="main behaviours">
                  <h2> Behaviours </h2>
                  <List
                    sx={{
                      minHeight: 422,
                      maxHeight: 422,
                      border: "solid",
                      borderColor: "black",
                      overflow: "auto",
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                      (number) => {
                        return (
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemText primary={"Behav " + number} />
                            </ListItemButton>
                          </ListItem>
                        );
                      }
                    )}
                  </List>
                  <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="behavSelect"> Select type </InputLabel>
                    <Select label="Select type" labelId="behavSelect">
                      <MenuItem value={"onSetup"}> Setup </MenuItem>
                      <MenuItem value={"onEvent"}> OneTime/OnEvent </MenuItem>
                    </Select>
                  </FormControl>
                </nav>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
