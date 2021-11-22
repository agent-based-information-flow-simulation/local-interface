import React, { useState } from "react";
import { FormControl, Select, MenuItem, TextField } from "@mui/material";

export const FloatParam = () => {
  const distributionsDict = {
    normal: {
      name: "Normal",
      arg_count: 2,
      param_names: ["miu", "sigma"],
    },
    exp: {
      name: "Exponential",
      arg_count: 1,
      param_names: ["lambda"],
    },
  };
  const [floatType, setFloatType] = useState("initVal");
  const [distribution, setDistribution] = useState(
    Object.keys(distributionsDict)[0]
  );

  return (
    <>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <Select
          value={floatType}
          onChange={(e) => setFloatType(e.target.value)}
        >
          <MenuItem value={"initVal"}> Initial Value </MenuItem>
          <MenuItem value={"distribution"}> Draw from distribution </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        {floatType === "initVal" ? (
          <TextField type="number" id="init_val_float" />
        ) : floatType === "distribution" ? (
          <Select
            value={distribution}
            onChange={(e) => setDistribution(e.target.value)}
          >
            {Object.keys(distributionsDict).map((key) => {
              return (
                <MenuItem value={key}> {distributionsDict[key].name} </MenuItem>
              );
            })}
          </Select>
        ) : (
          <></>
        )}
        {floatType === "distribution" ? (
          [...Array(distributionsDict[distribution].arg_count).keys()].map(
            (key, index) => {
              return (
                <TextField
                  label={distributionsDict[distribution].param_names[index]}
                  type="number"
                  InputProps={{ inputProps: { step: 0.1 } }}
                  sx={{ margin: 1 }}
                  id={distribution + "_param_" + index}
                />
              );
            }
          )
        ) : (
          <></>
        )}
      </FormControl>
    </>
  );
};

export default FloatParam;