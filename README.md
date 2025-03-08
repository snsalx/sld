The docs are coming sometime in March.

## Self-Hosting

```bash
docker build -t sld .

docker run -p 80:3000 -p 8090:8090 -e BACKEND_URL="localhost:8090" -v sld:/pb/pb_data sld
```

## Working Notes

commit scopes:

- viewer
- slide
- project
- list
- auth
- backend
