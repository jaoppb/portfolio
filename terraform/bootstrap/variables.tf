variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "state_bucket_name" {
  description = "Name of the Cloudflare R2 bucket for Terraform remote state"
  type        = string
  default     = "jaoppb-portfolio-tf-state"
}

variable "location" {
  description = "Location hint for the R2 bucket (e.g. WNAM, ENAM, WEUR, EEUR, APAC, OC)"
  type        = string
  default     = null
}
