# AI Attestation System Guide

This guide explains how the automatic AI attestation system works for this blog, powered by [attest.ink](https://attest.ink).

## Overview

Every blog post automatically receives a cryptographic attestation that declares whether it was written by a human or with AI assistance. These attestations are:
- Generated automatically during Jekyll build
- Cryptographically signed with HMAC-SHA256
- Displayed as subtle badges on each post
- Verifiable by anyone through attest.ink

## How It Works

### 1. Attribution in Front Matter

When creating a new post, add an `attribution` field to your front matter:

```yaml
---
layout: post
title: "Your Post Title"
date: 2025-01-15 10:00:00 -0500
categories: [tech, ai]
attribution: human
---
```

#### Attribution Options:

- **`human`** - Content written entirely by a human
- **`ai claude opus 4`** - AI-assisted content using Claude 4 Opus
- **`ai claude opus 3`** - AI-assisted content using Claude 3 Opus
- **`ai gpt 4`** - AI-assisted content using GPT-4
- **`ai gpt 4.5`** - AI-assisted content using GPT-4.5
- **`ai chatgpt 4.1`** - AI-assisted content using ChatGPT
- Any other AI model following the pattern: `ai [model-name]`

If no attribution is specified, it defaults to `ai claude opus 4`.

### 2. Automatic Attestation Generation

The attestation system works in two ways:

#### During Development (Local)
When you run `bundle exec jekyll serve` or `bundle exec jekyll build`, the Ruby plugin (`_plugins/attest_hook.rb`) automatically:
1. Detects new or modified posts
2. Parses the attribution field
3. Generates a cryptographic attestation
4. Signs it with your configured key
5. Saves it to `_data/attestations.json`

#### Manual Generation
You can also manually regenerate all attestations:
```bash
node _scripts/generate-attestations.js
```

### 3. Attestation Display

Each post automatically displays:
- A subtle attestation badge in the footer
- The AI model used (if applicable)
- A "Verify Attestation" link

The main attestations page (`/attestations/`) shows all blog attestations in one place.

## Configuration

### Signing Key Setup

The system uses HMAC-SHA256 signatures. To configure your signing key:

1. Create `_config/signing.json`:
```json
{
  "signing_key": "your-secret-signing-key-here",
  "signer_name": "Your Name",
  "signer_id": "your-id"
}
```

2. Add `_config/signing.json` to `.gitignore` (already done)

3. For production, set the environment variable:
```bash
export ATTEST_SIGNING_KEY="your-secret-signing-key-here"
```

## GitHub Deployment

### How It Works

The attestation system is designed to work seamlessly with GitHub Pages:

1. **Local Generation**: Attestations are generated locally when you build the site
2. **Committed to Repository**: The `_data/attestations.json` file is tracked in git
3. **GitHub Actions**: A workflow automatically regenerates attestations when posts change
4. **No Secrets Required**: The default signing key works fine for public attestations

### Existing GitHub Actions Workflow

This blog already includes `.github/workflows/attest.yml` that:
- Triggers when posts are added or modified
- Runs `node _scripts/generate-attestations.js`
- Commits updated attestations back to the repository
- Works automatically - no configuration needed!

### Deployment Options

#### Option 1: GitHub Pages (Default) ✅
**No additional setup required!** Just push to GitHub and it works:

```bash
git add .
git commit -m "Add new post"
git push origin main
```

The GitHub Actions workflow will:
1. Detect new/modified posts
2. Generate attestations
3. Commit them back
4. GitHub Pages will rebuild with the new attestations

#### Option 2: Custom Signing Key (Optional)
For production sites that want unique signatures:

1. Generate a strong signing key:
   ```bash
   openssl rand -base64 32
   ```

2. Add to GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add `ATTEST_SIGNING_KEY` with your key

3. Update `.github/workflows/attest.yml`:
   ```yaml
   - name: Create attestations
     env:
       ATTEST_SIGNING_KEY: ${{ secrets.ATTEST_SIGNING_KEY }}
     run: |
       node _scripts/generate-attestations.js
   ```

### Deployment Checklist

- [x] `_plugins/attest_hook.rb` is in the repository
- [x] `_scripts/generate-attestations.js` is in the repository
- [x] `_data/attestations.json` is tracked in git
- [x] `.github/workflows/attest.yml` workflow exists
- [x] Gemfile includes required gems (csv, base64, bigdecimal, logger, cgi)
- [ ] (Optional) Custom `ATTEST_SIGNING_KEY` secret in GitHub

## Troubleshooting

### Attestations not generating
1. Check that the attribution field is properly formatted in your post's front matter
2. Look for errors in the Jekyll build output
3. Manually run `node _scripts/generate-attestations.js` to see detailed errors

### Verification failing
1. Ensure the attestation URL isn't corrupted (should be properly URL-encoded)
2. Check that the model name matches one supported by attest.ink
3. Verify the signature key hasn't changed

### Missing attestations after deployment
1. Make sure `_data/attestations.json` is committed to git
2. Check GitHub Actions logs if using custom workflow
3. Ensure the Ruby plugin is executing (check for "Attest:" messages in build logs)

## Adding New AI Models

To add support for a new AI model:

1. Update the model mapping in `_scripts/generate-attestations.js`:
```javascript
// In parseAttribution function
else if (modelPart.includes('newmodel')) {
  return { type: 'ai', model: 'newmodel-1.0' };
}
```

2. Update the same logic in `_plugins/attest_hook.rb`:
```ruby
# In parse_attribution method
elsif model_part.include?('newmodel')
  return { type: 'ai', model: 'newmodel-1.0' }
```

## Privacy & Security

- **Content Privacy**: Only content hashes are included, not the actual content
- **Signing Key**: Keep your signing key secret and never commit it
- **Verification**: Anyone can verify attestations without accessing your server
- **Decentralized**: Attestations work offline and don't require any external services

## Examples

### Human-Written Post
```yaml
---
attribution: human
---
```
Generates: Model: Human (no AI)

### AI-Assisted Post
```yaml
---
attribution: ai claude opus 4
---
```
Generates: Model: claude-4-opus • Role: assisted

### No Attribution (Default)
```yaml
---
# no attribution field
---
```
Generates: Model: claude-4-opus • Role: assisted

## Support

For issues or questions:
- Check the [attest.ink documentation](https://attest.ink/developers/)
- Open an issue in this repository
- Visit the [attest.ink GitHub](https://github.com/statusdothealth/attest.ink)