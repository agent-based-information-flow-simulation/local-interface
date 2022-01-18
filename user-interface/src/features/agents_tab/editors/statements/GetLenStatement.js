import React, {useState} from 'react';
import {
  Stack,
  Select,
  MenuItem,
  IconButton
} from "@mui/material"

import AddCircleIcon from "@mui/icons-material/AddCircle"
import InlineText from '../InlineText';


export const GetLenStatement = (props) => {

  const { save, setEditOn, lhsCandidates, rhsCandidates} = props;
  const [curLhs, setCurLhs] = useState("");
  const [curRhs, setCurRhs] = useState("");

  const addLenStatement = () => {
    if(curLhs !== "" && curRhs !== ""){
      let statement = "Let " +curLhs + "= len(" + curRhs + ")";
      let operation = "LEN     " + curLhs + "," + curRhs;
      save(statement, operation);
      setEditOn(false);
    }
  }

  return(
    <Stack direction="row">
      <InlineText text="Let " />
      <Select
        value={curLhs}
        onChange={(e) => setCurLhs(e.target.value)}
      >
        {
          lhsCandidates.map((el, index) => {
            return <MenuItem value={el.name}> {el.name} ({el.type}) </MenuItem>
          })
        }
      </Select>
      <InlineText text="be the length of " />
      <Select
        value={curRhs}
        onChange={(e) => setCurRhs(e.target.value)}
      >
        {
          rhsCandidates.map((el, index) => {
            return <MenuItem value={el.name}> {el.name} ({el.type}) </MenuItem>
          })
        }
      </Select>
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addLenStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>



    </Stack>
  );
}
export default GetLenStatement;