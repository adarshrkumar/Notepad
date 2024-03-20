var supptdImgExts = [
  ['apng'], 
  ['avif'], 
  ['bmp'], 
  ['gif'], 
  ['ico', 'cur'], 
  ['jpg', 'jpeg', 'jpe', 'jfif', 'pjpeg', 'pjp'], 
  ['png'], 
  ['webp'], 
  ['tif', 'tiff'], 
  ['xbm'], 
]

var history = ['']
var histI = 0
var dtitle = document.title
var hasUpdatedPreview = false
var isPreview = false
var theAlert = false
var main = document.querySelector('main')
var textarea = main.querySelector('textarea')

function download() {
  let input = document.querySelector('textarea').value;

  // create a new Blob object with the content you want to assign
  let blob = new Blob([input], {type: "text/plain"});

  // create a FileReader object
  let reader = new FileReader();

  // when the read operation is finished, this will be called
  reader.onloadend = function() {
    // the result attribute contains the contents of the file
    console.log(reader.result);
  }

  // read the file as text
  reader.readAsText(blob);

  let link = document.querySelector('a#downloader');
  link.href = window.URL.createObjectURL(blob);
  let title = document.getElementById('title').value
  if (!!title === false) title = 'New Text File'
  let ext = ''
  if (title.includes('.')) {
    ext = ext.split('.')[1]
  }
  if (ext === 'txt') {
    link.download = `${title}.txt`  ;
  }
  else {
    link.download = `${title}`  ;
  }
  if (Boolean(document.querySelector('textarea').value) || !!title) {
    link.click();
  }
  checkHTML()
}

function setTitle() {
  let ftitle = document.querySelector('input#title').value
  if (ftitle.split('').length <= 0) {
    document.title = dtitle
  }
  else {
    if (ftitle.includes('.')) {
      ext = ''
    }
    document.title = `${ftitle} | ${dtitle}`
  }
  ext = ftitle.split('.').slice(-1)
  checkHTML()
}

var readfile = document.querySelector("input[type='file']#readfile");

readfile.onchange = object => { 
  // getting a hold of the file reference
  var file = object.target.files[0];
  if (!file) return 

  let filename = file.name
  let ftitle = ''
  if (filename.split('.').slice(-1) === 'txt') {
    ftitle = filename.split(`.${filename.split('.').slice(-1)}`)[0]
  }
  else {
    ftitle = filename
  }

  var isImage = checkImage(file, filename)

  if (!isImage) {
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      document.querySelector('textarea').value = readerEvent.target.result; // this is the content!
    }
  }

  if (ftitle.split('').length <= 0) {
    document.title = dtitle
  }
  else {
    document.title = `${ftitle} | ${dtitle}`
  }
  document.querySelector('input#title').value = ftitle
  document.getElementById('title').value = ftitle
  checkHTML()
}

textarea.addEventListener('keyup', checkHTML)

function checkImage(file, name) {
  var ext = name
  if (ext.includes('.')) {
    ext = ext.split('.').slice(-1)
  }

  var isImage = false
  supptdImgExts.forEach(function(g) {
    g.forEach(function(e, i) {
      if (ext === e) {
        textarea.value = `<style>
  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
</style>
<img src="${path}" alt="">`
        isImage = true
        checkHTML('image', true)
      }
    })
  })

  return isImage
}

function checkHTML(type, override) {
  var preview = main.querySelector('iframe#preview')
  var span = main.querySelector('span')
  let title = document.getElementById('title').value
  let ext = ''
  if (title.includes('.')) {
    ext = title.split('.')[1]
  }

  if (ext === 'html' || ext === 'htm' || ext === 'mht' || ext === 'svg' || override) {
    setTimeout(function() {
//      alert(true)
      let value = document.querySelector('textarea').value
      textarea = document.querySelector('textarea')
      preview.style.display = ''
      preview.style.width = '75%'
      span.style.display = ''
      textarea.style = 'border-right: none;'
      let eleVal = 'documentElement'
      if (value.includes('<html')) {
        value = value.split(`<html${value.split('<html')[1].split('>')[0]}>\n`)[1]
        if (value.includes('</html>')) {
          value = value.split('</html>')[0]
        }
      }
      else if (value.includes('<xml')) {
        value = value.split(`<xml${value.split('<xml')[1].split('>')[0]}>\n`)[1]
      }
      else if (value.includes('<?xml')) {
        value = value.split(`<?xml${value.split('<?xml')[1].split('>')[0]}>\n`)[1]
      }
      if (value.includes('<svg')) {
        eleVal = 'body'
      }
      document.getElementById('eleVal').value = eleVal
      isPreview = true
      if (type !== 'image') {
        if (!!theAlert === false) {
          theAlert = confirm('There is a default css file that you can add to your code, just add the following code: `<link rel="stylesheet" href="/default.css" />`. Pro tip: click OK, to copy!')
          if (!!theAlert) {
            prompt('Default CSS File Import Code', '<link rel="stylesheet" href="/default.css" />')
          }
          hasShown = true
        }
      }
      if (hasUpdatedPreview === false) {
        preview.src = `/preview.html`
        hasUpdatedPreview = true
      }
      document.querySelector('textarea').classList.add('code')
    }, 1)
  }
  else if (isPreview === true) {
    preview.style.display = 'none'
    span.style.display = 'none'
    preview.src = `/preview.html`
    textarea.style = ''
    hasShown = false
    document.querySelector('textarea').removeAttribute('id')
  }
  histI++
  history[histI + 1] = false
  history[histI] = document.querySelector('textarea').value
}

