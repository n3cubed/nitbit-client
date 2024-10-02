# nitbit-client

## Development

```bash
npm run dev
```

Result at [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Result at ./out

## Start
```bash
npm run start
```

## Using Docker (linux/amd64/v8)
```bash
docker pull n3cubed/nitbit-client

docker run \
  -p 3000:3000
  -v ~/Desktop/nitbit_static:/app/.next/static \
  n3cubed/nitbit-client
```

Static files should be placed in the static folder on the host machine
