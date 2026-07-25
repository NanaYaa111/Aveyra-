// Terraform starter for Supabase provisioning (example)
// This is a template to be adapted; the Supabase Terraform provider is community-maintained.
// See https://registry.terraform.io/providers/supabase/supabase/latest for provider details.

terraform {
  required_version = ">= 1.0"
}

provider "supabase" {
  // You will need to configure provider credentials in CI or local environment
  // e.g. env var SUPABASE_ACCESS_TOKEN or provider configuration blocks.
}

// Example: create a table using SQL migration file (provider dependent).
// The exact resources depend on the chosen provider and hosting model.

output "note" {
  value = "This Terraform template is a starting point. Review provider docs and replace with production-ready resources."
}
