declare module 'object-traversed' {
    export function traversed<T>(collection?: T[] | Object): Traversed;
    export default function traversed<T>(collection?: T[] | Object): Traversed;
    export class Traversed {
        get(path: string, defaultValue: any): string | object | any
        has(path: string): boolean
        set(path: string, value: any): any
        push(path: string, value: any): void
        create(path: string): void
        delete(path: string): void
        exec(path: string): any
        isArray(path: string): boolean
        isObject(path: string): boolean
        isString(path: string): boolean
        isNumber(path: string): boolean
    }
}
