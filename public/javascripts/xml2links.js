const { raw } = require("express")

function dataFilter(rawData, url, callback){
    // console.log('Body\n\n\/',rawData.body.length)
    // console.log('Text\n\n\/',rawData.text.length)

    let reqData = ''

    if(rawData.text === undefined){
        reqData = rawData.body
    }else if(rawData.body.length ==  undefined){
        reqData = rawData.text
    }else{
        console.log('No data')
        callback('Response has no data',null)
    }

    let dataArray = []
    if(reqData.includes('<loc>')){
        if(reqData.text){
            dataArray = reqData.split(/<loc>(.*?)<\/loc>/)
        }else{
            dataArray = reqData.toString().split(/<loc>(.*?)<\/loc>/)
        }
    }else{
        dataArray = reqData.split(/\/\n/)
    }
    dataArray = dataArray.filter(item => !item.includes('<'))
    let filter = { }
    let isXML = false
    
    dataArray = dataArray.filter(item => {
        filterItem = item.split(/(.*?)\//)
        for(let i = 0; i < filterItem.length; i++){
            if(filterItem[i].includes('sitemap')){
                isXML = true
            }
            
            if(filterItem[i] != '' && filterItem[i] != 'https:' && filterItem[i] != 'http:' && !filterItem[i].includes('www.') && !url.includes(filterItem[i])){
                if(filter.hasOwnProperty(filterItem[i])){
                    filter[filterItem[i]] += 1 
                }else{  
                    filter[filterItem[i]] = 1
                }
            }
            
        }
        
        return item
    })
    
    
    Object.getOwnPropertyNames(filter).forEach(element => {
        if(filter[element] < 5) delete filter[element]
        else if(!isNaN(element)) delete filter[element]
    });

    let newFilter = []
    let arr = Object.getOwnPropertyNames(filter)
    dataArray.filter(item => {
        filterItem = item.split(/(.*?)\//)
        
        let newPair = arr.filter(el => filterItem.includes(el))
        
        newFilter.push(newPair)
    })
        
    let doneFilter = {}
    
    newFilter.map(item => {
        
        let subCat = ''
        item.map((el, i) => {

            
            if(item.length > 1 && i == 0){
                if(!doneFilter[el]){
                    doneFilter[el] = {}
                    subCat = el
                    
                }else{
                    subCat = el
                }
            }else if(item.length > 1){                
                if(doneFilter[subCat][el] !== undefined){
                    doneFilter[subCat][el] += 1
                }else{
                    doneFilter[subCat][el] = 0
                }
            }
            return el
        })
        return item
    })
    
    
    
    data = {
        dataArray: dataArray,
        filter: filter,
        categorizedFilter: doneFilter,
        isXML: isXML
    }
    
    console.log('data',data)
    callback(null,data)
}

function getSitemapLink(robotsTxt, callback){
    data = robotsTxt.text
    .split('\n')
    .filter(item => item.includes('sitemap'))
    .map(item => item.slice(item.indexOf('https')))

    callback(null,data)
}

function validateUrl(url){
    if(url[url.length-1] != '/') url += '/'
    if(!url.includes('https://')) url = 'https://' + url
    return url
}

module.exports = {
    dataFilter,
    getSitemapLink,
    validateUrl
}