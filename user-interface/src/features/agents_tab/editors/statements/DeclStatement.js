import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Stack,
  Autocomplete,
  TextField,
  IconButton
} from '@mui/material'

import { useDispatch } from 'react-redux'
import { addScopeVar } from '../editorSlice'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import InlineText from '../InlineText'

export const DeclStatement = (props) => {
  const { save, setEditOn, variables } = props

  const dispatch = useDispatch()

  const typeLookup = (name) => {
    const variable = variables.find(el => el.name === name)
    if (variable) {
      return variable.type
    } else {
      return ''
    }
  }

  const handleLhsChange = (value) => {
    setCurLhs(value)
  }

  const handleRhsChange = (value) => {
    setCurRhs(value)
  }

  const [curLhs, setCurLhs] = useState('')
  const [lhsError, setLhsError] = useState(false)
  const [curRhs, setCurRhs] = useState('')
  const [rhsError, setRhsError] = useState(false)

  const addDeclStatement = () => {
    // validate LHS
    let err_flag = false
    if (variables.findIndex((el) => el.name === curLhs) !== -1) {
      setLhsError(true)
      err_flag = true
    }
    // validate RHS
    if (
      variables.findIndex((el) => el.name === curRhs) === -1 &&
      isNaN(parseFloat(curRhs))
    ) {
      setRhsError(true)
      err_flag = true
    }
    if (!err_flag) {
      if (isNaN(parseFloat(curRhs))) {
        dispatch(addScopeVar({
          name: curLhs,
          type: typeLookup(curRhs)
        }))
      } else {
        dispatch(addScopeVar({
          name: curLhs,
          type: 'float'
        }))
      }
      const statement = 'let ' + curLhs + ' = ' + curRhs
      const operation = 'DECL    ' + curLhs + ',' + curRhs
      save(statement, operation)
      setEditOn(false)
    }
  }

  return (
    <Stack direction="row">
      <InlineText text="Let: " />
      <TextField
        value={curLhs}
        onChange={(e) => handleLhsChange(e.target.value)}
        error={lhsError}
        helperText="LHS must be a new identifier"
      />
      <InlineText text=" = " />
      <Autocomplete
        freeSolo
        options={variables.map((key, index) => key.name)}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: '200px' }}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid property or a number"
      />

      <IconButton sx={{ p: '10px' }} color="primary" onClick={addDeclStatement}>
        <AddCircleIcon sx={{ fontSize: '30px' }} />
      </IconButton>
    </Stack>
  )
}

DeclStatement.propTypes = {
  save: PropTypes.func.isRequired,
  setEditOn: PropTypes.func.isRequired,
  variables: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string
  })).isRequired
}

export default DeclStatement
