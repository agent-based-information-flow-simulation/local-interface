import React, { useState } from "react";
import {useDispatch} from "react-redux"
import { FormControl, Select, MenuItem } from "@mui/material"

import {
  setCurrentParamData
} from "../agentsTabSlice";


export const ListParam = () => {
  const [listType, setListType] = useState("conns");
  const dispatch = useDispatch()

  const handleTypeChange = (value) => {
    setListType(value);
    updateParamData();

  }
  const updateParamData = () => {
    let paramData = {};
    paramData.type = listType;
    dispatch(setCurrentParamData(paramData))
  }

  return (
    <FormControl fullWidth xd={{ marginTop: 2}}>
      <Select
        value={listType}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <MenuItem value={"conns"}> Connections </MenuItem>
        <MenuItem value={"msgs"}> Messages </MenuItem>
      </Select>
    </FormControl>
  );
}

export default ListParam;