#!/bin/bash



if pgrep -x "node" >/dev/null 2>&1
  then
     sudo pkill node
  else
     echo " node is not running/stopped "
fi