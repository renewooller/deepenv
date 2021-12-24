declare let prefix : string
declare let nesting_delimiter : string

declare interface options {
    custom_prefix?: string
    custom_nesting_delimiter? : string
}

declare function config<T extends {[key:string]: any}>(original :T, options: options): T