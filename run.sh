#!/bin/sh

/pb/pocketbase serve --http=0.0.0.0:8080 &
npm run start &
wait -n
exit $?
