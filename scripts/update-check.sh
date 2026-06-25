#!/bin/bash

# Claude Skills Update Check Script
# Checks for updates and new versions

echo "Checking for Claude Skills updates..."

CURRENT_VERSION=$(cat VERSION)
echo "Current version: $CURRENT_VERSION"

# Check remote repository for updates
git fetch origin

LATEST_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "No tags found")
echo "Latest version: $LATEST_VERSION"

if [ "$CURRENT_VERSION" != "$LATEST_VERSION" ]; then
    echo "Update available!"
    echo "Run 'git pull' to update"
else
    echo "You are up to date!"
fi
