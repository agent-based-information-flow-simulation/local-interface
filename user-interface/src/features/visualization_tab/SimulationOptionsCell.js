import React from 'react'

import { TableCell, IconButton } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import streamSaver from 'streamsaver'

export const SimulationOptionsCell = (props) => {
  const { simulation, deleteCallback, reportCallback, restartCallback } = props

  const deleteSimulation = async () => {
    const url = `http://localhost/api/simulations/${simulation.simulation_id}`
    // LDE
    // const url = `http://localhost/api/simulation/${simulation.simulation_id}`;
    await fetch(url, { method: 'DELETE' })
      .then((response) => {
        if (response.status === 200) {
          deleteCallback(simulation.simulation_id, 'success', '')
        } else {
          deleteCallback(simulation.simulation_id, 'error', response.status)
        }
      })
      .catch((error) => {
        deleteCallback(simulation.simulation_id, 'error', error)
      })
  }

  const restartSimulation = async () => {
    const url = `http://localhost/api/simulations/${simulation.simulation_id}`
    //const url = `http://localhost/api/simulation/${simulation.simulation_id}`;
    await fetch(url, { method: 'POST' })
      .then((response) => {
        if (response.status === 201) {
          restartCallback(simulation.simulation_id, 'success', '')
        } else {
          restartCallback(simulation.simulation_id, 'error', response.status)
        }
      })
      .catch((error) => {
        restartCallback(simulation.simulation_id, 'error', error)
      })
  }

  const openSimulationReport = () => {
    reportCallback(simulation.simulation_id)
  }

  // https://stackoverflow.com/questions/40939380/how-to-get-file-name-from-content-disposition
  const getTimeseriesFilename = async (response) => {
    const contentDisposition = response.headers.get('content-disposition')
    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(contentDisposition)
      if (matches !== null && matches[1]) {
        return matches[1].replace(/['"]/g, '')
      }
    } else {
      return 'timeseries.json'
    }
  }

  const downloadTimeseries = async (simulationId) => {
    const url = `http://localhost/api/simulations/${simulationId}/timeseries`
    //const url = `http://localhost/api/simulation/${simulationId}/timeseries`;
    const response = await fetch(url)
    if (response.status === 400) {
      const body = await response.json()
      console.error(body.detail)
      return
    } else if (response.status !== 200) {
      console.error('Error downloading timeseries')
      return
    }

    const filename = await getTimeseriesFilename(response)
    const fileStream = streamSaver.createWriteStream(filename)
    await response.body.pipeTo(fileStream)
  }

  return (
    <TableCell>
      {simulation.status !== 'ACTIVE'
        ? (
        <IconButton
          sx={{ p: '10px' }}
          color="primary"
          onClick={restartSimulation}
        >
          <RestartAltIcon sx={{ fontSize: '30px' }} />
        </IconButton>
          )
        : (
        <IconButton
          sx={{ p: '10px' }}
          color="primary"
          onClick={deleteSimulation}
        >
          <RemoveCircleIcon sx={{ fontSize: '30px' }} />
        </IconButton>
          )}
      <IconButton
        sx={{ p: '10px' }}
        color="primary"
        onClick={openSimulationReport}
      >
        <AssessmentOutlinedIcon sx={{ fontSize: '30px' }} />
      </IconButton>
      <IconButton
        sx={{ p: '10px' }}
        color="primary"
        onClick={() => downloadTimeseries(simulation.simulation_id)}
      >
        <DownloadIcon sx={{ fontSize: '30px' }} />
      </IconButton>
    </TableCell>
  )
}

export default SimulationOptionsCell
