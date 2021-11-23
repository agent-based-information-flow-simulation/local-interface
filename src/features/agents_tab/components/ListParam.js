import React, { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material"

export const ListParam = () => {
  const [listType, setListType] = useState("conns");

  return (
    <FormControl fullWidth xd={{ marginTop: 2}}>
      <Select
        value={listType}
        onChange={(e) => setListType(e.target.value)}
      >
        <MenuItem value={"conns"}> Connections </MenuItem>
        <MenuItem value={"msgs"}> Messages </MenuItem>
      </Select>
    </FormControl>
  );
}

export default ListParam;