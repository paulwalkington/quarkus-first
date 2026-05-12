resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "${var.project_name}-db-password"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db.result
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_security_group" "db" {
  name        = "${var.project_name}-db"
  description = "Postgres ingress from ECS tasks only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.task.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_rds_cluster" "main" {
  cluster_identifier     = "${var.project_name}-db"
  engine                 = "aurora-postgresql"
  engine_version         = "16.6"
  database_name          = "quarkus"
  master_username        = "quarkus"
  master_password        = random_password.db.result
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  storage_encrypted      = true

  # Dev-friendly: easy to tear down. Tighten these before going to prod.
  skip_final_snapshot     = true
  backup_retention_period = 1
  deletion_protection     = false
  apply_immediately       = true
}

resource "aws_rds_cluster_instance" "main" {
  identifier           = "${var.project_name}-db-1"
  cluster_identifier   = aws_rds_cluster.main.id
  instance_class       = "db.t4g.medium"
  engine               = aws_rds_cluster.main.engine
  engine_version       = aws_rds_cluster.main.engine_version
  db_subnet_group_name = aws_db_subnet_group.main.name
  apply_immediately    = true
}