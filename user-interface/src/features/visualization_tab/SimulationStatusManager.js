import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import SimulationOptionsCell from "./SimulationOptionsCell";

export const SimulationStatusManager = (props) => {
  const { simulationData } = props;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" colspan={3}>
              <b> Simulation Status </b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Simulation ID </TableCell>
            <TableCell> Status </TableCell>
            <TableCell> Options </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {simulationData.map((el, index) => {
            return (
              <TableRow key={el.key}>
                <TableCell> {el.simulation_id}</TableCell>
                <TableCell> {el.status}</TableCell>
                <SimulationOptionsCell simulation={el} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SimulationStatusManager;
