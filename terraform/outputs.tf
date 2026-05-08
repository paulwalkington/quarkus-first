output "alb_dns_name" {
  value       = aws_lb.app.dns_name
  description = "Public DNS for the ALB. Hit it once tasks are healthy."
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.app.repository_url
  description = "Push the image here before tasks can start."
}

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "service_name" {
  value = aws_ecs_service.app.name
}
