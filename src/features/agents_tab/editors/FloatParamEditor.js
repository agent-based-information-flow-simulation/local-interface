import React, {useState} from "react";
import {useSelector} from "react-redux";
import { Select, MenuItem, FormHelperText, Stack, Box, Button, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  selectParameters,
} from "../agentsTabSlice";

export const FloatParamEditor = (props) => {

  const [editOn, setEditOn] = useState(false);
  const [statementType, setStatementType] = useState("expr");
  const params = useSelector(selectParameters);

  const ModeDisplay = () =>{
    if(!editOn) return <></>;

    switch(statementType){
      case "expr":
        break;
      case "decl":
        break;
      case "cond":
        break;
      case "endc":
        break;
      default:
        return <></>
    }


  }

  return (
    <Stack direction="row" sx={{display: "flex"}}>
      <Box sx={{ width: "100%"}}>
        <Select sx={{ width: "100%" }}
          value={statementType}
          onChange={(e) => setStatementType(e.target.value)}
        >
          <MenuItem value={"expr"}> Expression </MenuItem>
          <MenuItem value={"decl"}> Declaration </MenuItem>
          <MenuItem value={"cond"}> Conditional </MenuItem>
          <MenuItem value={"endc"}> End Conditional </MenuItem>
        </Select>
        <FormHelperText> Choose statement type </FormHelperText>
      </Box>
      <IconButton sx={{width: 60, p: "10px"}} color="primary">
        <AddCircleIcon sx={{fontSize: "45px"}}/>
      </IconButton>
      <ModeDisplay />
    </Stack>
  );
};

export default FloatParamEditor;
