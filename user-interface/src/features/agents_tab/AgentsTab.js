import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import {
  DialogActions,
  DialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Alert
} from '@mui/material'
import ParamsDialog from '../components/ParamsDialog'
import BehavDialog from './BehavDialog'
import SelectList from '../components/SelectList'
import DisplayList from '../components/DisplayList'
import { useSelector, useDispatch } from 'react-redux'
import { validateAgentName, errorCodes } from '../../app/utils'

import {
  selectParameters,
  addParam,
  selectBehaviours,
  reset
} from './agentsTabSlice'
import { addAgent, selectAgents, addName } from '../simulationSlice'

export function AgentsTab (props) {
  const dispatch = useDispatch()

  const paramListOptions = [
    { value: 'float', display: 'Float' },
    { value: 'enum', display: 'Enumerable' },
    { value: 'list', display: 'Connections/Messages' }
  ]

  const behavListOptions = [
    { value: 'onSetup', display: 'Setup' },
    { value: 'oneTime', display: 'One Time' },
    { value: 'cyclic', display: 'Cyclic' },
    { value: 'onMessageReceive', display: 'On Message Receive' }
  ]

  const [paramDialogOpen, setParamDialogOpen] = React.useState(false)
  const [behavDialogOpen, setBehavDialogOpen] = React.useState(false)
  const [paramDialogType, setParamDialogType] = React.useState('')
  const [behavDialogType, setBehavDialogType] = React.useState('')
  const [notifyError, setNotifyError] = React.useState(false)

  const [agentName, setAgentName] = React.useState('')
  const [nameError, setNameError] = React.useState(false)
  const [nameErrorText, setNameErrorText] = React.useState('')
  const [behavError, setBehavError] = React.useState(false)
  const [paramError, setParamError] = React.useState(false)

  const params = useSelector(selectParameters)
  const behavs = useSelector(selectBehaviours)
  const agents = useSelector(selectAgents)
  // const messages = useSelector(selectMessageTypes);

  const handleNameChange = (name) => {
    setNameError(false)
    setAgentName(name)
  }

  const handleParamTypeChange = (e) => {
    setParamDialogType(e.target.dataset.value)
    setParamDialogOpen(true)
  }

  const handleBehavTypeChange = (e) => {
    setBehavDialogType(e.target.dataset.value)
    setBehavDialogOpen(true)
  }

  const handleBehavClose = (error) => {
    setNotifyError(error)
    setBehavDialogOpen(false)
  }

  const handleParamClose = (error) => {
    setNotifyError(error)
    setParamDialogOpen(false)
  }

  const handleNotifyClose = () => {
    setNotifyError(false)
  }

  const generatePRM = (param) => {
    let code = 'PRM ' + param.name + ','
    switch (param.type) {
      case 'float':
        code += 'float,'
        switch (param.mode) {
          case 'init':
            code += 'init,' + param.value + '\n'
            return code
          case 'distribution':
            code += 'dist,' + param.distribution + ','
            param.distribution_args.forEach((el) => (code += el + ','))
            code = code.slice(0, -1) + '\n'
            return code
          default:
            return ''
        }
      case 'enum':
        code += 'enum'
        param.values.forEach(
          (val) => (code += ',' + val.name + ',' + val.percentage)
        )
        return code + '\n'
      case 'list':
        code += 'list,'
        switch (param.mode) {
          case 'conn':
            return code + 'conn\n'
          case 'msg':
            return code + 'msg\n'
          default:
            return ''
        }
      default:
        return ''
    }
  }

  const saveAgent = () => {
    let err_flag = false
    if (validateAgentName(agentName) !== 0) {
      err_flag = true
      const err_code = validateAgentName(agentName)
      const error = errorCodes.find((el) => el.code === err_code)
      setNameErrorText(error.info)
      setNameError(true)
    }
    if (behavs.length === 0) {
      err_flag = true
      setBehavError(true)
    }
    if (params.length === 0) {
      err_flag = true
      setParamError(true)
    }
    if (!err_flag) {
      let code = 'AGENT ' + agentName + '\n'
      params.forEach((el) => (code += generatePRM(el)))
      behavs.forEach((el) => (code += el.code))
      code += 'EAGENT\n'
      const agent = {
        name: agentName,
        params: [...params],
        behavs: [...behavs],
        code
      }
      dispatch(addAgent(agent))
      dispatch(addName(agentName))
      setAgentName('')
      dispatch(reset())
    }
  }

  return (
    <>
      <ParamsDialog
        open={paramDialogOpen}
        onClose={handleParamClose}
        type={paramDialogType}
        addParam={addParam}
      />
      <BehavDialog
        open={behavDialogOpen}
        handleClose={handleBehavClose}
        type={behavDialogType}
      />
      <Dialog open={notifyError} onClose={handleNotifyClose}>
        <DialogTitle> Error while saving </DialogTitle>
        <DialogContent>
          <DialogContentText>
            An error occured while attempting to save your data. This may be a
            result of incorrectly filling out the form.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotifyClose}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Stack
        direction="row"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ color: 'black', borderColor: 'black', borderWidth: 1 }}
          />
        }
        spacing={2}
      >
        <DisplayList
          name="Created Agents"
          collection={agents.map((el) => el.name)}
        />
        <Box
          sx={{
            width: '100%',
            height: 700,
            maxWidth: 720,
            bgcolor: 'background.paper',
            display: 'inline-block',
            paddingTop: 9,
            marginLeft: 10
          }}
        >
          <Stack>
            <Box sx={{ textAlign: 'left' }}>
              <TextField
                variant="outlined"
                label="Agent Type Name"
                id="agent_type_input"
                value={agentName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </Box>
            <Stack direction="row">
              <SelectList
                name="Parameters"
                collection={params}
                collectionDisplayFunction={(item) =>
                  item.name + ' (' + item.type + ')'
                }
                options={paramListOptions}
                handleParamTypeChange={handleParamTypeChange}
                collectionItemClick={() => {}}
              />
              <SelectList
                name="Behaviours"
                collection={behavs}
                options={behavListOptions}
                handleParamTypeChange={handleBehavTypeChange}
                collectionItemClick={() => {}}
              />
            </Stack>
            {behavError
              ? (
              <Alert severity="error" onClose={(e) => setBehavError(false)}>
                Error saving! Please add some behaviours
              </Alert>
                )
              : (
              <></>
                )}
            {paramError
              ? (
              <Alert severity="error" onClose={(e) => setParamError(false)}>
                Error saving! Please add some parameters
              </Alert>
                )
              : (
              <></>
                )}
            {nameError
              ? (
              <Alert severity="error" onClose={(e) => setNameError(false)}>
                Name Error: {nameErrorText}
              </Alert>
                )
              : (
              <></>
                )}
            <Button variant="contained" onClick={saveAgent}>
              {' '}
              Add Agent{' '}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
