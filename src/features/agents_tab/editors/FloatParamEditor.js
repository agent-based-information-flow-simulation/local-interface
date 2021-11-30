import React, { useState, useEffect } from "react";
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

import { ExprStatement, DeclStatement } from "./statements";

import {
  selectParameters,
  selectScopeVars,
  addScopeVar,
} from "../agentsTabSlice";
import InlineText from "./InlineText";


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
  const [scopeVars, setScopeVars] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const read_only = [
    { name: "connCount", type: "float" },
    { name: "msgRCount", type: "float" },
    { name: "msgSCount", type: "float" },
  ];

  const [exprLhs, setExprLhs] = useState([]);
  const [exprRhs, setExprRhs] = useState([]);

  useEffect(() => {
    let tmpArr = [...scopeVars, selectedParam];
    setExprLhs(tmpArr);
    tmpArr = params.filter((el) => el.type === "float");
    tmpArr = [...tmpArr, ...scopeVars, ...read_only];
    setExprRhs(tmpArr);
    tmpArr = [...params, ...scopeVars, ...read_only];
    setVariables(tmpArr);
  }, [params, scopeVars, selectedParam, read_only]);

  const handleLhsChange = (value) => {
    setCurLhs(value);
  };

  const handleRhsChange = (value) => {
    setCurRhs(value);
  };

  const addScopeVar = (value) => {
    setScopeVars([...scopeVars, value]);
  }

  const ModeDisplay = () => {
    if (!editOn) return <></>;

    switch (statementType) {
      case "expr":
        return (
          <ExprStatement
            save={save}
            setEditOn={setEditOn}
            lhsCandidates={exprLhs}
            rhsCandidates={exprRhs}
          />
        );
      case "decl":
        return (
          <DeclStatement
            save={save}
            setEditOn={setEditOn}
            variables={variables}
          />
        );
      case "cond_float":
        return <CondStatement />;
      case "endc":
        return <EndCondStatement />;
      default:
        return <></>;
    }
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
            <MenuItem value={"cond_float"}> Conditional (number) </MenuItem>
            <MenuItem value={"cond_enum"}> Conditional (enum) </MenuItem>
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
