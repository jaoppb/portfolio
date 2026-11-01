output "pages_project_name" {
  description = "Name of the Cloudflare Pages project"
  value       = cloudflare_pages_project.portfolio.name
}

output "pages_subdomain" {
  description = "Default pages.dev subdomain"
  value       = cloudflare_pages_project.portfolio.subdomain
}

output "apex_domain" {
  description = "Configured apex custom domain"
  value       = cloudflare_pages_domain.apex.domain
}

output "www_domain" {
  description = "Configured www custom domain"
  value       = cloudflare_pages_domain.www.domain
}
