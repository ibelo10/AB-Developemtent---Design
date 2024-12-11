#!/bin/bash
echo "⚠️  This will remove old files. Make sure you have tested the new structure."
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -rf assets
    rm -rf RN
    rm -rf RNL
    rm -rf Ariels
    rm -rf KNK
    echo "🧹 Cleanup complete!"
fi
