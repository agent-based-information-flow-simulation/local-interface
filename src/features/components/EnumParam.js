import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"

import {
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
  TextField,
  Button,
} from "@mui/material";

import {} from "../agents_tab/agentsTabSlice";

import NewEnumVal from "./NewEnumVal";
import EnumVal from "./EnumVal";

const EnumParam = (props) => {
  const {save} = props
  const [enumType, setEnumType] = useState("new");
  const [enumState, setEnumState] = useState("init");

  const [enumVals, setEnumVals] = useState([]);
  const [enumValName, setEnumValName] = useState("");
  const [enumValNameError, setEnumValNameError] = useState(false);
  const [percentageError, setPrecentageError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paramName, setParamName] = useState();
  const [paramData, setParamData] = useState({});

  const addEnumVal = () => {
    if (enumVals.some((el) => el.name === enumValName) || enumValName === "") {
      setEnumValNameError(true);
    } else {
      const newVal = {
        name: enumValName,
        percentage: 0,
      };
      setEnumVals((enumVals) => [...enumVals, newVal]);
      setEnumValName("");
    }
  };

  const onEnumValFieldChange = (value) => {
    setEnumValName(value);
    setEnumValNameError(false);
  };

  const removeEnumVal = (name) => {
    setEnumVals(enumVals.filter((item) => item.name !== name));
  };

  const setPercentage = (name, percentage) => {
    let newVals = JSON.parse(JSON.stringify(enumVals));
    let index = newVals.findIndex((el) => el.name === name);
    if (index !== -1) {
      newVals[index].percentage = percentage;
    }
    setEnumVals(newVals);
    let sum = 0;
    for (let i = 0; i < newVals.length; i++) {
      sum += parseFloat(newVals[i].percentage);
    }
    if (sum !== 100) {
      setPrecentageError(true);
    } else {
      setPrecentageError(false);
    }
    updateParamData();
  };

  const handleEnumStateChange = (value) => {
    setEnumState(value);
    updateParamData();
  };

  const handleSelectionChange = (value) => {
    setSelectedIndex(value);
    updateParamData();
  };

  const updateParamData = () => {
    let newParamData = {};
    newParamData.type = enumType;
    newParamData.name = paramName;
    switch (enumType) {
      case "new":
        newParamData.state = enumState;
        switch (enumState) {
          case "init":
            newParamData.selectedInit = selectedIndex;
            break;
          case "percentages":
            break;
          default:
            break;
        }
        newParamData.enumVals = enumVals;
        break;
      case "existing":
        break;
      default:
        break;
    }
    setParamData(newParamData);
  };

  // I have no idea why this works
  useEffect(()=>{
    updateParamData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramName]);

  return (
    <>
    <FormControl fullWidth sx={{ marginTop: 2 }}>
      {enumState === "init" ? (
        <TextField
          variant="outlined"
          label="Name"
          id="param_name"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
        />
      ) : (
        <></>
      )}
      <Select value={enumType} onChange={(e) => setEnumType(e.target.value)}>
        <MenuItem value={"new"}> New enumerable </MenuItem>
        <MenuItem value={"existing"}> Existing enumerable </MenuItem>
      </Select>
      {enumType === "new" ? (
        <>
          <RadioGroup
            value={enumState}
            onChange={(e) => handleEnumStateChange(e.target.value)}
          >
            <FormControlLabel
              value="init"
              control={<Radio />}
              label="Initial state"
            />
            <FormControlLabel
              value="percentages"
              control={<Radio />}
              label="Percentages"
            />
          </RadioGroup>
          {enumState === "init" && enumVals.length > 0 ? (
            <>
              <Select
                value={selectedIndex}
                onChange={(e) => handleSelectionChange(e.target.value)}
                sx={{ margin: 1 }}
              >
                {" "}
                {enumVals.map((key, index) => {
                  return <MenuItem value={index}> {key.name} </MenuItem>;
                })}
              </Select>
            </>
          ) : (
            <></>
          )}
          <List>
            {enumVals.map((key) => {
              return (
                <EnumVal
                  name={key.name}
                  enumState={enumState}
                  enumVals={enumVals}
                  setPercentage={setPercentage}
                  removeEnumVal={removeEnumVal}
                  error={percentageError}
                />
              );
            })}
          </List>
          <NewEnumVal
            addEnumVal={addEnumVal}
            enumValName={enumValName}
            onChangeField={onEnumValFieldChange}
            error={enumValNameError}
          />
        </>
      ) : enumType === "existing" ? (
        <List></List>
      ) : (
        <></>
      )}
    </FormControl>
    <Button onClick={(e) => save(paramData)}> Add parameter </Button>
    </>
  );
};

EnumParam.propTypes = {
  save: PropTypes.func.isRequired,
};

export default EnumParam;
