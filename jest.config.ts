import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  collectCoverage: true,
  coverageDirectory: 'coverage', // 커버리지 결과 저장 디렉토리
  coverageReporters: ['text', 'lcov'],
};

export default config;

