import React, { useEffect }  from "react";
import Stack from "@mui/material/Stack";
import DisplayList from "../components/DisplayList";
import { Button } from "@mui/material";

export function VisualizationTab() {
  const [runningSimulations, setRunningSimulations] = React.useState([]);
  const [simulationsOutput, setSimulationsOutput] = React.useState({});
  const [selectedSimulationId, setSelectedSimulationId] = React.useState("");

  useEffect(() => {
    const runningSimulationsWebsocket = new WebSocket("ws://localhost:8000/simulations");
    runningSimulationsWebsocket.onmessage = (message) => {
        const data = JSON.parse(message.data)
        setRunningSimulations(data.running_simulations)
    };
    return () => {
        runningSimulationsWebsocket.close();
    }
  }, []);

  const getSimulationOutput = (simulationId) => {
    return (simulationId in simulationsOutput) ? simulationsOutput[simulationId] : [];
  }

  const startNewSimulation = async () => {
    const numAgents = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
    const url = `http://localhost:8000/simulations?num_agents=${numAgents}`;
    const response = await fetch(url, {method: 'POST'});
    const data = await response.json();
    if ("id" in data) {
      const simulationId = data.id;
      setSelectedSimulationId(simulationId);
      setSimulationsOutput(prevState => ({
        ...prevState, 
        [simulationId]: []
      }));
      const simulationOutputWebsocket = new WebSocket(`ws://localhost:8000/simulations/${data.id}`);
      simulationOutputWebsocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        const simulationId = data.id;
        const outputLine = data.line;
        setSimulationsOutput(prevState => ({
            ...prevState, 
            [simulationId]: [...prevState[simulationId], outputLine]
          })
        );
      }
    }
  }

  const deleteSimulation = async (simulationId) => {
    const url = `http://localhost:8000/simulations/${simulationId}`;
    await fetch(url, {method: 'DELETE'});
    setSimulationsOutput(prevState => ({
        ...prevState, 
        [simulationId]: []
      })
    );
  }

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={2}>
          <DisplayList name="Running simulations" collection={runningSimulations} onItemClick={setSelectedSimulationId} />
          <Button onClick={startNewSimulation}>Start new simulation</Button>
          <Button onClick={() => deleteSimulation(selectedSimulationId)}>Delete selected simulation</Button>
        </Stack>
        <DisplayList name="Output" collection={getSimulationOutput(selectedSimulationId)} />
      </Stack>
    </div>
  );
}
