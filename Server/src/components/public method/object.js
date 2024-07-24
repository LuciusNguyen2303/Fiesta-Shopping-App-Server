function cleanObject(obj, allowedKeys) {
  
    const cleanedObj = {};
    const set = new Set(allowedKeys)
    for (const key in obj) {
  
        if (set.has(key)) {
            cleanedObj[key] = obj[key];
           
        }
    }
    return cleanedObj;
}
module.exports={cleanObject}