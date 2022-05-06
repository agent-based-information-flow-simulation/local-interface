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
import streamSaver from 'streamsaver';

export const SimulationStatusManager = (props) => {
  const { simulationData, deleteCallback, restartCallback } = props;

  const [reportOpen, setReportOpen] = useState(false);
  const [reportSimId, setSimId] = useState("");

  const handleReportClose = () => {
    setReportOpen(false);
  };

  const reportCallback = (sim_id) => {
    setSimId(sim_id);
    setReportOpen(true);
  };

  // https://stackoverflow.com/questions/40939380/how-to-get-file-name-from-content-disposition
  const getTimeseriesFilename = async (response) => {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches !== null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    } else {
      return "timeseries.json";
    }
  }

  const downloadTimeseries = async (simulationId) => {
    const url = `http://localhost/api/simulations/${simulationId}/timeseries`;
    const response = await fetch(url);

    if (response.status === 400) {
      const body = await response.json();
      console.error(body['detail']);
      return;
    } else if (response.status !== 200) {
      console.error("Error downloading timeseries");
      return;
    }

    const filename = await getTimeseriesFilename(response);
    const fileStream = streamSaver.createWriteStream(filename);
    await response.body.pipeTo(fileStream);
  }

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 400 }}>
        <Table stickyHeader>
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
                    restartCallback={restartCallback}
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

      {/* TODO: remove this button */}
      <button onClick={() => downloadTimeseries("7167312a-e")}>
        click
      </button>

    </>
  );
};

export default SimulationStatusManager;
