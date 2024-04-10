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
      checkHTML()
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

function rename() {
  docTitle = prompt("Rename Document", docTitle)
}

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
  let docTitle = docTitle
  if (!!title === false) title = 'New Text File'
  link.download = `${title}.tnynpd`;
  if (!!title) {
    link.click();
  }
  checkHTML()
}

function setTitle() {
  let title = docTitle
  if (title.split('').length <= 0) {
    document.title = dtitle
  }
  else {
    if (ftitle.includes('.')) {
      ext = ''
    }
    document.title = `${title} | ${dtitle}`
  }
  ext = title.split('.').slice(-1)
  checkHTML()
}

var readfile = document.querySelector("input[type='file']#readfile");

readfile.onchange = object => { 
  // getting a hold of the file reference
  var file = object.target.files[0];
  if (!file) return 

  let filename = file.name
  let title = ''
  if (filename.split('.').slice(-1) === 'txt') {
    title = filename.split(`.${filename.split('.').slice(-1)}`)[0]
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
      if (text.includes('\n')) text = text.split('\n').join('<br>')
      tinymce.activeEditor.setContent(text);
    }
  }

  if (title.split('').length <= 0) {
    document.title = dtitle
  }
  else {
    document.title = `${title} | ${dtitle}`
  }
  docTitle = title
  checkHTML()
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

function checkHTML(type) {
  var preview = container.querySelector('iframe#preview')
  var span = container.querySelector('span')
  let title = docTitle
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
  let fContent = tinymce.activeEditor.getContent({ format: 'text' });
  fContent = btoa(fContent)
  let lHostPathName = `${location.host}/${location.pathname}`.replace('//', '/')
  let fLink = `${location.protocol}//${lHostPathName}?action=filelink&file=${fileName}&content=${fContent}`
  prompt('This is the link to share!', fLink)
}

function upload() {
  document.querySelector(`input[type='file']#readfile`).click()
}


var isUpload = (new URLSearchParams(location.search)).get('action') === 'upload'
if (isUpload) {
  window.addEventListener('DOMContentLoaded', upload)
}

function deleteFile(e) {
  var fTitle = docTitle
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