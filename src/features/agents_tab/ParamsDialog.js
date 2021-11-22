import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import {
  Container,
  Button,
} from "@mui/material";

import FloatParam from "./components/FloatParam";
import EnumParam from "./components/EnumParam";

function ParamsDialog(props) {
  const { onClose, open, type } = props;

  const handleClose = () => {
    onClose();
  };

  const ModeDisplay = () => {
    console.log(type);
    switch (type) {
      case "float":
        return <FloatParam />;
      case "enum":
        return <EnumParam />;
      default:
        return <></>;
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Container sx={{ padding: 3 }}>
        <DialogTitle> New parameter... </DialogTitle>
        <TextField variant="outlined" label="Name" id="param_name" />
        <ModeDisplay />
        <Button> Add parameter </Button>
      </Container>
    </Dialog>
  );
}

ParamsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default ParamsDialog;
