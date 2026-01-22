FROM docker.elastic.co/beats/filebeat:8.11.0

USER root

# Copy config into image
COPY filebeat.yml /usr/share/filebeat/filebeat.yml

# Fix permissions (owner writable only)
RUN chmod 644 /usr/share/filebeat/filebeat.yml && chown root:root /usr/share/filebeat/filebeat.yml

USER filebeat