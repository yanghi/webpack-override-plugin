import { Compiler , NormalModule} from 'webpack';
import path from 'path'
import ResolverPlugin from './resolver';
import { normalizeOption, OverriderWebpackPluginOptions } from './options';
import { Log } from './logger';

class OverriderWebpackPlugin {
    static defaultOptions: Partial<OverriderWebpackPluginOptions> = {
        log: true,
        module: 'override'
    }

    options: OverriderWebpackPluginOptions
    resolverPlugin: ResolverPlugin

    readonly root = process.cwd()
    constructor(options: OverriderWebpackPluginOptions) {
        this.options = normalizeOption(options, OverriderWebpackPlugin.defaultOptions)

        this.resolverPlugin = new ResolverPlugin(this.options)
    }
    _compiler?: Compiler
    getCompiler() {
        return this._compiler
    }
    relativeRoot(_path: string) {
        return path.relative(this.root, _path)
    }
    apply(compiler: Compiler) {
        this._compiler = compiler
        const pluginName = this.constructor.name
        if (!compiler.options.resolve.plugins) compiler.options.resolve.plugins = []

        compiler.options.resolve.plugins.unshift(this.resolverPlugin)

        this.options.log && this.resolverPlugin.hooks.override.tap(pluginName, (data) => {
            Log.log(`${this.relativeRoot(data.override.path)} -> ${this.relativeRoot(data.origin.path)}`)
        })
    }
}

module.exports = OverriderWebpackPlugin
