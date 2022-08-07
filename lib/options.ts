export interface OverrideOptions {
    context: string
    target: string
    module?: ModuleOverrideType
}

export type ModuleOverrideType = 'override' | 'merge' | 'auto'

export interface NormalizedOverrideOptions extends OverrideOptions {
    module: ModuleOverrideType
}

export interface OverriderWebpackPluginOptions {
    overrides: OverrideOptions[]
    module?: ModuleOverrideType
    extensions?: string[] | null
    log?: boolean
}

export function normalizeOption(options: OverriderWebpackPluginOptions, defaults: Partial<OverriderWebpackPluginOptions> = {}): OverriderWebpackPluginOptions {

    const normalized = Object.assign({}, defaults, options)

    if (normalized.extensions === undefined) {
        normalized.extensions = defaults.extensions
    }

    normalized.overrides.forEach(op => {
        if (!op.module) op.module = normalized.module
    })

    return normalized

}