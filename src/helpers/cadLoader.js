import {
    Color,
    Geometry,
    Mesh,
    MeshStandardMaterial,
} from 'three';
import {initOpenCascade} from "opencascade.js";
import openCascadeHelper from "./cascadeHelper";

// this is the struggle with wasm... Here's one way to solve it.
// I really dont like passing the module around it feels un-natural
let openCascade = '';
export async function loadWasm(){
   if (openCascade === ''){
       return initOpenCascade().then(o=> o.ready).then(o => {
           openCascade = o
           console.log('loaded wasm')
           return false;
       })
   }
   return Promise.resolve(true)
}
const loadFileAsync = async (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    })
}

const cascadeToThree = async (shape) => {
    openCascadeHelper.setOpenCascade(openCascade);
    const facelist = await openCascadeHelper.tessellate(shape);
    const [locVertexcoord, locNormalcoord, locTriIndices] = await openCascadeHelper.joinPrimitives(facelist);
    const tot_triangle_count = facelist.reduce((a,b) => a + b.number_of_triangles, 0);
    const [vertices, faces] = await openCascadeHelper.generateGeometry(tot_triangle_count, locVertexcoord, locNormalcoord, locTriIndices);

    const objectMat = new MeshStandardMaterial({
        color: new Color(0.9, 0.9, 0.9)
    });
    const geometry = new Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    const object = new Mesh(geometry, objectMat);
    object.name = "shape";
    object.rotation.x = -Math.PI / 2;
    return object
}

const loadSTEPorIGES = async (inputFile)=> {
    return await loadFileAsync(inputFile).then(async (fileText) => {
        const fileName = inputFile.name;
        // Writes the uploaded file to Emscripten's Virtual Filesystem
        // this is gross
        openCascade.FS.createDataFile("/", fileName, fileText, true, true);

        // Choose the correct OpenCascade file parsers to read the CAD file
        var reader = null;
        if (fileName.toLowerCase().endsWith(".step") || fileName.toLowerCase().endsWith(".stp")) {
            reader = new openCascade.STEPControl_Reader_1();
        } else if (fileName.toLowerCase().endsWith(".iges") || fileName.toLowerCase().endsWith(".igs")) {
            reader = new openCascade.IGESControl_Reader_1();
        } else { console.error("opencascade.js can't parse this extension! (yet)"); }
        const readResult = reader.ReadFile(fileName);            // Read the file
        if (readResult === openCascade.IFSelect_ReturnStatus.IFSelect_RetDone) {
            console.log(fileName + " loaded successfully!     Converting to OCC now...");
            // const numRootsTransferred = reader.TransferRoots();    // Translate all transferable roots to OpenCascade
            const stepShape           = reader.OneShape();         // Obtain the results of translation in one OCCT shape
            console.log(fileName + " converted successfully!  Triangulating now...");

            // Out with the old, in with the new!
new            scene.remove(scene.getObjectByName("shape"));
            const mesh = await cascadeToThree(stepShape);
            console.log(fileName + " triangulated and added to the scene!");

            // Remove the file when we're done (otherwise we run into errors on reupload)
            openCascade.FS.unlink("/" + fileName);
            return mesh
        } else {
            console.error("Something in OCCT went wrong trying to read " + fileName);
        }
    });
};
export { loadSTEPorIGES };