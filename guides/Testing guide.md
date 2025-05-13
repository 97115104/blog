# Testing Strategy for Jekyll Sites

## Local Testing
1. Run: `bundle exec jekyll serve`
2. View at: `http://localhost:4000/personal-blog/`
3. Make changes and refresh to see them immediately
4. Check for missing styles, broken links, etc.

## GitHub Pages Testing
1. Commit your changes and push to GitHub
2. Wait a few minutes for GitHub Actions to build your site
3. View at: `https://antimoloch007.github.io/personal-blog/`
4. Check Issues tab for any build errors
5. Check browser console for 404s or other errors

## Key Differences
- GitHub Pages uses Jekyll 3.9.x, while you might have Jekyll 4.x locally
- Some plugins work locally but not on GitHub Pages
- GitHub Pages has stricter security settings
- Paths work differently in some cases