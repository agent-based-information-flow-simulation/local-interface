import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Stack,
  Autocomplete,
  Select,
  MenuItem,
  TextField,
  IconButton
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { useDispatch } from 'react-redux'
import {
  openBlock
} from '../editorSlice'

const EnumCondOps = [
  { opcode: 'IEQ ', label: '==' },
  { opcode: 'INEQ', label: '!=' }
]

export const CondEnumStatement = (props) => {
  const { save, setEditOn, variables } = props
  const dispatch = useDispatch()

  const [curLhs, setCurLhs] = useState('')
  const [lhsError, setLhsError] = useState(false)
  const [curRhs, setCurRhs] = useState('')
  const [rhsError, setRhsError] = useState(false)
  const [curOpCode, setCurOpCode] = useState(EnumCondOps[0].opcode)

  const [rhsCandidates, setRhsCandidates] = useState([])

  const handleLhsChange = (value) => {
    setCurLhs(value)
    const val = variables.find(el => el.name === value)
    setRhsCandidates(val.values.map((el, index) => el.name))
  }

  const handleRhsChange = (value) => {
    setCurRhs(value)
  }

  const addCondStatement = () => {
    let err_flag = false
    if (
      variables.findIndex((el) => el.name === curLhs) === -1 &&
      isNaN(parseFloat(curLhs))
    ) {
      setLhsError(true)
      err_flag = true
    }
    if (
      rhsCandidates.findIndex((el) => el === curRhs) === -1 &&
      isNaN(parseFloat(curRhs))
    ) {
      setRhsError(true)
      err_flag = true
    }
    if (!err_flag) {
      const statement =
        'If ' +
        curLhs +
        ' ' +
        EnumCondOps.find((el) => el.opcode === curOpCode).label +
        ' ' +
        curRhs
      const operation = curOpCode + '    ' + curLhs + ',' + curRhs
      dispatch(openBlock())
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
        options={variables.map((el, index) => el.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: '200px' }}
        error={lhsError}
        value={curLhs}
        inputValue={curLhs}
        onInputChange={(event, value) => handleLhsChange(value)}
        helperText="LHS must be a valid variable or a number"
      />
      <Select value={curOpCode} onChange={(e) => setCurOpCode(e.target.value)}>
        {EnumCondOps.map((op, index) => {
          return <MenuItem value={op.opcode}> {op.label} </MenuItem>
        })}
      </Select>
      <Autocomplete
        freeSolo
        options={rhsCandidates}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: '200px' }}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        disabled={curLhs === ''}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid variable or a number"
      />
      <IconButton sx={{ p: '10px' }} color="primary" onClick={addCondStatement}>
        <AddCircleIcon sx={{ fontSize: '30px' }} />
      </IconButton>
    </Stack>
  )
}

CondEnumStatement.propTypes = {
  save: PropTypes.func.isRequired,
  setEditOn: PropTypes.func.isRequired,
  variables: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    }))
  })).isRequired
}

export default CondEnumStatement
