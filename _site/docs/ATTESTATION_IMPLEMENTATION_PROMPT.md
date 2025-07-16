# Instructions to Implement attest.ink Attestation System on a Jekyll Blog

Please implement an automatic AI attestation system for my Jekyll blog located at `/Users/x97115104/Documents/Projects/biz/blog` using attest.ink. This system should automatically generate cryptographic attestations for all blog posts, declaring whether they were written by humans or with AI assistance.

## Requirements

### 1. Core Functionality
- Automatically generate attestations for all blog posts during Jekyll build
- Support both human and AI-assisted content attribution
- Create cryptographically signed attestations using HMAC-SHA256
- Display subtle attestation badges on individual posts
- Create an attestations index page showing all attestations

### 2. Attribution System
Posts should support an `attribution` field in their front matter:
- `attribution: human` - for human-written content
- `attribution: ai claude opus 4` - for Claude 4 Opus assisted content
- `attribution: ai gpt 4` - for GPT-4 assisted content
- Default to `ai claude opus 4` if no attribution specified

### 3. Files to Create

#### A. Ruby Plugin: `_plugins/attest_hook.rb`
Create a Jekyll plugin that:
- Runs after posts are written
- Parses the attribution field from post front matter
- Generates attestations following attest.ink v2.0 schema
- Signs attestations with HMAC-SHA256
- Saves to `_data/attestations.json`
- URL-encodes base64 data for data URLs (important!)

Key requirements:
- Use `CGI.escape()` for URL-encoding base64 data
- Include these fields in attestations:
  - version: "2.0"
  - id: date-based unique ID
  - content_name: post title
  - content_hash: SHA256 hash of post content
  - model: parsed from attribution (e.g., "claude-4-opus", "Human")
  - role: "generated" for human, "assisted" for AI
  - timestamp: ISO 8601 format
  - platform: "attest.ink"
  - author: "Austin Harshberger"
  - signature: HMAC-SHA256 signature object
  - signer: name and ID at root level

#### B. Node.js Script: `_scripts/generate-attestations.js`
Create a Node.js script for manual attestation generation that:
- Reads all posts from `_posts/` directory
- Parses front matter to get attribution
- Generates attestations matching the Ruby plugin format
- Uses `encodeURIComponent()` for URL-encoding base64 data
- Saves to `_data/attestations.json`

#### C. Attestation Display: `_includes/attest-badge.html`
Create an include that:
- Displays a subtle attestation badge at the end of posts
- Shows the model and role
- Links to the attest.ink verification page
- Uses minimal styling that works in both light and dark modes
- Uses `color: inherit` and `opacity` for colors (not hard-coded colors)

Example styling:
```html
<div style="margin-top: 1.5rem; display: inline-block; border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(0, 0, 0, 0.02); padding: 8px 12px; border-radius: 4px;">
  <div style="display: flex; align-items: center; gap: 8px;">
    <span style="font-size: 0.85rem; opacity: 0.8;">
      Model: {{ attestation.attestation.model | default: "Unknown" }}
      {% if attestation.attestation.role %}
        • Role: {{ attestation.attestation.role }}
      {% endif %}
    </span>
    <span style="opacity: 0.4;">•</span>
    <a href="{{ attestation.urls.full }}" 
       target="_blank" 
       rel="noopener"
       style="font-size: 0.85rem; opacity: 0.8; text-decoration: underline;">
      Verify Attestation →
    </a>
  </div>
</div>
```

#### D. Footer Integration: Update `_includes/footer.html`
Add a subtle attestation notice to the footer:
```html
<div style="margin-top: 20px; border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(0, 0, 0, 0.02); padding: 10px 12px; font-size: 0.8rem; border-radius: 4px;">
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 8px; opacity: 0.7;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="opacity: 0.5;">
        <path d="M9 11H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-2M9 11V7a3 3 0 116 0v4M9 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
      <span style="font-size: 0.75rem;">Content verified via attest.ink</span>
    </div>
    <a href="{{ site.baseurl }}/attestations/" style="text-decoration: none; font-size: 0.7rem; opacity: 0.6;">View attestations →</a>
  </div>
</div>
```

#### E. Attestations Page: `attestations.html`
Create a page that lists all attestations:
- Layout: default
- Title: "AI Attestations"
- Permalink: /attestations/
- Lists all posts with their attestation details
- Shows signature information properly (handling signature objects)

#### F. Post Layout Update
Update the post layout to include the attestation badge by adding at the end:
```liquid
{% include attest-badge.html %}
```

#### G. GitHub Actions: `.github/workflows/attest.yml`
Create a workflow that:
```yaml
name: Create Attestations

on:
  push:
    paths:
      - '_posts/*.md'
    branches:
      - main
  workflow_dispatch:

jobs:
  attest:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Create attestations
        run: |
          node _scripts/generate-attestations.js
      
      - name: Commit attestations
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add _data/attestations.json
          if git diff --staged --quiet; then
            echo "No new attestations to commit"
          else
            git commit -m "Update attestations [skip ci]"
            git push
          fi
```

### 4. Configuration Files

#### A. Signing Configuration: `_config/signing.json`
```json
{
  "signing_key": "DEFAULT_KEY",
  "signer_name": "Austin Harshberger",
  "signer_id": "97115104"
}
```
Add this file to `.gitignore`

#### B. Update Gemfile
Ensure these gems are included:
```ruby
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"
gem "cgi"
```

### 5. Important Technical Details

#### Signature Format
Attestations must include signatures in this exact format:
```json
{
  "signature": {
    "type": "hmac-sha256",
    "value": "signature_value_here",
    "algorithm": "HMAC-SHA256",
    "data_to_sign": "{\"content_hash\":\"...\",\"model\":\"...\",\"timestamp\":\"...\"}"
  },
  "signer": {
    "name": "Austin Harshberger",
    "id": "97115104"
  }
}
```

#### URL Encoding
**Critical**: Base64 data in URLs must be properly encoded:
- Node.js: Use `encodeURIComponent(base64Data)`
- Ruby: Use `CGI.escape(base64_data)`
- This prevents issues with `+`, `/`, and `=` characters

#### Model Mapping
Map attribution strings to attest.ink model IDs:
- "human" → model: "Human", role: "generated"
- "ai claude opus 4" → model: "claude-4-opus", role: "assisted"
- "ai gpt 4" → model: "gpt-4", role: "assisted"
- "ai chatgpt 4.1" → model: "gpt-4.1", role: "assisted"

### 6. Testing
After implementation:
1. Add `attribution: human` to a test post
2. Run `bundle exec jekyll build`
3. Check `_data/attestations.json` was created
4. Verify the attestation badge appears on the post
5. Click "Verify Attestation" and ensure it works on attest.ink
6. Test with an AI attribution like `attribution: ai claude opus 4`

### 7. Documentation
Create `docs/ATTESTATIONS.md` with:
- How to use the attribution system
- List of supported AI models
- Troubleshooting guide
- GitHub deployment instructions

Update the main README.md to link to this guide.

## Expected Behavior
- New posts automatically get attestations during build
- Attestations are cryptographically signed
- Each post shows a subtle badge with model information
- Clicking "Verify Attestation" opens attest.ink with valid data
- The system works with GitHub Pages without additional configuration

## Style Requirements
- Use subtle, minimal styling
- Support both light and dark modes using `opacity` and `inherit`
- Don't use CSS variables or hard-coded colors
- Keep badges small and unobtrusive
- Match the existing blog's aesthetic