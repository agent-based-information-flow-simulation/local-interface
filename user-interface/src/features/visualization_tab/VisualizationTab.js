import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Button, TextField, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectAgents,
  selectMessageTypes,
  selectGraph,
} from "../simulationSlice";

import SimulationDisplay from "./SimulationDisplay";

import { pingpong, benchmark } from "./assm_presets";

const presetMap = {
  pingpong: pingpong,
  benchmark: benchmark,
};

export function VisualizationTab() {
  const [simId, setSimId] = React.useState("");

  const messages = useSelector(selectMessageTypes);
  const agents = useSelector(selectAgents);
  const graph = useSelector(selectGraph);

  const [code, setCode] = React.useState([]);
  const [generatedCode, setGeneratedCode] = React.useState([]);
  const [codeFilled, setCodeFilled] = React.useState(false);
  const [codeGenerated, setCodeGenerated] = React.useState(false);

  const [custom, setCustom] = React.useState(false);
  const [customCode, setCustomCode] = React.useState("");

  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  const [success, setSuccess] = React.useState(false);

  const generateCode = () => {
    let tmp_code = [];
    messages.forEach((el) => {
      if (el.code !== undefined) {
        el.code.split("\n").forEach((line) => tmp_code.push(line));
      }
    });
    agents.forEach((el) => {
      if (el.code !== undefined) {
        el.code.split("\n").forEach((line) => tmp_code.push(line));
      }
    });

    if (graph.code !== undefined) {
      const graph_lines = graph.code.split("\n");
      tmp_code = [...tmp_code, ...graph_lines];
      setGeneratedCode(tmp_code);
      setCode(tmp_code);
      setCodeFilled(true);
      setCodeGenerated(true);
    } else {
      setCode([]);
      setCodeGenerated(false);
      setCodeFilled(false);
    }
  };

  useEffect(() => {
    generateCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSimulationFromCode = async (code_lines) => {
    const url = "http://localhost/api/simulations";

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ aasm_code_lines: code_lines }),
    })
      .then((response) => {
        if (response.status === 201) {
          setSuccess(true);
          return response.json();
        } else {
          setError(true);
          setErrorText(`Encountered http error: ${response.status}`);
        }
      })
      .then((data) => {
        if (data["simulation_id"]) {
          setSimId(data["simulation_id"]);
        }
      })
      .catch((error) => {
        setError(true);
        setErrorText(`Unexpected error: ${error.message}`);
      });
  };

  const loadSimulationPreset = (presetName) => {
    setCustom(false);
    setCode(presetMap[presetName]);
    setCodeFilled(true);
  };

  const clearPreset = () => {
    setCustom(false);
    if (codeGenerated) {
      setCode(generatedCode);
      setCodeFilled(true);
    } else {
      setCode([]);
      setCodeFilled(false);
    }
  };

  const startSimButtonClick = () => {
    if (custom) {
      const custom_code_lines = customCode.split("\n");
      startSimulationFromCode(custom_code_lines);
    } else if (codeFilled) {
      startSimulationFromCode(code);
    } else {
      setError(true);
      setErrorText(
        "Couldn't start simulation with above code, check if everything is correct"
      );
    }
  };

  const clearError = () => {
    setError(false);
    setErrorText("");
  };

  const clearSuccess = () => {
    setSuccess(false);
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={2}>
          <h1> Simulation Settings</h1>
          {codeFilled && !custom ? (
            <>
              <h3> Code to be run: </h3>
              <Stack
                sx={{
                  textAlign: "left",
                  p: 3,
                  maxHeight: "50%",
                  overflow: "auto",
                }}
              >
                {code.map((el, index) => {
                  return <div key={index}> {el} </div>;
                })}
              </Stack>
            </>
          ) : custom ? (
            <></>
          ) : (
            <p> Your code will show up here when you fill out the forms</p>
          )}
          {custom ? (
            <TextField
              multiline
              rows="23"
              margin="normal"
              placeholder="Write your aasm code here"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
          ) : (
            <></>
          )}
          <h3> Simulation presets: </h3>
          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              onClick={(e) => {
                loadSimulationPreset("pingpong");
              }}
            >
              {" "}
              Ping-Pong{" "}
            </Button>
            <Button
              variant="contained"
              onClick={(e) => {
                loadSimulationPreset("benchmark");
              }}
            >
              {" "}
              Benchmark{" "}
            </Button>
            <Button
              variant="contained"
              onClick={(e) => {
                setCustom(true);
              }}
            >
              {" "}
              Custom{" "}
            </Button>
            <Button variant="contained" onClick={clearPreset}>
              {" "}
              Clear{" "}
            </Button>
          </Stack>
          <Button onClick={startSimButtonClick}>
            {" "}
            Start simulation with the code above{" "}
          </Button>
          {error ? (
            <Alert severity="error" onClose={clearError}>
              {" "}
              {errorText}{" "}
            </Alert>
          ) : (
            <></>
          )}
          {success ? (
            <Alert severity="success" onClose={clearSuccess}>
              Correctly created simulation. Get status to see the state.
            </Alert>
          ) : (
            <></>
          )}
        </Stack>
        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
          <h1> Simulation Management </h1>
          <SimulationDisplay simId={simId} />
        </Stack>
      </Stack>
    </div>
  );
}
