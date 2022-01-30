import React, { useState } from "react";
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
import SimulationReportDialog from "./SimulationReportDialog";

export const SimulationStatusManager = (props) => {
  const { simulationData, deleteCallback } = props;

  const [reportOpen, setReportOpen] = useState(false);
  const [reportSimId, setSimId] = useState("");

  const handleReportClose = () => {
    setReportOpen(false);
  };

  const reportCallback = (sim_id) => {
    setSimId(sim_id);
    setReportOpen(true);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3}>
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
                  <SimulationOptionsCell
                    simulation={el}
                    deleteCallback={deleteCallback}
                    reportCallback={reportCallback}
                  />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <SimulationReportDialog
        open={reportOpen}
        onClose={handleReportClose}
        simId={reportSimId}
      />
    </>
  );
};

export default SimulationStatusManager;
