import React, { useState } from "react";

import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
} from "@mui/material";

import NewEnumVal from "./NewEnumVal";
import EnumVal from "./EnumVal";

const EnumParam = () => {
  const [enumType, setEnumType] = useState("new");
  const [enumState, setEnumState] = useState("init");

  const [enumVals, setEnumVals] = useState([]);
  const [enumValName, setEnumValName] = useState("");
  const [enumValNameError, setEnumValNameError] = useState(false);

  const addEnumVal = () => {
    if (enumVals.some((el) => el.name === enumValName)) {
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
    let newVals = [...enumVals];
    let index = newVals.findIndex((el) => el.name === name);
    if (index !== -1) {
      newVals[index].percentage = percentage;
    }
    setEnumVals(newVals);
  };

  return (
    <FormControl fullWidth sx={{ marginTop: 2 }}>
      <Select value={enumType} onChange={(e) => setEnumType(e.target.value)}>
        <MenuItem value={"new"}> New enumerable </MenuItem>
        <MenuItem value={"existing"}> Existing enumerable </MenuItem>
      </Select>
      {enumType === "new" ? (
        <>
          <TextField label="Enum name" id="enum_param_name" />
          <RadioGroup
            value={enumState}
            onChange={(e) => setEnumState(e.target.value)}
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
          <List>
            {enumVals.map((key) => {
              return (
                <EnumVal
                  name={key.name}
                  enumState={enumState}
                  enumVals={enumVals}
                  setPercentage={setPercentage}
                  removeEnumVal={removeEnumVal}
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
  );
};

export default EnumParam;
