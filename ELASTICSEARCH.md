### OpenSearch Local Docker Environment

https://www.elastic.co/guide/en/elasticsearch/reference/8.6/docker.html

Pull the latest OpenSearch image:

`docker pull docker.elastic.co/elasticsearch/elasticsearch:8.6.1`

`docker network create elastic`

`docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.6.1`

Password for the elastic user (reset with `bin/elasticsearch-reset-password -u elastic`):
  JWa*J6=6+u-oYLzlruZh

ℹ️  HTTP CA certificate SHA-256 fingerprint:
  0c8b9f8ea4201665ac5d211c9087ba21625ef02740d6c76dd79944d6fc57cb8e

ℹ️  Configure Kibana to use this cluster:
• Run Kibana and click the configuration link in the terminal when Kibana starts.
• Copy the following enrollment token and paste it into Kibana in your browser (valid for the next 30 minutes):
  eyJ2ZXIiOiI4LjYuMSIsImFkciI6WyIxNzIuMTguMC4yOjkyMDAiXSwiZmdyIjoiMGM4YjlmOGVhNDIwMTY2NWFjNWQyMTFjOTA4N2JhMjE2MjVlZjAyNzQwZDZjNzZkZDc5OTQ0ZDZmYzU3Y2I4ZSIsImtleSI6IkJCUUtHWVlCcVpJS3Zad2VrVDhJOmJXQS01b1lBUXhtTHdVSmYtSmZmRFEifQ==
  
Configure other nodes to join this cluster:
• Copy the following enrollment token and start new Elasticsearch nodes with `bin/elasticsearch --enrollment-token <token>` (valid for the next 30 minutes):
  eyJ2ZXIiOiI4LjYuMSIsImFkciI6WyIxNzIuMTguMC4yOjkyMDAiXSwiZmdyIjoiMGM4YjlmOGVhNDIwMTY2NWFjNWQyMTFjOTA4N2JhMjE2MjVlZjAyNzQwZDZjNzZkZDc5OTQ0ZDZmYzU3Y2I4ZSIsImtleSI6IkJSUUtHWVlCcVpJS3Zad2VrVDhKOlhNV1U2UVVaUmotdC1BUWxoYWhhUGcifQ==

  If you're running in Docker, copy the enrollment token and run:
  `docker run -e "ENROLLMENT_TOKEN=<token>" docker.elastic.co/elasticsearch/elasticsearch:8.6.1`




OLD
********************************************************





To run the image for local development:

```
docker run \
-p 9200:9200 -p 9600:9600 \
-e "discovery.type=single-node" \
-v /Users/derekau/Projects/pma-opensearch/opensearch-dev.yml:/usr/share/opensearch/config/opensearch.yml \
opensearchproject/opensearch:latest
```

(Note the use of opensearch-dev.yml, you will need to change the full directory path for this file.)

Then send requests to the server to verify that OpenSearch is up and running:

```
curl -XGET http://localhost:9200
curl -XGET http://localhost:9200/_cat/nodes?v
curl -XGET http://localhost:9200/_cat/plugins?v
```

To find the container ID:
`docker ps`

Then you can stop the container using:
`docker stop <container-id>`

#### Run the Fastify server

* Development: `npm run dev`
* Beta: `npm run beta` (only works within AWS VPC)
* Production: `npm run prod` (only works within AWS VPC)

The config/development.json will point to the OpenSearch server running locally within the Docker container.

### pma-opensearch Dockerfile

Current Docker image is node:16-alpine (LTS)

TODO: Add docker-compose and run both OpenSearch & pma-opensearch in containers for local development & testing.





## Kibana

https://www.elastic.co/guide/en/kibana/8.6/docker.html

docker pull docker.elastic.co/kibana/kibana:8.6.1
docker run --name kib-01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.6.1


docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana --url "https://172.0.0.3:9200"