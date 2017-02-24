import {render} from "./widgets/renderer";

import * as app from "./widgets/app"
import * as state from "./appstate";
import {configure} from "./widgets/appview";


/**export function mount(): void {
    render(app.view, state.init(), document.querySelector("#app"))
}
console.log("mounting ..");
mount();**/
configure();