import { LitElement, html } from "lit-element";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/vaadin-radio-button/vaadin-radio-group";
import { VisibilityFilters, getVisibleTodosSelector } from "../redux/reducer";
import { connect } from "pwa-helpers";
import { store } from "../redux/store";
import {
    addTodo,
    updateTodoStatus,
    updateFilter,
    clearCompleted,
} from "../redux/actions.js";
import { BaseView } from "./base-view";

class TodoView extends connect(store)(BaseView) {
    static get properties() {
        return {
            todos: { type: Array },
            filter: { type: String },
            task: { type: String },
        };
    }
    stateChanged(state) {
        this.todos = getVisibleTodosSelector(state);
        this.filter = state.filter;
    }

    render() {
        return html`
            <div class="input-layout" @keyup="${this.shortcutListener}">
                <vaadin-text-field
                    placeholder="Task"
                    value="${this.task || ""}"
                    @change="${this.updateTask}"
                ></vaadin-text-field>
                <vaadin-button theme="primary" @click="${this.addTodo}"
                    >Add Todo</vaadin-button
                >
            </div>
            <div class="todos-list">
                ${this.todos.map(
                    (todo) => html` <div class="todo-item">
                        <vaadin-checkbox
                            ?checked="${todo.complete}"
                            @change="${(e) =>
                                this.updateTodoStatus(todo, e.target.checked)}"
                            >${todo.task}</vaadin-checkbox
                        >
                    </div>`
                )}
            </div>
            <vaadin-radio-group
                class="visibility-filters"
                value="${this.filter}"
                @value-changed="${this.filterChanged}"
            >
                ${Object.values(VisibilityFilters).map(
                    (filter) => html`
                        <vaadin-radio-button value="${filter}"
                            >${filter}</vaadin-radio-button
                        >
                    `
                )}
            </vaadin-radio-group>
            <vaadin-button @click="${this.clearCompleted}"
                >Clear Completed</vaadin-button
            >
        `;
    }

    filterChanged(e) {
        store.dispatch(updateFilter(e.detail.value));
    }
    clearCompleted() {
        store.dispatch(clearCompleted());
    }

    updateTodoStatus(updatedTodo, complete) {
        store.dispatch(updateTodoStatus(updatedTodo, complete));
    }
    shortcutListener(e) {
        if (e.key === "Enter") {
            this.addTodo();
        }
    }
    updateTask(e) {
        this.task = e.target.value;
    }
    addTodo() {
        if (this.task) {
            store.dispatch(addTodo(this.task));
            this.task = "";
        }
    }
}

customElements.define("todo-view", TodoView);
