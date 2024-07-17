import { Entry, IMog, LogFn, MogInitConfig } from "./lib";
import { Dictionary, genSingletonLock, Nullable, typeOf, is } from "./mog.utils";
import { HtmlBuilder } from "./mog.html.builder";
import { MogStyles } from "./mog.styles";

const MogSingletonLock = Symbol(genSingletonLock('MogSingletonLock'));

export class Mog implements IMog {
    private static _singleInstance: Mog;

    private _isInit: boolean = false;
    private _isMobileEnv: boolean = false;
    private _isCollapsed: boolean = false;

    private _toggleViewClassName: string = "mog-collapsed-view";

    private _parentElement: HTMLElement = document.body;
    private _rootElement: Nullable<HTMLElement> = null;
    private _elements: Dictionary<HTMLElement> = {};
    private _htmlBuilder: HtmlBuilder = HtmlBuilder.getSingle();

    private _entries: Entry[] = [];

    constructor(singletonLock?: symbol) {
        if (Mog._singleInstance) {
            throw Error("Constructor error");
        }

        if (singletonLock !== MogSingletonLock) {
            throw Error("Constructor error");
        }
    }

    public static getSingle(): Mog  {
        if (!Mog._singleInstance) {
            Mog._singleInstance = new Mog(MogSingletonLock);
        }
        return Mog._singleInstance;
    }

    public init(initConfig: MogInitConfig): void {
        if (this.isInit) return;

        this.defineEnv();
        this.applyInitConfig(initConfig);
        this.initHTML();

        this._isInit = true;
    }

    public get isInit(): boolean {
        return this._isInit;
    }

    public log(message: any): void {
        this.handleLog(message);
    }

    public defineLog(): LogFn {
        return this.log.bind(this);
    }

    private addEntry(entry: Entry): void {
        this.entries.push(entry);
    }

    private defineEnv(): void {
        this._isMobileEnv = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent);
    }

    private render(): void {
        const { messageType, serializedMessage} = this.lastEntry;

        const entries: Nullable<HTMLElement> = this.elements.entries;

        this.htmlBuilder.build({
            tag: "div",
            classList: [
                "mog-entry",
                `mog-entry-type-${messageType}`
            ],
            parent: entries,
            innerText: serializedMessage,
        });
    }

    private handleLog(message: any): void {
        const messageType: string = typeOf(message);

        let serializedMessage: string = is.scalar(message) || is.fn(message)
            ? message.toString()
            : JSON.stringify(message);

        if (messageType === "undefined") {
            serializedMessage = "undefined";
        }

        if (messageType === "string") {
            serializedMessage = `"${serializedMessage}"`;
        }

        this.addEntry({
            message,
            messageType,
            serializedMessage,
        });

        this.render();
    }

    private createHTML(): void {
        this.rootElement = this.htmlBuilder.build({
            tag: "div",
            parent: this.parentElement,
            classList: [
                'mog',
                `mog-${this.isMobileEnv ? "mobile" : "desktop"}`
            ],
            id: 'mog',
        });

        this.elements.styles = this.htmlBuilder.build({
            tag: 'style',
            parent: this.rootElement,
            classList: ['mog-styles'],
            innerText: MogStyles,
        });

        this.elements.groupHeader = this.htmlBuilder.build({
            tag: 'div',
            parent: this.rootElement,
            classList: [
                'mog-group',
                'mog-group-header'
            ],
            id: 'mogGroupHeader'
        });

        this.elements.logo = this.htmlBuilder.build({
            tag: 'p',
            parent: this.elements.groupHeader,
            classList: ['mog-logo'],
            id: 'mogLogo',
            innerText: 'Mog v0.0.1',
        });

        this.elements.buttonToggleView = this.htmlBuilder.build({
            tag: 'button',
            parent: this.elements.groupHeader,
            classList: [
                'mog-button',
                'mog-button-toggle-view',
            ],
            id: 'buttonToggleView',
            innerText: "⛶",
        });

        this.elements.entries = this.htmlBuilder.build({
            tag: 'output',
            parent: this.rootElement,
            classList: [
                'mog-entries'
            ],
            id: 'mogEntries'
        });
    }

    private listenHTML(): void {
        const buttonToggleView: HTMLButtonElement = this.elements.buttonToggleView as HTMLButtonElement;

        buttonToggleView.addEventListener("click", this.handleOnClickButtonToggleView.bind(this));
    }

    private stopListenHTML(): void {
        const buttonToggleView: HTMLButtonElement = this.elements.buttonToggleView as HTMLButtonElement;

        buttonToggleView.removeEventListener("click", this.handleOnClickButtonToggleView.bind(this));
    }

    private handleOnClickButtonToggleView(event: Event): void {
        event.preventDefault();
        this.toggleView();
    }

    private toggleView(): void {
        this._isCollapsed = !this._isCollapsed;

        const className: string = this._toggleViewClassName;
        const rootElement: HTMLElement = this.rootElement;

        if (this._isCollapsed) {
            rootElement.classList.add(className);
        } else {
            rootElement.classList.remove(className);
        }
    }

    private initHTML(): void {
        this.createHTML();
        this.listenHTML();
    }

    private applyInitConfig(initConfig: MogInitConfig): void {
        const { parentElement } = initConfig;
        this._parentElement = parentElement;
    }

    private get rootElement(): HTMLElement {
        return this._rootElement;
    }

    private set rootElement(element: Nullable<HTMLElement>) {
        this._rootElement = element;
    }

    private get parentElement(): HTMLElement {
        return this._parentElement;
    }

    private get htmlBuilder(): HtmlBuilder {
        return this._htmlBuilder;
    }

    private get entries(): Entry[] {
        return this._entries;
    }

    private get lastEntry(): Nullable<Entry> {
        return this.entries.length
            ? this.entries[this.entries.length - 1]
            : null;
    }

    private get isMobileEnv(): boolean {
        return this._isMobileEnv;
    }

    private get elements(): Dictionary<HTMLElement> {
        return this._elements;
    }
}