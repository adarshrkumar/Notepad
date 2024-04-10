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


    setTimeout(function() {
        rename(title)
    }, 1000)

    var type = 'text'
    if (!!file.type) type = file.type
    if (type === 'image') {
        showImage(fContent)
    }
    else {
        setContent(fContent)
    }
}
else if (action === 'filelink') {
    let fName = urlParams.get('file')
    let fContent = urlParams.get('content')
    fContent = atob(fContent)

    setContent(fContent)
}
else {
    location.href = '/'
}

function setContent(c) {
    if (c.includes('\n')) c = c.split('\n').join('<br>')
    setTimeout(function() {
        tinymce.activeEditor.setContent(c);
    }, 10000)
}