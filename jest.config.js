export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:3000'
      }
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@babel|axios|react-router-dom)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
}; 