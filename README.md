# My Blog

This is a simple, content-focused blog built with Jekyll, inspired by [Vitalik Buterin's blog](https://github.com/vbuterin/blog).

## Features

- Clean, minimal design focused on content
- Markdown support for easy writing
- Responsive layout for all devices
- Category organization
- Simple navigation
- Dark/Light mode toggle
- AI attribution badges via attest.ink integration

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
attribution: human  # or 'claude' for AI-assisted content
---
```

Then write your post content using Markdown.

## Content Attribution with attest.ink

This blog includes an integration with [attest.ink](https://attest.ink) for clearly marking content as either human-created or AI-assisted.

### Using Attribution Badges

1. Simply add the `attribution` parameter to your post's frontmatter:

   ```yaml
   ---
   attribution: human  # For human-written content
   ---
   ```

   or

   ```yaml
   ---
   attribution: claude  # For Claude AI-assisted content
   ---
   ```

2. The appropriate badge will automatically appear at the bottom of your post.

3. If no attribution is specified, posts default to "human" attribution.

### Adding New Attribution Types

To add support for additional AI assistants or attribution types:

1. Update the `_includes/attest-badge.html` file to include the new type in the case statement
2. Ensure you have the corresponding badge SVG available at attest.ink

## Working with Categories

This blog uses Jekyll collections to create category pages. When you add categories to your posts, you'll need to create corresponding category pages.

### Adding a New Category

1. Create a new file in the `_categories` directory with the format `category-name.md`
2. Add the following YAML front matter:

```yaml
---
layout: category
title: "Category: Your Category Name"
category: your_category_name
permalink: /categories/your_category_name/
---
```

Make sure the `category` value matches exactly what you use in your post's frontmatter (including case).

### Generating Categories Automatically

To help generate category files for all your existing categories:

1. Start your Jekyll server with `bundle exec jekyll serve`
2. Visit `http://localhost:4000/generate-categories.html`
3. This page will list all categories used in your posts and show the content needed for each category file
4. Copy the content for each category and create the corresponding files in the `_categories` directory

## Customizing the Theme

### Light/Dark Mode

The blog includes a light/dark mode toggle that respects user preferences. The theme automatically adapts based on:

1. User's explicit choice (via the toggle button)
2. User's system preference
3. Default to light mode if neither is available

Theme preferences are saved to localStorage for returning visitors.

## Deployment

This blog is designed to be easily deployed on GitHub Pages. Push your changes to your GitHub repository, and if GitHub Pages is enabled, your site will be available at `https://yourusername.github.io`.

## Credits

- Design inspired by [Vitalik Buterin's blog](https://github.com/vbuterin/blog)
- Built with [Jekyll](https://jekyllrb.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)
- Attribution badges from [attest.ink](https://attest.ink)
- Created with assistance from [Claude](https://www.anthropic.com/claude), Anthropic's AI assistant

## License

This project is licensed under the MIT License - see the LICENSE file for details.