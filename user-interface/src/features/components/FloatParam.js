import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  distributionsDict,
  validateFloatParam,
  errorCodes,
} from "../../app/utils";

export const FloatParam = (props) => {
  const { save } = props;

  const [floatType, setFloatType] = useState("initVal");
  const [initVal, setInitVal] = useState(0);
  const [distribution, setDistribution] = useState(
    Object.keys(distributionsDict)[0]
  );
  const [distributionArgs, setDistributionArgs] = useState([]);
  const [paramName, setParamName] = useState("");
  const [paramData, setParamData] = useState({});

  const [displayError, setDisplayError] = useState(false);
  const [errorText, setErrorText] = useState("");

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
  };

  const saveButtonClick = () => {
    let code = validateFloatParam(paramData);
    if (code !== 0) {
      let error = errorCodes.find((el) => el.code === code);
      setDisplayError(true);
      setErrorText(error.info);
    } else {
      save(paramData);
    }
  };

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
  useEffect(() => {
    updateParamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramName, floatType, distribution, distributionArgs]);

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
            key="field_del_text_float_paramo"
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
                <MenuItem key={key} value={key}>
                  {" "}
                  {distributionsDict[key].name}{" "}
                </MenuItem>
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
                  key={`${key}_${index}`}
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
      {displayError ? (
        <Alert severity="error" onClose={(e) => setDisplayError(false)}>
          {" "}
          {errorText}{" "}
        </Alert>
      ) : (
        <></>
      )}
      <Button onClick={saveButtonClick}> Add parameter </Button>
    </>
  );
};

FloatParam.propTypes = {
  save: PropTypes.func.isRequired,
};

export default FloatParam;
