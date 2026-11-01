output "bucket_name" {
  description = "R2 state bucket name"
  value       = cloudflare_r2_bucket.tf_state.name
}

output "account_id" {
  description = "Cloudflare account ID"
  value       = var.cloudflare_account_id
}
