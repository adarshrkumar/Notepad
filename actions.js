var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var action = urlParams.get('action')

if (action === 'upload') {
    document.getElementById('takeFile').click()
}
else if (action === 'openfile') {
    var fName = urlParams.get('file')
    var file = localStorage.getItem(`FILEDATA://${fName}`)
    alert(file)
    file = JSON.parse(file)

    let textarea = document.querySelector('main textarea')
    // json = {
    //     title: file.title, 
    //     content: file.content, 
    //     author: file.author, 
    //     dateModofied: file.dateModofied, 
    // }

    var fName = file.title
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
else if (action = 'filelink') {
    let fName = urlParams.get('file')
    let fContent = urlParams.get('content')
    fContent = atob(fContent)

    document.getElementById('title').value = fName
    document.querySelector('main textarea').value = fContent
}