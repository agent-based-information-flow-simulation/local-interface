import React, {useState} from "react"

import {
  Stack,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material"

import AddCircleIcon from "@mui/icons-material"

const ListCondOps = [
  { opcode: "IN  ", label: "in"},
  { opcode: "NIN ", label: "not in"},
]

export const CondListStatement = (props) => {
  const {save, setEditOn, lhsCandidates, rhsCandidates} = props;

  const [curLhs, setCurLhs] = useState("")
  const [curRhs, setCurRhs] = useState("")
  const [curOpCode, setCurOpCode] = useState(ListCondOps[0].opcode);

  const addCondStatement = () => {
    if(curLhs !== "" && curRhs !== ""){
      let op = ListCondOps.find(el => el.opcode === curOpCode)
      let statement = "If " + curLhs + " " + op.label + " " + curRhs;
      let operation = op.opcode + curRhs + "," + curLhs;
      save(statement, operation);
      setEditOn(false);
    }
  }

  return (
    <Stack direction="row">
      <Select
        value={curLhs}
        onChange={(e) => setCurLhs(e.target.value)}
      >
        {
          lhsCandidates.map((el,index) =>{
            return <MenuItem value={el.name}>  {el.name} </MenuItem>
          })
        }


      </Select>
      <Select value={curOpCode} onChange={(e) => setCurOpCode(e.target.value)}>
        {ListCondOps.map((op, index) => {
          return <MenuItem value={op.opcode}> {op.label} </MenuItem>;
        })}
      </Select>
      <Select
        value={curRhs}
        onChange={(e) => setCurRhs(e.target.value)}
      >
        {
          rhsCandidates.map((el,index) =>{
            return <MenuItem value={el.name}>  {el.name} </MenuItem>
          })
        }

      </Select>
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addCondStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>

    </Stack>
  );


}

export default CondListStatement;