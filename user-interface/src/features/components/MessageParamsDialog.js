import React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { Container } from '@mui/material'
import { validateQualifiedName } from '../../app/utils'
import MessageFloatParam from './MessageFloatParam'

import { useDispatch } from 'react-redux'

export const MessageParamsDialog = (props) => {
  const { onClose, open, type, addParam } = props
  const dispatch = useDispatch()

  const handleClose = (event, reason) => {
    onClose(false)
  }

  const save = (paramData) => {
    const param = {}
    if (!validateQualifiedName(paramData.name)) onClose(true)
    else {
      param.name = paramData.name
      param.type = paramData.type
      dispatch(addParam(param))
      onClose(false)
    }
  }

  const ModeDisplay = () => {
    switch (type) {
      case 'float':
        return <MessageFloatParam save={save}/>
      default:
        return <></>
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Container sx={{ padding: 3 }}>
        <DialogTitle> New parameter </DialogTitle>
        <ModeDisplay />
      </Container>
    </Dialog>
  )
}
