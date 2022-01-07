import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Button, Divider, Box, Alert } from "@mui/material";
import { selectAgents } from "../../simulationSlice";
import StatisticalRow from "./StatisticalRow";

import { distributionsDict } from "../../../app/utils";

const errorAlerts = {
  1: "Amount of agents need to be a number!",
  2: "Invalid environment description mode. Contact developers.",
  3: "Amount of connections must be an integer or drawn from distribution!",
  4: "Invalid arguments for the distribution!",
}

export const StatisticalDescEditor = (props) => {
  const agents = useSelector(selectAgents);
  const [agentData, setAgentData] = useState([]);
  const [errorData, setErrorData] = useState([]);

  const {codeCallback, displayError} = props;

  const generateDEFG = (agent) => {
    let code = "DEFG ";
    code += agent.name + ", " + agent.amount + ", ";
    if(agent.draw_from_distribution){
      code += "dist_" + agent.distribution + ", ";
      code += agent.dist_args.join(", ");
    }else {
      code += agent.conn_amount;
    }
    return code;
  }

  useEffect(()=>{
    console.log(agentData)
    if(agentData.findIndex((ad, index) => {
      return ad.err_flag > 0;
    }) !== -1){
      codeCallback("ERROR", "Fill out the form correctly!", {});
    }else if(agentData.reduce((prevRes, ad) => {
      if(ad.amount === undefined) return prevRes;
      if(ad.amount.slice(-1) === "%"){
        console.log(ad.amount)
        return prevRes + parseFloat(ad.amount);
      }else{
        return prevRes;
      }
    }, 0) !== 100){
      codeCallback("ERROR", "Sum of percentages of population must be 100", {})
    }else{
      let code = "";
      agentData.forEach((ad, index) => {
        code += generateDEFG(ad) + "\n";
      })
       codeCallback(code, "generated statistical description", {agentData: agentData});
    }

  }, [agentData])

  const setRowError = (index, value) => {
    let tmpArr = [...errorData];
    tmpArr[index] = value;
    setErrorData(tmpArr);
  }

  useEffect(() => {
    let tmpArr = [];
    let agent = {
      name: "",
      amount: "0",
      conn_amount: 0,
      draw_from_distribution: false,
      distribution: "",
      dist_args: [],
      err_flag: 0,
    };
    agents.forEach((el) => {
      agent.name = el.name;
      tmpArr.push({...agent});
    });
    setAgentData(tmpArr);
    let errArr = [];
    errArr.length = agents.length;
    errArr.fill(false);
    setErrorData(errArr);
  }, [agents]);

  const handleAgentDataChange = (new_data, index) => {
    let tmpArr = [...agentData];
    tmpArr[index] = new_data;
    setRowError(index, true);
    setAgentData(tmpArr);
  };

  return (
    <Box sx={{maxHeight: 600, overflow: "auto"}}>
      <Grid container spacing={2}>
        {/* Headers of columns */}
        <Grid item xs={4}>
          <h2> Type </h2>
        </Grid>
        <Grid item xs={4}>
          <h2> Env % </h2>
        </Grid>
        <Grid item xs={4}>
          <h2> # of connections </h2>
        </Grid>
        {
          // generate editable columns
          agentData.map((el, index) => {
            return (
              <Grid item xs={12}>
                <StatisticalRow
                  agentData={el}
                  key={index}
                  index={index}
                  handleChange={handleAgentDataChange}
                />
                {
                  el.err_flag > 0 && errorData[index] && displayError ?
                    <Alert severity="error" onClose={(e) => setRowError(index, false)}>{errorAlerts[el.err_flag]}</Alert>
                    :
                    <></>
                }
                <Divider />
              </Grid>
            );
          })
        }
      </Grid>
      {/*<Button onClick={XD}>Testing</Button>*/}
    </Box>
  );
};

export default StatisticalDescEditor;
