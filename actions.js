var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var action = urlParams.get('action')
var tempCode = ''

if (action === 'upload' || action === 'new') {
    
}
else if (action === 'openfile') {
    var fName = urlParams.get('file')
    var file = localStorage.getItem(`FILEDATA://${fName}`)
    file = JSON.parse(file)

    var fName = String(file.title)
    if (fName.includes('.')) {
        var nFName = fName.split('.').slice(-1)
        nFName = nFName
        if (nFName === 'tnynpd') {
            fName = fName.slice(-7)
        }
    }

    var fContent = file.content
    if (!!fContent === false) {
        fContent = 'File Content Not Found or Corrupted'
    }


    setTimeout(function() {
        rename ? rename(fName) : ''
    }, 1000)

    var type = 'text'
    if (!!file.type) type = file.type
    if (type === 'image') {
        showImage(fContent)
    }
    else {
        if (location.pathname === '/codeEditor.html') {
            setCode(fContent)
        }
        else setContent(fContent)
    }
}
else if (action === 'filelink') {
    let fName = urlParams.get('file')
    var fContent = getContent()

    setContent(fContent)
}
else {
    location.href = '/'
}

function getContent() {
    let fContent = urlParams.get('content')
    if (fContent.includes(' ')) fContent = fContent.split(' ').join('+')
    fContent = atob(fContent)
    return fContent
}

function setCode(c) {
    tempCode = c
}

function setContent(c) {
    if (c.includes('\n')) c = c.split('\n').join('<br>')
    document.querySelector('textarea').value = c;
}