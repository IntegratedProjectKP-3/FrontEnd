import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'ohma3y',
  e2e: {
    specPattern: 'cypress/e2e//*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173'
    // baseUrl: 'http://ip23kp3.sit.kmutt.ac.th'
  },
  component: {
    specPattern: 'src//tests/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
})