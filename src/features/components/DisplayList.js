import React from "react";
import PropTypes, { arrayOf } from "prop-types"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"

const DisplayList = (props) => {
  const {name, collection} = props;

  return(
      <Box
        sx={{
          width: "100%",
          height: 600,
          maxWidth: 360,
          bgcolor: "background.paper",
          display: "inline-block",
        }}
      >
        <nav aria-label="main agents">
          <h2> {name} </h2>
          <List
            sx={{
              minHeight: 550,
              maxHeight: 550,
              overflow: "auto",
              border: "solid",
              borderColor: "black",
            }}
          >
            {collection.map((item) => {
              return (
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary={item} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Box>

  )
}

DisplayList.propTypes = {
  name: PropTypes.string.isRequired,
  collection: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}

export default DisplayList;