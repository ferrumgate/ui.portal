#!/bin/bash

set -e
first="$1"
second="$2"

npm run buildprod
version=$(cat package.json | grep version | cut -d: -f2 | tr -d , | tr -d \" | tr -d " ")

docker build -t ui.portal .
echo "ui.portal:$version builded"
docker tag ui.portal registry.ferrumgate.zero/ferrumgate/ui.portal:"$version"
docker tag ui.portal registry.ferrumgate.zero/ferrumgate/ui.portal:latest
docker tag ui.portal ferrumgate/ui.portal:"$version"

execute() {
    docker push registry.ferrumgate.zero/ferrumgate/ui.portal:"$version"
    docker push registry.ferrumgate.zero/ferrumgate/ui.portal:latest
    if [ "$first" == "--push" ] || [ "$second" == "--push" ]; then
        docker push ferrumgate/ui.portal:"$version"

    fi

}

if [ "$first" == "--force" ] || [ "$second" == "--force" ]; then
    execute
    exit
else
    while true; do
        read -r -p "do you want push to local registry y/n " yn
        case $yn in
        [Yy]*)
            execute
            break
            ;;
        [Nn]*) exit ;;
        *) echo "please answer yes or no." ;;
        esac
    done
fi
