import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_REPOSITORY?.endsWith('.github.io')
    ? '/'
    : process.env.GITHUB_REPOSITORY
      ? `/${process.env.GITHUB_REPOSITORY.split('/').at(-1)}/`
      : '/',
  plugins: [react()],
})
