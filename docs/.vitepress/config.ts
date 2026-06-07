import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Verdex Dashboard',
  description: 'Documentation du cockpit admin, DevOps & cybersécurité Verdex.',
  lang: 'fr-FR',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'Verdex Dashboard',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Utilisateur', link: '/user-guide' },
      { text: 'Audit & roadmap', link: '/AUDIT' },
      { text: 'Infra à faire', link: '/infra-setup' },
      {
        text: 'Liens',
        items: [
          { text: 'Dépôt GitHub', link: 'https://github.com/Verdex-Workspace/Verdex-Dashboard' },
          {
            text: 'Contribuer',
            link: 'https://github.com/Verdex-Workspace/Verdex-Dashboard/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Démarrer',
          items: [
            { text: 'Prise en main', link: '/guide/getting-started' },
            { text: 'Architecture', link: '/guide/architecture' },
          ],
        },
        {
          text: 'Approfondir',
          items: [
            { text: 'Design system', link: '/guide/design-system' },
            { text: 'Environnements & déploiement', link: '/guide/deployment' },
          ],
        },
      ],
      '/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Guide utilisateur', link: '/user-guide' },
            { text: 'Audit & roadmap', link: '/AUDIT' },
            { text: 'Checklist infrastructure', link: '/infra-setup' },
          ],
        },
        {
          text: 'Guide technique',
          items: [
            { text: 'Prise en main', link: '/guide/getting-started' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Design system', link: '/guide/design-system' },
            { text: 'Environnements & déploiement', link: '/guide/deployment' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Verdex-Workspace/Verdex-Dashboard' }],

    footer: {
      message: 'Sous licence MIT.',
      copyright: '© Verdex Workspace',
    },

    search: { provider: 'local' },

    outline: { label: 'Sur cette page', level: [2, 3] },
    docFooter: { prev: 'Précédent', next: 'Suivant' },
    lastUpdatedText: 'Dernière mise à jour',
  },
})
