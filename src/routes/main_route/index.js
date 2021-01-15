import MainRouteView from "./view";

import { initOpenCascade } from "opencascade.js";

function MainRoute(){

    initOpenCascade().then(openCascade => {
        // use it!
    });

    return <MainRouteView />
}

export default MainRoute;