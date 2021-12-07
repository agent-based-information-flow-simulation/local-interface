import React, { useEffect }  from "react";
import Stack from "@mui/material/Stack";
import DisplayList from "../components/DisplayList";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectAgents, selectMessageTypes } from "../simulationSlice";

export function VisualizationTab() {
  const [runningSimulations, setRunningSimulations] = React.useState([]);
  const [simulationsOutput, setSimulationsOutput] = React.useState({});
  const [selectedSimulationId, setSelectedSimulationId] = React.useState("");
  const messages = useSelector(selectMessageTypes)
  const agents = useSelector(selectAgents);

  const [code, setCode] = React.useState("");

  const generateCode = () => {
    let tmp_code = "";
    messages.forEach(el => tmp_code += el.code + '\n');
    agents.forEach(el => tmp_code += el.code + '\n');
    setCode(tmp_code);
  }

  useEffect(() => {
    const runningSimulationsWebsocket = new WebSocket("ws://localhost:8000/simulations");
    console.debug("opened running simulations websocket");
    runningSimulationsWebsocket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      setRunningSimulations(data.running_simulations)
    };
    runningSimulationsWebsocket.onclose = () => {
      console.debug("closing running simulations websocket");
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
      const simulationOutputWebsocket = new WebSocket(`ws://localhost:8000/simulations/${simulationId}`);
      console.debug(`opened ${simulationId} websocket`);
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
      simulationOutputWebsocket.onclose = () => {
        console.debug(`closing ${simulationId} websocket`);
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
        <Stack sx={{textAlign: "left", p: 3}}>
          {
            code.split('\n').map((el, index) => {
              return <div key={index}> {el} </div>;
            })
          }
        <Button onClick={(e) => {generateCode()}}> Generate code </Button>
        </Stack>
      </Stack>
    </div>
  );
}
