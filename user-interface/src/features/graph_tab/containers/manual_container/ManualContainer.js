import React, { useState, useEffect, useRef } from 'react'
import { Stack, Button } from '@mui/material'

import { Network } from 'vis-network'
import { DataSet } from 'vis-data'

import NodeDescription from './NodeDescription'

import './ManualContainer.css'
import Graph, { Vertex } from './graph'

export const ManualContainer = () => {
  const [graph, setGraph] = useState(new Graph())
  const [nodes, setNodes] = useState(new DataSet([]))
  const [edges, setEdges] = useState(new DataSet([]))

  const [nodeType, setNodeType] = useState('Agent')

  const descriptionCallback = (description) => {
    const new_graph = Graph.graph_from_description(description)
    setGraph(new_graph)
    setNodes(new_graph.get_nodes())
    setEdges(new_graph.get_edges())
  }

  // Vis
  const visJsRef = useRef(null)

  // TODO: add restoring zoom (and cam pos?)
  const add_node = (nodeData, callback) => {
    if (nodeType === '') {
      console.error('No node type selected')
    } else {
      console.log(nodeData)
      const copy = Graph.copy_graph(graph)
      const node = new Vertex(nodeType, nodeData.x, nodeData.y)
      copy.add_node(node)
      setGraph(copy)
    }
  }

  const add_edge = (edgeData, _) => {
    const copy = Graph.copy_graph(graph)
    if(edgeData.from > edgeData.to) {
      const id = Graph.get_edge_id(edgeData.from, edgeData.to)
      copy.add_edge(edgeData.from, edgeData.to, id)
    } else{
      const id = Graph.get_edge_id(edgeData.to, edgeData.from)
      copy.add_edge(edgeData.from, edgeData.to, id)
    }
    setGraph(copy)
  }

  const delete_node = (data, callback) => {
    console.log(data)
    const copy = Graph.copy_graph(graph)
    copy.delete_node(data.nodes[0])
    setGraph(copy)
    callback(null)
  }

  const delete_edge = (data, callback) => {
    console.log(data)
    const copy = Graph.copy_graph(graph)
    copy.delete_edge(data.edges[0])
    setGraph(copy)
    callback(null)
  }

  const options = {
    physics: {
      enabled: false
    },
    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: add_node,
      addEdge: add_edge,
      deleteNode: delete_node,
      deleteEdge: delete_edge
    },
    interaction: {
      hover: true
    }
  }

  useEffect(() => {
    const network = visJsRef.current &&
           new Network(visJsRef.current, { nodes, edges }, options)
    network.on('click', function (params) {
      console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM))
      console.log(params)
    })
  }, [visJsRef, nodes, edges, options])

  useEffect(() => {
    setNodes(graph.get_nodes())
    setEdges(graph.get_edges())
  }, [graph])

  const nodeTypeChanged = (nodeType) => {
    setNodeType('Agent')
  }

  return (
      <Stack
        spacing={2}
      >
        <h3>Manual setup</h3>
        <NodeDescription 
          nodeCallback={nodeTypeChanged}
          descriptionCallback={descriptionCallback}
          AASM_Code={graph.get_AASM()}
        />
        <Stack style={{width: '100%'}} direction='row'>
        <div ref={visJsRef} style={{ width: '100%', height: '800px' }}></div>
          <table className='matrix' id='matrix_tab' style={{width: '800px', height: '800px', margin: '25px', font_size: '20px'}}>
        {
          graph.matrix.map((row, i) => {
            return (
              <tr className='matrix' key={i}>
                {row.map((col, j) => {
                  return (
                    <td className='matrix' key={j}>{col}</td>
                  )
                })}
              </tr>
            )
            
          })
        }
        </table>
        </Stack>
      </Stack>
  )
}

export default ManualContainer;
