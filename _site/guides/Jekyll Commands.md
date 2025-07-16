# If bundle install fails, try:
gem install bundler -v 2.4.22

# After installing bundler, run:
bundle install

# If you still have issues, create a clean bundle environment:
bundle clean --force
bundle install

# To run Jekyll with detailed output:
bundle exec jekyll serve --verbose

# If you want to update all gems:
bundle update

# To check if Jekyll is installed:
bundle exec jekyll -v