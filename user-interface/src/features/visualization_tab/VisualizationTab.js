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

  const [simulationId, setSimulationId] = React.useState("");
  const [simulationSeed, setSimulationSeed] = React.useState("");

  const [custom, setCustom] = React.useState(false);
  const [customCode, setCustomCode] = React.useState("");

  const [useFiles, setUseFiles] = React.useState(false);
  const [sourceFile, setSourceFile] = React.useState([]);
  const [moduleFiles, setModuleFiles] = React.useState([])

  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  const [success, setSuccess] = React.useState(false);

  const activateUseFiles = () => {
    setUseFiles(true);
    clearPreset();
  }

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

  const startSimulationFromCode = async (code_lines, module_code_lines) => {
    const url = "http://localhost/api/simulation";
    const seed = isInteger(simulationSeed) ? parseInt(simulationSeed) : -1;
    let data = {
      aasm_code_lines: code_lines,
      module_code_lines: module_code_lines,
      simulation_id: simulationId,
      simulation_seed: seed,
    }

    console.log(data)

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json().then((data) => {
          if (response.status === 201) {
            setSuccess(true);
            if (data["simulation_id"]) {
              setSimId(data["simulation_id"]);
            }
          } else {
            setError(true);
            if (data["translator_version"] !== undefined) {
              setErrorText(`Error: ${data["place"]}: ${data["reason"]}`);
              return;
            }
            setErrorText(`System Error: ${response.status}`);
            return;
          }
        });
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setErrorText(`Unexpected error: ${error}`);
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

  function isInteger(str) {
    return /^[+-]?\d+$/.test(str);
  }

  const addSourceFile = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      console.log(reader.result);
      setSourceFile(reader.result.split("\n"));
    }
  }

  const addModuleFiles = (e) => {
    let files = e.target.files;
    let contents = [];
    // create an array of 0 of the length of the files
    let flags = Array(files.length).fill(0);
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsText(files[i]);
      reader.onload = () => {
        console.log(reader.result);
        contents.push(reader.result.split("\n"));
        flags[i] = 1;
        if (flags.reduce((a, b) => a + b, 0) === files.length) {
          setModuleFiles(contents);
        }
      }
      // let content = getFileLines(files[i]);
      // console.log(content)
      // contents.push(content);
    }
    setModuleFiles(contents);
  }

  const startSimButtonClick = () => {
    console.log("Starting simulation");
    console.log("Simulation ID:", simulationId);
    console.log("Simulation Seed:", simulationSeed);
    clearError();
    if (!isInteger(simulationSeed) && !(simulationSeed === "")) {
      setError(true);
      setErrorText("Simulation seed must be an integer");
    }else{
      if (custom) {
        const custom_code_lines = customCode.split("\n");
        startSimulationFromCode(custom_code_lines, []);
      } else if (codeFilled) {
        startSimulationFromCode(code, []);
      } else if (useFiles && sourceFile.length > 0 ) {
        startSimulationFromCode(sourceFile, moduleFiles);
      } 
      else {
        setError(true);
        setErrorText(
          "Couldn't start simulation with above code, check if everything is correct"
        );
      }

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
          ) : (custom || useFiles) ? (
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
          {useFiles ? (
            <div>
            <i> Source file: </i> <br/>
            <input type="file" accept=".aasm" onChange={addSourceFile}/> <br/>
            <i> Module files: </i> <br/>
            <input type="file" accept=".aasm.mod" multiple onChange={addModuleFiles}/> <br/>
            </div>
          ): (
            <></>
          )
          }
          <h3> Simulation presets: </h3>
          <Stack direction="row" spacing={2}>
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
            <Button variant="contained" onClick={activateUseFiles}>
              {" "}
              From file{" "}
            </Button>
          </Stack>
          <Stack spacing={1}>
            <TextField
              id="simulation-id"
              label="Simulation ID"
              type="text"
              value={simulationId}
              onChange={(e) => setSimulationId(e.target.value)}
            />
            <TextField
              id="seed"
              label="Seed"
              type="number"
              value={simulationSeed}
              onChange={(e) => setSimulationSeed(e.target.value)}
            />
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
