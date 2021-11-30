import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import {
  ExprStatement,
  DeclStatement,
  CondFloatStatement,
  EndCondStatement,
} from "./statements";

import {
  selectParameters,
} from "../agentsTabSlice";

export const FloatParamEditor = (props) => {
  const { save, selectedParam } = props;
  const [editOn, setEditOn] = useState(false);
  const [statementType, setStatementType] = useState("expr");
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
  const [variables, setVariables] = useState([]);
  const [floatVars, setFloatVars] = useState([]);

  useEffect(() => {
    let tmpArr = [...scopeVars, selectedParam];
    setExprLhs(tmpArr);
    tmpArr = params.filter((el) => el.type === "float");
    tmpArr = [...tmpArr, ...scopeVars, ...read_only];
    setExprRhs(tmpArr);
    tmpArr = [...params, ...scopeVars, ...read_only];
    setVariables(tmpArr);
    tmpArr = tmpArr.filter((el) => el.type === "float");
    setFloatVars(tmpArr);
  }, [params, scopeVars, selectedParam, read_only]);

  const addScopeVar = (value) => {
    setScopeVars([...scopeVars, value]);
  };

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
            addScopeVar={addScopeVar}
          />
        );
      case "cond_float":
        return (
          <CondFloatStatement
            save={save}
            setEditOn={setEditOn}
            variables={floatVars}
          />
        );
      case "endc":
        return <EndCondStatement save={save} />;
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