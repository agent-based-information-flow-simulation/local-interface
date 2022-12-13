import React, { useState, useEffect } from 'react'

import {
  Stack,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
  Box
} from '@mui/material'
import { distributionsDict } from '../../../app/utils'
import InlineText from '../../agents_tab/editors/InlineText'

export const StatisticalRow = (props) => {
  const { agentData, index, handleChange } = props

  const [mode, setMode] = useState('%')
  const [amount, setAmount] = useState('')
  const [connAmountData, setConnAmountData] = useState('')
  const [distribution, setDistribution] = useState('')
  const [distArgsOn, setDistArgsOn] = useState(false)

  const [toChange, setToChange] = useState({})

  const [distributionArgs, setDistributionArgs] = useState([])

  useEffect(() => {
    updateAgentData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, connAmountData, distribution, distributionArgs])

  useEffect(() => {
    handleChange(toChange, index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toChange])

  const updateAgentData = () => {
    const tmpAd = JSON.parse(JSON.stringify(agentData)) // make a copy of existing agentData
    tmpAd.err_flag = 0
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      tmpAd.err_flag = 1
    }
    if (mode === '%') {
      tmpAd.amount = amount + '%'
    } else if (mode === '#') {
      tmpAd.amount = amount
    } else {
      tmpAd.err_flag = 2
    }

    if (isNaN(parseInt(connAmountData))) {
      const foundKey = Object.keys(distributionsDict).find((key, index) => {
        return distributionsDict[key].name === connAmountData
      })
      if (foundKey !== undefined) {
        const foundDist = distributionsDict[foundKey]
        if (foundDist.validate(distributionArgs)) {
          tmpAd.draw_from_distribution = true
          tmpAd.distribution = foundKey
          tmpAd.dist_args = distributionArgs
        } else {
          tmpAd.err_flag = 4
        }
      } else {
        tmpAd.err_flag = 3
      }
    } else {
      tmpAd.draw_from_distribution = false
      tmpAd.conn_amount = connAmountData
    }
    setToChange(tmpAd)
  }

  const handleDistributionArgChange = (value, id) => {
    let index = id.split('_')
    index = parseInt(index[index.length - 1])
    if (!isNaN(index)) {
      const newArgs = [...distributionArgs]
      newArgs[index] = value
      setDistributionArgs(newArgs)
    }
    updateAgentData()
  }

  const handleModeChange = (value) => {
    setMode(value)
    updateAgentData()
  }

  const handleAmountChange = (value) => {
    setAmount(value)
    updateAgentData()
  }

  const handleConnDataChange = (value) => {
    setConnAmountData(value)
    const found = Object.keys(distributionsDict).find((key, index) => {
      return distributionsDict[key].name === value
    })
    if (found !== undefined) {
      setDistArgsOn(true)
      setDistribution(found)
    } else {
      setDistArgsOn(false)
      setDistribution('')
    }
    updateAgentData()
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: '56px', width: '100%' }}
    >
      <Box
        sx={{
          borderRight: 'solid',
          borderColor: 'black',
          width: '100%',
          whiteSpace: 'nowrap',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        <InlineText text={agentData.name} />
      </Box>
      <Box
        sx={{
          borderRight: 'solid',
          borderColor: 'black',
          width: '100%',
          whiteSpace: 'nowrap',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <Select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value)}
          >
            <MenuItem value="%"> % of population </MenuItem>
            <MenuItem value="#"> number of agents </MenuItem>
          </Select>
        </Stack>
      </Box>
      <Box sx={{ width: '100%', whiteSpace: 'nowrap', p: '20px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            freeSolo
            options={Object.keys(distributionsDict).map(
              (el, index) => distributionsDict[el].name
            )}
            renderInput={(params) => <TextField {...params} />}
            sx={{ width: '150px' }}
            value={connAmountData}
            inputValue={connAmountData}
            onInputChange={(event, value) => handleConnDataChange(value)}
          ></Autocomplete>
          {distArgsOn
            ? (
                [...Array(distributionsDict[distribution].arg_count).keys()].map(
                  (key, index) => {
                    return (
                  <TextField
                    label={distributionsDict[distribution].param_names[index]}
                    type="number"
                    value={distributionArgs[index]}
                    onChange={(e) => {
                      handleDistributionArgChange(e.target.value, e.target.id)
                    }}
                    InputProps={{ inputProps: { step: 0.1 } }}
                    sx={{ margin: 1, width: '80px' }}
                    id={distribution + '_param_' + index}
                  />
                    )
                  }
                )
              )
            : (
            <></>
              )}
        </Stack>
      </Box>
    </Stack>
  )
}

export default StatisticalRow
