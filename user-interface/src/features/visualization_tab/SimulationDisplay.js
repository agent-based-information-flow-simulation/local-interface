import React, { useState } from "react";
import { Stack, Button } from "@mui/material";
import NeoGraph, {ResizableGraph} from "./NeoGraph";

export const SimulationDisplay = (props) => {
  const { simId } = props;

  const [instances, setInstances] = useState([]);

  const deleteSimulation = async () => {
    const url = `http://localhost:3002/api/simulations/${simId}`;
    await fetch(url, { method: "DELETE" });
  };

  const getStatus = async () => {
    const url = `http://localhost:3002/api/simulations/`;
    //GET method here
    const response = await fetch(url, {
      method: "GET",
    });
    console.log("Got response: ", response);
    const data = await response.json();
    console.log(data);
    if (response.status !== 200) {
      console.log("ERRRERP"); // TODO add error handling
    } else {
      setInstances(data["instances"]);
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      {simId === "" ? (
        <p> Start a simulation to get the data </p>
      ) : (
        <p> {simId} </p>
      )}
      <div>
        <NeoGraph
          width={600}
          height={500}
          containerId={"graph1"}
          neo4jUri={"bolt://localhost:7687"}
        />
      </div>
      <h3> Status </h3>
      <Button onClick={getStatus}> Get status </Button>
      <table>
        <thead>
          <tr>
            <th> Key </th>
            <th> Status </th>
            <th> Simulation ID </th>
            <th> Agents# </th>
            <th> API Mem usage [MiB] </th>
            <th> Sim Mem usage [MiB] </th>
          </tr>
        </thead>
        <tbody>
          {instances.map((el, index) => {
            return (
              <tr>
                <td>{el.key}</td>
                <td>{el.status}</td>
                <td>{el.simulation_id}</td>
                <td>{el.num_agents}</td>
                <td>{el.api_memory_usage_MiB}</td>
                <td>{el.simulation_memory_usage_MiB}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button onClick={deleteSimulation}> Delete simulation </Button>
    </Stack>
  );
};

export default SimulationDisplay;
