import React, {useState} from "react"
import {
  Stack,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material"

import AddCircleIcon from "@mui/icons-material/AddCircle";
import InlineText from "../InlineText"

export const ClearListStatement = (props) => {
  const {save, setEditOn, variables} = props;
  const [curArg, setCurArg] = useState("");

  const addClearStatement = () => {
    let statement = "Clear " + curArg;
    let operation = "CLR     " + curArg;
    save(statement, operation);
    setEditOn(false);
  }

  return (
    <Stack direction="row">
      <InlineText text="Clear list" />
      <Select
        value={curArg}
        onChange={(e) => setCurArg(e.target.value)}
      >
        {
          variables.map((el, index) => {
            return <MenuItem value={el.name}> {el.name} ({el.type}) </MenuItem>;
          })
        }
      </Select>
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addClearStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
}

export default ClearListStatement;
