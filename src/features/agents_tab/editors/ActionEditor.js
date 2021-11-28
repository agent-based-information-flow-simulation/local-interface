import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectParameters } from "../agentsTabSlice";
import {
  Container,
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  FormGroup,
  FormHelperText,
} from "@mui/material";

import FloatParamEditor from "./FloatParamEditor";
import EnumParamEditor from "./EnumParamEditor";
import ListParamEditor from "./ListParamEditor";

const ActionEditor = (props) => {
  const { onClose, open } = props;
  const [actionType, setActionType] = useState("modifySelf");
  const [selectedParam, setSelectedParam] = useState(-1);
  const params = useSelector(selectParameters);

  const ModeDisplay = (props) => {
    if(props.param === undefined) return <></>;
    switch (props.param.type) {
      case "float_init":
      case "float_distribution":
        return <FloatParamEditor />;
      case "enum_new_init":
      case "enum_new_percentages":
      case "enum_existing_init":
      case "enum_existing_percentages":
        return <EnumParamEditor />;
      case "list_conns":
      case "list_messages":
        return <ListParamEditor />;
      default:
        return <></>;
    }
  };

  return (
    <Dialog fullScreen={true} onClose={onClose} open={open}>
      <Container sx={{ padding: 3 }}>
        <DialogTitle> New action </DialogTitle>
        <FormGroup fullWidth>
          <Select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            sx={{ marginTop: 1 }}
          >
            <MenuItem value={"modifySelf"}> Modify Self </MenuItem>
            <MenuItem value={"sendMsg"}> Send message </MenuItem>
          </Select>
          {actionType === "modifySelf" ? (
            <>
              <Select
                value={selectedParam}
                onChange={(e) => setSelectedParam(e.target.value)}
                sx={{ marginTop: 1 }}
              >
                <MenuItem value={-1}>
                  <em>param...</em>
                </MenuItem>
                {params.map((param, index) => {
                  return <MenuItem value={index}> {param.name} </MenuItem>;
                })}
              </Select>
              <FormHelperText>{selectedParam===-1 ? "Select param to change" : ""} </FormHelperText>
              <ModeDisplay param={params[selectedParam]} />
            </>
          ) : (
            <></>
          )}
        </FormGroup>
      </Container>
    </Dialog>
  );
};

ActionEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ActionEditor;
