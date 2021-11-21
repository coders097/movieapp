let getUniqueKey=()=>{
    return [...Array(6)].map(e=>((Math.random()*36) | 0).toString(36)).join("");
}


export default getUniqueKey;