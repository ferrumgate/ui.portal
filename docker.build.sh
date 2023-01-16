#!/bin/bash

set -e
npm run buildprod
version=$(cat package.json | grep version | cut -d: -f2 | tr -d , | tr -d \" | tr -d " ")

docker build -t ui.portal .
echo "ui.portal:$version builded"
docker tag ui.portal registry.ferrumgate.local/ferrumgate/ui.portal:$version
docker tag ui.portal registry.ferrumgate.local/ferrumgate/ui.portal:latest
docker tag ui.portal ferrumgate/ui.portal:$version

while true; do
    read -p "do you want push to local registry y/n " yn
    case $yn in
    [Yy]*)
        docker push registry.ferrumgate.local/ferrumgate/ui.portal:$version
        docker push registry.ferrumgate.local/ferrumgate/ui.portal:latest
        break
        ;;
    [Nn]*) exit ;;
    *) echo "please answer yes or no." ;;
    esac
done
