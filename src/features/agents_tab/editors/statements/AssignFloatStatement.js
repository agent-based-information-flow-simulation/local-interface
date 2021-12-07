import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Stack,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material"

import InlineText from "../InlineText"
import AddCircleIcon from "@mui/icons-material/AddCircle";


export const AssignFloatStatement = (props) => {

  const { lhsCandidates, rhsCandidates, save, setEditOn } = props;

  const [curLhs, setCurLhs] = useState(lhsCandidates[0].name)
  const [curRhs, setCurRhs] = useState("")

  const [rhsError, setRhsError] = useState(false);

  const handleRhsChange = (value) => {
    setCurRhs(value);
  };

  const addAssignStatement = () => {
    //LHS is select no need to validate
    //validate RHS
    let err_flag = false;
    if (
      rhsCandidates.findIndex((el) => el.name === curRhs) === -1 &&
      isNaN(parseFloat(curRhs))
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

  return (
    <Stack direction="row">
      <Select
        value={curLhs}
        onChange = {(e) => setCurLhs(e.target.value)}
      >
        {
          lhsCandidates.map((el, index)=>{
            return <MenuItem value={el.name}> {el.name} </MenuItem>;
          })
        }

      </Select>
      <InlineText text="="/>
      <Autocomplete
        freeSolo
        options={rhsCandidates.map((el,index)=>el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{width: "200px"}}
        value={curRhs}
        inputValue = {curRhs}
        onInputChange = {(event, value) => handleRhsChange(value)}
        error={rhsError}
      />
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addAssignStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>

    </Stack>
  );
}

AssignFloatStatement.propTypes = {
  save: PropTypes.func.isRequired,
  setEditOn: PropTypes.func.isRequired,
  lhsCandidates: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string
  })).isRequired,
  rhsCandidates: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string
  })).isRequired,
}

export default AssignFloatStatement;