function outputsize() {
  if (document.querySelector('textarea').clientWidth < 150) {
    textarea.style.width = `${150}px`
  }
}
outputsize()
 
new ResizeObserver(outputsize).observe(textarea) 

function replace(cmd) {
  let value = main.querySelector('textarea').value
  let section = document.querySelector('section')
  let value1 = section.querySelector('input#replacethis').value
  let value2 = section.querySelector('input#withthis').value
  if (cmd === 'all') {
    while (value.includes(value1)) {
      value = value.replace(value1, value2)
    }
  }
  if (cmd === 'single') {
    value = value.replace(value1, value2)
  }
  textarea.value = value
  checkHTML()
}

function undo() {
  if (histI > 0) {
    histI--
    while (history[histI] === false) {
      histI--
    }
    document.querySelector('textarea').value = history[histI]
  }
  checkHTML()
}

function redo() {
  if (histI <= history.length - 1) {
    histI++
    while (history[histI] === false) {
      histI++
    }
    document.querySelector('textarea').value = history[histI]
  }
  checkHTML()
}

checkHTML()

function saveToLocalStorage(e) {
  let title = document.getElementById('title').value
  if (title === '' || !!title === false || title === null) return

  let value = document.querySelector('textarea').value
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
}

textarea.addEventListener('keypress', saveToLocalStorage)


function getShareLink() {
  let fileName = document.getElementById('title').value
  let fContent = document.querySelector('main textarea').value
  fContent = btoa(fContent)
  let lHostPathName = `${location.host}/${location.pathname}`.replace('//', '/')
  let fLink = `${location.protocol}//${lHostPathName}?action=filelink&file=${fileName}&content=${fContent}`
  prompt('This is the link to share!', fLink)
}

function editFile(fileName=false) {
  if (!!fileName === false) {
    fileName = urlParams.get('file')
  }
  let disabledEles = []

  let titleEle = document.getElementById('title')
  disabledEles.push(titleEle)  

  let textAreaEle = document.querySelector('main textarea')
  disabledEles.push(textAreaEle)

  disabledEles.forEach(function(ele, i) {
    ele.removeAttribute('disabled', '')  
    ele.style.cursor = 'auto'
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
        element.parentNode.removeAttribute('hidden')
    }
  })
}

function upload() {
  document.querySelector(`input[type='file']#readfile`).click()
}


var functions = [
  {
    id: 'title', 
    event: 'onkeyup', 
    function: function(e) { setTitle(e) }, 
  }, 
  {
    id: 'editFile', 
    event: 'onclick', 
    function: function(e) { editFile(e) }, 
  }, 
  {
    id: 'upload', 
    event: 'onclick', 
    function: function(e) { upload(e) }, 
  }, 
  {
    id: 'download', 
    event: 'onclick', 
    function: function(e) { download(e) }, 
  }, 
  {
    id: 'delete',
    event: 'onclick', 
    function: function(e) { deleteFile(e) },  
  }, 
  {
    id: 'undo',
    event: 'onclick', 
    function: function(e) { undo(e) },  
  }, 
  {
    id: 'redo',
    event: 'onclick', 
    function: function(e) { redo(e) },  
  }, 
  {
    id: 'replaceThis', 
    event: 'onclick', 
    function: function(e) { replace('single', e) }, 
  }, 
  {
    id: 'replaceAll', 
    event: 'onclick', 
    function: function(e) { replace('all', e) }, 
  }, 
  {
    id: 'makeLink', 
    event: 'onclick', 
    function: function(e) { getShareLink(e) }, 
  }, 
  {
    id: 'enableHTML', 
    event: 'onclick', 
    function: function(e) { checkHTML(e) }, 
  }, 
]

function addEventListeners() {
  functions.forEach(function(f, i) {
    let id = f.id
    let isNeeds = false
    addListener(f)
  })
}

window.addEventListener('DOMContentLoaded', addEventListeners)
addEventListeners()

function addListener(f) {
  let id = f.id
  let event = f.event
  let method = f.method
  let func = f.function
  if (!!event) {
    if (!!event.startsWith('on') && !!method === false) method = 'none'
  }
  if (!!document.getElementById(id)) {
    if (!!method) {
      if (event.startsWith('on')) {
        // document.getElementById(id).setAttribute(event, func)
        document.getElementById(id)[event] = func
      }
      else if (method === 'attribute' || method === 'setAttribute') {
        document.getElementById(id)[event] = func
      }
      else if (method === 'property' || method === 'elementProperty') {
        document.getElementById(id)[event] = func
      }
      else {
        document.getElementById(id).addEventListener(event, func)
      }
    }
    else {
      document.getElementById(id).addEventListener(event, func)
    }
  }
}

var isUpload = (new URLSearchParams(location.search)).get('action') === 'upload'
if (isUpload) {
  addEventListener('DOMContentLoaded', function(e) { document.getElementById('upload').click() })
  // upload()
}

function deleteFile(e) {
  var fTitle = document.getElementById('title').value
  localStorage.removeItem(`FILEDATA://${fTitle}`)

  let filesObj = localStorage.getItem('files')
  filesObj = JSON.parse(filesObj)
  if (!!filesObj === false) {
    filesObj = []
  }
  let hasFile = false
  filesObj.forEach(function(f, i) {
    if (f === fTitle) {
      hasFile = true
    }
  })
  if (hasFile) {
    let index = filesObj.indexOf(fTitle)
    filesObj.splice(index, 1)
  }
  else {
    var location = location.pathname
    location.href = `${location.pathname}?action=new`
  }
  localStorage.setItem('files', JSON.stringify(filesObj))

  history.back();
  location.href = '/'
}