import React, { useState } from "react";
import { Stack, Button, Box } from "@mui/material";
import NeoGraph, { ResizableGraph } from "./NeoGraph";
import InstanceStatusTable from "./InstanceStatusTable";
import SimulationStatusManager from "./SimulationStatusManager";

export const SimulationDisplay = (props) => {
  const { simId } = props;

  const [instances, setInstances] = useState([]);
  const [simulations, setSimulations] = useState([]);

  const deleteSimulation = async (sim_id) => {
    const url = `http://localhost/api/simulations/${sim_id}`;
    await fetch(url, { method: "DELETE" });
  };

  const getStatus = async () => {
    const url = `http://localhost/api/simulations`;
    //GET method here
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    if (response.status !== 200) {
      console.log("ERRRERP"); // TODO add error handling
    } else {
      console.log("Data of instances:", data["instances"]);
      setInstances(data["instances"]);
      setSimulations(data["simulations"]);
    }
  };

  return (
    <Stack direction="column" spacing={2} flex>
      {simId === "" ? (
        <></>
      ) : (
        <Box>
          <h3> {simId} Status</h3>
          <div>
            <NeoGraph
              width={530}
              height={350}
              containerId={"graph1"}
              neo4jUri={"bolt://localhost:8008"}
              simId={simId}
            />
          </div>
          <Button onClick={(e) => deleteSimulation(simId)}>
            {" "}
            Delete Current simulation{" "}
          </Button>
        </Box>
      )}
      <h3> SLB Status </h3>
      <Stack direction="row" spacing={2}>
        <InstanceStatusTable instanceData={instances} />
        <SimulationStatusManager simulationData={simulations} />
      </Stack>
      <Button onClick={getStatus}> Get status </Button>
    </Stack>
  );
};

export default SimulationDisplay;
