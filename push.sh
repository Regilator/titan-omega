#!/bin/bash
# Script to automate Git push for Titan-omega

# Check if a commit message was provided
if [ -z "$1" ]; then
    echo "Usage: ./push.sh \"your commit message\""
    exit 1
fi

git add .
git commit -m "$1"
git push origin main

echo "Changes pushed to GitHub successfully!"

