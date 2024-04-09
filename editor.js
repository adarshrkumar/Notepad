var currentState = null

var menuItems = [
  {
    name: 'Save', 
    func: saveToLocalStorage, 
  }, 
  {
    name: 'Delete', 
    func: deleteFile, 
  }, 
  {
    name: 'Upload', 
    func: upload, 
  }, 
  {
    name: 'Download', 
    func: download, 
  }, 
]

tinymce.init({
  selector: 'textarea', 
  resize: false, 
  plugins: [
    'link', 'image', 'lists', 'anchor', 'media', 'table', 'emoticons',     
    'preview', 'pagebreak', 'fullscreen', 'template', 

    'autolink', 
    'searchreplace', 'wordcount', 
    'visualblocks', 'visualchars', 'code', 
    'insertdatetime', 
    'help'
  ], 

  menu: {
    newFile: { title: 'File', items: 'save delete | upload download | print' }
  },
  menubar: 'newFile edit view insert format tools table help',

  placeholder: 'Type here...', 
  content_style: '.toolbar { border-bottom: none; }', 
  setup: (editor) => {
    currentState = 'editor'
    editor.on('change', () => {
      saveToLocalStorage(editor);
    });

    addMenuItems(editor)
  }
});

var supptdImgExts = [
  ['avif'], 
  ['bmp'], 
  ['gif'], 
  ['ico', 'cur'], 
  ['jpg', 'jpeg', 'jpe', 'jfif', 'pjpeg', 'pjp'], 
  ['apng', 'png'], 
  ['webp'], 
  ['tif', 'tiff'], 
  ['xbm'], 
]

var htmlExts = [
  ['html', 'htm', 'mht'], 
]

var fsUnit = 'pt'
var fsDefault = 10

var dtitle = document.title
var hasUpdatedPreview = false
var theAlert = false
var container = document.querySelector('.container')
var textarea = container.querySelector('textarea')

function download() {
  let input = tinymce.activeEditor.getContent({ format: 'text' });

  // create a new Blob object with the content you want to assign
  let blob = new Blob([input], {type: "text/plain"});

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
  let title = document.getElementById('title').value
  if (!!title === false) title = 'New Text File'
  link.download = `${title}.tnynpd`;
  if (!!document.querySelector('textarea').value || !!title) {
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

  currentState = checkImage(object, file, filename, currentState)
  if (currentState !== 'image') {
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var text = readerEvent.target.result
      if (text.includes('\n')) text = text.split('\n').join('<br>')
      tinymce.activeEditor.setContent(text);
    }
  }

  if (ftitle.split('').length <= 0) {
    document.title = dtitle
  }
  else {
    document.title = `${ftitle} | ${dtitle}`
  }
  document.getElementById('title').value = ftitle
  checkHTML()
}

textarea.addEventListener('keyup', checkHTML)

function showImage(src) {
  var image = document.querySelector('.image-preview')
  image.src = src
  image.alt = 'Image Preview'
  image.setAttribute('shown', '')
}

function checkImage(element, file, name, state) {

  var ext = name
  if (ext.includes('.')) {
    ext = ext.split('.').slice(-1)
  }

  supptdImgExts.forEach(function(g) {
    g.forEach(function(e, i) {
      if (ext == e) {
        state = 'image'
      }
    })
  })

  let reader = new FileReader();
  reader.onload = function () {
    var path = reader.result//.replace('data:', '').replace(/^.+,/, "");
    if (currentState === 'image') {
      showImage(path)
      saveToLocalStorage({type: 'image', content: path})
    }
  }
  reader.readAsDataURL(file);

  return state
}

