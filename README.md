# mini-a Documentation Site

Professional documentation site for [OpenAF mini-a](https://github.com/OpenAF/mini-a) - a minimalist autonomous agent.

## About

This repository contains the GitHub Pages site for mini-a, providing comprehensive documentation including:

- **Getting Started** - Installation and setup guide
- **Features** - Complete feature overview
- **Examples** - Practical use cases and code samples
- **Advanced Usage** - Dual-model setup, MCP integration, optimizations
- **Configuration** - Complete parameter reference

## Viewing the Site

The site is published at: **https://openaf.github.io/mini-a-docs/**

## Local Development

To build and preview the site locally:

### Prerequisites

- Ruby 2.7 or higher
- Bundler

### Setup

1. Clone the repository:
```bash
git clone https://github.com/OpenAF/mini-a-docs.git
cd mini-a-docs
```

2. Install dependencies:
```bash
bundle install
```

3. Serve the site locally:
```bash
bundle exec jekyll serve
```

4. Open your browser to `http://localhost:4000/mini-a-docs/`

### Building

To build the static site:

```bash
bundle exec jekyll build
```

The generated site will be in the `_site/` directory.

## Structure

```
mini-a-docs/
├── _config.yml           # Jekyll configuration
├── index.md              # Home page
├── getting-started.md    # Getting started guide
├── features.md           # Features overview
├── examples.md           # Usage examples
├── advanced.md           # Advanced topics
├── configuration.md      # Configuration reference
├── assets/
│   ├── css/
│   │   └── style.scss   # Custom styling
│   └── images/          # Screenshots and images
├── Gemfile              # Ruby dependencies
└── README.md            # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding Content

- Documentation pages are written in Markdown
- Place new pages in the root directory
- Add new pages to the navigation in `_config.yml`
- Images go in `assets/images/`

### Styling

Custom styles are in `assets/css/style.scss`. The site uses a modern, clean design with:

- Blue color scheme (#2563eb primary)
- Card-based layouts
- Responsive grid systems
- Mobile-friendly design

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

If needed, you can manually trigger deployment through GitHub Actions:

1. Go to the Actions tab in GitHub
2. Select the "Deploy Jekyll site to Pages" workflow
3. Click "Run workflow"

## License

This documentation is part of the mini-a project and follows the same license.

## Links

- **Main Repository**: [OpenAF/mini-a](https://github.com/OpenAF/mini-a)
- **Documentation Site**: https://openaf.github.io/mini-a-docs/
- **OpenAF**: https://openaf.io

## Suggestions for Enhancement

Throughout the documentation, you'll find suggestions marked with 💡 for additional visual content:

- **Screenshots**: Capture more features and workflows
- **Asciinema recordings**: Show real-time terminal interactions
- **Diagrams**: Visual architecture and flow diagrams
- **Videos**: Tutorials and demos

These can be added to further enhance the user experience.