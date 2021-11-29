import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Box,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { selectParameters, selectScopeVars, addScopeVar } from "../agentsTabSlice";
import InlineText from "./InlineText";

export const FloatExprOps = [
  { opcode: "ADD ", label: "+=" },
  { opcode: "SUBT", label: "-=" },
  { opcode: "MULT", label: "*=" },
  { opcode: "DIV ", label: "/=" },
];

export const FloatParamEditor = (props) => {
  const { save, selectedParam } = props;
  const dispatch = useDispatch();
  const [editOn, setEditOn] = useState(false);
  const [statementType, setStatementType] = useState("expr");
  const [variables, setVariables] = useState([]);
  const [lhsCandidates, setLhsCandidate] = useState([selectedParam.name]);
  const [curOpCode, setCurOpCode] = useState(FloatExprOps[0].opcode);
  const [curLhs, setCurLhs] = useState("");
  const [lhsError, setLhsError] = useState(false);
  const [curRhs, setCurRhs] = useState("");
  const [rhsError, setRhsError] = useState(false);
  const params = useSelector(selectParameters);
  const scope_vars = useSelector(selectScopeVars);
  const read_only = ["connCount", "msgRCount", "msgSCount"];

  useEffect(() => {
    let param_names = params.map((val, index) => val.name);
    setVariables([...read_only, ...param_names, ...scope_vars]);
    setLhsCandidate([...lhsCandidates, ...scope_vars])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, scope_vars]);

  const handleLhsChange = (value) =>{
    setCurLhs(value);
  }

  const handleRhsChange = (value) =>{
    setCurRhs(value)
  }

  const updateLhsCandidates = (value) => {
    dispatch(addScopeVar(value));
  }

  const addExprStatement = () => {
    //validate LHS
    let err_flag = false;
    if(lhsCandidates.findIndex(el => el === curLhs) === -1){
      setLhsError(true);
      err_flag = true;
    }
    //validate RHS
    if(variables.findIndex(el => el === curRhs) === -1 && isNaN(parseFloat(curRhs))){
      setRhsError(true);
      err_flag = true;
    }
    if(!err_flag){
      let statement = curLhs + ' ' + FloatExprOps.find(el => el.opcode === curOpCode).label + ' ' + curRhs;
      let operation = curOpCode + '    ' + curLhs + ',' + curRhs;
      save(statement, operation)
      setEditOn(false);
      setLhsError(false);
      setRhsError(false);
    }
  }

  const addDeclStatement = () => {
    console.log("we here")
    //validate LHS
    let err_flag = false;
    if(variables.findIndex(el => el === curLhs) !== -1){
      console.log(variables);
      setLhsError(true);
      err_flag = true;
    }
    //validate RHS
    if(variables.findIndex(el => el === curRhs) === -1 && isNaN(parseFloat(curRhs))){
      setRhsError(true);
      err_flag = true;
    }
    if(!err_flag){
      updateLhsCandidates(curLhs);
      let statement = "let " + curLhs + ' = ' + curRhs;
      let operation = "DECL    " + curLhs + ',' + curRhs;
      save(statement, operation)
      setEditOn(false);
    }

  }


  const ExprStatement = () => {
    return (
      <Stack direction="row">
        <Autocomplete
          freeSolo
          options={lhsCandidates}
          renderInput={(params) => <TextField {...params} />}
          sx={{width: "200px"}}
          error={lhsError}
          value={curLhs}
          inputValue={curLhs}
          onInputChange={(event, value) => handleLhsChange(value)}
          helperText="LHS must be a valid property"
        />
        <Select
          value={curOpCode}
          onChange={(e) => setCurOpCode(e.target.value)}
        >
          {FloatExprOps.map((op, index) => {
            return <MenuItem value={op.opcode}> {op.label} </MenuItem>;
          })}
        </Select>
        <Autocomplete
          freeSolo
          options={variables}
          renderInput={(params) => <TextField {...params} />}
          sx={{width: "200px"}}
          error={rhsError}
          value={curRhs}
          inputValue={curRhs}
          onInputChange={(event, value) => handleRhsChange(value)}
          helperText="RHS must be a valid property or a number"
        />
      <IconButton
        sx={{  p: "10px" }}
        color="primary"
        onClick={addExprStatement}
      >
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
      </Stack>
    );
  };

  const DeclStatement = () => {
    return (
      <Stack direction="row">
      <InlineText text="Let: "/>
      <TextField
        value={curLhs}
        onChange={(e) => handleLhsChange(e.target.value)}
        error={lhsError}
        helperText="LHS must be a new identifier"
      />
      <InlineText text=" = "/>
      <Autocomplete
        freeSolo
        options={variables}
        renderInput={(params) => <TextField {...params} />}
        sx={{width: "200px"}}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid property or a number"
      />

      <IconButton
        sx={{  p: "10px" }}
        color="primary"
        onClick={addDeclStatement}
      >
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
      </Stack>

    );
  }

  const ModeDisplay = () => {
    if (!editOn) return <></>;

    switch (statementType) {
      case "expr":
        return <ExprStatement />;
      case "decl":
        return <DeclStatement />;
      case "cond":
        break;
      case "endc":
        break;
      default:
        return <></>;
    }
    return <></>;
  };

  return (
    <>
    <Stack direction="row" sx={{ display: "flex" }}>
      <Box sx={{ width: "100%" }}>
        <Select
          sx={{ width: "100%" }}
          value={statementType}
          onChange={(e) => setStatementType(e.target.value)}
        >
          <MenuItem value={"expr"}> Expression </MenuItem>
          <MenuItem value={"decl"}> Declaration </MenuItem>
          <MenuItem value={"cond"}> Conditional </MenuItem>
          <MenuItem value={"endc"}> End Conditional </MenuItem>
        </Select>
        <FormHelperText> Choose statement type </FormHelperText>
      </Box>
      <IconButton
        sx={{ width: 60, p: "10px" }}
        color="primary"
        onClick={(e) => setEditOn(true)}
        disabled={editOn}
      >
        <AddCircleIcon sx={{ fontSize: "45px" }} />
      </IconButton>
    </Stack>
    <ModeDisplay />
    </>
  );
};

export default FloatParamEditor;
