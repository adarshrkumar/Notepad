var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var action = urlParams.get('action')

if (action === 'openfile') {
    var fName = urlParams.get('file')
    var file = localStorage.getItem(`FILEDATA://${fName}`)
    file = JSON.parse(file)

    let textarea = document.querySelector('main textarea')

    var fName = String(file.title)
    if (fName.includes('.')) {
        nFName = fName.split('.')
        nFName = nFName[nFName.length-1]
        if (fName === 'txt') {
            fName = fName.substring(fName.split('').length-4)
        }
    }

    var fContent = file.content
    if (!!fContent === false) {
        fContent = 'File Content Not Found or Corrupted'
    }

    document.getElementById('title').value = fName
    textarea.value = file.content
}
else if (action === 'filelink') {
    let fName = urlParams.get('file')
    let fContent = urlParams.get('content')
    fContent = atob(fContent)

    let disabledEles = []

    let titleEle = document.getElementById('title')
    titleEle.value = fName
    disabledEles.push(titleEle)  

    let textAreaEle = document.querySelector('main textarea')
    textAreaEle.value = fContent
    disabledEles.push(textAreaEle)

    disabledEles.forEach(function(ele, i) {
        ele.setAttribute('disabled', '')  
        ele.style.cursor = 'pointer'
    })

    let removeEles = [
        'enableHTML', 
        'undo', 
        'redo', 
        'replacethis', 
        'withthis', 
        'replaceThis', 
        'replaceAll', 
    ]

    removeEles.forEach(function(e, i) {
        let element = document.querySelector(e)
        if (!!element === false) {
            element = document.getElementById(e)
        }
        if (!!element) {
            element.parentNode.setAttribute('hidden', '')
        }
    })

    document.getElementById('upload').onclick = function(e) {}
    document.getElementById('upload').parentNode.href = `${location.pathname}?action=upload`

    document.getElementById('reset').onclick = function() {}
    document.getElementById('reset').parentNode.href = `${location.pathname}?action=new`

    let editBtn = document.getElementById('editFile')
    editBtn.parentNode.removeAttribute('hidden')
}
else {
    location.href = '/'
}