function checkHTML(type) {
  var preview = container.querySelector('iframe#preview')
  var span = container.querySelector('span')
  let title = document.getElementById('title').value
  let ext = ''
  if (title.includes('.')) {
    ext = title.split('.')[1]
  }

  var isHTML = false
  htmlExts.forEach(function(g) {
    g.forEach(function(e, i) {
      if (ext == e) {
        setTimeout(function() {
    //      alert(true)
          let value = tinymce.activeEditor.getContent({ format: 'text' });
          textarea = document.querySelector('textarea')
          preview.setAttribute('shown', '')
          span.style.display = ''
          textarea.style.borderRight = 'none'
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
          currentState = 'preview'
          if (type !== 'image' && !!theAlert === false) {
            theAlert = confirm('There is a default css file that you can add to your code, just add the following code: `<link rel="stylesheet" href="/default.css" />`. Pro tip: click OK to copy to clipboard!')
            if (!!theAlert) {
              prompt('Default CSS File Import Code', '<link rel="stylesheet" href="/default.css" />')
            }
            hasShown = true
          }
          if (hasUpdatedPreview === false) {
            preview.src = `/preview.html`
            hasUpdatedPreview = true
          }
          document.querySelector('textarea').classList.add('code')
        }, 1)
        isHTML = true
      }
    })
  })
  if (!isHTML && currentState === 'preview') {
    preview.removeAttribute('shown')
    span.style.display = 'none'
    preview.src = `/preview.html`
    textarea.style.removeProperty('border-right')
    hasShown = false
    document.querySelector('textarea').removeAttribute('id')
  }
}

function outputsize() {
  if (currentState !== 'image' && document.querySelector('textarea').clientWidth < 150) {
    textarea.style.width = `${150}px`
  }
}
outputsize()
 
new ResizeObserver(outputsize).observe(textarea) 

checkHTML()

function saveToLocalStorage(info) {
  let value = tinymce.activeEditor.getContent({ format: 'text' });
  var type = 'text'
  if (!!info) {
    if (!!info.type) {
      type = info.type
      if (type === 'image') {
        if (!!info.content) {
          value = info.content
        }
      }
    }
  }
  let title = document.getElementById('title').value
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
}

textarea.addEventListener('keypress', saveToLocalStorage)


function getShareLink() {
  let fileName = document.getElementById('title').value
  let fContent = tinymce.activeEditor.getContent({ format: 'text' });
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

  let textAreaEle = document.querySelector('container textarea')
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
    function: setTitle, 
  }, 
  {
    id: 'editFile', 
    event: 'onclick', 
    function: editFile, 
  }, 
  {
    id: 'upload', 
    event: 'onclick', 
    function: upload, 
  }, 
  {
    id: 'download', 
    event: 'onclick', 
    function: download, 
  }, 
  {
    id: 'delete',
    event: 'onclick', 
    function: deleteFile,  
  }, 
  {
    id: 'makeLink', 
    event: 'onclick', 
    function: getShareLink, 
  }, 
  {
    id: 'enableHTML', 
    event: 'onclick', 
    function: checkHTML, 
  }, 
  {
    id: 'fs-input', 
    event: 'onchange', 
    function: fontSizeChange, 
  }, 
  {
    id: 'fs-slider', 
    event: 'onchange', 
    function: fontSizeChange, 
  }, 
]

function addEventListeners() {
  functions.forEach(function(f, i) {
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
  localStorage.setItem('files', JSON.stringify(filesObj))

  if (!hasFile) {
    var page = location.pathname
    location.href = `${page}?action=new`
  }

  history.back();
  location.href = '/'
}

fontSizeChange({target: {value: fsDefault}}, fsDefault)
function fontSizeChange(e, size) {
  var finput = document.getElementById('fs-input')
  var slider = document.getElementById('fs-slider')

  if (!!e) {
    if (!!e.target) {
      if (!!e.target.value) size = parseInt(e.target.value)
    }
  }

  finput.value = size
  slider.value = size

  setFontSize(size)
}

function setFontSize(s) {
  document.querySelector('.fs-unit').textContent = 'pt'
  textarea.style.fontSize = `${s}${fsUnit}`
}

// save delete | upload download | print
function addMenuItems(editor) {
  menuItems.forEach(function(m, i) {
    var mId = m.name.toLowerCase()

    if (mId.includes(' ')) {
      mId = mId.split(' ')
      mId.forEach(function(p, i) {
        if (i !== 0) {
          mId[i] = `${p[0].toUpperCase()}${p.slice(1)}`
        }
      })
      mId = mId.join('')
    }

    editor.ui.registry.addMenuItem(mId, {
      text: m.name,
      onAction: () => m.func()
    });
  })


}