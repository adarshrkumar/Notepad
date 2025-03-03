function rename(newName) {
    if (newName) {
          docTitle = newName
    }
    else {
        docTitle = prompt('Rename Document', docTitle)
    }
    setTitle()
}

function download() {
    let input = tinymce.activeEditor.getContent({ format: 'raw' });
  
    // create a new Blob object with the content you want to assign
    let blob = new Blob([input], {type: 'text/plain'});
  
    // create a FileReader object
    let reader = new FileReader();
  
    // when the read operation is finished, this will be called
    reader.onloadend = function() {
        // the result attribute contains the contents of the file
    }
  
    // read the file as text
    reader.readAsText(blob);
  
    let link = document.querySelector('a#downloader');
    link.href = window.URL.createObjectURL(blob);
    let title = docTitle
    if (!!title === false) title = 'New Text File'
    link.download = `${title}.tnynpd`;
    if (!!title) {
        link.click();
    }
}  
  
function setTitle() {
    let title = docTitle
    if (title.split('').length <= 0) {
        document.title = docTitle
    }
    else {
        if (docTitle.includes('.')) {
            ext = ''
        }
        document.title = `${title} | ${docTitle}`
    }
    ext = title.split('.').slice(-1)
}

function saveFile(value) {
    let title = docTitle
    if (title === '' || !!title === false || title === null) return
  
    let author = localStorage.getItem('username')
    if (!!author === false) author = ''
    let d = new Date()
    let json = {
      title: title, 
      content: value, 
      author: author, 
      dateModofied: `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`
    }
    localStorage.setItem(`FILEDATA://${title}`, JSON.stringify(json))
    let filesObj = localStorage.getItem('files')
    filesObj = JSON.parse(filesObj)
    if (!!filesObj === false) {
      filesObj = []
    }
    let hasFile = false
    filesObj.forEach(function(f, i) {
      if (f === title) {
        hasFile = true
      }
    })
    if (hasFile === false) {
      filesObj.push(title)
    }
    localStorage.setItem('files', JSON.stringify(filesObj))
    return title
}

function getShareLink(fContent) {
    let fileName = docTitle
    fContent = btoa(fContent)
    let lHostPathName = `${location.host}/${location.pathname}`.replace('//', '/')
    let fLink = `${location.protocol}//${lHostPathName}?action=filelink&file=${fileName}&content=${fContent}`
    prompt('This is the link to share!', fLink)
}

function deleteFile() {
    var fTitle = docTitle
    console.log(`\`docTitle\` = "${docTitle}"`)
    localStorage.removeItem(`FILEDATA://${fTitle}`)
  
    let filesObj = localStorage.getItem('files')
    if (!!filesObj === false) {
        filesObj = []
    }
    else if (!filesObj.startsWith('[') || !filesObj.endsWith(']')) {
        filesObj = [filesObj]
    }
    else filesObj = JSON.parse(filesObj)
    let index = filesObj.indexOf(fTitle)
    if (index >= 0) {
        filesObj.splice(index, 1)
    }
    localStorage.setItem('files', JSON.stringify(filesObj))
  
    if (index < 0) {
        location.href = `${location.pathname}?action=new`
    }
  
    location.href = '/'
}  