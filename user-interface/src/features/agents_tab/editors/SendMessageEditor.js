import React, { useState } from "react";

import {
  Select,
  MenuItem,
  Stack,
  Box,
  IconButton,
  FormHelperText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StatementDisplay from "./StatementDisplay";

export const SendMessageEditor = (props) => {
  const { save, rcvMsg, sndMsg } = props;

  const [statementType, setStatementType] = useState("assign_float");
  const [editOn, setEditOn] = useState(false);

  return (
    <>
      <Stack direction="row" sx={{ display: "flex" }}>
        <Box sx={{ width: "100%" }}>
          <Select
            sx={{ width: "100%" }}
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
          >
            <MenuItem value={"assign_float"}> Assignment (number) </MenuItem>
            <MenuItem value={"expr"}> Math Expression </MenuItem>
            <MenuItem value={"decl"}> Declaration </MenuItem>
            <MenuItem value={"cond_float"}> Conditional (number) </MenuItem>
            <MenuItem value={"cond_enum"}> Conditional (enum) </MenuItem>
            <MenuItem value={"cond_list"}> Conditional (list) </MenuItem>
            <MenuItem value={"while_float"}>
              {" "}
              Do while Condition (number){" "}
            </MenuItem>
            <MenuItem value={"while_enum"}>
              {" "}
              Do while Condition (enum){" "}
            </MenuItem>
            <MenuItem value={"endb"}> End Block (condition/while) </MenuItem>
            <MenuItem value={"send"}> Send Message to </MenuItem>
          </Select>
          <FormHelperText> Choose statement type </FormHelperText>
        </Box>
        <IconButton
          sx={{ width: 60, p: "10px" }}
          color="primary"
          onClick={(e) => setEditOn(true)}
          disabled={editOn}
        >
          <AddCircleIcon sx={{ fontSize: "45px" }} />
        </IconButton>
      </Stack>
      <StatementDisplay
        save={save}
        editOn={editOn}
        setEditOn={setEditOn}
        statementType={statementType}
        sndMsg={sndMsg}
        rcvMsg={rcvMsg}
      />
    </>
  );
};

export default SendMessageEditor;
