import tailwindTypography from '@tailwindcss/typography' // 排版插件
import tailwindLineClamp from '@tailwindcss/line-clamp' // 文本截断插件

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './docs/**/*.{html,js,vue,ts,md}',
    './docs/.vitepress/**/*.{html,js,vue,ts,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindTypography,
    tailwindLineClamp,
  ],
}


