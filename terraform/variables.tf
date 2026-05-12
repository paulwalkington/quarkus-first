variable "region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy into."
}

variable "project_name" {
  type        = string
  default     = "getting-started"
  description = "Used as a prefix for resource names and as the ECR repo name."
}

variable "image_tag" {
  type        = string
  default     = "latest"
  description = "Tag of the image in ECR that the service should run."
}

variable "desired_count" {
  type        = number
  default     = 1
  description = "Number of running tasks."
}

variable "task_cpu" {
  type    = number
  default = 256
}

variable "task_memory" {
  type    = number
  default = 512
}

variable "frontend_image_tag" {
  type        = string
  default     = "latest"
  description = "Tag of the frontend image in ECR that the service should run."
}
