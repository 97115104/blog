# Jekyll Setup Instructions for Windows

Follow these steps in order to get Jekyll working on your Windows system:

## 1. Open Command Prompt as Administrator
- Right-click on Command Prompt and select "Run as administrator"

## 2. Install Ruby Development Kit
If you don't have Ruby installed:
```
winget install RubyInstallerTeam.RubyWithDevKit
```
Or download from: https://rubyinstaller.org/downloads/ (choose Ruby+Devkit version)

## 3. Install Jekyll and Bundler
```
gem install jekyll bundler
```

## 4. Create a Simple Gemfile
Create a file named `Gemfile` (no extension) in your project root with this content:
```ruby
source "https://rubygems.org"
gem "jekyll", "~> 4.2.0"
gem "webrick", "~> 1.7"
```

## 5. Run Bundle Install with Specific Options
```
bundle install --without development test
```

## 6. If That Fails, Try This Alternate Command
```
bundle install --redownload
```

## 7. Run Jekyll with Bundle Exec
```
bundle exec jekyll serve
```

## 8. If You See "cannot load such file -- webrick"
```
bundle add webrick
```
Then try steps 5-7 again.

## 9. Troubleshooting

### If you see specific gem errors:
For each problematic gem, try:
```
gem install [gem_name] --platform=ruby
```

### If bundle install keeps failing:
```
bundle config build.wdm --with-ldflags="-Wl,--dynamicbase"
bundle install
```

### Last resort - minimal dependencies:
Delete your Gemfile.lock and create a minimal Gemfile with just:
```ruby
source "https://rubygems.org"
gem "jekyll"
gem "webrick"
```