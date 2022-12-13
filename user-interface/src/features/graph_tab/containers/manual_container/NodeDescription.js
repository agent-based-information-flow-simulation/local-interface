import React, { useState, useEffect } from 'react'
import { Stack, TextField, Button, MenuItem } from '@mui/material'

import { useSelector } from 'react-redux'
import { selectAgents } from '../../../simulationSlice'

export const NodeDescription = (props) => {
  const { nodeCallback, descriptionCallback } = props
  const agents = useSelector(selectAgents)
  const [nodeType, setNodeType] = useState(
    agents.length > 0 ? agents[0].name : ''
  )
  const [graphDescription, setNodeDescription] = useState('')

  const handleDescriptionChange = (event) => {
    setNodeDescription(event.target.value)
  }

  const handleChange = (e) => {
    setNodeType(e.target.value)
  }

  useEffect(() => {
    nodeCallback(nodeType)
  }, [nodeType])

  return (
      <Stack
        direction="row"
        component = "form"
        sx = {{
          width: '1200px',
          m: 1
        }}
      >
        <TextField
          id="select-agent-type"
          select
          label="Select Node Type"
          value={nodeType}
          onChange={handleChange}
          sx={{ width: '50%' }}
        >
          {agents.map((agent) => (
            <MenuItem key={agent.name} value={agent.name}>
              {agent.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="graphDescription"
          label="Description"
          multiline
          style={{ width: '100%' }}
          rows={4}
          value={graphDescription}
          onChange={handleDescriptionChange}
        />

        <Button onClick={(e) => descriptionCallback(graphDescription)}> Make graph </Button>
      </Stack>
  )
}

export default NodeDescription
