import ts from 'rollup-plugin-typescript2' // 解析 ts
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方插件
import path from 'path'

const packagesDir  = path.resolve('packages')
const packageDir  = path.resolve(packagesDir,process.env.TARGET)
console.log("🚀 ~ file: rollup.config.js:8 ~ packageDir:", packageDir)

const resolve = p => path.resolve(packageDir,p)
const pkg = require(resolve('package.json'))
const packageOptions = pkg.buildOptions || {}
const name = path.basename(packageDir)
const outputOptions = {
    "esm-bundler": {
        file:resolve( `dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    "cjs":{
        file:resolve( `dist/.cjs.js`),
        format:'cjs'
    },
    "global":{
        file:resolve(`dist/${name}.global.js`),
        format:'iife'
    }
}
const options = pkg.buildOptions || {}
function createConfig(format,output){
    output.name = options.name
    output.sourcemap = true
    return {
        input:resolve('src/index.ts'),
        output,
        plugin:[
            json(),
            ts({
                tsconfig:path.resolve('tsconfig.json')
            }),
            resolvePlugin(),
        ]
    }
}
export default options.formats.map(format=>createConfig(format,outputOptions[format]))
