require 'json'
require 'digest'
require 'base64'
require 'securerandom'
require 'openssl'
require 'cgi'

# Load signing configuration
def load_signing_config(site_source)
  config_path = File.join(site_source, '_config', 'signing.json')
  if File.exist?(config_path)
    JSON.parse(File.read(config_path))
  else
    {
      'signing_key' => ENV['ATTEST_SIGNING_KEY'] || 'DEFAULT_KEY',
      'signer_name' => 'Austin Harshberger',
      'signer_id' => '97115104'
    }
  end
end

# Sign attestation data
def sign_attestation(attestation, signing_key)
  data_to_sign = JSON.generate({
    'content_name' => attestation['content_name'],
    'content_hash' => attestation['content_hash'],
    'timestamp' => attestation['timestamp'],
    'model' => attestation['model']
  })
  
  OpenSSL::HMAC.hexdigest('SHA256', signing_key, data_to_sign)
end

# Parse attribution to determine type and model
def parse_attribution(attribution)
  return { type: 'ai', model: 'claude-4-opus' } unless attribution
  
  attr = attribution.to_s.downcase.strip
  
  return { type: 'human', model: nil } if attr == 'human'
  
  # Parse AI attribution
  if attr.start_with?('ai ')
    model_part = attr[3..-1].strip
    
    # Map common variations
    if model_part.include?('claude')
      return { type: 'ai', model: 'claude-4-opus' } if model_part.include?('opus') && model_part.include?('4')
      return { type: 'ai', model: 'claude-3-opus' } if model_part.include?('opus')
      return { type: 'ai', model: 'claude-3-sonnet' } if model_part.include?('sonnet')
      return { type: 'ai', model: 'claude-3-haiku' } if model_part.include?('haiku')
      return { type: 'ai', model: 'claude-3' }
    elsif model_part.include?('chatgpt') || model_part.include?('gpt')
      version = model_part.match(/[\d.]+/)&.to_s || '4'
      return { type: 'ai', model: "gpt-#{version}" }
    elsif model_part.include?('gemini')
      return { type: 'ai', model: 'gemini-pro' }
    end
    
    # Default to specified model string
    return { type: 'ai', model: model_part.gsub(/\s+/, '-') }
  end
  
  # Default
  { type: 'ai', model: 'claude-4-opus' }
end

Jekyll::Hooks.register :posts, :post_write do |post|
  # Skip drafts
  next if post.draft?
  
  attestations_file = File.join(post.site.source, '_data', 'attestations.json')
  
  # Load existing attestations
  attestations = {}
  if File.exist?(attestations_file)
    attestations = JSON.parse(File.read(attestations_file))
  end
  
  # Check if we already have an attestation for this post
  post_key = File.basename(post.path)
  next if attestations.key?(post_key)
  
  # Create attestation locally
  begin
    # Parse attribution
    attribution_info = parse_attribution(post.data['attribution'])
    
    # Load signing config
    signing_config = load_signing_config(post.site.source)
    
    # Generate content hash
    content_hash = Digest::SHA256.hexdigest(post.content)
    
    # Generate attestation ID
    id = "#{Date.today.iso8601}-#{SecureRandom.hex(3)}"
    
    # Create attestation object
    attestation = {
      'version' => '2.0',
      'id' => id,
      'content_name' => post.data['title'],
      'timestamp' => Time.now.iso8601,
      'platform' => 'attest.ink'
    }
    
    # Add model and role
    if attribution_info[:type] == 'human'
      attestation['model'] = 'Human'
      attestation['role'] = 'generated'
    elsif attribution_info[:type] == 'ai' && attribution_info[:model]
      attestation['model'] = attribution_info[:model]
      attestation['role'] = 'assisted'
    end
    
    # Optional fields according to spec
    attestation['content_hash'] = "sha256:#{content_hash}"
    attestation['document_type'] = 'markdown'
    attestation['author'] = 'Austin Harshberger'
    
    # Add signature in attest.ink format
    signature_value = sign_attestation(attestation, signing_config['signing_key'])
    attestation['signature'] = {
      'type' => 'hmac-sha256',
      'value' => signature_value,
      'algorithm' => 'HMAC-SHA256',
      'data_to_sign' => {
        'content_hash' => attestation['content_hash'],
        'model' => attestation['model'],
        'timestamp' => attestation['timestamp']
      }.to_json
    }
    
    # Add signer at root level
    attestation['signer'] = {
      'name' => signing_config['signer_name'] || 'Austin Harshberger',
      'id' => signing_config['signer_id'] || '97115104'
    }
    
    # Generate URLs
    encoded_data = Base64.strict_encode64(attestation.to_json)
    short_url = "https://attest.ink/verify/?id=#{id}"
    # URL-encode the base64 data to handle + and = characters
    data_url = "https://attest.ink/verify/?data=#{CGI.escape(encoded_data)}"
    
    attestations[post_key] = {
      'postPath' => post_key,
      'title' => post.data['title'],
      'attestation' => attestation,
      'urls' => {
        'short' => short_url,
        'full' => data_url
      },
      'created_at' => Time.now.iso8601
    }
    
    # Save attestations
    File.write(attestations_file, JSON.pretty_generate(attestations))
    
    Jekyll.logger.info "Attest:", "Created attestation for #{post.data['title']}"
  rescue => e
    Jekyll.logger.warn "Attest:", "Failed to create attestation for #{post.data['title']}: #{e.message}"
  end
end