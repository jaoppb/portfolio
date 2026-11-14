data "cloudflare_zone" "selected" {
  account_id = var.cloudflare_account_id
  name       = var.domain_name
}

resource "cloudflare_pages_project" "portfolio" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch
}

resource "cloudflare_record" "apex" {
  zone_id = data.cloudflare_zone.selected.id
  name    = "@"
  content = cloudflare_pages_project.portfolio.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.selected.id
  name    = "www"
  content = cloudflare_pages_project.portfolio.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  domain       = var.domain_name

  depends_on = [cloudflare_record.apex]
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  domain       = "www.${var.domain_name}"

  depends_on = [cloudflare_record.www]
}

# Plan check only, not to be merged.
# The apex is the canonical host. www stays a proxied record and a Pages domain so the
# request reaches Cloudflare with a valid certificate, and this rule answers it first.
# /.well-known/ is left alone, because certificate validation may be served from it.
resource "cloudflare_ruleset" "redirects" {
  zone_id     = data.cloudflare_zone.selected.id
  name        = "Redirects"
  description = "Single Redirects of the zone"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    ref         = "www_to_apex"
    description = "Redirect www to the apex"
    expression  = "(http.host eq \"www.${var.domain_name}\" and not starts_with(http.request.uri.path, \"/.well-known/\"))"
    action      = "redirect"
    enabled     = true

    action_parameters {
      from_value {
        status_code           = 301
        preserve_query_string = true

        target_url {
          expression = "concat(\"https://${var.domain_name}\", http.request.uri.path)"
        }
      }
    }
  }
}

# Cloudflare turns this on for new zones. It rewrites the contact mailto link into a
# /cdn-cgi/l/email-protection link that only works after an injected script has run.
resource "cloudflare_zone_settings_override" "zone" {
  zone_id = data.cloudflare_zone.selected.id

  settings {
    email_obfuscation = "off"
  }
}

# Proves ownership of the domain to Google Search Console (docs/workflows/launch.md).
# The value is public, like every TXT record, and only works for the account that asked for it.
resource "cloudflare_record" "google_site_verification" {
  zone_id = data.cloudflare_zone.selected.id
  name    = "@"
  content = "\"google-site-verification=w7Tjw8Y15UWOGG4c-q3pg1A2RT3c0mLUDm-LtTsjK-s\""
  type    = "TXT"
  ttl     = 1
}
