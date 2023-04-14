import React, { useState, useEffect } from 'react'

import {FormGroup, FormControlLabel, Switch} from '@mui/material'

import PropTypes from 'prop-types'

export class NDConfiguration {
    constructor() {
        this.gdl = false;
        this.code = false;
    }
}

export const NDConfig = (props) => {
  const { configCallback } = props
  const [config, setConfig] = useState(new NDConfiguration())

  const handleGDLChange = (event) => {
    const new_config = {...config, gdl: event.target.checked}
    setConfig(new_config)
    configCallback(new_config)

  }

  const handleCodeChange = (event) => {
    const new_config = {...config, code: event.target.checked}
    setConfig(new_config)
    configCallback(new_config)
  }

  return (
    <FormGroup>
      <FormControlLabel 
        control={<Switch defaultChecked />}
        onChange={handleGDLChange}
        checked={config.gdl}
        label="GDL" />
      <FormControlLabel 
        control={<Switch defaultChecked />}
        onChange={handleCodeChange}
        checked={config.code}
        label="CODE" />
    </FormGroup>
  )
}

export default NDConfig

NDConfig.propTypes = {
  configCallback: PropTypes.func.isRequired,
}
