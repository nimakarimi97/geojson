---
title: Docs
---

<script setup>
const { t } = useI18n()
useHead({ title: () => t('button.docs') })
</script>

<div flex items-center justify-start gap-2 text-4xl primary-color>
  <!-- You can use Vue components inside markdown -->
  <div i-carbon-dicom-overlay  />
  <h3 m-0 >{{ t('button.docs') }}</h3>
</div>

## Kubernetes Deployment Guide with Helm Charts

### Prerequisites

- Kubernetes cluster access configured (`kubectl` working)
- Helm CLI installed (v3+)
- Docker credentials
- Application Docker image built and pushed to registry

## 1. Initial Setup

### File Transfer

Copy Kubernetes configuration files to the build server:

```bash
scp -r /home/nkarimi/kubernates nkarimi@k8s-build:/home/nkarimi/
```

### Create Namespace

```bash
kubectl create namespace mobile-data
```

### Set Up Docker Registry Credentials

With generic we can use the docker config.json file, whereas using docker-registry it's possible to add several users to the same docker registry.

```bash
# Login to Docker Hub
docker login

# Create Kubernetes secret for Docker credentials
kubectl create secret generic docker-secret -n mobile-data \
  --from-file=.dockerconfigjson=/home/nkarimi/.docker/config.json \
  --type=kubernetes.io/dockerconfigjson

kubectl create secret docker-registry regcred-pinbike -n mobile-data --docker-server=serviceinnovation.tilab.com --docker-username=FB-Innovation-Token --docker-password=<password>

kubectl create secret docker-registry frontend-geojson -n mobile-data --docker-server=serviceinnovation.tilab.com --docker-username=Nima-Token-Frontend-geoJson --docker-password=<password>
```

### How to build on Mac (ARM CPU)

```bash
docker buildx build --platform linux/amd64 --push  -t serviceinnovation.tilab.com/jol-catania/live-mobility-data/express:1.1.4 .
```

## 2. Prepare Helm Chart

### Configure Chart Values

Edit `values.yaml` to match your application requirements:

```bash
nano values.yaml
nano templates/configmap.yaml
```

Key configurations to check:

- Image repository, tag, and pull policy
- Resource limits and requests
- Service ports
- Persistence settings (if needed)
- Ingress configuration
- Environment variables (Note: ports should be strings using the format "{{ }}")

## 3. Validate Chart

```bash
# Lint the chart to find issues
helm lint .

# Perform a dry run to validate the chart
helm template v1 . -n mobile-data

# Validate server-side rendering
helm install --dry-run --debug v1 . -n mobile-data
```

## 4. Deploy Application

### First-time Installation

```bash
cd helm-chart-dir

# Update dependencies
helm dependency update

# Install with namespace creation
helm install v1 . -n mobile-data --create-namespace

# Install or upgrade release
helm upgrade --install v1 . -n mobile-data --create-namespace

# Install with specific set value overrides
helm install v1 . -n mobile-data --set image.tag=v1.2.3 --set service.port=8080
```

### TLS secret

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout tls.key \
-out tls.crt \
-subj "/C=IT/ST=Italy/L=catania/O=tim/OU=it/CN=<ingress host name>"
```

### Update Existing Deployment

```bash
# Upgrade with new values
helm upgrade v1 . -n mobile-data

# Upgrade with values file and set overrides
helm upgrade v1 . -n mobile-data -f custom-values.yaml --set replicas=3
```

## 5. Verify Deployment

```bash
# Check release status
helm list -n mobile-data

# Check pods status
kubectl get pods -n mobile-data

# get all
kubectl get all -n mobile-data

# Describe specific pod
kubectl describe pod -n mobile-data

# View logs
kubectl logs -f -n mobile-data
```

## 6. Access Application

### Port Forwarding (for testing)

```bash
kubectl port-forward svc/v1 8080:80 -n mobile-data
```

### Entering the databases

```bash
# mongodb
kubectl exec -it v9-mongodb-646779f778-7t4mq -c mongodb -n mobile-data -- bash
mongosh -u jol -p wave2013! --authenticationDatabase mobile-data
    show dbs
    show collections
    db.cities_configs.find()

# postgresql
kubectl exec -it v1-postgresql-0 -n mobile-data -- bash
psql -U mobility_user -d mobility-data-processing
postgres_user1!

  \dt
  SELECT * FROM sessions;
```

## 7. Rollback (if needed)

```bash
# List revision history
helm history v1 -n mobile-data

# Rollback to specific revision
helm rollback v1 1 -n mobile-data
```

## 8. Clean Up

```bash
# Uninstall release
helm uninstall v1 -n mobile-data

# Delete namespace (removes all resources within)
kubectl delete namespace mobile-data
```

## Troubleshooting Tips

- **Pod not starting**: Check events with `kubectl describe pod <pod-name> -n mobile-data`
- **Image pull issues**: Verify secret is correct `kubectl get secret -n mobile-data`
- **Configuration issues**: Check ConfigMaps with `kubectl get configmap -n mobile-data`
- **Resource constraints**: Check resource usage with `kubectl top pods -n mobile-data`
- **Persistent volume issues**: Check PVCs with `kubectl get pvc -n mobile-data`
