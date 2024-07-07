function cleanObject(obj, allowedKeys) {
    const cleanedObj = {};
    for (const key in obj) {
        if (allowedKeys.includes(key)) {
            cleanedObj[key] = obj[key];
        }
    }
    return cleanedObj;
}
module.exports={cleanObject}