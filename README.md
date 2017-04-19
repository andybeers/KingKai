# WELCOME TO THE KINGKAI PROJECT

## About

KingKai intends to provide a simple, elegant solution for monitoring a
fleet of servers.

KingKai uses a push model for monitoring: each server you wish to monitor
will have a kai agent installed on it (see back_end/deployment for more info)
that phones home to a single kai_host, which is the server that aggregates
data for all kai agents.

### Run locally

After cloning the repo, start running mongoDB, and from the king_kai/server directory, run:
  - npm i
  - npm start
  
### Testing

After cloning the repo, start running mongoDB, and from the king_kai/server directory, run:
  - npm i
  - npm test
