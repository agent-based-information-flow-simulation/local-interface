import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types"
import Neovis from "neovis.js/dist/neovis.js"

export const NeoGraph = (props) => {
  const {
    width,
    height,
    containerId,
    neo4jUri,
  } = props;

  const graphRef = useRef();

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
      initial_cypher: "MATCH (a: Agent) OPTIONAL MATCH (a)-[r]->() RETURN a, r",
    };
    const graph = new Neovis(config);
    graph.render();
  }, [neo4jUri])

  return (
    <div
      id={containerId}
      ref={graphRef}
      style={{
        width: {width},
        height: {height},
        backgroundColor: "white"
      }}
    />
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
};

export default NeoGraph;
