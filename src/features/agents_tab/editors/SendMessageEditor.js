import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Select, MenuItem, Stack, Box, IconButton, FormHelperText } from "@mui/material";
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

import {
  selectMessageTypes
} from "../../simulationSlice"
import { SendStatement } from "./statements/SendStatement";

export const SendMessageEditor = (props) => {
  const { save, rcvMsg, sndMsg } = props;

  const read_only = [
    { name: "connCount", type: "float" },
    { name: "msgRCount", type: "float" },
    { name: "msgSCount", type: "float" },
  ];

  const params = useSelector(selectParameters);
  const scopeVars = useSelector(selectScopeVars);
  const messages = useSelector(selectMessageTypes);

  const [statementType, setStatementType] = useState("assign_float");
  const [editOn, setEditOn] = useState(false);

  const [mutFloats, setMutFloats ] = useState([]);
  const [floats, setFloats] = useState([]);
  const [enums, setEnums] = useState([]);
  const [connLists, setConnLists] = useState([])
  const [msgLists, setMsgLists] = useState([])
  const [lists, setLists] = useState([])
  const [paramsToSet, setParamsToSet] = useState([])
  const [readOnly, setReadOnly] = useState([...read_only]);
  const rcvJid = {name: "RCV.sender", type: "jid"};
  const rcvVar = {name: "RCV", type: "msg"};
  const connectionsVar = {name: "Connections", type: "list", mode: "conn"}


  useEffect(()=>{
    // populate the arrays
    // generate params to set
    if(sndMsg){
      console.log("snd", sndMsg)
      console.log("rcv", rcvMsg)

    let tmpArr = sndMsg.params.map((el,index)=>{
      return {
        name: "SEND." + el.name,
        type: el.type,
      };
    })
    setParamsToSet(tmpArr);
    // while sending msg all mut floats are scopeVars
    setMutFloats(scopeVars);
    // floats are read only, scopeVars, float params and recv msg params
    let floatParams = params.filter((el) => el.type === "float");
    if(rcvMsg !== undefined){
      // add rcv params to read only
      let rcvParams = rcvMsg.params.map((el, index) => {
        return {
          name: "RCV." + el.name,
          type: el.type,
        }
      })
      setReadOnly([...read_only, ...rcvParams]);
      floatParams = [...floatParams, ...rcvParams]
    }
    tmpArr = [...floatParams, ...read_only, ...scopeVars];
    setFloats(tmpArr);
    // enums are only enum params
    tmpArr = params.filter((el) => el.type === "enum")
    setEnums(tmpArr);
    // first lets get lists:
    let lists = params.filter((el) => el.type === "list");
    lists = [...lists, connectionsVar]
    setLists(lists);
    //then list subtypes
    tmpArr = lists.filter((el) => el.mode === "conn");
    setConnLists(tmpArr);
    tmpArr = lists.filter((el) => el.mode === "msg");
    setMsgLists(tmpArr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [scopeVars])

  const ModeDisplay = () => {
    if (!editOn) return <></>;

    switch (statementType) {
      case "assign_float":
        return (
          <AssignFloatStatement
            save={save}
            setEditOn={setEditOn}
            lhsCandidates={[...mutFloats, ...paramsToSet]} // assign takes a mutFloat or send param to set
            rhsCandidates={floats} //any float is valid for rhs assignment
          />
        );
      case "assign_enum":
        return (
          <AssignEnumStatement
            save={save}
            setEditOn={setEditOn}
            variables={enums}
          />
        );
      case "expr":
        return (
          <ExprStatement
            save={save}
            setEditOn={setEditOn}
            lhsCandidates={mutFloats} // mutable floats can change value
            rhsCandidates={floats} // to any float
          />
        );
      case "decl":
        return (
          <DeclStatement
            save={save}
            setEditOn={setEditOn}
            variables={floats} // any float can be assigned at declaration
          />
        );
      case "cond_float":
        return (
          <CondFloatStatement
            save={save}
            setEditOn={setEditOn}
            variables={floats} // logical innit?
          />
        );
      case "cond_enum":
        return (
          <CondEnumStatement
            save={save}
            setEditOn={setEditOn}
            variables={enums}
          />
        );
      case "while_float":
        return (
          <WhileFloatStatement
            save={save}
            setEditOn={setEditOn}
            variables={floats}
          />
        );
      case "while_enum":
        return (
          <WhileEnumStatement
            save={save}
            setEditOn={setEditOn}
            variables={enums}
          />
        );
      case "cond_list":
        return (
          <CondListStatement
            save={save}
            setEditOn={setEditOn}
            rhsCandidates={lists} //any list gucci
            lhsCandidates={[rcvVar, rcvJid]} // only two options here
          />
        )
      case "endb":
        return <EndBlockStatement save={save} setEditOn={setEditOn}/>;
      case "send":
        return <SendStatement save={save} setEditOn={setEditOn}
          connLists={[...connLists, rcvJid]}
        />;
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
          <MenuItem value={"assign_float"}> Assignment (number) </MenuItem>
          <MenuItem value={"expr"}> Expression </MenuItem>
          <MenuItem value={"decl"}> Declaration </MenuItem>
          <MenuItem value={"cond_float"}> Conditional (number) </MenuItem>
          <MenuItem value={"cond_enum"}> Conditional (enum) </MenuItem>
          <MenuItem value={"cond_list"}> Conditional (list) </MenuItem>
          <MenuItem value={"while_float"}> Do while Condition (number) </MenuItem>
          <MenuItem value={"while_enum"}> Do while Condition (enum) </MenuItem>
          <MenuItem value={"endb"}> End Block (condition/while) </MenuItem>
          <MenuItem value={"send"}> Send Message to </MenuItem>
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

export default SendMessageEditor;