import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types"
import Neovis from "neovis.js/dist/neovis.js"

import useResizeAware from "react-resize-aware";
import { Button } from "@mui/material";

export const NeoGraph = (props) => {
  const {
    width,
    height,
    containerId,
    neo4jUri,
    simId,
  } = props;

  const graphRef = useRef();
  let graph;

  useEffect(() => {
    const config = {
      container_id: graphRef.current.id,
      server_url: neo4jUri,
      server_user: "",
      server_password: "",
      labels: {
        Agent: {}
      },
      relationships: {
        connections: {
          caption: false,
          thickness: "count",
        }
      },
      initial_cypher: "MATCH (a: Agent {simulation_id: '"+ simId +"'}) OPTIONAL MATCH (a)-[r]->() RETURN a, r",
    };
    graph = new Neovis(config);
    graph.render();
  }, [neo4jUri])

  return (
    <>
    <div
      id={containerId}
      ref={graphRef}
      style={{
        width: {width},
        height: {height},
        backgroundColor: "white"
      }}
    />
    <Button onClick={() => graph.stabilize()}> Stabilize </Button>
    </>
  )
}

NeoGraph.defaultProps = {
  width: 600,
  height: 600,
};

NeoGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  simId: PropTypes.string.isRequired,
};

export const ResizableGraph = (props) => {
  const [resizeListener, size] = useResizeAware()
  const side = Math.max(size.width, size.height) / 2;

  const neoprops = {...props, width: side, height: side}
  return (
    <div style={{ position: "relative"}}>
      {resizeListener}
      <NeoGraph {...neoprops} />
    </div>
  )
};

ResizableGraph.propTypes = {
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  simId: PropTypes.string.isRequired
};

export default NeoGraph;