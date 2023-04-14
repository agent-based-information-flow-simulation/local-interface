export class Vertex {
  constructor (label, x, y) {
    this.label = label
    this.x = x
    this.y = y
  }
}

export class Graph {
  constructor () {
    this.node_map = []
    this.edge_map = {}
    this.matrix = []
  }

  static copy_graph (graph) {
    const copy = new Graph()
    copy.node_map = graph.node_map
    copy.matrix = graph.matrix
    copy.edge_map = graph.edge_map
    return copy
  }

  static get_edge_id(from, to) {
    // cantor's pairing function
    return (from + to) * (from + to + 1) / 2 + to;
  }
  
  static get_random_graph( n, p ){
    const graph = new Graph()
  }


  static graph_from_description (description) {
    // example:
    // 5,K,1,2,3,4,K,4,5
    const arr = description.split(',')
    const graph = new Graph()
    const n = parseInt(arr[0])
    const theta = 2 * Math.PI / n
    const r = n * 20
    for (let i = 1; i <= n; i++) {
      const node = new Vertex(i, r * Math.cos(theta * i), r * Math.sin(theta * i))
      graph.add_node(node)
    }
    let complete_graph_labels = []
    let state = {
      complete: false,
      inverse: false,
    }
    for (let i = 1; i < arr.length; i++) {
      if( arr[i] === 'K' ){
        if(state.complete){
          graph.add_complete_graph(complete_graph_labels)
          complete_graph_labels = []
        }else if(state.inverse){
          graph.add_inverse_graph(complete_graph_labels)
          complete_graph_labels = []
        }
        state.complete = true;
        state.inverse = false;

      }else if( arr[i] === 'I' ){
        if(state.complete){
          graph.add_complete_graph(complete_graph_labels)
          complete_graph_labels = []
        }else if(state.inverse){
          graph.add_inverse_graph(complete_graph_labels)
          complete_graph_labels = []
        }
        state.complete = false;
        state.inverse = true;
      }else{
        console.log(arr[i])
        console.log(parseInt(arr[i]) - 1)
        complete_graph_labels.push(parseInt(arr[i]) - 1)
      }
    }
    if(state.complete){
      graph.add_complete_graph(complete_graph_labels)
    }else{
      graph.add_inverse_graph(complete_graph_labels)
    }
    return graph;
  }

  add_node (node) {
    this.node_map.push(node)
    this.matrix.forEach((row) => {
      row.push(0)
    })
    this.matrix.push(Array(this.node_map.length).fill(0))
  }

  delete_node (node_label) {
    const node_index = this.node_map.indexOf(node_label)
    this.node_map.splice(node_index, 1)
    this.matrix.splice(node_index, 1)
    this.matrix.forEach((row) => {
      row.splice(node_index, 1)
    })
  }

  add_edge (node_index_1, node_index_2, id) {
    console.log("Adding edge " + id + " between " + node_index_1 + " and " + node_index_2)
    this.matrix[node_index_1][node_index_2] == 1 ?
      this.matrix[node_index_1][node_index_2] = 0 :
      this.matrix[node_index_1][node_index_2] = 1
    this.matrix[node_index_2][node_index_1] == 1 ?
      this.matrix[node_index_2][node_index_1] = 0 :
      this.matrix[node_index_2][node_index_1] = 1
    this.edge_map[id] = {first: node_index_1, second: node_index_2}
    console.log(this.matrix)
    console.log(this.edge_map)
  }

  delete_edge (edge_id) {
    console.log("Deleting edge " + edge_id)
    console.log(this.edge_map)
    const edge = this.edge_map[edge_id]
    this.matrix[edge.first][edge.second] = 0
    this.matrix[edge.second][edge.first] = 0
    delete this.edge_map[edge_id]
  }

  get_nodes () {
    return this.node_map.map((node, index) => {
      return {
        id: index,
        label: node.label,
        color: {
          border: 'black',
          background: 'white'

        },
        x: node.x,
        y: node.y
      }
    })
  }

  get_edges () {
    const edges = []
    this.matrix.forEach((row, row_index) => {
      row.forEach((value, col_index) => {
        if (value === 1) {
          edges.push({
            from: row_index,
            to: col_index,
            id: Graph.get_edge_id(row_index, col_index)
          })
        }
      })
    })
    return edges
  }

  add_complete_graph (edge_list) {
    for(let i=0; i<edge_list.length; i++){
      for(let j=i+1; j<edge_list.length; j++){
        this.add_edge(edge_list[i], edge_list[j], Graph.get_edge_id(edge_list[i], edge_list[j]))
      }
    }
  }

  add_inverse_graph ( edge_list ) {
    let inverse_list = this.node_map.map((node, index) => index).filter((node) => !edge_list.includes(node))
    console.log("Inverse list: " + inverse_list)
    this.add_complete_graph(inverse_list)
  }

  get_description () {
    let description = this.node_map.length + ","
    let complete_graph_labels = []
  }

  get_AASM () {
    const preamble = "GRAPH matrix\n"
    const size = "SIZE " + this.node_map.length + "\n"
    let code = preamble + size
    this.matrix.forEach((row, index) => {
      code += "DEFNODE " + this.node_map[index].label + ", R" + row.join('') + "\n"
    })
    const epilogue = "EGRAPH\n"
    code += epilogue
    return code
  }
}

export default Graph

