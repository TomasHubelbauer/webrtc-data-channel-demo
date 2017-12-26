#!/bin/bash
cd cmd/firefox-screenshot
nvm use # .nvmrc
node ./index.js $1
