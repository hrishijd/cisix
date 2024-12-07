# Run the Akave Node 
```bash
docker run -d \
  -p 8000:3000 \
  -e NODE_ADDRESS="connect.akave.ai:5500" \
  -e PRIVATE_KEY="" \
  akave/akavelink:latest
```