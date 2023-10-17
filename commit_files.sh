#!/bin/bash

for file in *; do
    if [ "$file" != "commit_files.sh" ]; then
        git add -f "$file"
        git commit -m "Adding $file"
    fi
done
