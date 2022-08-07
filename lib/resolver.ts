import { Resolver } from "webpack";
import { AsyncSeriesBailHook } from 'tapable'
import { ModuleOverrideType, OverriderWebpackPluginOptions } from "./options";
import path from 'path'
import { resolveFileWithExtensions } from "./resolve";

// type H = Resolver['hooks']['noResolve'] 
// type ResolveRequest = H extends  SyncHook<[infer R, any], any, any> ? R : any
type ResolveRequest = any

export interface OverrideRequest {
    resolveRequest: ResolveRequest
    path: string
}

export interface OverrideData {
    type: ModuleOverrideType
    origin: OverrideRequest
    override: OverrideRequest
}

class OverrideResolverPlugin {
    options: OverriderWebpackPluginOptions
    constructor(options: OverriderWebpackPluginOptions) {
        this.options = (options)
    }
    hooks = {
        override: new AsyncSeriesBailHook<[
            OverrideData], void | ResolveRequest>(['overrideData'])
    }
    overrideSet = new Set()
    apply(resolver: Resolver) {
        const target = resolver.ensureHook('resolve')

        const resolverName = this.constructor.name
        const options = this.options

        resolver.hooks.resolve.tapAsync(resolverName, async (resolveRequest, resolveContext, cb) => {
            if (!resolveRequest.path || !resolveRequest.request) return cb()

            const matchOption = options.overrides.find(opt => {
                return (resolveRequest.path && resolveRequest.path.startsWith(opt.target))
            })

            if (!matchOption) return cb()

            const relativePath = resolveRequest.path.substring(matchOption.target.length)
            let overrideContext = path.join(matchOption.context, relativePath)

            const overrideRequest = path.join(overrideContext, resolveRequest.request)

            resolveFileWithExtensions(overrideRequest, options.extensions, (e, result) => {
                if (e || !result) {
                    return cb()
                }

                // todo otherwise
                if (matchOption.module !== 'override') {
                    return cb()
                }

                const overrideRequestObj = { ...resolveRequest, request: overrideRequest }
                const data: OverrideData = {
                    origin: {
                        resolveRequest: resolveRequest,
                        path: path.join(resolveRequest.path || '', resolveRequest.request!)
                    },
                    override: {
                        resolveRequest: overrideRequestObj,
                        path: overrideRequest
                    },
                    type: matchOption.module
                }
                this.hooks.override.callAsync(data, (err, result) => {
                    if (err) {
                        console.log('override hook call error', err)
                    }

                    resolver.doResolve(target, result || overrideRequestObj, null, resolveContext, cb)
                })

            })

        })
    }
}

export default OverrideResolverPlugin