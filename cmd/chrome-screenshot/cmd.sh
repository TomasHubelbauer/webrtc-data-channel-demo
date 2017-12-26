#!/bin/bash
cd cmd/chrome-screenshot
nvm use # .nvmrc
node ./index.js $1
