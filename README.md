# Local Interface

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

Local interface.

## Getting Started <a name = "getting_started"></a>

### Prerequisites

```
docker
docker-compose
```

### Installing
Use the `server.sh` utility script.
```
./server.sh help
```

## Usage <a name = "usage"></a>

After starting the `.dev.swarm.yml` compose file, the server in accessible on localhost. </br>
Host port mapping: </br>
* port `80` - simulation run environment entrypoint (api)
* port `8008` - simulation run environment entrypoint (neo4j)
