import React from "react";
import PropTypes from "prop-types";
import { Container, Dialog, DialogTitle } from "@mui/material";
import OnSetupBehav from "./behavs/OnSetupBehav";
import OneTimeBehav from "./behavs/OneTimeBehav";
import CyclicBehav from "./behavs/CyclicBehav";
import MessageRecvBehav from "./behavs/MessageRecvBehav";

const BehavDialog = (props) => {
  const { handleClose, open, type } = props;

  const saveCallback = () => {
    handleClose(false);
  }

  const ModeDisplay = () => {
    switch (type) {
      case "onSetup":
        return <OnSetupBehav onClose={saveCallback}/>;
      case "oneTime":
        return <OneTimeBehav onClose={saveCallback}/>;
      case "cyclic":
        return <CyclicBehav onClose={saveCallback}/>;
      case "onMessageReceive":
        return <MessageRecvBehav onClose={saveCallback}/>;
      default:
        return <></>;
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Container sx={{ padding: 3 }}>
        <DialogTitle> New behaviour </DialogTitle>
        <ModeDisplay />
      </Container>
    </Dialog>
  );
};

BehavDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default BehavDialog;
