import React, { useState } from "react";
import { FormControl, Select, MenuItem, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  setCurrentParamData
} from "../agentsTabSlice";

export const FloatParam = () => {
  const dispatch = useDispatch();

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
  const [initVal, setInitVal] = useState(0);
  const [distribution, setDistribution] = useState(
    Object.keys(distributionsDict)[0]
  );
  const [distributionArgs, setDistributionArgs] = useState([]);

  const handleDistributionChange = (distribution) => {
    let arg_count = distributionsDict[distribution].arg_count;
    let newArgs = Array(arg_count);
    newArgs.fill(0);
    setDistributionArgs(newArgs);
    setDistribution(distribution);
    updateParamData();
  };

  const handleDistributionArgChange = (value, id) => {
    let index = id.split("_");
    index = parseInt(index[index.length - 1]);
    if (!isNaN(index)) {
      let newArgs = [...distributionArgs];
      newArgs[index] = value;
      setDistributionArgs(newArgs);
    }
    updateParamData();
  };

  const handleInitValChange = (value) => {
    console.log("Changing initVal for no reason!")
    setInitVal(value);
    updateParamData();
  }

  const updateParamData = () => {
    let paramData = {};
    paramData.type = floatType;
    switch (floatType) {
      case "initVal":
        paramData.initVal = initVal;
        break;
      case "distribution":
        paramData.distribution = distribution;
        paramData.distribution_args = distributionArgs;
        break;
      default:
        break;
    }
    dispatch(setCurrentParamData(paramData))
  };

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
          <TextField
            type="number"
            id="init_val_float"
            value={initVal}
            onChange={(e) => handleInitValChange(e.target.value)}
          />
        ) : floatType === "distribution" ? (
          <Select
            value={distribution}
            onChange={(e) => handleDistributionChange(e.target.value)}
          >
            {Object.keys(distributionsDict).map((key) => {
              return (
                <MenuItem key={key} value={key}> {distributionsDict[key].name} </MenuItem>
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
                  value={distributionArgs[index]}
                  onChange={(e) => {
                    handleDistributionArgChange(e.target.value, e.target.id);
                  }}
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
