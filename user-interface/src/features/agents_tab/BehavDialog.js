import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetActions, resetScope } from './editors/editorSlice'
import PropTypes from 'prop-types'
import { Container, Dialog, DialogTitle } from '@mui/material'
import OnSetupBehav from './behavs/OnSetupBehav'
import OneTimeBehav from './behavs/OneTimeBehav'
import CyclicBehav from './behavs/CyclicBehav'
import MessageRecvBehav from './behavs/MessageRecvBehav'

const BehavDialog = (props) => {
  const { handleClose, open, type } = props
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(resetScope())
  })

  const saveCallback = () => {
    dispatch(resetActions())
    handleClose(false)
  }

  const wrappedHandleClose = () => {
    dispatch(resetActions())
    handleClose()
  }

  const ModeDisplay = () => {
    switch (type) {
      case 'onSetup':
        return <OnSetupBehav onClose={saveCallback} />
      case 'oneTime':
        return <OneTimeBehav onClose={saveCallback} />
      case 'cyclic':
        return <CyclicBehav onClose={saveCallback} />
      case 'onMessageReceive':
        return <MessageRecvBehav onClose={saveCallback} />
      default:
        return <></>
    }
  }

  return (
    <Dialog onClose={(e) => wrappedHandleClose()} open={open}>
      <Container sx={{ padding: 3, width: '35em' }}>
        <DialogTitle> New behaviour </DialogTitle>
        <ModeDisplay />
      </Container>
    </Dialog>
  )
}

BehavDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
}

export default BehavDialog
