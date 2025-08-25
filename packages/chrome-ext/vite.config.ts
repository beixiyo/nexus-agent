import type { Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import manifest from './manifest.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    ignoreNode(),
    react(),
    UnoCSS(),
    AutoImport({
      imports: ['react'],
      dts: './src/auto-imports.d.ts',
    }),
    crx({ manifest }),
    codeInspectorPlugin({
      bundler: 'vite',
      editor: 'cursor',
    }),
  ],
  define: {
    'process.env': {},
    'process.cwd': () => '',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url).href),
      },
    },
  },
})

// #region
function ignoreNode(): Plugin {
  const modulesToMock = [
    'child_process',
    'fs',
    'os',
    'path',
    'crypto',
    'util',
    'url',
    'buffer',
    'stream',
    'events',
    'http',
    'https',
    'process',
    /** 如果遇到更多模块报错，继续在这里添加 */
  ]

  /** 为这些模块创建虚拟ID映射，同时处理 node: 前缀 */
  const resolvedVirtualModuleIds: Record<string, string> = {}

  modulesToMock.forEach((moduleName) => {
    /** 处理普通导入: import fs from 'fs' */
    const virtualId = `virtual:${moduleName}`
    resolvedVirtualModuleIds[virtualId] = virtualId

    /** 处理 node: 前缀导入: import fs from 'node:fs' */
    const nodeVirtualId = `virtual:node:${moduleName}`
    resolvedVirtualModuleIds[nodeVirtualId] = nodeVirtualId
  })

  const virtualModuleIds = Object.keys(resolvedVirtualModuleIds)

  /** 常见的具名导出映射，用于提供更精确的 mock */
  const commonExports: Record<string, string[]> = {
    child_process: ['exec', 'execSync', 'spawn', 'spawnSync', 'fork', 'execFile', 'execFileSync'],
    fs: [
      'readFile',
      'readFileSync',
      'writeFile',
      'writeFileSync',
      'existsSync',
      'mkdir',
      'mkdirSync',
      'readdir',
      'readdirSync',
      'stat',
      'statSync',
      'unlink',
      'unlinkSync',
      'rmdir',
      'rmdirSync',
      'access',
      'accessSync',
      'copyFile',
      'copyFileSync',
      'rename',
      'renameSync',
    ],
    path: [
      'resolve',
      'join',
      'dirname',
      'basename',
      'extname',
      'parse',
      'format',
      'normalize',
      'relative',
      'isAbsolute',
      'sep',
      'delimiter',
      'posix',
      'win32',
    ],
    os: [
      'platform',
      'arch',
      'cpus',
      'totalmem',
      'freemem',
      'hostname',
      'type',
      'release',
      'tmpdir',
      'homedir',
      'userInfo',
      'uptime',
      'loadavg',
      'networkInterfaces',
    ],
    crypto: [
      'createHash',
      'createHmac',
      'randomBytes',
      'randomUUID',
      'createCipher',
      'createDecipher',
      'pbkdf2',
      'scrypt',
    ],
    util: [
      'inspect',
      'format',
      'promisify',
      'callbackify',
      'deprecate',
      'inherits',
      'isDeepStrictEqual',
    ],
    url: [
      'parse',
      'format',
      'resolve',
      'pathToFileURL',
      'fileURLToPath',
      'URL',
      'URLSearchParams',
    ],
    buffer: ['Buffer'],
    stream: ['Readable', 'Writable', 'Transform', 'Duplex', 'PassThrough', 'pipeline'],
    events: ['EventEmitter', 'once', 'on'],
    http: ['createServer', 'request', 'get', 'Agent', 'IncomingMessage', 'ServerResponse'],
    https: ['createServer', 'request', 'get', 'Agent'],
    process: ['env', 'cwd', 'argv'],
  }

  return {
    name: 'vite-plugin-node-builtins-polyfill',
    enforce: 'pre',

    resolveId(id: string) {
      /** 处理 node: 前缀导入 */
      if (id.startsWith('node:')) {
        const moduleName = id.slice(5) // 移除 'node:' 前缀
        if (modulesToMock.includes(moduleName)) {
          return resolvedVirtualModuleIds[`virtual:node:${moduleName}`]
        }
      }

      /** 处理普通导入 */
      if (modulesToMock.includes(id)) {
        return resolvedVirtualModuleIds[`virtual:${id}`]
      }

      return null
    },

    load(id: string) {
      if (virtualModuleIds.includes(id)) {
        /** 从虚拟ID中提取模块名 */
        let moduleName = id.replace('virtual:', '')
        if (moduleName.startsWith('node:')) {
          moduleName = moduleName.slice(5) // 移除 'node:' 前缀
        }

        /** 获取该模块的常见导出 */
        const exports = commonExports[moduleName] || []

        /** 生成具名导出的 mock 函数 */
        const namedExports = exports.map((exportName) => {
          return `export const ${exportName} = createMockFunction('${moduleName}', '${exportName}');`
        }).join('\n')

        const code = `
// Polyfill for ${moduleName} module
function createMockFunction(moduleName, functionName) {
  return function(...args) {
    console.warn(\`[Node Polyfill] The function "\${moduleName}.\${functionName}" is not available in the browser environment. Called with args:\`, args);

    // 为一些常见函数提供合理的返回值
    switch (functionName) {
      case 'existsSync':
        return false;
      case 'readFileSync':
      case 'readFile':
        return '';
      case 'resolve':
      case 'join':
      case 'dirname':
      case 'basename':
        return args.join ? args.join('/') : (args[0] || '');
      case 'platform':
        return 'browser';
      case 'arch':
        return 'x64';
      case 'sep':
        return '/';
      case 'delimiter':
        return ':';
      default:
        return undefined;
    }
  };
}

// 生成具名导出
${namedExports}

// 预先创建所有已知导出的对象
const moduleExports = {};
${exports.map(name => `moduleExports['${name}'] = ${name};`).join('\n')}

// 创建一个 Proxy 作为默认导出，处理动态属性访问
const handler = {
  get(target, prop, receiver) {
    // 如果是已知的导出，直接返回
    if (moduleExports.hasOwnProperty(prop)) {
      return moduleExports[prop];
    }

    // 对于未知属性，也返回 mock 函数
    console.warn(\`[Node Polyfill] The property "\${String(prop)}" of module "${moduleName}" is not available in the browser. Returning a dummy function.\`);
    return createMockFunction('${moduleName}', String(prop));
  },

  has(target, prop) {
    return true; // 让所有属性检查都返回 true
  },

  ownKeys(target) {
    return Object.keys(moduleExports);
  },

  getOwnPropertyDescriptor(target, prop) {
    if (moduleExports.hasOwnProperty(prop)) {
      return {
        enumerable: true,
        configurable: true,
        writable: true,
        value: moduleExports[prop]
      };
    }
    return {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.get(target, prop, receiver)
    };
  }
};

const defaultExport = new Proxy(moduleExports, handler);

export default defaultExport;
        `
        return { code }
      }
      return null
    },
  }
}
// #endregion
