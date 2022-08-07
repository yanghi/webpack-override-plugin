import glob, { IOptions } from 'glob'
import path from 'path'


export function asyncGlob(pattern: string, options?: IOptions): Promise<string[]> {
    return new Promise(function (resolve, reject) {

        glob(pattern, options || {}, (r, m) => {
            if (r) {
                reject(r)
            } else {
                resolve(m)
            }
        })
    })
}

function asyncGlobs(patterns: string[], options?: IOptions): Promise<string[]> {

    return new Promise((resolve, reject) => {

        Promise.all(patterns.map(pattern => asyncGlob(pattern, options))).then(res => {
            // console.log('fff', res)
            const files = res.reduce<string[]>((result, cur) => {
                result.push(...cur)
                return result
            }, [])

            resolve(files)
        }).catch(reject)

    })

}

function globs(patterns: string[], cb: (err: Error | null, files: string[]) => void): void
function globs(patterns: string[], options: IOptions, cb: (err: Error | null, files: string[]) => void): void
function globs(patterns: string[], options: any, cb?: any) {
    if (typeof options === 'function') {
        cb = options
        options = undefined
    }
    asyncGlobs(patterns, options).then(files => {
        cb(null, files)
    }).catch((err) => {
        cb(err, [])
    })
}

export function resolveFileWithExtensions(request: string, extensions: string[] | undefined | null, cb: (err: any, result?: string) => void) {

    const ext = path.extname(request)
    const patterns = ext ? [request] : [`${request}*`, `${request}/index*`]

    globs(patterns, { nodir: true }, (r, files) => {
        if (r) {
            cb(r)
        } else {
            // console.log('gg', files)
            // console.log('gg', request, extensions, ext)

            if (extensions) {
                let full = matchFileWithExtentions(files, request, extensions)

                cb(null, full)
            } else {
                let f= matchFile(files, request)
                // console.log('matchFile', f,request, files)
                cb(null, matchFile(files, request))

                return
            }

        }
    })
}

function matchFileWithExtentions(files: string[], request: string, exts: string[]) {

    for (let i = 0; i < files.length; i++) {
        let file = files[i]

        for (let j = 0; j < exts.length; j++) {
            const ext = exts[j];


            let path = request + ext
            if (path === file) return path


            path = request + '/index' + ext

            if (path === file) return path

        }
    }
}

function matchFile(files: string[], request: string) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i]

        if(file.startsWith(request)) return file

        if(file.startsWith(request + '/index')) return file
        
    }
}