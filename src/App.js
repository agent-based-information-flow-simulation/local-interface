import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./App.css";
import { TabPanel, a11yProps } from "./features/tab_panel/TabPanel";
import { AgentsTab } from "./features/agents_tab/AgentsTab";
import { MessageTab } from "./features/message_tab/MessageTab";

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Agents" {...a11yProps(0)} />
          <Tab label="Messages" {...a11yProps(1)} />
          <Tab label="Graph" {...a11yProps(2)} />
          <Tab label="Visualisation" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AgentsTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MessageTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </div>
  );
}

export default App;
