variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
  type        = string
  default     = "jaoppb-portfolio"
}

variable "domain_name" {
  description = "Custom domain name for the portfolio website"
  type        = string
  default     = "jaoppb.com"
}

variable "production_branch" {
  description = "Production branch for Cloudflare Pages"
  type        = string
  default     = "main"
}
