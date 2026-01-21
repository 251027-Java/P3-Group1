# Generated with assistance from GPT-5 mini
# Reviewed and modified by Pranav Koduri

# ELK + Filebeat (logging)

Run the ELK stack and Filebeat that reads the microservice log volumes.

Quick start:

1. Create the named volumes (if not present):
```bash
docker volume create react_service_logs
docker volume create angular_service_logs
```

2. From the `elk/` folder run:
```bash
docker-compose up -d
```

Notes:
- `filebeat` mounts the named volumes as read-only and sends logs to `logstash`.
- Ensure your microservices write logs to `/var/log/react-service` and `/var/log/angular-service` inside their containers.
- To inspect the logs in a volume:
```bash
docker run --rm -v react_service_logs:/data busybox sh -c "ls -la /data && tail -n 50 /data/*.log"
```
