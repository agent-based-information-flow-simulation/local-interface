import React from 'react'
import { Box } from '@mui/material'

const FloatInit = (props) => {
  return (<div>Value: {props.value}</div>)
}

const FloatDistribution = (props) => {
  return (
    <>
  <div>Distribution: {props.distribution} </div>
  {
    props.distribution_args.map((arg, index) => {
      return (
        <div>
          Argument {index}: {arg}
        </div>
      )
    })
  }
  </>
  )
}

const EnumInit = (props) => {
  return (
    <>
    <div> Initial Value: {props.values[props.selectedIndex].name} </div>
    <h2>Values: </h2>
    {
      props.values.map((val, index) => {
        return (
          <div> {val.name} </div>
        )
      })
    }
    </>
  )
}

const EnumPercentages = (props) => {
  return (
    <>
    <h2>Values: </h2>
    {
      props.values.map((val, index) => {
        return (
          <div> {val.name} : {val.percentage}% </div>
        )
      })
    }
    </>
  )
}

const renderParam = (param) => {
  switch (param.type) {
    case 'float':
      if (param.mode === 'init') {
        return <FloatInit value={param.value} />
      } else {
        return <FloatDistribution distribution={param.distribution} distribution_args={param.distribution_args}/>
      }
    case 'enum':
      if (param.mode.contains('init')) {
        return <EnumInit values={param.values} selectedIndex={param.selectedInit} />
      } else {
        return <EnumPercentages values={param.values}/>
      }
    default:
      return (<></>)
  }
}

export const ParamInspector = (props) => {
  const { param } = props
  return (
    <Box
      sx={{
        width: '100%',
        height: 700,
        bgcolor: 'background.paper',
        display: 'inline-block',
        paddingTop: 9,
        marginLeft: 10
      }}
    >
      <h1> {param.name} </h1>
      <h2> {param.type} </h2>
      {renderParam(param)}
    </Box>
  )
}

export default ParamInspector
