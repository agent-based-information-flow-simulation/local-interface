import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Stack,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  IconButton
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

const FloatExprOps = [
  { opcode: 'ADD ', label: '+=' },
  { opcode: 'SUBT', label: '-=' },
  { opcode: 'MULT', label: '*=' },
  { opcode: 'DIV ', label: '/=' }
]

export const ExprStatement = (props) => {
  const { save, setEditOn, lhsCandidates, rhsCandidates } = props

  const [curLhs, setCurLhs] = useState('')
  const [lhsError, setLhsError] = useState(false)
  const [curRhs, setCurRhs] = useState('')
  const [rhsError, setRhsError] = useState(false)
  const [curOpCode, setCurOpCode] = useState(FloatExprOps[0].opcode)

  const handleLhsChange = (value) => {
    setCurLhs(value)
  }

  const handleRhsChange = (value) => {
    setCurRhs(value)
  }

  const addExprStatement = () => {
    // validate LHS
    let err_flag = false
    if (lhsCandidates.findIndex((el) => el.name === curLhs) === -1) {
      setLhsError(true)
      err_flag = true
    }
    // validate RHS
    if (
      rhsCandidates.findIndex((el) => el.name === curRhs) === -1 &&
      isNaN(parseFloat(curRhs))
    ) {
      setRhsError(true)
      err_flag = true
    }
    if (!err_flag) {
      const statement =
        curLhs +
        ' ' +
        FloatExprOps.find((el) => el.opcode === curOpCode).label +
        ' ' +
        curRhs
      const operation = curOpCode + '    ' + curLhs + ',' + curRhs
      save(statement, operation)
      setEditOn(false)
      setLhsError(false)
      setRhsError(false)
    }
  }

  return (
    <Stack direction="row">
      <Autocomplete
        freeSolo
        options={lhsCandidates.map((el, index) => el === undefined ? '' : el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: '200px' }}
        error={lhsError}
        value={curLhs}
        inputValue={curLhs}
        onInputChange={(event, value) => handleLhsChange(value)}
        helperText="LHS must be a valid property"
      />
      <Select value={curOpCode} onChange={(e) => setCurOpCode(e.target.value)}>
        {FloatExprOps.map((op, index) => {
          return <MenuItem value={op.opcode}> {op.label} </MenuItem>
        })}
      </Select>
      <Autocomplete
        freeSolo
        options={rhsCandidates.map((el, index) => el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: '200px' }}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid property or a number"
      />
      <IconButton sx={{ p: '10px' }} color="primary" onClick={addExprStatement}>
        <AddCircleIcon sx={{ fontSize: '30px' }} />
      </IconButton>
    </Stack>
  )
}

ExprStatement.propTypes = {
  save: PropTypes.func.isRequired,
  setEditOn: PropTypes.func.isRequired,
  lhsCandidates: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string
  })).isRequired,
  rhsCandidates: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string
  })).isRequired
}

export default ExprStatement
