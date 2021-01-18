import MainRouteView from "./view";
import React, {useState, useEffect} from "react";
import {loadSTEPorIGES, loadWasm, loadLocalFile} from "../../helpers/cadLoader";
import test from './test.stp';

function MainRoute(){
    const [wasm, setWasm] = useState(false);
    const [mesh, setMesh] = useState(null)

    useEffect(() => {
        loadWasm().then(loaded => setWasm(true));
    }, [])



    useEffect(() => {
        if (wasm)
            loadLocalFile(test).then(r =>{
                loadSTEPorIGES(test, r).then(r => setMesh(r))
            })

        }, [wasm])

    //     loadSTEPorIGES(test).then(r => r);


    return <MainRouteView mesh={mesh}/>
}

export default MainRoute;