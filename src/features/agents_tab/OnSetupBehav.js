import React, {useState } from "react";
import {
  FormControl, TextField, Button
} from "@mui/material"

import ActionEditor from './editors/ActionEditor';

export const OnSetupBehav = (props) => {

  const [behavName, setBehavName] = useState("")
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const onActionDialogClose = () =>{
    setActionDialogOpen(false);
  }


  return (
    <>
    <ActionEditor open={actionDialogOpen} onClose={onActionDialogClose}/>
    <FormControl fullWidth>
      <TextField
        variant="outlined"
        label="Name"
        id="behav_name"
        value={behavName}
        onChange={(e)=>setBehavName(e.target.value)}
      />
    </FormControl>
    <Button onClick={(e)=>setActionDialogOpen(true)}> Add Action </Button>
    </>
  );
}