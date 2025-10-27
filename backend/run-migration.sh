#!/bin/bash
# Script to run migration via Railway
cd /home/vanilla-ke/development/VANILLA\ RECOVERY\ HUB/backend
railway run --service 8df6322a-d1b8-4599-bf4a-53c153f09d1e npm run migrate
