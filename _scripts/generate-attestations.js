#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load signing configuration
function loadSigningConfig() {
  const configPath = path.join(__dirname, '..', '_config', 'signing.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return {
    signing_key: process.env.ATTEST_SIGNING_KEY || 'DEFAULT_KEY',
    signer_name: 'Austin Harshberger',
    signer_id: '97115104'
  };
}

// Function to sign attestation data
function signAttestation(attestation, signingKey) {
  const dataToSign = JSON.stringify({
    content_name: attestation.content_name,
    content_hash: attestation.content_hash,
    timestamp: attestation.timestamp,
    model: attestation.model
  });
  
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(dataToSign)
    .digest('hex');
  
  return signature;
}

// Function to parse attribution and determine model
function parseAttribution(attribution) {
  if (!attribution) return { type: 'ai', model: 'claude-4-opus' };
  
  const attr = attribution.toLowerCase().trim();
  
  if (attr === 'human') {
    return { type: 'human', model: null };
  }
  
  // Parse AI attribution (e.g., "ai claude opus 4", "ai chatgpt 4.1")
  if (attr.startsWith('ai ')) {
    const modelPart = attr.substring(3).trim();
    
    // Map common variations to standard model names
    if (modelPart.includes('claude')) {
      if (modelPart.includes('opus') && modelPart.includes('4')) {
        return { type: 'ai', model: 'claude-4-opus' };
      } else if (modelPart.includes('opus')) {
        return { type: 'ai', model: 'claude-3-opus' };
      } else if (modelPart.includes('sonnet')) {
        return { type: 'ai', model: 'claude-3-sonnet' };
      } else if (modelPart.includes('haiku')) {
        return { type: 'ai', model: 'claude-3-haiku' };
      }
      return { type: 'ai', model: 'claude-3' };
    } else if (modelPart.includes('chatgpt') || modelPart.includes('gpt')) {
      const version = modelPart.match(/[\d.]+/)?.[0] || '4';
      return { type: 'ai', model: `gpt-${version}` };
    } else if (modelPart.includes('gemini')) {
      return { type: 'ai', model: 'gemini-pro' };
    }
    
    // Default to the specified model string
    return { type: 'ai', model: modelPart.replace(/\s+/g, '-') };
  }
  
  // Default to AI with Claude
  return { type: 'ai', model: 'claude-4-opus' };
}

// Function to generate attestation data
function generateAttestation(postPath) {
  const content = fs.readFileSync(postPath, 'utf8');
  const lines = content.split('\n');
  
  // Parse frontmatter
  let inFrontmatter = false;
  let title = '';
  let date = '';
  let attribution = '';
  
  for (const line of lines) {
    if (line === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) {
      if (line.startsWith('title:')) {
        title = line.replace('title:', '').trim().replace(/['"]/g, '');
      }
      if (line.startsWith('date:')) {
        date = line.replace('date:', '').trim().split(' ')[0];
      }
      if (line.startsWith('attribution:')) {
        attribution = line.replace('attribution:', '').trim();
      }
    }
  }
  
  // Generate content hash
  const contentHash = crypto.createHash('sha256').update(content).digest('hex');
  
  // Parse attribution
  const { type, model } = parseAttribution(attribution);
  
  // Load signing config
  const signingConfig = loadSigningConfig();
  
  // Generate attestation ID
  const id = `${new Date().toISOString().split('T')[0]}-${crypto.randomBytes(3).toString('hex')}`;
  
  // Create attestation object
  const attestation = {
    version: "2.0",
    id: id,
    content_name: title,
    timestamp: new Date().toISOString(),
    platform: "attest.ink"
  };
  
  // Add model and role - human gets "Human" as model
  if (type === 'human') {
    attestation.model = "Human";
    attestation.role = "generated";
  } else if (type === 'ai' && model) {
    attestation.model = model;
    attestation.role = "assisted";
  }
  
  // Add optional fields
  attestation.content_hash = `sha256:${contentHash}`;
  attestation.document_type = "markdown";
  attestation.author = "Austin Harshberger";
  
  // Add signature in attest.ink format
  const signatureValue = signAttestation(attestation, signingConfig.signing_key);
  attestation.signature = {
    type: "hmac-sha256",
    value: signatureValue,
    algorithm: "HMAC-SHA256",
    data_to_sign: JSON.stringify({
      content_hash: attestation.content_hash,
      model: attestation.model,
      timestamp: attestation.timestamp
    })
  };
  
  // Add signer at root level
  attestation.signer = {
    name: signingConfig.signer_name || "Austin Harshberger",
    id: signingConfig.signer_id || "97115104"
  };
  
  // Generate URLs
  const encodedData = Buffer.from(JSON.stringify(attestation)).toString('base64');
  const shortUrl = `https://attest.ink/verify/?id=${id}`;
  // URL-encode the base64 data to handle + and = characters
  const dataUrl = `https://attest.ink/verify/?data=${encodeURIComponent(encodedData)}`;
  
  return {
    postPath: path.basename(postPath),
    title,
    attestation,
    urls: {
      short: shortUrl,
      full: dataUrl
    },
    created_at: new Date().toISOString()
  };
}

// Main function
async function main() {
  const postsDir = path.join(__dirname, '..', '_posts');
  const attestationsPath = path.join(__dirname, '..', '_data', 'attestations.json');
  
  // Ensure _data directory exists
  const dataDir = path.join(__dirname, '..', '_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Load existing attestations
  let attestations = {};
  if (fs.existsSync(attestationsPath)) {
    attestations = JSON.parse(fs.readFileSync(attestationsPath, 'utf8'));
  }
  
  // Get all posts
  const posts = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(postsDir, f));
  
  // Generate attestations for all posts
  for (const post of posts) {
    const postName = path.basename(post);
    console.log(`Generating attestation for ${postName}...`);
    
    try {
      const result = generateAttestation(post);
      attestations[postName] = result;
      console.log(`✓ Generated attestation for ${result.title}`);
    } catch (error) {
      console.error(`✗ Failed to generate attestation for ${postName}:`, error.message);
    }
  }
  
  // Save attestations
  fs.writeFileSync(attestationsPath, JSON.stringify(attestations, null, 2));
  console.log('\nAttestations saved to _data/attestations.json');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateAttestation };