// jest.setup.js

// Import the TextEncoder and TextDecoder from the 'util' module
const { TextEncoder, TextDecoder } = require('util');

// Make TextEncoder and TextDecoder available globally for the test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
