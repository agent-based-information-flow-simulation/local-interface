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

export const InstanceStatusTable = (props) => {
  const { instanceData } = props;

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={6}>
                <b> Instance Status </b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right"> Key </TableCell>
              <TableCell align="right"> Status </TableCell>
              <TableCell align="right"> Simulation ID</TableCell>
              <TableCell align="right"> Agents # </TableCell>
              <TableCell align="right"> Sim Mem usage [MiB] </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instanceData.map((el, index) => {
              console.log("INSTANCE DATA", instanceData);
              return (
                <TableRow key={el.key}>
                  <TableCell>{el.key}</TableCell>
                  <TableCell>{el.status}</TableCell>
                  <TableCell>{el.simulation_id}</TableCell>
                  <TableCell>{el.num_agents}</TableCell>
                  <TableCell>{el.simulation_memory_usage_MiB}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default InstanceStatusTable;
