import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'

const DisplayList = (props) => {
  const { name, collection, onItemClick, selectedItem } = props

  return (
    <Box
      sx={{
        width: '100%',
        height: 600,
        maxWidth: 360,
        bgcolor: 'background.paper',
        display: 'inline-block'
      }}
    >
      <div aria-label="main-agents">
        <h2> {name} </h2>
        <List
          sx={{
            minHeight: 550,
            maxHeight: 550,
            overflow: 'auto',
            border: 'solid',
            borderColor: 'black'
          }}
        >
          {collection.map((item, index) => {
            return (
              <ListItem
                sx={
                  index === selectedItem
                    ? {
                        bgcolor: '#1976d2',
                        color: 'white'
                      }
                    : {}
                }
                disablePadding
                onClick={() => onItemClick(item, index)}
              >
                <ListItemButton>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </div>
    </Box>
  )
}

DisplayList.propTypes = {
  name: PropTypes.string.isRequired,
  collection: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onItemClick: PropTypes.func
}

export default DisplayList
