import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'WebSublime Forms',
  description: 'Form model validation',
  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/websublime/forms' },
      { text: 'Getting Started', link: '/guide/getting-started' }
    ],
    sidebar: {
      '/guide/': getGuideSidebar()
      // '/concepts/': getConceptsSidebar(),
      // '/': getGuideSidebar()
    }
  }
});

function getGuideSidebar() {
  return [
    {
      text: 'Introduction',
      children: [
        { text: 'What is Forms?', link: '/guide/' },
        { text: 'Getting started', link: '/guide/getting-started' },
        { text: 'Form Control', link: '/guide/form-control' },
        { text: 'Form Group', link: '/guide/form-group' },
        { text: 'Form Array', link: '/guide/form-array' }
      ]
    }
  ];
}

// function getConceptsSidebar() {
//   return [
//     {
//       text: 'Introduction',
//       children: [
//         { text: 'What is VitePress?', link: '/' },
//         { text: 'Getting Started', link: '/guide/getting-started' },
//         { text: 'Configuration', link: '/guide/configuration' },
//         { text: 'Asset Handling', link: '/guide/assets' },
//         { text: 'Markdown Extensions', link: '/guide/markdown' },
//         { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
//         { text: 'Deploying', link: '/guide/deploy' }
//       ]
//     },
//     {
//       text: 'Advanced',
//       children: [
//         { text: 'Frontmatter', link: '/guide/frontmatter' },
//         { text: 'Theming', link: '/guide/theming' },
//         { text: 'API Reference', link: '/guide/api' },
//         {
//           text: 'Differences from Vuepress',
//           link: '/guide/differences-from-vuepress'
//         }
//       ]
//     }
//   ];
// }
