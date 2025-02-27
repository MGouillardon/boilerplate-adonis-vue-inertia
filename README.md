# AdonisJS Vue Inertia Starter

A boilerplate combining AdonisJS, Vue 3, Inertia, TailwindCSS and DaisyUI with customizable theme management.

## Features

- **Backend**: AdonisJS v6
- **Frontend**: Vue 3 with Inertia.js
- **Styling**: TailwindCSS with DaisyUI
- **Themes**: Customizable system with theme selection via CLI command
- **Database**: Preconfigured SQLite for quick start

## Installation

```bash
# Clone the repository
git clone git@github.com:MGouillardon/boilerplate-adonis-vue-inertia.git
cd boilerplate-adonis-vue-inertia

# Rename the project (optional)
mv boilerplate-adonis-vue-inertia your-project-name

# Install dependencies
npm install
```

## Configuration

```bash
# Create environment file
cp .env.example .env

# Generate application key
node ace generate:key

# Create tmp folder for SQLite
mkdir tmp

# Run migrations
node ace migration:run

# Configure DaisyUI themes
node ace configure:theme
```

Theme configuration options:

- `--no-dark-mode` or `-n`: Disable dark mode support
- `--css-path=path/to/file.css` or `-p`: Specify a custom CSS path

## Development

```bash
# Start the development server
npm run dev
```
