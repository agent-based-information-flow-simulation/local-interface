import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";


import ExprStatement from "./statements/ExprStatement";
import DeclStatement from "./statements/DeclStatement";
import CondFloatStatement from "./statements/CondFloatStatement";
import CondEnumStatement from "./statements/CondEnumStatement";
import EndBlockStatement from "./statements/EndBlockStatement";
import WhileEnumStatement from "./statements/WhileEnumStatement";
import WhileFloatStatement from "./statements/WhileFloatStatement";
import AssignFloatStatement from "./statements/AssignFloatStatement";
import CondListStatement from "./statements/CondListStatement";
import AddElemStatement from "./statements/AddElemStatement";
import RemElemStatement from "./statements/RemElemStatement";
import RemNElemsStatement from "./statements/RemNElemsStatement";
import ClearListStatement from "./statements/ClearListStatement";
import AssignEnumStatement from "./statements/AssignEnumStatement";
import SendStatement from "./statements/SendStatement";
import { SubsetListStatement } from "./statements/SubsetListStatement";

import {
  selectParameters,
} from "../agentsTabSlice";

import {
  selectScopeVars
} from "./editorSlice";

const read_only = [
  { name: "connCount", type: "float" },
  { name: "msgRCount", type: "float" },
  { name: "msgSCount", type: "float" },
];

export const StatementDisplay = (props) => {
  const { save, editOn, setEditOn, statementType, sndMsg, rcvMsg} = props;

  const params = useSelector(selectParameters);
  const scopeVars = useSelector(selectScopeVars);

  const [mutFloats, setMutFloats ] = useState([]);
  const [floats, setFloats] = useState([]);
  const [enums, setEnums] = useState([]);
  const [connLists, setConnLists] = useState([])
  const [msgLists, setMsgLists] = useState([])
  const [lists, setLists] = useState([])
  const rcvJid = {name: "RCV.sender", type: "jid"};
  const rcvVar = {name: "RCV", type: "msg"};
  const sendVar = {name: "SEND", type: "msg"};
  const connectionsVar = {name: "Connections", type: "list", mode: "conn"}


  useEffect(()=>{
    let toSetMutFloats = [...scopeVars];
    if(sndMsg){
      let tmpArr = sndMsg.params.map((el,index)=>{
        return {
          name: "SEND." + el.name,
          type: el.type,
        };
      });
      tmpArr = tmpArr.filter((el) => el.type === "float");
      toSetMutFloats = [...toSetMutFloats, ...tmpArr];

    }else{
      let tmpArr = params.filter((el) => el.type === "float");
      toSetMutFloats = [...toSetMutFloats, ...tmpArr];
    }
    setMutFloats(toSetMutFloats);
    let toSetFloats = [...toSetMutFloats, ...read_only];
    if(rcvMsg){
      let rcvParams = rcvMsg.params.map((el, index) => {
        return {
          name: "RCV." + el.name,
          type: el.type,
        }
      })
      rcvParams = rcvParams.filter((el) => el.type === "float");
      toSetFloats = [...toSetFloats, ...rcvParams];
    }
    setFloats(toSetFloats);
    let tmpEnums = params.filter((el) => el.type === "enum");
    setEnums(tmpEnums);
    // first lets get lists:
    let lists = params.filter((el) => el.type === "list");
    lists = [...lists, connectionsVar]
    setLists(lists);
    //then list subtypes
    let tmpArr = [];
    tmpArr = lists.filter((el) => el.mode === "conn");
    setConnLists(tmpArr);
    tmpArr = lists.filter((el) => el.mode === "msg");
    setMsgLists(tmpArr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeVars])

  if (!editOn) return <></>;
  switch (statementType) {
    case "subset":
      return (
        <SubsetListStatement
          save={save}
          setEditOn={setEditOn}
          lhsCandidates={lists}
          rhsCandidates={lists}
          numCandidates={floats}
        />
      )
    case "send":
      return (
        <SendStatement
          save={save}
          setEditOn={setEditOn}
          connLists={[...connLists, rcvJid]}
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
    case "add_element":
      return (
        <AddElemStatement
          save={save}
          setEditOn={setEditOn}
          lhsCandidates={lists}
          rhsCandidates={[sendVar, rcvVar, rcvJid]}
        />
      );
    case "rem_element":
      return (
        <RemElemStatement
          save={save}
          setEditOn={setEditOn}
          lhsCandidates={lists}
          rhsCandidates={[sendVar, rcvVar, rcvJid]}
        />
      );
    case "rem_n_el":
      return (
        <RemNElemsStatement
          save={save}
          setEditOn={setEditOn}
          variables={lists}
        />
      );
    case "clr_list":
      return (
        <ClearListStatement
          save={save}
          setEditOn={setEditOn}
          variables={lists}
        />
      );
    case "cond_list":
      return (
        <CondListStatement
          save={save}
          setEditOn={setEditOn}
          rhsCandidates={lists}
          lhsCandidates={[sendVar, rcvVar, rcvJid]}
        />
      );
    case "assign_float":
      return (
        <AssignFloatStatement
          save={save}
          setEditOn={setEditOn}
          lhsCandidates={mutFloats}
          rhsCandidates={floats}
        />
      );
    case "expr":
      return (
        <ExprStatement
          save={save}
          setEditOn={setEditOn}
          lhsCandidates={mutFloats}
          rhsCandidates={floats}
        />
      );
    case "decl":
      return (
        <DeclStatement
          save={save}
          setEditOn={setEditOn}
          variables={floats}
        />
      );
    case "cond_float":
      return (
        <CondFloatStatement
          save={save}
          setEditOn={setEditOn}
          variables={floats}
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
    case "endb":
      return <EndBlockStatement save={save} />;
    default:
      return <></>;
  }
};

export default StatementDisplay;
