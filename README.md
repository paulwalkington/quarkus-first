# Getting Started

A full-stack vehicle management application. The backend is a Quarkus REST API backed by PostgreSQL. The frontend is a Next.js application. Both are containerised and deployed to AWS ECS Fargate behind CloudFront.

## Architecture

```
CloudFront
    └── ALB
         ├── /api/*  →  Backend (ECS Fargate, port 8080)
         └── /*      →  Frontend (ECS Fargate, port 3000)

Aurora PostgreSQL (VPC-only, accessed by backend tasks)
```

Authentication is JWT-based with two roles: `admin` and `user`. Default credentials seeded by Flyway migrations are `admin`/`admin123` and `user`/`user123`.

---

## Running Locally

### Prerequisites

- Java 21
- Node.js 22
- Docker

### 1. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port 5432 with username `quarkus`, password `quarkus`, database `quarkus`. Data is persisted to a Docker volume (`postgres-data`).

### 2. Start the backend

```bash
./gradlew quarkusDev
```

The API is available at `http://localhost:8080/api`. Flyway migrations run automatically on startup. Live reload is enabled — changes to Java files take effect without restarting.

The Quarkus Dev UI is available at `http://localhost:8080/q/dev/`.

### 3. Start the frontend

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

The frontend is available at `http://localhost:3000`.

---

## Running Tests

```bash
./gradlew test
```

Tests use an H2 in-memory database. Flyway migrations run against H2 to build the schema before each test run. No running database is required.

---

## Building Docker Images

### Backend (native)

```bash
./gradlew build -Dquarkus.native.enabled=true -Dquarkus.native.container-build=true -Dquarkus.package.jar.enabled=false
```

The container build flag compiles the native binary inside a Docker container so GraalVM does not need to be installed locally.

### Frontend

```bash
cd frontend
docker build -t getting-started-frontend:latest .
```

---

## Deploying to AWS with Terraform

### Prerequisites

- Terraform >= 1.6
- AWS CLI configured with credentials that have permissions to create ECS, ECR, RDS, ALB, CloudFront, IAM, and Secrets Manager resources

### First-time setup

```bash
cd terraform
terraform init
terraform apply
```

Note the outputs — you will need the ECR URLs to push images.

```bash
terraform output ecr_repository_url           # backend ECR
terraform output frontend_ecr_repository_url  # frontend ECR
terraform output cloudfront_url               # public entry point
```

### Push images to ECR

Authenticate Docker with ECR, then push both images. Replace `<account-id>` with your AWS account ID.

```bash
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

**Backend:**

```bash
./gradlew build -Dquarkus.native.enabled=true -Dquarkus.native.container-build=true
docker build -f src/main/docker/Dockerfile.native -t getting-started:latest .
docker tag getting-started:latest <backend-ecr-url>:latest
docker push <backend-ecr-url>:latest
```

**Frontend:**

```bash
cd frontend
docker build -t getting-started-frontend:latest .
docker tag getting-started-frontend:latest <frontend-ecr-url>:latest
docker push <frontend-ecr-url>:latest
```

### Force a new deployment

After pushing updated images, force ECS to pull them:

```bash
aws ecs update-service \
  --cluster getting-started \
  --service $(terraform output -raw service_name) \
  --force-new-deployment \
  --region us-east-1

aws ecs update-service \
  --cluster getting-started \
  --service $(terraform output -raw frontend_service_name) \
  --force-new-deployment \
  --region us-east-1
```

### Terraform variables

| Variable | Default | Description |
|---|---|---|
| `region` | `us-east-1` | AWS region |
| `project_name` | `getting-started` | Prefix for resource names |
| `image_tag` | `latest` | Backend image tag in ECR |
| `frontend_image_tag` | `latest` | Frontend image tag in ECR |
| `desired_count` | `1` | Number of running tasks per service |
| `task_cpu` | `256` | Fargate CPU units |
| `task_memory` | `512` | Fargate memory (MB) |

Override any variable at apply time:

```bash
terraform apply -var="desired_count=2"
```

### Tear down

```bash
terraform destroy
```

---

## Project Structure

```
.
├── src/                        # Quarkus backend
│   ├── main/java/org/acme/
│   │   ├── domain/             # Domain records (Car, Lorry, User)
│   │   ├── repository/         # JPA entities and Panache repositories
│   │   ├── service/            # Business logic
│   │   └── resource/           # REST endpoints
│   └── main/resources/
│       └── db/migration/       # Flyway SQL migrations
├── frontend/                   # Next.js frontend
├── terraform/                  # AWS infrastructure
└── docker-compose.yml          # Local PostgreSQL
```