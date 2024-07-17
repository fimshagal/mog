import { Dictionary } from "../utils";
import { Nullable } from "../utils";

/* Pure interfaces */

export interface IMog {
    init(initConfig: MogInitConfig): void;
    log(message: any): void;
    defineLog(): LogFn;
}

export interface IHtmlBuilder {
    build(options: HTMLBuildConfig): Nullable<HTMLElement>;
    removeAllChild(target: HTMLElement): void
}

/* Pure interfaces end */

//

/* Configs */

export interface Entry {
    message: any;
    messageType: string;
    serializedMessage: string;
}

export interface MogInitConfig {
    parentElement?: HTMLElement,
}

export interface HTMLBuildConfig {
    parent: HTMLElement;
    tag: string;
    id?: string;
    classList?: string[];
    innerText?: string;
    value?: string;
    type?: string;
    attributes?: Dictionary<string>[];
    children?: HTMLElement[];
}

/* Configs end */

//

/* Types */

export type LogFn = (message: any) => void;

/* Types end */