import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // give the tests a fake DOM
    globals: true,        // test/expect/beforeEach without imports; lets RTL clean up after each test
  },
})
