data "cloudflare_zone" "selected" {
  account_id = var.cloudflare_account_id
  name       = var.domain_name
}

resource "cloudflare_pages_project" "portfolio" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  domain       = var.domain_name
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  domain       = "www.${var.domain_name}"
}

resource "cloudflare_record" "apex" {
  zone_id = data.cloudflare_zone.selected.id
  name    = "@"
  value   = cloudflare_pages_project.portfolio.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.selected.id
  name    = "www"
  value   = cloudflare_pages_project.portfolio.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
