var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var action = urlParams.get('action')

if (action === 'upload' || action === 'new') {
    
}
else if (action === 'openfile') {
    var fName = urlParams.get('file')
    var file = localStorage.getItem(`FILEDATA://${fName}`)
    file = JSON.parse(file)

    let textarea = document.querySelector('main textarea')

    var fName = String(file.title)
    if (fName.includes('.')) {
        nFName = fName.split('.')
        nFName = nFName.slice(-1)
        if (nFName === 'txt') {
            fName = fName.slice(-4)
        }
    }

    var fContent = file.content
    if (!!fContent === false) {
        fContent = 'File Content Not Found or Corrupted'
    }

    document.getElementById('title').value = fName

    var type = 'text'
    if (!!file.type) type = file.type
    if (type === 'image') {
        showImage(fContent)
    }
    else {
        var text = fContent
        if (text.includes('\n')) text = text.split('\n').join('<br>')
        tinymce.activeEditor.setContent(text);
    }
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
        ele.onclick = function(e) { editFile(e) }
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

    let editBtn = document.getElementById('editFile')
    editBtn.parentNode.removeAttribute('hidden')
}
else {
    location.href = '/'
}