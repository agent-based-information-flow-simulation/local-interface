import React, { useState } from "react"

import {
  Stack,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle"
import InlineText from "../InlineText";

export const SendStatement = (props) => {
  const {save, setEditOn, connLists} = props;
  const [receiver, setReceiver] = useState("");

  const addSendStatement = () => {
    let statement = "Send to " + receiver;
    let operation = "SEND    " + receiver;
    save(statement, operation);
    setEditOn(false);
  }

  return (
    <Stack direction="row">
      <InlineText text="Send the message to: "/>
      <Select
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      >
        {
          connLists.map((el, index)=>{
            return <MenuItem value={el.name}> {el.name} </MenuItem>;
          })
        }
      </Select>
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addSendStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>

    </Stack>
  )
}

export default SendStatement;