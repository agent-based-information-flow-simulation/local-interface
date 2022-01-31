import React from "react";

import { TableCell, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const SimulationOptionsCell = (props) => {
  const { simulation, deleteCallback, reportCallback, restartCallback } = props;

  const deleteSimulation = async () => {
    const url = `http://localhost:8000/api/simulations/${simulation.simulation_id}`;
    await fetch(url, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          deleteCallback(simulation.simulation_id, "success", "");
        } else {
          deleteCallback(simulation.simulation_id, "error", response.status);
        }
      })
      .catch((error) => {
        deleteCallback(simulation.simulation_id, "error", error);
      });
  };

  const restartSimulation = async () => {
    const url = `http://localhost:8000/api/simulations/${simulation.simulation_id}`;
    await fetch(url, { method: "POST" })
      .then((response) => {
        if (response.status === 201) {
          restartCallback(simulation.simulation_id, "success", "");
        } else {
          restartCallback(simulation.simulation_id, "error", response.status);
        }
      })
      .catch((error) => {
        restartCallback(simulation.simulation_id, "error", error);
      });
  };

  const openSimulationReport = () => {
    reportCallback(simulation.simulation_id);
  };

  return (
    <TableCell>
      {simulation.status !== "ACTIVE" ? (
        <IconButton
          sx={{ p: "10px" }}
          color="primary"
          onClick={restartSimulation}
        >
          <RestartAltIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      ) : (
        <IconButton
          sx={{ p: "10px" }}
          color="primary"
          onClick={deleteSimulation}
        >
          <RemoveCircleIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      )}
      <IconButton
        sx={{ p: "10px" }}
        color="primary"
        onClick={openSimulationReport}
      >
        <AssessmentOutlinedIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </TableCell>
  );
};

export default SimulationOptionsCell;
