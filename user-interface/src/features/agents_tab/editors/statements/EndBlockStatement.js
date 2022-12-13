import React from 'react'
import PropTypes from 'prop-types'
import {
  Stack,
  IconButton
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import InlineText from '../InlineText'

import { useDispatch } from 'react-redux'
import {
  closeBlock
} from '../editorSlice'

export const EndBlockStatement = (props) => {
  const { save } = props
  const dispatch = useDispatch()

  const addEndCondStatement = () => {
    const statement = 'End block'
    const operation = 'EBLOCK'
    dispatch(closeBlock())
    save(statement, operation)
  }

  return (
    <Stack direction="row">
      <InlineText text="End conditional block" />
      <IconButton
        sx={{ p: '10px' }}
        color="primary"
        onClick={addEndCondStatement}
      >
        <AddCircleIcon sx={{ fontSize: '30px' }} />
      </IconButton>
    </Stack>
  )
}

EndBlockStatement.propTypes = {
  save: PropTypes.func.isRequired
}

export default EndBlockStatement
