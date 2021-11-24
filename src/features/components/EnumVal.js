import React from "react";
import PropTypes from "prop-types";

import {
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";

const EnumVal = (props) => {

  const {enumState, enumVals, name, setPercentage, removeEnumVal, error} = props

  return (
    <ListItem disablePadding>
      <ListItemText primary={name} />
      {enumState === "percentages" ? (
        <TextField
          value={enumVals.find((el) => el.name === name).percentage}
          onChange={(e) => setPercentage(props.name, e.target.value)}
          type={"number"}
          InputProps={{
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
            inputProps: {step: 0.1, min: 0, max: 100}
          }}
          error={error}
          sx={{ width: 90 }}
          id={props.name + "_percentage"}
        />
      ) : (
        <></>
      )}
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        onClick={(e) => removeEnumVal(props.name)}
      >
        <RemoveIcon />
      </IconButton>
    </ListItem>
  );
};

EnumVal.propTypes = {
  enumState: PropTypes.string.isRequired,
  enumVals: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  setPercentage: PropTypes.func.isRequired,
  removeEnumVal: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
}

export default EnumVal;