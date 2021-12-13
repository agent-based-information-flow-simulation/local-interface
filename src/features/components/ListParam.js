import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, TextField, Button } from "@mui/material"
import PropTypes from "prop-types"

export const ListParam = (props) => {
  const {save} = props
  const [listType, setListType] = useState("conns");
  const [paramName, setParamName] = useState("");
  const [paramData, setParamData] = useState({})

  const handleTypeChange = (value) => {
    setListType(value);
    updateParamData();
  }

  const updateParamData = () => {
    let newParamData = {};
    newParamData.type = listType;
    newParamData.name = paramName;
    setParamData(newParamData);
  }

  // I have no idea why this works
  useEffect(()=>{
    updateParamData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramName, listType]);

  return (
    <>
    <FormControl fullWidth xd={{ marginTop: 2}}>
        <TextField
          variant="outlined"
          label="Name"
          id="param_name"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
        />
      <Select
        value={listType}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <MenuItem value={"conns"}> Connections </MenuItem>
        <MenuItem value={"msgs"}> Messages </MenuItem>
      </Select>
    </FormControl>
    <Button onClick={(e) => save(paramData)}> Add parameter </Button>
    </>
  );
}

ListParam.propTypes = {
  save: PropTypes.func.isRequired,
};

export default ListParam;