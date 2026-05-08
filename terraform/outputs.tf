output "cloudfront_url" {
  value       = "https://${aws_cloudfront_distribution.app.domain_name}"
  description = "Public entrypoint. The ALB only accepts traffic via this distribution."
}

output "alb_dns_name" {
  value       = aws_lb.app.dns_name
  description = "ALB DNS. Hitting this directly returns 403 — access only via CloudFront."
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
