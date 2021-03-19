#!/bin/bash


if pgrep node
then
pkill node
else
echo " node is not running/stopped "
fi
