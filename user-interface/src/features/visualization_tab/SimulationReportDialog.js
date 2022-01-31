import React, { useState } from "react";
import { Dialog, Container, DialogTitle, Stack, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Alert,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import NeoGraph from "./NeoGraph";
import QueryCreator from "./QueryCreator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const SimulationReportDialog = (props) => {
  const { open, onClose, simId } = props;

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{}],
  });

  const [queryError, setQueryError] = useState(false);
  const [errorText, setErrorText] = useState("");

  //left for consistency, maybe add options later
  const barOptions = {
    indexAxis: "y",
  };

  const handleClose = (event, reason) => {
    onClose(false);
  };

  const queryCallback = async (searchString, label) => {
    setQueryError(false);
    const url =
      `http://localhost/api/simulations/${simId}/statistics/` + searchString;

    await fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (response.status !== 200) {
          setQueryError(true);
          setErrorText("HTTP error getting query: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setBarData({
          labels: data["labels"],
          datasets: [
            {
              label: label,
              backgroundColor: "rgb(25, 118, 210)",
              borderColor: "rgb(25, 118, 210)",
              data: data["data"],
            },
          ],
        });
      })
      .catch((error) => {
        setQueryError(true);
        setErrorText("Unkown error getting query");
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
      <Container sx={{ padding: 1 }}>
        <DialogTitle> {simId} Simulation Report </DialogTitle>
        <Stack direction="row" spacing={2}>
          <Box sx={{ width: "40%", margin: 2 }}>
            <NeoGraph
              width={"100%"}
              height={500}
              containerId={"graph1"}
              neo4jUri={"bolt://localhost:8008"}
              simId={simId}
            />
          </Box>
          <Box sx={{ width: "60%", margin: 2 }}>
            <h3> Simulation data </h3>
            <Bar options={barOptions} data={barData} />
            <QueryCreator queryCallback={queryCallback} />
            {queryError ? (
              <Alert severity="error" onClose={(e) => setQueryError(false)}>
                {errorText}
              </Alert>
            ) : (
              <></>
            )}
          </Box>
        </Stack>
      </Container>
    </Dialog>
  );
};

export default SimulationReportDialog;
