import React, { useState, useEffect } from "react";
import { Stack, Select, MenuItem, TextField, IconButton } from "@mui/material";

import InlineText from "../InlineText";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { distributionsDict } from "../../../../app/utils";

export const RandStatement = (props) => {
  const { variables, save, setEditOn } = props;

  const [curLhs, setCurLhs] = useState("");
  const [distArgs, setDistArgs] = useState([]);
  const [cast, setCast] = useState("float");
  const [distribution, setDistribution] = useState("normal");
  const [argError, setArgError] = useState(false);

  useEffect(() => {});

  const addRandStatement = () => {
    setArgError(false);
    let err_flag = false;
    //validate the distribution
    let dist = distributionsDict[distribution];
    if (!dist.validate(distArgs)) {
      err_flag = true;
      setArgError(true);
    }
    if (!err_flag) {
      let statement = `${curLhs} = ${cast} from ${distribution}(`;
      let firstPass = true;
      distArgs.forEach((value, index) => {
        if (firstPass) {
          statement += `${value}`;
          firstPass = false;
        } else {
          statement += `,${value}`;
        }
      });
      statement += ")";

      let operation = `RAND    ${curLhs},${cast},${distribution}`;
      distArgs.forEach((value, index) => {
        operation += `,${value}`;
      });
      save(statement, operation);
      setEditOn(false);
      setArgError(false);
    }
  };

  const handleDistributionChange = (dist_name) => {
    setDistribution(dist_name);
  };

  const handleDistributionArgChange = (arg, id) => {
    let index = id.split("_");
    index = parseInt(index[index.length - 1]);
    if (!isNaN(index)) {
      let newArgs = [...distArgs];
      newArgs[index] = arg;
      setDistArgs(newArgs);
    }
  };

  return (
    <Stack direction="row">
      <Select value={curLhs} onChange={(e) => setCurLhs(e.target.value)}>
        {variables.map((el, index) => {
          if (el === undefined) return <></>;
          return (
            <MenuItem value={el.name} key={el.name}>
              {el.name} ({el.type})
            </MenuItem>
          );
        })}
      </Select>
      <InlineText text="=" />
      <Select value={cast} onChange={(e) => setCast(e.target.value)}>
        <MenuItem value={"float"} key={"float_cast"}>
          (float)
        </MenuItem>
        <MenuItem value={"int"} key={"int_cast"}>
          (int)
        </MenuItem>
      </Select>
      <InlineText text="from" />
      <Select
        value={distribution}
        onChange={(e) => handleDistributionChange(e.target.value)}
      >
        {Object.keys(distributionsDict).map((el, index) => {
          return (
            <MenuItem value={el} key={el}>
              {distributionsDict[el].name}
            </MenuItem>
          );
        })}
      </Select>
      {[...Array(distributionsDict[distribution].arg_count).keys()].map(
        (key, index) => {
          return (
            <TextField
              label={distributionsDict[distribution].param_names[index]}
              type="number"
              value={distArgs[index]}
              error={argError}
              onChange={(e) => {
                handleDistributionArgChange(e.target.value, e.target.id);
              }}
              InputProps={{ inputProps: { step: 0.1 } }}
              sx={{ margin: 1, width: "80px" }}
              id={distribution + "_param_" + index}
            />
          );
        }
      )}
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addRandStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
};

export default RandStatement;
