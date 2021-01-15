import MainRouteView from "./view";
import React, {useState, useEffect} from "react";
import {loadWasm} from "../../helpers/cadLoader";

function MainRoute(){
    const [wasm, setWasm] = useState(false);

    useEffect(() => {
        loadWasm().then(loaded => setWasm(loaded));
    }, [])

    return <MainRouteView />
}

export default MainRoute;