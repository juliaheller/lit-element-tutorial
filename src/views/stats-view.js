import { BaseView } from "./base-view";
import { connect } from "pwa-helpers";
import { store } from "../redux/store.js";
import { html } from "lit-element";
import { statsSelector } from "../redux/reducer.js";
import "@vaadin/vaadin-charts";

export class StatsView extends connect(store)(BaseView) {
    static get properties() {
        return {
            chartConfig: { type: Object },
        };
    }
    stateChanged(state) {
        const stats = statsSelector(state);
        this.chartConfig = [
            { name: "Completed", y: stats.completed },
            { name: "Active", y: stats.active },
        ];

        this.hasTodos = state.todos.length > 0;
    }
    getChart() {
        if (this.hasTodos) {
            return html`
                <vaadin-chart type="pie">
                    <vaadin-chart-series
                        .values="${this.chartConfig}"
                    ></vaadin-chart-series>
                </vaadin-chart>
            `;
        } else {
            return html` <p>Nothing to do! 🌴🍻☀️</p> `;
        }
    }

    render() {
        return html`
            <style>
                stats-view {
                    display: block;
                }
            </style>
            ${this.getChart()}
        `;
    }
}
customElements.define("stats-view", StatsView);
