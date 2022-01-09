import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"

export const SelectList = (props) => {
  const {name, collection, options, handleParamTypeChange, collectionItemClick, collectionDisplayFunction} = props

  let itemDisplay = useRef( (item) => {
    return item.name;
  });

  return (
    <Box
      sx={{
        maxWidth: 360,
        minWidth: 360,
        bgcolor: "background.paper",
        display: "inline-block",
      }}
    >
      <nav aria-label="main parameters">
        <h2> {name} </h2>
        <List
          sx={{
            minHeight: 422,
            maxHeight: 422,
            border: "solid",
            borderColor: "black",
            overflow: "auto",
          }}
        >
          {collection.map((item, index) => {
            return (
              <ListItem key={index} disablePadding onClick={(e)=>collectionItemClick(index)}>
                <ListItemButton >
                  <ListItemText primary={collectionDisplayFunction === undefined ? itemDisplay(item) : collectionDisplayFunction(item)} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel> Select type </InputLabel>
          <Select label="Select type">
            {
              options.map((item) => {
                return (
                  <MenuItem value={item.value} onClick={handleParamTypeChange}>
                    {item.display}
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
      </nav>
    </Box>
  );
};

SelectList.propTypes = {
  name: PropTypes.string.isRequired,
  collection: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      display: PropTypes.string.isRequired,
    })).isRequired,
  handleParamTypeChange: PropTypes.func.isRequired,
  collectionItemClick: PropTypes.func.isRequired,
}

export default SelectList;
