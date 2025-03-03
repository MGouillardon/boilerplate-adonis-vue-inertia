#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'
import readline from 'readline'
import path from 'path'

try {
  execSync('chmod +x setup.js')
} catch (error) {
  console.log('Note: Unable to make script executable automatically.')
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('\n🚀 Setting up Adonis-Vue-Inertia Boilerplate...\n')

// Remove .git directory if it exists
const gitDirExists = fs.existsSync(path.join(process.cwd(), '.git'))
if (gitDirExists) {
  console.log('🗑️  Removing existing Git repository from boilerplate...')
  try {
    fs.rmSync(path.join(process.cwd(), '.git'), { recursive: true, force: true })
  } catch (error) {
    console.error('Error removing Git repository:', error.message)
  }
}

// Create tmp directory for SQLite if it doesn't exist
if (!fs.existsSync('tmp')) {
  console.log('📁 Creating tmp directory for SQLite...')
  fs.mkdirSync('tmp')
}

// Copy .env.example to .env if it doesn't exist
if (!fs.existsSync('.env')) {
  console.log('📄 Creating .env file from .env.example...')
  fs.copyFileSync('.env.example', '.env')
}

// Install dependencies
console.log('📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
} catch (error) {
  console.error('Error installing dependencies:', error.message)
  process.exit(1)
}

// Generate application key
console.log('🔑 Generating application key...')
try {
  execSync('node ace generate:key', { stdio: 'inherit' })
} catch (error) {
  console.error('Error generating application key:', error.message)
}

// Run migrations
console.log('🗃️ Running database migrations...')
try {
  execSync('node ace migration:run', { stdio: 'inherit' })
} catch (error) {
  console.error('Error running migrations:', error.message)
}

// Theme configuration
console.log('\n⚙️ Theme configuration...')
rl.question('Do you want to disable dark mode? (y/n): ', (disableDarkMode) => {
  rl.question('Do you want to use a custom CSS path? (y/n): ', (customCssPath) => {
    let themeCommand = 'node ace configure:theme'

    if (disableDarkMode.toLowerCase() === 'y') {
      themeCommand += ' -n'
    }

    if (customCssPath.toLowerCase() === 'y') {
      rl.question('Please enter the CSS file path: ', (cssPath) => {
        themeCommand += ` --css-path=${cssPath}`
        configureThemeAndContinue(themeCommand)
      })
    } else {
      configureThemeAndContinue(themeCommand)
    }
  })
})

function configureThemeAndContinue(themeCommand) {
  console.log('🎨 Configuring DaisyUI theme...')
  try {
    execSync(themeCommand, { stdio: 'inherit' })
  } catch (error) {
    console.error('Error configuring theme:', error.message)
  }

  // Ask to initialize a new Git repository
  rl.question('Do you want to initialize a new Git repository? (y/n): ', (initGit) => {
    if (initGit.toLowerCase() === 'y') {
      console.log('🔄 Initializing a new Git repository...')
      try {
        execSync('git init', { stdio: 'inherit' })
        console.log('📝 Creating initial commit...')
        try {
          execSync('git add .', { stdio: 'inherit' })
          execSync('git commit -m "feat: init"', {
            stdio: 'inherit',
          })
        } catch (error) {
          console.error('Error creating initial commit:', error.message)
        }
      } catch (error) {
        console.error('Error initializing Git repository:', error.message)
      }
    }

    finishSetup()
  })
}

function finishSetup() {
  console.log('\n✅ Setup complete! You can start the development server with:')
  console.log('npm run dev\n')
  rl.close()
}
