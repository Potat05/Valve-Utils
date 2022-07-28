
import { VTF } from "../valveUtils/vtf.js";

const VTF_FILE = './resource/testload.vtf';



(async function() {
    
    const vtf = new VTF();
    
    const data = await ((await fetch(VTF_FILE)).arrayBuffer());
    vtf.load(data);

    console.log(vtf);
    
}());


