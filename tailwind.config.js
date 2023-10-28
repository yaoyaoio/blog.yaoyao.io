/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  // ...
  purge: {
    content: [
      './docs/.vitepress/**/*.js',
      './docs/.vitepress/**/*.vue',
      './docs/.vitepress/**/*.ts',
    ],
    options: {
      safelist: ['html', 'body'],
    },
  }
}
