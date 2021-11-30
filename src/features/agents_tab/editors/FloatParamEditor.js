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

import ExprStatement from "./statements/ExprStatement";
import DeclStatement from "./statements/DeclStatement";
import CondFloatStatement from "./statements/CondFloatStatement";
import CondEnumStatement from "./statements/CondEnumStatement";
import EndCondStatement from "./statements/EndCondStatement";

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
  const [enumVars, setEnumVars] = useState([]);

  useEffect(() => {
    console.log("using effect:", scopeVars);
    let tmpArr = [...scopeVars, selectedParam];
    setExprLhs(tmpArr);
    tmpArr = params.filter((el) => el.type === "float");
    tmpArr = [...tmpArr, ...scopeVars, ...read_only];
    setExprRhs(tmpArr);
    tmpArr = [...params, ...scopeVars, ...read_only];
    setVariables(tmpArr);
    let tmpArrFloat = tmpArr.filter((el) => el.type === "float");
    setFloatVars(tmpArrFloat);
    let tmpArrEnum = tmpArr.filter((el) => el.type === "enum");
    setEnumVars(tmpArrEnum);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeVars, selectedParam]);

  const addScopeVar = (value) => {
    console.log(value)
    let newArr = [...scopeVars];
    newArr.push(value);
    console.log(newArr);
    setScopeVars(newArr);
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
      case "cond_enum":
        return (
          <CondEnumStatement
            save={save}
            setEditOn={setEditOn}
            variables={enumVars}
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
