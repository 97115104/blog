# First, delete the Gemfile.lock file if it exists
del Gemfile.lock

# Create a new minimal Gemfile
echo source "https://rubygems.org" > Gemfile
echo gem "jekyll" >> Gemfile
echo gem "webrick" >> Gemfile

# Install the gems
gem install jekyll
gem install webrick

# Run bundle install with options
bundle install --redownload

# Try running Jekyll
bundle exec jekyll serve