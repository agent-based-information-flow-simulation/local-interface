import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {
  Stack,
  Box,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle";

import ExprStatement from "./statements/ExprStatement";
import DeclStatement from "./statements/DeclStatement";
import CondFloatStatement from "./statements/CondFloatStatement";
import CondEnumStatement from "./statements/CondEnumStatement";
import EndBlockStatement from "./statements/EndBlockStatement";
import WhileEnumStatement from "./statements/WhileEnumStatement";
import WhileFloatStatement from "./statements/WhileFloatStatement";
import AssignFloatStatement from "./statements/AssignFloatStatement";
import AssignEnumStatement from "./statements/AssignEnumStatement";
import CondListStatement from "./statements/CondListStatement";

import {
  selectParameters,
} from "../agentsTabSlice";

import {
  selectScopeVars
} from "./editorSlice";

export const EnumParamEditor = (props) => {

  const read_only = [
    { name: "connCount", type: "float" },
    { name: "msgRCount", type: "float" },
    { name: "msgSCount", type: "float" },
  ];

  const {save, selectedParam } = props;
  const [editOn, setEditOn] = useState(false);

  const params = useSelector(selectParameters);
  const scopeVars = useSelector(selectScopeVars);

  const [exprLhs, setExprLhs] = useState([]);
  const [exprRhs, setExprRhs] = useState([]);
  const [variables, setVariables] = useState([]);
  const [floatVars, setFloatVars] = useState([]);
  const [enumVars, setEnumVars] = useState([]);

  useEffect(() => {
    let tmpArr = [...scopeVars, selectedParam]; //first we set the possible floats as LHS for expression
    setExprLhs(tmpArr);
    tmpArr = params.filter((el) => el.type === "float");
    tmpArr = [...tmpArr, ...scopeVars, ...read_only]; //then we add read_only to this array for RHS for expression
    setExprRhs(tmpArr);
    tmpArr = [...params, ...scopeVars, ...read_only]; //for all other we give a posibility of selecting any variable or param
    setVariables(tmpArr);
    let tmpArrFloat = tmpArr.filter((el) => el.type === "float");
    setFloatVars(tmpArrFloat);
    let tmpArrEnum = tmpArr.filter((el) => el.type === "enum");
    setEnumVars(tmpArrEnum);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeVars, selectedParam]);



  const ModeDisplay = () => {
    if (!editOn) return <></>;

    switch (statementType) {
      case "assign_float":
        return (
          <AssignFloatStatement
            save={save}
            setEditOn={setEditOn}
            lhsCandidates={exprLhs}
            rhsCandidates={exprRhs}
          />
        );
      case "assign_enum":
        return (
          <AssignEnumStatement
            save={save}
            setEditOn={setEditOn}
            variables={enumVars}
          />
        );
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
      case "while_float":
        return (
          <WhileFloatStatement
            save={save}
            setEditOn={setEditOn}
            variables={floatVars}
          />
        );
      case "while_enum":
        return (
          <WhileEnumStatement
            save={save}
            setEditOn={setEditOn}
            variables={enumVars}
          />
        );
      case "cond_list":
        return (
          <CondListStatement
            save={save}
            setEditOn={setEditOn}
            rhsCandidates={[selectedParam]} //tmp
            lhsCandidates={variables} //tmp
          />
        )
      case "endb":
        return <EndBlockStatement save={save} />;
      default:
        return <></>;
    }
  };


  const [statementType, setStatementType] = useState("expr");
  return (
    <>
      <Stack direction="row" sx={{ display: "flex" }}>
        <Box sx={{ width: "100%" }}>
          <Select
            sx={{ width: "100%" }}
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
          >
            <MenuItem value={"assign_float"}> Assignment (number) </MenuItem>
            <MenuItem value={"assign_enum"}> Assignment (enum) </MenuItem>
            <MenuItem value={"expr"}> Expression </MenuItem>
            <MenuItem value={"decl"}> Declaration </MenuItem>
            <MenuItem value={"cond_float"}> Conditional (number) </MenuItem>
            <MenuItem value={"cond_enum"}> Conditional (enum) </MenuItem>
            <MenuItem value={"cond_list"}> Conditional (list) </MenuItem>
            <MenuItem value={"while_float"}> Do while Condition (number) </MenuItem>
            <MenuItem value={"while_enum"}> Do while Condition (enum) </MenuItem>
            <MenuItem value={"endb"}> End Block (condition/while) </MenuItem>
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
}

export default EnumParamEditor;