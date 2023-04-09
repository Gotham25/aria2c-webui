#!/bin/bash

RPC_LISTEN_PORT=6800
ARIA2C_PROCESS_PID=
DOWNLOADS_DIRECTORY="./public/downloads"

checkAria2cProcessStatus() {
  echo "Checking for aria2c process status..."
  ARIA2C_PROCESS_PID=$(netstat -anp 2>/dev/null | grep $RPC_LISTEN_PORT | rev | cut -d ' ' -f1 | cut -d '/' -f2 | rev)
}

checkAria2cProcessStatus

if [ -z "$ARIA2C_PROCESS_PID" ]; then
  echo "aria2c process not running. Trying to start it on the port, $RPC_LISTEN_PORT"
else
  echo "aria2c process is already running in the background with pid, $ARIA2C_PROCESS_PID"
  exit 0
fi

if [ ! -f /app/aria2c ]; then
  echo "ERROR: aria2c binary not found"
  exit 2
fi

if [ -d "${DOWNLOADS_DIRECTORY}" ]; then
  echo "Downloads directory exists. Clearing the directory contents..."
  rm -rf "${DOWNLOADS_DIRECTORY}/*"
fi

# nohup ./aria2c --conf-path=./aria2.conf </dev/null >/dev/null 2>&1 &

nohup ./aria2c --enable-rpc --rpc-listen-all --log=aria2c.log </dev/null >/dev/null 2>&1 &

sleep 3

checkAria2cProcessStatus

if [ -z "$ARIA2C_PROCESS_PID" ]; then
  echo "ERROR: aria2c process is not listening on port $RPC_LISTEN_PORT"
  exit 3
fi

echo "aria2c process in started in background with pid, $ARIA2C_PROCESS_PID"

