import React, {useState } from 'react'

import {
  Stack,
  Select,
  MenuItem,
  IconButton,
  TextField,
} from "@mui/material"
import { AddCircleIcon } from "@mui/icons-material"
import InlineText from '../InlineText'

export const RemNElemsStatement = (props) => {
  const {save, setEditOn, variables } = props;
  const [curLhs, setCurLhs] = useState(variables[0] === undefined ? "" : variables[0].name);
  const [curRhs, setCurRhs] = useState("");

  const addRemStatement = () => {
    if(!parseFloat(curRhs)){
      let statement = "Remove " + curRhs + " elements from" + curLhs;
      let operation = "REMEN   " + curLhs + "," + curRhs;
      save(statement, operation);
      setEditOn(false);
    }
    // TODO add error display

  }

  return (
    <Stack direction="row">
        <InlineText text="To "/>
        <Select
          value={curLhs}
          onChange = {(e) => setCurLhs(e.target.value)}
        >
        {
          variables.map((el, index) => {
            if(el === undefined) return <></>;
            return <MenuItem value={el.name}> {el.name} </MenuItem>;
          })
        }
        </Select>
        <InlineText text="remove"/>
        <TextField
          value = {curRhs}
          onChange = {(e) => setCurRhs(e.target.value)}
          type="number"
        />
        <IconButton sx={{ p: "10px" }} color="primary" onClick={addRemStatement}>
          <AddCircleIcon sx={{ fontSize: "30px" }} />
        </IconButton>
    </Stack>

  );
}

export default RemNElemsStatement;