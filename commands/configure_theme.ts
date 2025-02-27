import fs from 'node:fs'
import path from 'node:path'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ConfigureThemeCommand extends BaseCommand {
  static commandName = 'configure:theme'
  static description = 'Configure DaisyUI themes for your application'

  static help = [
    'This command configures DaisyUI themes for your application.',
    '',
    'Examples:',
    '',
    '  # Basic configuration with default and dark themes',
    '  {{ binaryName }} configure:theme',
    '',
    '  # Configuration without dark mode',
    '  {{ binaryName }} configure:theme --no-dark-mode',
    '',
    '  # Custom CSS path',
    '  {{ binaryName }} configure:theme --css-path=resources/css/app.css',
  ]

  static options: CommandOptions = {
    startApp: false,
  }

  @flags.boolean({
    description: 'Disable dark mode support',
    alias: 'n',
  })
  declare noDarkMode: boolean

  @flags.string({
    description: 'Path to CSS file (relative to project root)',
    alias: 'p',
  })
  declare cssPath: string

  private readonly AVAILABLE_THEMES = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
    'caramellatte',
    'abyss',
    'silk',
  ]

  private generateDaisyUIConfig(themes: string[]) {
    return `@import 'tailwindcss';
@plugin "daisyui" {
  themes:
    ${themes.join(',\n    ')};
}`
  }

  async run() {
    this.logger.info('🎨 Configuration des thèmes DaisyUI pour votre projet')

    const cssFilePath = this.cssPath || 'inertia/css/app.css'
    const fullCssPath = path.join(process.cwd(), cssFilePath)

    if (!fs.existsSync(path.dirname(fullCssPath))) {
      this.logger.warning(`Le répertoire ${path.dirname(fullCssPath)} n'existe pas. Création...`)
      fs.mkdirSync(path.dirname(fullCssPath), { recursive: true })
    }

    const defaultTheme = await this.prompt.choice(
      'Choisissez le thème par défaut:',
      this.AVAILABLE_THEMES.map((theme) => ({
        name: theme,
        message: theme,
      })),
      {
        default: this.AVAILABLE_THEMES.indexOf('light'),
      }
    )

    const selectedThemes = [`${defaultTheme} --default`]

    let darkTheme = ''
    if (!this.noDarkMode) {
      const useDarkMode = await this.prompt.confirm(
        'Voulez-vous configurer un thème pour le mode sombre?',
        {
          default: true,
        }
      )

      if (useDarkMode) {
        darkTheme = await this.prompt.choice(
          'Choisissez le thème pour le mode sombre:',
          this.AVAILABLE_THEMES.map((theme) => ({
            name: theme,
            message: theme,
          })),
          {
            default: this.AVAILABLE_THEMES.indexOf('dark'),
          }
        )
        selectedThemes.push(`${darkTheme} --prefersdark`)
      }
    }

    const addAdditionalThemes = await this.prompt.confirm(
      'Voulez-vous ajouter des thèmes supplémentaires?',
      {
        default: false,
      }
    )

    if (addAdditionalThemes) {
      const availableThemes = this.AVAILABLE_THEMES.filter(
        (theme) => theme !== defaultTheme && theme !== darkTheme
      ).map((theme) => ({
        name: theme,
        message: theme,
      }))

      if (availableThemes.length > 0) {
        const additionalThemes = await this.prompt.multiple(
          'Sélectionnez des thèmes additionnels:',
          availableThemes
        )

        selectedThemes.push(...additionalThemes)
      }
    }

    const daisyUIConfig = this.generateDaisyUIConfig(selectedThemes)
    fs.writeFileSync(fullCssPath, daisyUIConfig)

    this.logger.success(`✅ Configuration des thèmes terminée avec succès!`)

    const table = this.ui.table()
    table.head(['Type', 'Thème', 'Flag'])

    table.row(['Par défaut', defaultTheme, '--default'])

    if (darkTheme) {
      table.row(['Mode sombre', darkTheme, '--prefersdark'])
    }

    const additionalOnly = selectedThemes.slice(darkTheme ? 2 : 1)
    for (const theme of additionalOnly) {
      table.row(['Additionnel', theme, ''])
    }

    table.render()

    this.logger.info(`Configuration enregistrée dans: ${this.colors.cyan(fullCssPath)}`)
  }
}
