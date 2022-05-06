#!/bin/bash

function usage() {
  echo "Usage: $0 {init|join|network|start|stop|clean|stats|services|publish|reload}"
  echo "       init: initialize the swarm cluster"
  echo "       join TOKEN IP:PORT: join the swarm cluster"
  echo "       network (REQUIRES SWARM CLUSTER): create shared networks for the swarm cluster"
  echo "       start [-d: dev mode [-p: publish]] (REQUIRES SWARM CLUSTER): start the server"
  echo "       stop: stop the server"
  echo "       clean: stop the server and remove all docker data"
  echo "       stats: print stats from all services"
  echo "       services: print all services"
  echo "       publish [-d: dev mode (REQUIRES SWARM CLUSTER)]: publish the images to a registry"
  echo "       reload SERVICE (REQUIRES DEV MODE): rebuild and update the service"
}

function init() {
  if docker swarm init; then
    echo "swarm cluster initialized"
  else
    echo "failed to initialize swarm cluster"
  fi
}

function join() {
  if [ -z "$1"]; then
    echo "missing token"
    usage
  fi
  if [-z "$2"]; then
    echo "missing address"
    usage
  fi
  if docker swarm join --token "$1" "$2"; then
    echo "swarm cluster joined"
  else
    echo "failed to join swarm cluster"
  fi
}

function network() {
  if docker network create --driver overlay --attachable li-sre; then
    echo "[local-interface <-> simulation run environment] created"
  else
    echo "[local-interface <-> simulation run environment] failed to create"
  fi
}

function start() {
  DEV=0
  PUBLISH=0
  while getopts dpx opt; do
    case $opt in
      d) DEV=1 ;;
      p) PUBLISH=1 ;;
      *) usage ;;
    esac
  done

  if [ "$DEV" -eq "1" ]; then
    COMPOSE_FILE=docker-compose.dev.swarm.yml
    if [ "$PUBLISH" -eq "1" ]; then publish -d; fi
  else
    COMPOSE_FILE=docker-compose.swarm.yml
  fi

  source .env
  if env VERSION="${VERSION}" docker stack deploy -c ./"$COMPOSE_FILE" li; then
    echo "Interface can be accessed on port 80"
  else
    echo ""
    echo "failed to start the server"
    echo ""
    echo "if you see the following error:"
    echo "failed to create service X: Error response from daemon: network Y not found"
    echo "then restart docker daemon (i.e. sudo systemctl restart docker) and run ./server.sh clean"
    echo ""
    echo "if you see the following error:"
    echo "network X is declared as external, but could not be found"
    echo "run the script with the network option to create the required networks"
  fi
}

function stop() {
  docker stack rm li
}

function clean() {
  stop
  docker swarm leave --force
  docker system prune --all --volumes
}

function stats() {
  docker stats
}

function services() {
  docker service ls
  echo ""
  echo "if you notice that some of the services are not up"
  echo "then stop the server, publish the images, create the shared networks, and start the server again"
  echo ""
  echo "sre_kafka-topic-creator is expected to run only once"
}

function publish() {
  local OPTIND
  DEV=0
  while getopts d opt; do
    case $opt in
      d) DEV=1 ;;
      *) usage ;;
    esac
  done

  if [ "$DEV" -eq "1" ]; then
    echo "creating local registry"
    if ! docker service ps -q registry > /dev/null 2>&1; then
        if ! docker service create --name registry --publish published=5000,target=5000 registry:2; then
            echo "failed to create registry"
            usage
        fi
    else
        echo "registry already exists"
    fi
    docker-compose -f docker-compose.dev.swarm.yml build --parallel && \
    docker-compose -f docker-compose.dev.swarm.yml push
  else
    source .version
    read -p "Publish version ${VERSION} to registry? [y/n] " -r VERSION_ANSWER
    read -p "Publish version latest to registry? [y/n] " -r LATEST_ANSWER

    if [ "$VERSION_ANSWER" != "y" ] && [ "$LATEST_ANSWER" != "y" ]; then
      echo "aborting"
      exit 1
    fi

    if [ "$VERSION_ANSWER" == "y" ]; then
      env VERSION="${VERSION}" docker-compose -f docker-compose.swarm.yml build --parallel && \
      env VERSION="${VERSION}" docker-compose -f docker-compose.swarm.yml push && \
      echo "published version ${VERSION}"
    fi

    if [ "$LATEST_ANSWER" == "y" ]; then
      env VERSION=latest docker-compose -f docker-compose.swarm.yml build --parallel && \
      env VERSION=latest docker-compose -f docker-compose.swarm.yml push && \
      echo "published version latest"
    fi
  fi
}

function reload() {
  if [ -z "${1}" ]; then
    echo "missing service name"
    usage
  fi

  docker-compose -f docker-compose.dev.swarm.yml build "${1}" && \
  docker-compose -f docker-compose.dev.swarm.yml push && \
  docker service update li_"${1}" --force
}

case "${1}" in
  init) init ;;
  join) join "${2}" "{3}" ;;
  network) network ;;
  start) start "${@:2}" ;;
  stop) stop ;;
  clean) clean ;;
  stats) stats ;;
  services) services ;;
  publish) publish "${2}" ;;
  reload) reload "${2}" ;;
  *) usage ;;
esac