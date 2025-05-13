source "https://rubygems.org"

# Jekyll version
gem "jekyll", "~> 4.2.0"

# Theme
gem "minima", "~> 2.5"

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.15"
  gem "jekyll-seo-tag", "~> 2.7"
end

# Windows-specific gems - with conditional installation
gem "tzinfo", "~> 1.2", platforms: [:mingw, :mswin, :x64_mingw]
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw]

# Temporarily comment out wdm which is causing issues
# gem "wdm", "~> 0.1.1", platforms: [:mingw, :mswin, :x64_mingw]

# Lock kramdown version for security
gem "kramdown", ">= 2.3.0"

# Webrick is required for Ruby 3.0+
gem "webrick", "~> 1.7"