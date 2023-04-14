import React, { useState, useEffect } from 'react'
import { FormControl, TextField, Button } from '@mui/material'

export const MessageFloatParam = (props) => {
  const { save } = props

  const [paramName, setParamName] = useState('')
  const [paramData, setParamData] = useState({})

  const updateParamData = () => {
    const newParamData = {}
    newParamData.name = paramName
    newParamData.type = 'float'
    setParamData(newParamData)
  }
  // I have no idea why this works
  useEffect(() => {
    updateParamData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramName])

  return (
    <>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <TextField
          variant="outlined"
          label="Name"
          id="param_name"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
        />
      </FormControl>
      <Button onClick={(e) => save(paramData)}> Add parameter </Button>
    </>

  )
}

export default MessageFloatParam
