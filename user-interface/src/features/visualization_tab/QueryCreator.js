import React, { useState } from "react";
import {
  Stack,
  Select,
  MenuItem,
  TextField,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const QueryCreator = (props) => {
  const { queryCallback } = props;

  const [queryType, setQueryType] = useState("agent");
  const [advancedMode, setAdvancedMode] = useState(false);

  const [type, setType] = useState("");
  const [param, setParam] = useState("");
  const [msgList, setMsgList] = useState("");
  const [msgType, setMsgType] = useState("");
  const [connList, setConnList] = useState("");

  const handleQueryTypeChange = (value) => {
    setQueryType(value);
  };

  const runQuery = () => {
    let searchParamString = "";
    switch (queryType) {
      case "agent":
        searchParamString += "agents/";
        break;
      case "message":
        searchParamString += "messages/";
        break;
      default:
        return; // just don't run the query
    }
    searchParamString += type + "?";
    searchParamString += `property=${param}&`;
    if (advancedMode) {
      searchParamString += "&";
      searchParamString += `message_list=${msgList}&`;
      searchParamString += `message_type=${msgType}&`;
      searchParamString += `connection_list=${connList}`;
    }
    queryCallback(searchParamString, `${type} data`);
  };

  return (
    <Box>
      Query Creator
      <FormControlLabel
        sx={{ paddingLeft: 5 }}
        control={
          <Switch
            checked={advancedMode}
            onChange={(e) => setAdvancedMode(!advancedMode)}
          />
        }
        label="Advanced mode"
      />
      <Stack direction="row" spacing={1}>
        <Select
          sx={{ width: "10em" }}
          value={queryType}
          onChange={(e) => handleQueryTypeChange(e.target.value)}
        >
          <MenuItem value="agent">Agent</MenuItem>
          <MenuItem value="message">Message</MenuItem>
        </Select>
        {advancedMode ? (
          <>
            <TextField
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
            />
            <TextField
              value={param}
              onChange={(e) => setParam(e.target.value)}
              label="Property"
            />
            <TextField
              value={msgList}
              onChange={(e) => setMsgList(e.target.value)}
              label="Message List"
            />
            <TextField
              value={msgType}
              onChange={(e) => setMsgType(e.target.value)}
              label="Message Type"
            />
            <TextField
              value={connList}
              onChange={(e) => setConnList(e.target.value)}
              label="Connection List"
            />
          </>
        ) : (
          <>
            <TextField
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
            />
            <TextField
              value={param}
              onChange={(e) => setParam(e.target.value)}
              label="Parameter name"
            />
          </>
        )}
        <IconButton sx={{ p: "10px" }} color="primary" onClick={runQuery}>
          <PlayArrowIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default QueryCreator;
