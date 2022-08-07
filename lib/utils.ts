import path from 'path'

export interface FileInfo {
    ext: string
    path: string
    basenameWithoutExt: string,
    dir: string
}

export function fileInfo(p: string): FileInfo {
    let ext = path.extname(p)

    return {
        ext,
        path: p,
        basenameWithoutExt: path.basename(p, ext),
        dir: path.dirname(p)
    }
}
