import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/lib/**/*.ts', 'src/hooks/**/*.ts'],
}

export default createJestConfig(config)
