import React from "react";

import { TableCell, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

export const SimulationOptionsCell = (props) => {
  const { simulation, deleteCallback } = props;

  const deleteSimulation = async () => {
    const url = `http://localhost/api/simulations/${simulation.simulation_id}`;
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

  return (
    <TableCell>
      <IconButton sx={{ p: "10px" }} color="primary" onClick={deleteSimulation}>
        <RemoveCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
      <IconButton sx={{ p: "10px" }} color="primary">
        <AssessmentOutlinedIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </TableCell>
  );
};

export default SimulationOptionsCell;
