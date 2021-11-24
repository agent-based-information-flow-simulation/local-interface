import React, { useState } from "react";
import { FormControl, Select, MenuItem, TextField, Button } from "@mui/material"
import PropTypes from "prop-types"

export const ListParam = (props) => {
  const {save} = props
  const [listType, setListType] = useState("conns");
  const [paramName, setParamName] = useState();
  const [paramData, setParamData] = useState({})

  const handleTypeChange = (value) => {
    setListType(value);
    updateParamData();

  }

  const handleNameChange = (value) => {
    setParamName(value);
    updateParamData();
  }

  const updateParamData = () => {
    let newParamData = {};
    newParamData.type = listType;
    newParamData.name = paramName;
    setParamData(newParamData);
  }

  return (
    <>
    <FormControl fullWidth xd={{ marginTop: 2}}>
        <TextField
          variant="outlined"
          label="Name"
          id="param_name"
          value={paramName}
          onChange={(e) => handleNameChange(e.target.value)}
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