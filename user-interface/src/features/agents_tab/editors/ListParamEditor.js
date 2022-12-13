import React, { useState } from 'react'
import {
  Stack,
  Box,
  Select,
  MenuItem,
  FormHelperText,
  IconButton
} from '@mui/material'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import StatementDisplay from './StatementDisplay'

export const ListParamEditor = (props) => {
  const { save, rcvMsg } = props
  const [editOn, setEditOn] = useState(false)

  const [statementType, setStatementType] = useState('expr')

  return (
    <>
      <Stack direction="row" sx={{ display: 'flex' }}>
        <Box sx={{ width: '100%' }}>
          <Select
            sx={{ width: '100%' }}
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
          >
            <MenuItem value={'add_element'}> Add element to list </MenuItem>
            <MenuItem value={'rand'}> Assignment (random number) </MenuItem>
            <MenuItem value={'rem_element'}>
              {' '}
              Remove element from list{' '}
            </MenuItem>
            <MenuItem value={'rem_n_el'}>
              {' '}
              Remove some elements from list{' '}
            </MenuItem>
            <MenuItem value={'clr_list'}> Clear list </MenuItem>
            <MenuItem value={'subset'}> Store subset of a list </MenuItem>
            <MenuItem value={'get_len'}> Get length of a list </MenuItem>
            <MenuItem value={'expr'}> Math Expression </MenuItem>
            <MenuItem value={'decl'}> Declaration </MenuItem>
            <MenuItem value={'cond_float'}> Conditional (number) </MenuItem>
            <MenuItem value={'cond_enum'}> Conditional (enum) </MenuItem>
            <MenuItem value={'cond_list'}> Conditional (list) </MenuItem>
            <MenuItem value={'while_float'}>
              {' '}
              Do while Condition (number){' '}
            </MenuItem>
            <MenuItem value={'while_enum'}>
              {' '}
              Do while Condition (enum){' '}
            </MenuItem>
            <MenuItem value={'endb'}> End Block (condition/while) </MenuItem>
          </Select>
          <FormHelperText> Choose statement type </FormHelperText>
        </Box>
        <IconButton
          sx={{ width: 60, p: '10px' }}
          color="primary"
          onClick={(e) => setEditOn(true)}
          disabled={editOn}
        >
          <AddCircleIcon sx={{ fontSize: '45px' }} />
        </IconButton>
      </Stack>
      <StatementDisplay
        save={save}
        editOn={editOn}
        setEditOn={setEditOn}
        statementType={statementType}
        rcvMsg={rcvMsg}
      />
    </>
  )
}

export default ListParamEditor
