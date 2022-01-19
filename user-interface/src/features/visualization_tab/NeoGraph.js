import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types"
import NeoVis from "neovis.js/dist/neovis.js"

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
      visNetworkConfig:{
        nodes: {
          font: {
            size: 26,
            strokeWidth: 7
          },
          scaling: {
          }
        },
        edges: {
          arrows: {
            to: { enabled: false }
          },
          length: 200
        },
        layout: {
          improvedLayout: false,
          hierarchical: {
            enabled: false,
            sortMethod: 'hubsize'
          }
        },
        physics: {
          enabled: false,
        }
      },
      container_id: graphRef.current.id,
      server_url: neo4jUri,
      server_user: "",
      server_password: "",
      initial_cypher: "MATCH (a: Agent) OPTIONAL MATCH (a)-[r]->() RETURN a, r",
    };
    const graph = new NeoVis(config);
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
