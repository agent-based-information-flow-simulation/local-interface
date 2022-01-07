import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Stack, Divider, Button, Grid, Alert, TextField } from "@mui/material";
import DisplayList from "../components/DisplayList";
import StatisticalDescEditor from "./editors/StatisticalDescEditor";

import { setGraph } from "../simulationSlice";

const graphDescTypes = ["Statistical description", "Custom method"]

export const GraphTab = (props) => {

  const dispatch = useDispatch();

  const [modeIndex, setModeIndex] = useState(0);
  const [defgCode, setDefgCode] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [codeSet, setCodeSet] = useState(false);
  const [graphSize, setGraphSize] = useState("");
  const [showError, setShowError] = useState(false);
  const [graphData, setGraphData] = useState({})

  const clickedMode = (el, index) => {
    setModeIndex(index)
  }

  const codeCallback = (code, info, data) => {
    setAlertText(info);
    setGraphData(data);
    setError(false);
    setSuccess(false);
      setCodeSet(false);
    if(code === "ERROR"){
      setError(true);
    }else{
      setDefgCode(code);
      setSuccess(true);
      setCodeSet(true);
    }
  }

  const alertClose = () => {
    setError(false);
    setSuccess(false);
    setAlertDisplay(false);
  }

  const saveGraph = () => {
    setShowError(true);
    switch(modeIndex) {
      case 0:
        setAlertDisplay(true);
        if(codeSet){
          if(isNaN(parseInt(graphSize))){
            setSuccess(false);
            setError(true);
            setAlertText("Specify graph size!!!");
            break;
          }
          let code = "GRAPH statistical\n";
          code += "SIZE " + graphSize + "\n";
          code += defgCode;
          code += "EGRAPH\n";
          let graph = {
            type: "statistical",
            size: graphSize,
            agents: graphData.agentData,
            code: code,
          }
          dispatch(setGraph(graph));
        }
        break;
      case 1:
        break;
      default:
        break;
    }

  }

  return (
    <>
    <Stack
      direction="row"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ color: "black", borderWidth: 1 }}
        />
      }
      spacing={2}
    >
      <DisplayList
        name="Graph description type"
        collection={graphDescTypes}
        onItemClick={clickedMode}
        selectedItem={modeIndex}
      />
      <Grid container
      direction="column"
      >
        <Grid item sx={2}>
          <TextField label="Graph Size" value={graphSize} onChange={(e) => setGraphSize(e.target.value)}/>
        </Grid>
        <Grid item sx={11}>
        <StatisticalDescEditor codeCallback={codeCallback} displayError={showError} />
        </Grid>
        <Grid item sx={1}>
          {
            alertDisplay ? (
              error ? (
                <Alert severity="error" onClose={alertClose}> {alertText}</Alert>
              ) : success ? (
                <Alert severity="success" onClose={alertClose}> {alertText}</Alert>
              ) : <> </>
            ) : <></>
          }
        </Grid>
        <Grid item sx={1}>
        <Button variant="contained" onClick={saveGraph} sx={{margin: 5}}> Save Graph Description </Button>
        </Grid>
      </Grid>
    </Stack>
    </>
  );
};

export default GraphTab;