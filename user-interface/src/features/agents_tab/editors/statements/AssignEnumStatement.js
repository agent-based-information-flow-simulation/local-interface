import React, { useState} from "react"
import PropTypes from "prop-types";
import {
  Stack,
  Autocomplete,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InlineText from "../InlineText"

export const AssignEnumStatement = (props) => {
  const {save, setEditOn, variables} = props;

  const [curLhs, setCurLhs] = useState("");
  const [curRhs, setCurRhs] = useState("");
  const [rhsError, setRhsError] = useState(false);
  const [rhsCandidates, setRhsCandidates] = useState([]);

  const addAssignStatement = () => {
    //validate RHS
    let err_flag = false;
    if (
      rhsCandidates.findIndex((el) => el === curRhs) === -1 ||
      !isNaN(parseFloat(curRhs))
    ){
      setRhsError(true);
      err_flag = true;
    }
    if(!err_flag){
      let statement = curLhs + " = " + curRhs;
      let operation = "SET     " + curLhs + "," + curRhs;
      save(statement, operation);
      setEditOn(false);
      setRhsError(false);
    }
  }
  const handleLhsChange = (value) => {
    setCurLhs(value);
    let val = variables.find(el => el.name === value);
    setRhsCandidates(val.values.map((el,index)=>el.name));
  };

  const handleRhsChange = (value) => {
    setCurRhs(value);
  };

  return (
    <Stack direction="row">
      <Select
        value={curLhs}
        onChange = {(e) => handleLhsChange(e.target.value)}
      >
        {
          variables.map((el, index) => {
            return (
              <MenuItem value={el.name}> {el.name} ({el.type}) </MenuItem>
            );
          })
        }
      </Select>
      <InlineText text="=" />
      <Select
        value={curRhs}
        onChange={(e) => setCurRhs(e.target.value)}
        disabled={curLhs === ""}
      >
        {
          rhsCandidates.map((el,index) => {
            return(
              <MenuItem value={el}> {el} (enum value) </MenuItem>
            )
          })
        }

      </Select>
      <Autocomplete
        freeSolo
        options={rhsCandidates}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: "200px" }}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        disabled={curLhs === ""}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid variable or a number"
      />
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addAssignStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );

}

AssignEnumStatement.propTypes = {
  save: PropTypes.func.isRequired,
  setEditOn: PropTypes.func.isRequired,
  variables: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    }))
  })).isRequired,
}

export default AssignEnumStatement;