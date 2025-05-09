#!/bin/bash

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 ARG1 ARG2 ARG3"
  exit 1
fi

ARG1=$1
ARG2=$2
ARG3=$3

OUTPUT_FILE="/home/ec2-user/prosperiti/.env"

sudo cat <<EOF >> "$OUTPUT_FILE"
OPENAI_API_KEY="$ARG1"
GMAP_API_TOKEN="$ARG2"
MEETUP_API_TOKEN="$ARG3"
EOF