#!/bin/bash

set -e
npm run buildprod
version=$(cat package.json | grep version | cut -d: -f2 | tr -d , | tr -d \" | tr -d " ")

docker build -t ui.portal .
echo "ui.portal:$version builded"
docker tag ui.portal registry.ferrumgate.local/ferrumgate/ui.portal:$version
docker tag ui.portal registry.ferrumgate.local/ferrumgate/ui.portal:latest
