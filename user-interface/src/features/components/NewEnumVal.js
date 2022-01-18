import React from "react";
import PropTypes from "prop-types";
import { Paper, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const NewEnumVal = (props) => {
  const { addEnumVal, enumValName, onChangeField, error } = props;
  return (
    <Paper component="form" sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        sx={{ ml: 1, flex: 1 }}
        placeholder="Param name"
        value={enumValName}
        onChange={(e) => {
          onChangeField(e.target.value);
        }}
        error={error}
        helperText={error ? "Enum values must be non-empty and unique" : ""}
        id="new_enum_val_name"
      />
      <IconButton color="primary" sx={{ p: "10px" }} onClick={addEnumVal}>
        <AddIcon />
      </IconButton>
    </Paper>
  );
};

NewEnumVal.propTypes = {
  addEnumVal: PropTypes.func.isRequired,
  enumValName: PropTypes.string.isRequired,
  onChangeField: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
};

export default NewEnumVal;
