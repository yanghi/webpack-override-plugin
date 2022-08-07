
export namespace Log {
    export function log(msg: string) {
        console.log('[override plugin]', msg)
    }
}