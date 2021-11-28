import React from "react";

import { Select, MenuItem, FormHelperText, Stack, Box, Button, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const FloatParamEditor = (props) => {
  return (
    <Stack direction="row" sx={{display: "flex"}}>
      <Box sx={{ width: "100%"}}>
        <Select sx={{ width: "100%" }}>
          <MenuItem value={"expr"}> Expression </MenuItem>
          <MenuItem value={"cond"}> Conditional </MenuItem>
          <MenuItem value={"end_cond"}> End Conditional </MenuItem>
        </Select>
        <FormHelperText> Choose statement type </FormHelperText>
      </Box>
      <IconButton sx={{width: 60, p: "10px"}} color="primary">
        <AddCircleIcon sx={{fontSize: "45px"}}/>
      </IconButton>
    </Stack>
  );
};

export default FloatParamEditor;
