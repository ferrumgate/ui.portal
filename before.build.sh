cat package.json | grep version | cut -d':' -f2 | tr -d ' ' | tr -d ','
