import React from "react";

import { TableCell, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

export const SimulationOptionsCell = (props) => {
  const { simulation } = props;

  const deleteSimulation = async () => {
    const url = `http://localhost/api/simulations/${simulation.simulation_id}`;
    await fetch(url, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          //return success to the guy
        } else {
          //return error to the guy
        }
      })
      .catch((error) => {
        //return error to the guy
      });
  };

  return (
    <TableCell>
      <IconButton sx={{ p: "10px" }} color="primary">
        <RemoveCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
      <IconButton sx={{ p: "10px" }} color="primary">
        <AssessmentOutlinedIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </TableCell>
  );
};

export default SimulationOptionsCell;
