import React, { useState, useEffect } from 'react'
import { Stack, Button, Box, Snackbar, Alert } from '@mui/material'
import NeoGraph, { ResizableGraph } from './NeoGraph'
import InstanceStatusTable from './InstanceStatusTable'
import SimulationStatusManager from './SimulationStatusManager'

export const SimulationDisplay = (props) => {
  const { simId } = props

  const [instances, setInstances] = useState([])
  const [simulations, setSimulations] = useState([])

  const [snackText, setSnackText] = useState('')
  const [snackSeverity, setSnackSeverity] = useState('success')
  const [snackOpen, setSnackOpen] = useState(false)

  useEffect(() => {
    getStatus()
  }, [])

  const snackClose = () => {
    setSnackOpen(false)
  }

  const simulationRestartCallback = (sim_id, status, info) => {
    setSnackSeverity(status)
    if (status === 'success') {
      setSnackText(`Succesfully restarted ${sim_id}`)
    } else {
      setSnackText(`Failed to restart ${sim_id}: reason: ${info}`)
    }
    setSnackOpen(true)
  }

  const simulationDeleteCallback = (sim_id, status, info) => {
    setSnackSeverity(status)
    if (status === 'success') {
      setSnackText(`Succesfully deleted ${sim_id}`)
    } else {
      setSnackText(`Failed to detele ${sim_id}: reason: ${info}`)
    }
    setSnackOpen(true)
  }

  const simulationReportCallback = (sim_id) => {}

  const deleteSimulation = async (sim_id) => {
<<<<<<< HEAD
    const url = `http://localhost/api/simulations/${sim_id}`;
    await fetch(url, { method: "DELETE" });
  };

  const getStatus = async () => {
    const url = `http://localhost/api/simulations`;
    //GET method here
    const response = await fetch(url, {
      method: 'GET'
    })
    const data = await response.json()
    if (response.status !== 200) {
    } else {
      setInstances(data.instances)
      setSimulations(data.simulations)
    }
  }

  return (
    <Stack direction="column" spacing={2} flex sx={{ width: '100%' }}>
      <h3> SLB Status </h3>
      <Stack direction="row" spacing={2}>
        <InstanceStatusTable instanceData={instances} />
        <SimulationStatusManager
          simulationData={simulations}
          deleteCallback={simulationDeleteCallback}
          restartCallback={simulationRestartCallback}
        />
      </Stack>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={snackClose}>
        <Alert
          onClose={snackClose}
          severity={snackSeverity}
          sx={{ width: '100%' }}
        >
          {snackText}
        </Alert>
      </Snackbar>
      <Button onClick={getStatus}> Get status </Button>
    </Stack>
  )
}

export default SimulationDisplay
