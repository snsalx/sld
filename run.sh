#!/bin/sh

/pb/pocketbase serve --http=0.0.0.0:8090 &
npm run start &
wait -n
exit $?
