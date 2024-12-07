# Run the Akave Node 
```bash
docker run -d \
  -p 8000:3000 \
  -e NODE_ADDRESS="connect.akave.ai:5500" \
  -e PRIVATE_KEY="" \
  akave/akavelink:latest
```

# Run Walrus
walrus --config client_config.yaml get-wal

## Run Walrus Aggrigator & Publisher
walrus daemon -b "127.0.0.1:31415" --config client_config.yaml 