import React, {useState, useEffect } from 'react'

import {
  Stack,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material"
import { AddCircleIcon } from "@mui/icons-material"
import InlineText from '../InlineText'

export const AddElemStatement = (props) => {
  const {save, setEditOn, lhsCandidates, rhsCandidates} = props;
  const [curLhs, setCurLhs] = useState(lhsCandidates[0] === undefined ? "" : lhsCandidates[0].name);
  const [curRhs, setCurRhs] = useState("");
  const [rhsOptions, setRhsOptions] = useState([]);

  useEffect(()=>{
    let found = lhsCandidates.find((el) => el.name === curLhs);
    if(found !== undefined){
      let tmpArr = [];
      switch(found.type){
        case "conn":
          tmpArr = rhsCandidates.filter((el) => el.type === "jid");
          setRhsOptions(tmpArr);
          break;
        case "msg":
          tmpArr = rhsCandidates.filter((el) => el.type === "msg");
          setRhsOptions(tmpArr);
          break;
        default:
          break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curLhs]);

  const addAddStatement = () => {
    //both selects no need for validation
    let statement = "Add " + curRhs + "to" + curLhs;
    let operation = "ADDE    " + curLhs + "," + curRhs;
    save(statement, operation);
    setEditOn(false);
  }

  return (
    <Stack direction="row">
        <InlineText text="To "/>
        <Select
          value={curLhs}
          onChange = {(e) => setCurLhs(e.target.value)}
        >
        {
          lhsCandidates.map((el, index) => {
            if(el === undefined) return <></>;
            return <MenuItem value={el.name}> {el.name} </MenuItem>;
          })
        }
        </Select>
        <InlineText text="add"/>
        <Select
          value={curRhs}
          onChange = {(e) => setCurRhs(e.target.value)}
        >
          {
            rhsOptions.map((el, index) => {
              if(el === undefined) return <></>;
              return <MenuItem value={el.name}> {el.name} </MenuItem>
            })
          }
        </Select>
        <IconButton sx={{ p: "10px" }} color="primary" onClick={addAddStatement}>
          <AddCircleIcon sx={{ fontSize: "30px" }} />
        </IconButton>
    </Stack>

  );
}

export default AddElemStatement;