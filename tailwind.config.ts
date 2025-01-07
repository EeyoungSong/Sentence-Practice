import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'w-[30rem]',
    'border-t',
    'py-5',
    'pb-10',
    'disabled:border-pwcBorderGrey',
    'disabled:text-pwcBorderGrey',
    'ring-mainOrange/50',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        mainBlue: 'var(--mainBlue)',
        textBlue: '#2671AF',
        toggleBlue: '#D4E7F7',
        pwcBorderGrey: '#C6C6C8',
        pwcWarnTxt: '#9C0006',
        pwcWarnBg: '#FFC7CE',
        pwcSuccessTxt: '#006100',
        pwcSuccessBg: '#C6EFCE',
      },
    },
  },
  plugins: [],
};
export default config;
