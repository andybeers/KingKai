# WECLOME TO KING KAI AGENT, THE LOYAL EYES AND EARS OF KING KAI

## About
The king kai agent is the process that runs on all the servers you wish
to monitor. King kai agent is responsible for reporting the stats of it's host
back to the king kai central server at regular intervals.

To make things simple, an ansible deployment script is provided to build and install
the agents on every server you wish to monitor.  By default, docker is
used to run the agent on each host.

## Installation
- KingKai provides ansible scripts to deploy kingkai agent.
  See deployment dir for more information

## Configuration
- config for agent is kept in kai file (just yaml format)
- must set kai_host, which is where all data will be sent

