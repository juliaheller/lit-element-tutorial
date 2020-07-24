import { LitElement, html } from "lit-element";

export class BaseView extends LitElement {
    createRenderRoot() {
        return this;
    }
}
