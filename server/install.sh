#!/bin/bash
# References:
# https://pip.pypa.io/en/stable/cli/pip/
LOG_DIR_PIP="./"
PY_VENV="prosperiti-ai"

conda create -n prosperiti-ai python=3.12
conda activate prosperiti-ai
pip install --no-input --require-virtualenv --log $LOG_PIP -r requirements.txt 