#!/bin/bash
set -e
LOG_DIR_PIP="./pip.log"
PY_VENV="prosperiti"
ALT_TMP="./tmp-pip"

# Create the virtual environment
python3.12 -m venv "$PY_VENV"

# Activate the virtual environment
source "$PY_VENV/bin/activate"

# Install the requirements and log output
mkdir -p "$ALT_TMP"
TMPDIR="$ALT_TMP" pip install --no-input --no-cache-dir --require-virtualenv --log "$LOG_DIR_PIP" -r requirements.txt