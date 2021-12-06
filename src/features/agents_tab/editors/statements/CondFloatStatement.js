import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Autocomplete,
  MenuItem,
  IconButton,
  TextField,
  Select,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle";


import { useDispatch } from "react-redux";
import {
  openBlock
} from "../editorSlice";

const FloatCondOps = [
  { opcode: "ILT  ", label: "<" },
  { opcode: "IGT  ", label: ">" },
  { opcode: "ILTE ", label: ">=" },
  { opcode: "IGTE ", label: ">=" },
  { opcode: "IEQ  ", label: "==" },
  { opcode: "INEQ ", label: "!=" },
];

export const CondFloatStatement = (props) => {
  const { save, setEditOn, variables } = props;
  const dispatch = useDispatch();

  const [curLhs, setCurLhs] = useState("");
  const [lhsError, setLhsError] = useState(false);
  const [curRhs, setCurRhs] = useState("");
  const [rhsError, setRhsError] = useState(false);
  const [curOpCode, setCurOpCode] = useState(FloatCondOps[0].opcode);


  const handleLhsChange = (value) => {
    setCurLhs(value);
  };

  const handleRhsChange = (value) => {
    setCurRhs(value);
  };

  const addCondStatement = () => {
    let err_flag = false;
    if (
      variables.findIndex((el) => el.name === curLhs) === -1 &&
      isNaN(parseFloat(curLhs))
    ) {
      setLhsError(true);
      err_flag = true;
    }
    if (
      variables.findIndex((el) => el.name === curRhs) === -1 &&
      isNaN(parseFloat(curRhs))
    ) {
      setRhsError(true);
      err_flag = true;
    }
    if (!err_flag) {
      let statement =
        "If " +
        curLhs +
        " " +
        FloatCondOps.find((el) => el.opcode === curOpCode).label +
        " " +
        curRhs;
      let operation = curOpCode + "    " + curLhs + "," + curRhs;
      dispatch(openBlock());
      save(statement, operation);
      setEditOn(false);
      setLhsError(false);
      setRhsError(false);
    }
  };

  return (
    <Stack direction="row">
      <Autocomplete
        freeSolo
        options={variables.map((el,index)=>el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: "200px" }}
        error={lhsError}
        value={curLhs}
        inputValue={curLhs}
        onInputChange={(event, value) => handleLhsChange(value)}
        helperText="LHS must be a valid variable or a number"
      />
      <Select value={curOpCode} onChange={(e) => setCurOpCode(e.target.value)}>
        {FloatCondOps.map((op, index) => {
          return <MenuItem value={op.opcode}> {op.label} </MenuItem>;
        })}
      </Select>
      <Autocomplete
        freeSolo
        options={variables.map((el,index)=>el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: "200px" }}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid variable or a number"
      />
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addCondStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
};

CondFloatStatement.propTypes = {
  save: PropTypes.func.isRequired,
  setEditOn: PropTypes.func.isRequired,
  variables: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
}

export default CondFloatStatement;
