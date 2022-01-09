import React, { useState } from "react";

import { Stack, Select, MenuItem, IconButton, Autocomplete, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InlineText from "../InlineText";

export const SubsetListStatement = (props) => {
  const { save, setEditOn, lhsCandidates, rhsCandidates, numCandidates} = props;
  const [curLhs, setCurLhs] = useState("");
  const [curRhs, setCurRhs] = useState("");
  const [curNum, setCurNum] = useState(1);
  const [numError, setNumError] = useState(false);
  // TODO add error display for mismatched types
  // eslint-disable-next-line no-unused-vars
  const [typeError, setTypeError] = useState(false);


  const addSubsStatement = () => {
    //validate number
    let err_flag = false;
    if(isNaN(parseInt(curNum))){
      if(numCandidates.find(curNum) === undefined){
        err_flag = true;
        setNumError(true);
      }
    }else if(parseInt(curNum) < 1){
      err_flag = true;
      setNumError(true);
    }
    //validate types
    const lhs = lhsCandidates.find((el) => el.name === curLhs)
    const rhs = rhsCandidates.find((el) => el.name === curRhs)
    if(lhs !== undefined && rhs !== undefined){
      if(lhs.mode !== rhs.mode){
        err_flag = true;
        setTypeError(true);
      }

    }else{
      err_flag = true;
    }


    if(!err_flag){
      let statement = "Let " + curLhs + " contain " + curNum + " elements of " + curRhs;
      let operation = "SUBS    " + curLhs + "," + curRhs + "," + curNum;
      save(statement, operation);
      setEditOn(false);
      setNumError(false);
    }
  }

  return (
    <Stack direction="row">
      <InlineText text="Let " />
      <Select value={curLhs} onChange={(e) => setCurLhs(e.target.value)}>
        {lhsCandidates.map((el, index) => {
          if (el === undefined) return <></>;
          return <MenuItem value={el.name}> {el.name} ({el.type}) </MenuItem>;
        })}
      </Select>
      <InlineText text="contain" />
      <Autocomplete
        options={numCandidates.map((el, index)=>el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: "200px" }}
        value={curNum}
        inputValue={curNum}
        onInputChange={(e, value) => setCurNum(value)}
        error={numError}
      />
      <InlineText text="elements of" />
      <Select
        value={curRhs}
        onChange = {(e) => setCurRhs(e.target.value)}
      >
        {
          rhsCandidates.map((el, index) => {
            if(el === undefined) return <></>;
            return <MenuItem value={el.name}> {el.name} ({el.type}) </MenuItem>
          })
        }
      </Select>
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addSubsStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
};
