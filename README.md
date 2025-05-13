# My Blog

This is a simple, content-focused blog built with Jekyll, inspired by [Vitalik Buterin's blog](https://github.com/vbuterin/blog).

## Features

- Clean, minimal design focused on content
- Markdown support for easy writing
- Responsive layout for all devices
- Category organization
- Simple navigation

## Getting Started

### Prerequisites

- Ruby (version 2.5.0 or higher)
- RubyGems
- GCC and Make

### Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/blog.git
   cd blog
   ```

2. Install Jekyll and dependencies
   ```
   gem install jekyll bundler
   bundle install
   ```

3. Run the development server
   ```
   bundle exec jekyll serve
   ```

4. Open your browser and navigate to `http://localhost:4000`

## Writing Posts

To create a new post, add a new file to the `_posts` directory with the format `YYYY-MM-DD-title.md`. Include the following YAML front matter at the top:

```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD HH:MM:SS -0500
categories: [category1, category2]
---
```

Then write your post content using Markdown.

## Deployment

This blog is designed to be easily deployed on GitHub Pages. Push your changes to your GitHub repository, and if GitHub Pages is enabled, your site will be available at `https://yourusername.github.io`.

## Credits

- Design inspired by [Vitalik Buterin's blog](https://github.com/vbuterin/blog)
- Built with [Jekyll](https://jekyllrb.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)
- Created with assistance from [Claude](https://www.anthropic.com/claude), Anthropic's AI assistant

## License

This project is licensed under the MIT License - see the LICENSE file for details.