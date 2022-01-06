/* eslint-disable no-loop-func */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { selectParameters } from "../agentsTabSlice";
import { selectBlockLvl, resetScope } from "./editorSlice";
import { selectMessageTypes } from "../../simulationSlice";
import {
  Container,
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  FormGroup,
  FormHelperText,
  Button,
  Alert,
  TextField,
} from "@mui/material";

import FloatParamEditor from "./FloatParamEditor";
import EnumParamEditor from "./EnumParamEditor";
import ListParamEditor from "./ListParamEditor";
import SendMessageEditor from "./SendMessageEditor";

const ActionEditor = (props) => {
  const { onClose, open, rcvMsg } = props;
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState("modify_self");
  const [selectedParam, setSelectedParam] = useState(-1);
  const [sndMsg, setSndMsg] = useState("");
  const [blockError, setBlockError] = useState(false);

  const [actionName, setActionName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [missingSets, setMissingSets] = useState([]);
  const [sendError, setSendError] = useState(false);

  const [statements, setStatements] = useState([]);
  const [actionOperations, setActionOperations] = useState([]);

  const params = useSelector(selectParameters);
  const block_lvl = useSelector(selectBlockLvl);
  const messages = useSelector(selectMessageTypes);

  const save = (statement, operation) => {
    setStatements([...statements, statement]);
    setActionOperations([...actionOperations, operation]);
  };

  const reset = () => {
    setActionType("modify_self")
    setSelectedParam(-1);
    setBlockError(false);
    setActionName("")
    setNameError(false);
    setStatements([]);
    setActionOperations([]);
    dispatch(resetScope);
  }

  // TODO: Add checking for empty instructions
  const saveAction = () => {
    let error_flag = false;
    setSendError(false);
    setNameError(false);
    setBlockError(false);
    if (block_lvl) {
      setBlockError(true);
      error_flag = true;
    }
    if (actionName === "" || !isNaN(actionName)) {
      setNameError(true);
      error_flag = true;
    }
    if( actionType === "send_msg" ){
      if(messages[sndMsg] === undefined){
        error_flag = true;
        return;
      }
      let toverify = messages[sndMsg].params.map((el, index) => el.name);
      var found = "";
      var indexFound = -1;
      actionOperations.forEach((el, index) => {
        if(el.includes("SET") && el.includes("SEND")){
          found = el.substring(el.indexOf(".") + 1, el.indexOf(","));
          indexFound = toverify.findIndex(el => el === found);
          if(indexFound !== -1){
            toverify.splice(indexFound, 1);
          }
        }
      })
      if(toverify.length !== 0){
        setMissingSets(toverify);
        setSendError(true);
        error_flag = true;
      }
    }
    if(error_flag) return;
    let parsedOpArr = [];
    let rawOpArr = [...actionOperations];
    while (rawOpArr.findIndex((el) => el.startsWith("DECL")) !== -1) {
      let index = rawOpArr.findIndex((el) => el.startsWith("DECL"));
      parsedOpArr.push(rawOpArr[index]);
      rawOpArr.splice(index, 1);
    }
    rawOpArr.forEach((el) => parsedOpArr.push(el));
    let code = "ACTION " + actionName + ',' + actionType + "\n";
    parsedOpArr.forEach((el) => (code += el + "\n"));
    code += "EACTION\n";
    let script = statements.join('\n');
    let ret_action = {
      name: actionName,
      code: code,
      script: script,
    }
    reset();
    onClose(ret_action);
  };

  const cancel = () => {
    reset();
    onClose(null);
  }

  const findUnmatchedIndexes = () => {
    let end_indexes = statements.reduce((arr, e, i) => {
      if (e.startsWith("End")) {
        arr.push(i);
      }
      return arr;
    }, []);
    let if_indexes = statements.reduce((arr, e, i) => {
      if (e.startsWith("If")) {
        arr.push(i);
      }
      return arr;
    }, []);
    var stack = [];
    var bad_ends = [];

    statements.forEach((el, index)=> {
      if(if_indexes.find(ind => ind === index) !== undefined){
        stack.push(index);
      }
      if(end_indexes.find(ind => ind === index) !== undefined){
        if(stack.length === 0){
          bad_ends.push(index);
        }
        stack.pop()
      }
    })
    return [...stack, ...bad_ends];
  };

  const StatementsList = (props) => {
    let indentLevel = 0;
    let indexes = [];
    if (blockError) {
      indexes = findUnmatchedIndexes();
    }
    return (
      <ul>
        {statements.map((value, index) => {
          let correct = 0;
          if (value.startsWith("If") || value.startsWith("While")) {
            indentLevel += 4;
            correct = -4;
          } else if (value.startsWith("End")) {
            indentLevel -= 4;
          }
          let color = "black";
          if (indexes.length > 0) {
            if (indexes.findIndex((el) => el === index) !== -1) {
              color = "red";
            }
          }
          return (
            <li
              style={{ marginLeft: Math.max(indentLevel + correct, 0) + "em", color: color }}
            >
              {" "}
              {value}{" "}
            </li>
          );
        })}
      </ul>
    );
  };

  const ModeDisplay = (props) => {
    if (props.param === undefined) return <></>;
    switch (props.param.type) {
      case "float":
        return <FloatParamEditor save={save} />;
      case "enum":
        return <EnumParamEditor save={save}  />;
      case "list":
        return <ListParamEditor save={save} />;
      default:
        return <></>;
    }
  };

  return (
    <Dialog
      fullScreen={true}
      onClose={onClose}
      open={open}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Container sx={{ padding: 3 }}>
        <DialogTitle> New action </DialogTitle>
        <FormGroup fullWidth>
          <TextField
            value={actionName}
            onChange={(e) => setActionName(e.target.value)}
            label="Action name"
          />
          <Select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            sx={{ marginTop: 1 }}
          >
            <MenuItem value={"modify_self"}> Modify Self </MenuItem>
            <MenuItem value={"send_msg"}> Send message </MenuItem>
          </Select>
          {actionType === "modify_self" ? (
            <>
              <Select
                value={selectedParam}
                onChange={(e) => setSelectedParam(e.target.value)}
                sx={{ marginTop: 1 }}
              >
                <MenuItem value={-1}>
                  <em>param...</em>
                </MenuItem>
                {params.map((param, index) => {
                  return <MenuItem value={index}> {param.name} </MenuItem>;
                })}
              </Select>
              <FormHelperText>
                {selectedParam === -1 ? "Select param to change" : ""}{" "}
              </FormHelperText>
              <StatementsList />
              <ModeDisplay param={params[selectedParam]} />
            </>
          ) : (
            <>
              <TextField
                value={sndMsg}
                onChange={(e) =>{ setSndMsg(e.target.value)}}
                label="Send message type"
                select
                sx={{marginTop: 1}}
              >
                {
                  messages.map((el, index) => {
                    return <MenuItem value={index}> {el.name}_{el.type} </MenuItem>;
                  })
                }
              </TextField>
              <StatementsList />
              <SendMessageEditor save={save} rcvMsg={rcvMsg} sndMsg={messages[sndMsg]} />
            </>
          )}
        </FormGroup>
        {blockError ? (
          <Alert severity="error" onClose={(e) => setBlockError(false)}>
            Error saving! There is a conditional or a loop without matching
            close block
          </Alert>
        ) : (
          <></>
        )}
        {nameError ? (
          <Alert severity="error" onClose={(e) => setNameError(false)}>
            Error saving! You need to set a name for the action, and it cannot
            be a number!{" "}
          </Alert>
        ) : (
          <></>
        )}
        {
          sendError ? (
            <Alert severity="error" onClose={(e) => setSendError(false)}>
              Error saving! Missing set values of sent message:
              {
                missingSets.map((el, index) => el + ", ")
              }
            </Alert>
          ) : (
            <></>
          )
        }

        <Button variant="contained" onClick={saveAction}>
          {" "}
          Save action{" "}
        </Button>
        <Button variant="outlined" onClick={cancel} sx={{margin: 2}}>
          Cancel
        </Button>
      </Container>
    </Dialog>
  );
};

ActionEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ActionEditor;
