# Frontend

Next.js application served via ECS Fargate. In production it sits behind the shared CloudFront distribution and communicates with the Quarkus backend at the `/api` path prefix.

## Local development

```bash
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

The app is available at `http://localhost:3000`. `NEXT_PUBLIC_API_URL` points at a locally running Quarkus backend (see the root `docker-compose.yml` to start the database).

## Building the Docker image

The image is multi-stage and targets `linux/arm64` to match the Fargate task definition.

```bash
docker build --platform linux/arm64 -t getting-started-frontend:latest .
```

`NEXT_PUBLIC_API_URL` is baked in as `/api` during the build stage so the browser routes API calls through the same CloudFront domain, which the ALB then forwards to the backend.

### Pushing to ECR

```bash
# Retrieve the ECR URL from Terraform output
ECR_URL=$(cd ../terraform && terraform output -raw frontend_ecr_repository_url)
```

# Authenticate

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 331374384642.dkr.ecr.us-east-1.amazonaws.com
```

# Tag

```bash
docker tag getting-started-frontend:latest 331374384642.dkr.ecr.us-east-1.amazonaws.com/getting-started-frontend:latest
```

# Push

```bash
docker push 331374384642.dkr.ecr.us-east-1.amazonaws.com/getting-started-frontend:latest
```

### Deploying to ECS

After pushing the image, force a new deployment so ECS pulls the updated image:

```bash
aws ecs update-service \
  --cluster getting-started \
  --service getting-started-frontend \
  --force-new-deployment
```
