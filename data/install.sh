#!/bin/bash
LOG_PIP="./"
PY_VENV="prosperiti-data"

conda create -n $PY_VENV python=3.12
conda activate $PY_VENV
pip install --no-input --require-virtualenv --log $LOG_PIP -r requirements.txt
