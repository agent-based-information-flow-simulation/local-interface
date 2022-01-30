import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NeoVis from "neovis.js/dist/neovis.js";

import useResizeAware from "react-resize-aware";
import { Button } from "@mui/material";

export const NeoGraph = (props) => {
  const { width, height, containerId, neo4jUri, simId } = props;

  const config = {
    visNetworkConfig: {
      nodes: {
        font: {
          size: 20,
          strokeWidth: 0,
        },
        scaling: {},
      },
      edges: {
        arrows: {
          to: { enabled: false },
        },
      },
      layout: {
        randomSeed: 2137,
        // hierarchical: {
        //   enabled: false,
        //   sortMethod: 'hubsize'
        // }
      },
      physics: {
        enabled: false,
      },
    },
    container_id: containerId,
    server_url: neo4jUri,
    server_user: "",
    server_password: "",
    labels: {
      Agent: {},
    },
    relationships: {
      connections: {
        caption: false,
        thickness: "count",
      },
    },
    initial_cypher:
      "MATCH (a: Agent {simulation_id: '" +
      simId +
      "'}) OPTIONAL MATCH (a)-[r]->() RETURN a, r",
  };

  //this new needs to be twice or it breaks sometimes, I hate this lib
  const [graph, setGraph] = useState(() => new NeoVis(config));

  useEffect(() => {
    //this new needs to be twice or it breaks sometimes, I hate this lib
    let graph_tmp = new NeoVis(config);
    setGraph(graph_tmp);
    graph_tmp.render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    graph.reload();
  };

  return (
    <>
      <div
        id={containerId}
        style={{
          width: width,
          height: height,
          border: "1px solid black",
          backgroundColor: "white",
        }}
      />
      <Button onClick={refresh}> Refresh </Button>
    </>
  );
};

NeoGraph.defaultProps = {
  width: 900,
  height: 900,
};

NeoGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  simId: PropTypes.string.isRequired,
};

export const ResizableGraph = (props) => {
  const [resizeListener, size] = useResizeAware();
  const side = Math.max(size.width, size.height) / 2;

  const neoprops = { ...props, width: side, height: side };
  return (
    <div style={{ position: "relative" }}>
      {resizeListener}
      <NeoGraph {...neoprops} />
    </div>
  );
};

ResizableGraph.propTypes = {
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  simId: PropTypes.string.isRequired,
};

export default NeoGraph;
