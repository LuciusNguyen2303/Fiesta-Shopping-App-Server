function totalPages(totalData, limit) {
    let totalPages = 0
    console.log("PAGE: ",limit,totalData);
    limit = Number(limit)
    totalData=Number(totalData)
    if (totalData % limit == 0) {
        return totalPages = totalData / limit
    }
    return totalPages = Math.floor(totalData / limit) + 1

}

function skip(limit, page) {
    // 
    /* 
    */
    if (page <= 1||page < 0)
        return 0;
    // if (page < 0)
    //     return null;
    
    if (page > 1) {
        const page2 = page - 1;
        const skipPage = limit * page2;
        return skipPage
    }
}




module.exports= { totalPages,skip }