import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, TextField, Button } from "@mui/material";
import PropTypes from "prop-types"

export const distributionsDict = {
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

export const FloatParam = (props) => {

  const {save} = props

  const [floatType, setFloatType] = useState("initVal");
  const [initVal, setInitVal] = useState(0);
  const [distribution, setDistribution] = useState(
    Object.keys(distributionsDict)[0]
  );
  const [distributionArgs, setDistributionArgs] = useState([]);
  const [paramName, setParamName] = useState("");
  const [paramData, setParamData] = useState({})

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
    setInitVal(value);
    updateParamData();
  }

  const updateParamData = () => {
    let newParamData = {};
    newParamData.name = paramName;
    newParamData.type = floatType;
    switch (floatType) {
      case "initVal":
        newParamData.initVal = initVal;
        break;
      case "distribution":
        newParamData.distribution = distribution;
        newParamData.distribution_args = distributionArgs;
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
        <TextField
          variant="outlined"
          label="Name"
          id="param_name"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
        />
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
      <Button onClick={(e) => save(paramData)}> Add parameter </Button>
    </>
  );
};

FloatParam.propTypes = {
  save: PropTypes.func.isRequired,
};

export default FloatParam;
