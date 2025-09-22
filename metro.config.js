const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript and web
config.resolver.sourceExts.push('tsx', 'ts', 'jsx', 'js');
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

module.exports = config;
