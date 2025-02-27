# AdonisJS Vue Inertia Starter

A boilerplate combining AdonisJS, Vue 3, Inertia, TailwindCSS and DaisyUI with customizable theme management.

## Features

- **Backend**: AdonisJS v6
- **Frontend**: Vue 3 with Inertia.js
- **Styling**: TailwindCSS with DaisyUI
- **Themes**: Customizable system with theme selection via CLI command
- **Database**: Preconfigured SQLite

## Installation

```bash
# Clone the repository
git clone git@github.com:MGouillardon/boilerplate-adonis-vue-inertia.git
cd boilerplate-adonis-vue-inertia

# Rename the project (optional)
mv boilerplate-adonis-vue-inertia your-project-name
```

### Option 1: Automated Installation (Recommended)

```bash
# Run the setup script
npm run setup
```

The setup script will automate the following steps:

- Installing dependencies
- Creating the .env file
- Generating the application key
- Creating the tmp directory for SQLite
- Running migrations
- Interactive theme configuration

### Option 2: Manual Installation

```bash
# Install dependencies
npm install

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
