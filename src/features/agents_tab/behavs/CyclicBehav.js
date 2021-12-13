import React, { useState } from "react";
import {
  FormControl, TextField, Button, InputAdornment
} from "@mui/material"

import ActionEditor from '../editors/ActionEditor';
import { useDispatch, useSelector } from "react-redux";
import { addAction, resetScope, selectActions } from "../editors/editorSlice";
import { addBehav } from "../agentsTabSlice";
import { validateQualifiedName } from "../../../app/utils";

export const CyclicBehav = (props) => {
  const {onClose} = props;
  const [behavName, setBehavName] = useState("")
  const [cycle, setCycle] = useState(0);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [actionError, setActionError] = useState(false);
  const dispatch = useDispatch();
  const actions = useSelector(selectActions);
  const onActionDialogClose = (action) =>{
    if(action !== null){
      dispatch(addAction(action));
    }
    dispatch(resetScope);
    setActionDialogOpen(false);
  }

  const saveBehaviour = () => {
    let err_flag = false;
    if(!validateQualifiedName(behavName)){
      err_flag = true;
      setNameError(true);
    }
    if(actions.length === 0){
      err_flag = true;
      setActionError(true);
    }
    if(!err_flag){
      let code = "BEHAV " + behavName + ", cyclic," + cycle +"\n";
      actions.forEach(el => code+=el.code);
      code += "EBEHAV\n";
      let behav = {
        name: behavName,
        actions: [...actions],
        code: code,
      }
      dispatch(addBehav(behav));
      onClose();
    }
  }

  return (
    <>
    <ActionEditor open={actionDialogOpen} onClose={onActionDialogClose} />

    <FormControl fullWidth>
      <TextField
        variant="outlined"
        label="Name"
        id="behav_name"
        value={behavName}
        onChange={(e)=>setBehavName(e.target.value)}
      />
      <TextField
        sx={{marginTop: 2}}
        label="Delay"
        id="behav_delay"
        type="number"
        value={cycle}
        onChange={(e)=>setCycle(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">s</InputAdornment>,
        }}
      />
    </FormControl>
    <p><b>Actions: </b></p>
    {
      actions.map((el,index) => {
        return <p> {el.name} </p>;
      })
    }
    <Button onClick={(e)=>setActionDialogOpen(true)}> Add Action </Button>
    <Button onClick={saveBehaviour}> Add Behaviour </Button>
    </>
  );
}

export default CyclicBehav;