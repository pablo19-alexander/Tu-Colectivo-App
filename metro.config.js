const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Agrega la extensión '.cjs' a la lista de extensiones de activos reconocidos por Metro.
 * Esto es necesario porque algunas bibliotecas, como Firebase, utilizan módulos CommonJS con extensión '.cjs'.
 */
defaultConfig.resolver.assetExts.push('cjs');

/**
 * Desactiva la opción 'unstable_enablePackageExports'.
 * Esta opción experimental habilita la resolución de módulos basados en los 'exports' definidos en package.json.
 * Se desactiva para evitar conflictos de resolución con Firebase y otras bibliotecas que utilizan 'cjs' y 'esm'.
 */
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
