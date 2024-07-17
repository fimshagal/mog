import { HTMLBuildConfig, IHtmlBuilder } from "./lib";
import { genSingletonLock, Nullable } from "../utils";

const HtmlBuilderSingletonLock = Symbol(genSingletonLock('HtmlBuilder'));

export class HtmlBuilder implements IHtmlBuilder {
    private static _singleInstance: HtmlBuilder;

    constructor(singletonLock?: symbol) {
        if (HtmlBuilder._singleInstance) {
            throw Error("I can't be initialised twice");
        }

        if (singletonLock !== HtmlBuilderSingletonLock) {
            throw Error("I can't be initialised with constructor");
        }
    }

    public static getSingle(): HtmlBuilder  {
        if (!HtmlBuilder._singleInstance) {
            HtmlBuilder._singleInstance = new HtmlBuilder(HtmlBuilderSingletonLock);
        }
        return HtmlBuilder._singleInstance;
    }

    public build(options: HTMLBuildConfig): Nullable<HTMLElement> {
        const {
            tag,
            parent,
            id,
            classList,
            innerText,
            value,
            type,
            attributes,
            children,
        } = options;
        try {
            const el: HTMLElement = document.createElement(tag);

            if (id) {
                el.id = id;
            }

            if (classList && classList.length) {
                el.classList.add(...classList);
            }

            if (innerText) {
                el.innerText = innerText;
            }

            if (value) {
                switch(tag) {
                    case "option":
                        (el as HTMLOptionElement).value = value;
                        break;
                    case "input":
                        (el as HTMLInputElement).value = value;
                        break;
                }
            }

            if (type) {
                switch (tag) {
                    case "input":
                        (el as HTMLInputElement).type = type;
                }
            }

            if (attributes) {
                for (const item of attributes) {
                    Object
                        .entries(item)
                        .forEach(([key, value]) => el.setAttribute(key, value));
                }
            }

            if (children && children.length) {
                for (const child of children) {
                    el.insertAdjacentElement("beforeend", child);
                }
            }

            parent.insertAdjacentElement("beforeend", el);

            return el || null;
        } catch (err) {
            return null;
        }
    }

    public removeAllChild(target: HTMLElement): void {
        while(target?.firstChild){
            target?.removeChild(target?.firstChild);
        }
    }
}