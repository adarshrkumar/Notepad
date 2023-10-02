var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var action = urlParams.get('action')

if (action === 'upload') {
    document.querySelector(`input[type='file']#readfile`).click()
}
else if (action === 'open') {
    var fName = urlParams.get('file')
    var file = localStorage.getItem(`FILEDATA://${fName}`)
    file = JSON.parse(file)

    let textarea = document.querySelector('main textarea')
    // json = {
    //     title: file.title, 
    //     content: file.value, 
    //     author: file.author, 
    //     dateModofied: file.dateModofied, 
    // }

    fName = file.title
    if (fName.includes('.')) {
        nFName = fName.split('.')
        nFName = nFName[nFName.length-1]
        if (fName === 'txt') {
            fName = fName.substring(fName.split('').length-4)
        }
    }

    document.getElementById('title').value = fName
    textarea.value = file.value
}