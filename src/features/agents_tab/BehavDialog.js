import React from "react";
import {useDispatch} from "react-redux";
import {resetActions} from "./editors/editorSlice";
import PropTypes from "prop-types";
import { Container, Dialog, DialogTitle } from "@mui/material";
import OnSetupBehav from "./behavs/OnSetupBehav";
import OneTimeBehav from "./behavs/OneTimeBehav";
import CyclicBehav from "./behavs/CyclicBehav";
import MessageRecvBehav from "./behavs/MessageRecvBehav";

const BehavDialog = (props) => {
  const { handleClose, open, type } = props;
  const dispatch = useDispatch();

  const saveCallback = () => {
    console.log("dispatchingggSave")
    dispatch(resetActions())
    handleClose(false);
  }

  const wrappedHandleClose = () =>  {
    console.log("dispatchinggg")
    dispatch(resetActions())
    handleClose();

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
    <Dialog onClose={(e) => wrappedHandleClose()} open={open}>
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
