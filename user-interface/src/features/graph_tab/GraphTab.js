import React, { useState } from 'react'
import { Stack, Divider } from '@mui/material'
import DisplayList from '../components/DisplayList'
import StatisticalContainer from './containers/StatisticalContainer'
import ManualContainer from './containers/manual_container/ManualContainer'

const stat_desc_name = 'Statistical Description'
const manual_setup_name = 'Manual Setup'

const graphDescTypes = [stat_desc_name, manual_setup_name]

export const GraphTab = () => {
  const [modeIndex, setModeIndex] = useState(0)
  const clickedMode = (el, index) => {
    setModeIndex(index)
  }

  return (
    <>
    <Stack
      direction="row"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ color: 'black', borderWidth: 1 }}
        />
      }
      spacing={2}
    >
      <DisplayList
        name="Graph description type"
        collection={graphDescTypes}
        onItemClick={clickedMode}
        selectedItem={modeIndex}
      />
      {
        modeIndex === graphDescTypes.indexOf(stat_desc_name) ? <StatisticalContainer /> : <></>
      }{
        modeIndex === graphDescTypes.indexOf(manual_setup_name) ? <ManualContainer /> : <></>
      }
    </Stack>
    </>
  )
}

export default GraphTab
