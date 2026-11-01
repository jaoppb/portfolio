output "bucket_name" {
  description = "R2 state bucket name"
  value       = cloudflare_r2_bucket.tf_state.name
}

output "account_id" {
  description = "Cloudflare account ID"
  value       = var.cloudflare_account_id
}

output "r2_endpoint" {
  description = "Cloudflare R2 S3-compatible API endpoint URL"
  value       = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
}
