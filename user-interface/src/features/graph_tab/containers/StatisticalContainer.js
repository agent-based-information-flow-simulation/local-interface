import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setGraph } from '../../simulationSlice'

import { Button, Grid, Alert, TextField } from '@mui/material'
import StatisticalDescEditor from '../editors/StatisticalDescEditor'

export const StatisticalContainer = (props) => {
  const dispatch = useDispatch()

  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertDisplay, setAlertDisplay] = useState(false)
  const [codeSet, setCodeSet] = useState(false)
  const [graphSize, setGraphSize] = useState('')
  const [showError, setShowError] = useState(false)
  const [graphData, setGraphData] = useState({})
  const [defgCode, setDefgCode] = useState('')

  const alertClose = () => {
    setError(false)
    setSuccess(false)
    setAlertDisplay(false)
  }

  const codeCallback = (code, info, data) => {
    setCodeSet(false)
    setAlertDisplay(false)
    setAlertText(info)
    setGraphData(data)
    setError(false)
    setSuccess(false)

    if (code !== 'ERROR') {
      setError(true)
    } else {
      setSuccess(true)
      setDefgCode(code)
      setCodeSet(true)
    }
  }

  const saveGraph = () => {
    setShowError(true)
    setAlertDisplay(true)
    if (codeSet) {
      if (isNaN(parseInt(graphSize))) {
        setSuccess(false)
        setError(true)
        setAlertText('Specify graph size!!!')
      }
      setSuccess(true)
      let code = 'GRAPH statistical\n'
      code += 'SIZE ' + graphSize + '\n'
      code += defgCode
      code += 'EGRAPH\n'
      const graph = {
        type: 'statistical',
        size: graphSize,
        agents: graphData.agentData,
        code
      }
      dispatch(setGraph(graph))
    }
  }

  return (
      <Grid container
      direction="column"
      >
        <Grid item sx={2}>
          <TextField label="Graph Size" value={graphSize} onChange={(e) => setGraphSize(e.target.value)}/>
        </Grid>
        <Grid item sx={11}>
        <StatisticalDescEditor codeCallback={codeCallback} displayError={showError} />
        </Grid>
        <Grid item sx={1}>
          {
            alertDisplay
              ? (
                  error
                    ? (
                <Alert severity="error" onClose={alertClose}> {alertText}</Alert>
                      )
                    : success
                      ? (
                <Alert severity="success" onClose={alertClose}> Saved sucessfully! </Alert>
                        )
                      : <> </>
                )
              : <></>
          }
        </Grid>
        <Grid item sx={1}>
        <Button variant="contained" onClick={saveGraph} sx={{ margin: 5 }}> Save Graph Description </Button>
        </Grid>
      </Grid>

  )
}

export default StatisticalContainer
