import React from 'react'

import { Box } from '@mui/material'

export const InlineText = (props) => {
  return (
    <Box
      sx={{ width: '70px', textAlign: 'center', verticalAlign: 'middle', p: '15px' }}
    >
      {props.text}
    </Box>

  )
}

export default InlineText
