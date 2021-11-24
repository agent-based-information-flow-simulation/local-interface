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
import ParamsDialog from "./ParamsDialog";
import { useSelector } from "react-redux";

import { selectParameters } from "./agentsTabSlice";

export function AgentsTab(props) {
  const [open, setOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState("");
  const [notifyError, setNotifyError] = React.useState(false);

  const params = useSelector(selectParameters);

  const handleParamTypeChange = (e) => {
    setDialogType(e.target.value);
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

      <Box
        sx={{
          width: "100%",
          height: 600,
          maxWidth: 360,
          bgcolor: "background.paper",
          display: "inline-block",
        }}
      >
        <nav aria-label="main messages">
          <h2> Created Messages </h2>
          <List
            sx={{
              minHeight: 550,
              maxHeight: 550,
              overflow: "auto",
              border: "solid",
              borderColor: "black",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((number) => {
              return (
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary={"Message " + number} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Box>
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
            <Box
              sx={{
                maxWidth: 360,
                minWidth: 360,
                bgcolor: "background.paper",
                display: "inline-block",
              }}
            >
              <nav aria-label="main parameters">
                <h2> Parameters </h2>
                <List
                  sx={{
                    minHeight: 422,
                    maxHeight: 422,
                    border: "solid",
                    borderColor: "black",
                    overflow: "auto",
                  }}
                >
                  {params.map((param) => {
                    return (
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText primary={"Param " + param.name} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
                <FormControl fullWidth sx={{ marginTop: 2 }}>
                  <InputLabel> Select type </InputLabel>
                  <Select label="Select type" onChange={handleParamTypeChange}>
                    <MenuItem value={"float"}> Float </MenuItem>
                    <MenuItem value={"enum"}> Enumerable </MenuItem>
                    <MenuItem value={"list"}>
                      {" "}
                      Connections/Messages List{" "}
                    </MenuItem>
                  </Select>
                </FormControl>
              </nav>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
