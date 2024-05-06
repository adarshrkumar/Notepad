var previewWindow = null
var currentState = null
var docTitle = ''

var custMenuItems = [
  {
    name: 'Rename', 
    func: rename, 
  }, 
  {
    name: 'Save', 
    func: saveFile, 
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
  {
    name: 'Share', 
    func: getShareLink, 
  }
]

tinymce.init({
  selector: 'textarea', 
  resize: false, 
  plugins: [
    'link', 'image', 'lists', 'anchor', 'media', 'table', 'emoticons',     
    'preview', 'pagebreak', 'fullscreen', 

    'autolink', 
    'searchreplace', 'wordcount', 
    'visualblocks', 'visualchars', 'code', 
    'insertdatetime', 
    'help'
  ], 

  menu: {
    newFile: { title: 'File', items: 'rename save delete | upload download | share print' }
  },
  menubar: 'newFile edit view insert format tools table help',

  placeholder: 'Type here...', 
  content_style: '.toolbar { border-bottom: none; }', 
  setup: (editor) => {
    currentState = 'editor'
    editor.on('change', () => {
      saveFile(editor);
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

var docTitle = document.title
var theAlert = false
var container = document.querySelector('.container')
var textarea = container.querySelector('textarea')

function rename(newName) {
  if (newName) {
    docTitle = newName
  }
  else {
    docTitle = prompt("Rename Document", docTitle)
  }
}

function download() {
  let input = tinymce.activeEditor.getContent({ format: 'html' });

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

var readfile = document.querySelector("input[type='file']#readfile");

readfile.onchange = object => { 
  // getting a hold of the file reference
  var file = object.target.files[0];
  if (!file) return 

  let filename = file.name
  var ext = filename.split('.').slice(-1).join('.')
  let title = ''
  if (filename.split('.').slice(-1) === 'txt') {
    title = filename.split('.').slice(0, -1).join('.')
  }
  else {
    title = filename
  }

  currentState = checkImage(object, file, filename, currentState)
  if (currentState !== 'image') {
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var text = readerEvent.target.result

      if (ext === 'txt') {
        if (text.includes('\n')) {
          text = text.split('\n').join('<br>')
        }
      }

      tinymce.activeEditor.setContent(text);
    }
  }

  if (title.split('').length <= 0) {
    document.title = docTitle
  }
  else {
    document.title = `${title} | ${docTitle}`
  }
  docTitle = title
}

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
      saveFile({type: 'image', content: path})
    }
  }
  reader.readAsDataURL(file);

  return state
}

function previewHTML() {
  let title = docTitle
  let ext = ''
  if (title.includes('.')) {
    ext = title.split('.')[1]
  }

  let value = tinymce.activeEditor.getContent({ format: 'html' });
  textarea = document.querySelector('textarea')

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
  previewWindow = open(`/preview.html?eleval=${eleVal}&content=${btoa(value)}`)
}

function outputsize() {
  if (currentState !== 'image' && document.querySelector('textarea').clientWidth < 150) {
    textarea.style.width = `${150}px`
  }
}
outputsize()
 
new ResizeObserver(outputsize).observe(textarea) 

function saveFile(info) {
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
}

function getShareLink() {
  let fileName = docTitle
  let fContent = tinymce.activeEditor.getContent({ format: 'html' });
  fContent = btoa(fContent)
  let lHostPathName = `${location.host}/${location.pathname}`.replace('//', '/')
  let fLink = `${location.protocol}//${lHostPathName}?action=filelink&file=${fileName}&content=${fContent}`
  prompt('This is the link to share!', fLink)
}

function upload() {
  readfile.click()
}


var isUpload = (new URLSearchParams(location.search)).get('action') === 'upload'
if (isUpload) {
  window.addEventListener('DOMContentLoaded', upload)
}

function deleteFile(e) {
  var fTitle = docTitle
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
index <= 0
  if (index < 0) {
    location.href = `${location.pathname}?action=new`
  }

  history.back();
  location.href = '/'
}

function addMenuItems(editor) {
  custMenuItems.forEach(function(m, i) {
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
