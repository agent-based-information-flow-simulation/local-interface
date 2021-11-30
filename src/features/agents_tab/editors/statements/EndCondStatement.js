import React from "react";
import PropTypes from "prop-types";
import {
  Stack,
  IconButton
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import InlineText from "../InlineText";

export const EndCondStatement = (props) => {

  const {save} = props

  const addEndCondStatement = () => {
    let statement = "End if";
    let operation = "FI";
    save(statement, operation);
  };

  return (
    <Stack direction="row">
      <InlineText text="End conditional block" />
      <IconButton
        sx={{ p: "10px" }}
        color="primary"
        onClick={addEndCondStatement}
      >
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
};

EndCondStatement.propTypes = {
  save: PropTypes.func.isRequired,
}

export default EndCondStatement;
