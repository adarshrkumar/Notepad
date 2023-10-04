var history = ['']
var histI = 0
var histIsM = true
var histIsP = true
var dtitle = document.title
var hasUpdatedPreview = false
var isPreview = false
var alertShown = false
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

function reset() {
  document.querySelector('textarea').value = '';
  document.title = dtitle
  document.getElementById('title').value = ''
  checkHTML()
}

function setTitle() {
  let ftitle = document.querySelector('input#title').value
  if (ftitle.split('').length <= 0) {
    document.title = dtitle
    title = 'New Text File'
  }
  else {
    if (ftitle.includes('.')) {
      ext = ''
    }
    document.title = `${ftitle} | ${dtitle}`
  }
  ext = ftitle.split('.')[ftitle.split('.').length - 1]
  title = ftitle
  checkHTML()
}

var readfile = document.querySelector("input[type='file']#readfile");

readfile.onchange = object => { 

   // getting a hold of the file reference
   var file = object.target.files[0]; 

   // setting up the reader
   var reader = new FileReader();
   reader.readAsText(file,'UTF-8');

   // here we tell the reader what to do when it's done reading...
   reader.onload = readerEvent => {
      document.querySelector('textarea').value = readerEvent.target.result; // this is the content!
   }
  let fname = readfile.value.split('\\')[readfile.value.split('\\').length - 1]
  let ftitle = ''
  if (fname.split('.')[fname.split('.').length - 1] === 'txt') {
    ftitle = fname.split(`.${fname.split('.')[fname.split('.').length - 1]}`)[0]
  }
  else {
    ftitle = fname
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

function checkHTML() {
  var preview = main.querySelector('iframe#preview')
  var span = main.querySelector('span')
  let title = document.getElementById('title').value
  let ext = ''
  if (title.includes('.')) {
    ext = title.split('.')[1]
  }

  if (ext === 'html' || ext === 'htm' || ext === 'mht') {
    setTimeout(function() {
//      alert(true)
      let value = document.querySelector('textarea').value
      textarea = document.querySelector('textarea')
      preview.style.display = ''
      preview.style.width = '75%'
      span.style.display = ''
      textarea.style = 'border-right: none;'
      if (value.includes('<html')) {
        value = value.split(`<html${value.split('<html')[1].split('>')[0]}>\n`)[1]
        value = value.split('</html>')[0]
      }
      isPreview = true
      if (!!theAlert === false) {
        theAlert = confirm('There is a default css file that you can add to your code, just add the following code: `<link rel="stylesheet" href="/default.css" />`. Pro tip: click OK, to copy!')
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
  let value = document.querySelector('textarea').value
  let d = new Date()
  let json = {
    title: title, 
    content: value, 
    author: '', 
    dateModofied: `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`
  }
  localStorage.setItem(`FILEDATA://${document.getElementById('title').value}`, JSON.stringify(json))
  let filesObj = localStorage.getItem('files')
  filesObj = JSON.parse(filesObj)
  if (!!filesObj === false) {
    filesObj = []
  }
  let hasFile = false
  filesObj.forEach(function(f, i) {
    if (f === document.getElementById('title').value) {
      hasFile = true
    }
  })
  if (hasFile === false) {
    filesObj.push(document.getElementById('title').value)
  }
  console.log(filesObj)
  localStorage.setItem('files', JSON.stringify(filesObj))
}

textarea.addEventListener('keypress', saveToLocalStorage)


function getShareLink() {
  let fName = document.getElementById('title').value
  let fContent = document.querySelector('main textarea').value
  fContent = btoa(fContent)
  let lHostPathName = `${location.host}/${location.pathname}`.replace('//', '/')
  let fLink = `${location.protocol}//${lHostPathName}?action=filelink&file=${fName}&content=${fContent}`
  prompt('This is the link to share!', fLink)
}

function editFile(fName) {
  let fName = urlParams.get('file')
  saveToLocalStorage(fName)
  location.href = `${location.pathname}?action=open&file=${fName}`
}


let functions = [
  {
    id: 'editBtn', 
    function: editFile, 
  }, 
  {
    id: 'download', 
    function: download, 
  }, 
  {
    id: 'reset',
    function: reset,  
    method: 'on', 
  }, 
  {
    id: 'undo',
    function: undo,  
  }, 
  {
    id: 'redo',
    function: redo,  
  }, 
  {
    id: 'replaceThis', 
    function: function(e) { replace('single', e) }, 
  }, 
  {
    id: 'replaceAll', 
    function: function(e) { replace('all', e) }, 
  }, 
  {
    id: 'shareLink', 
    function: getShareLink, 
  }, 
  {
    id: 'takeFile', 
    function: function(e) { document.querySelector(`input[type='file']#readfile`).click() }, 
    method: 'on', 
  }, 
  {
    id: 'enableHTML', 
    function: checkHTML, 
  }, 
]
let needsToDo = []


function addEventListeners() {
  functions.forEach(function(f, i) {
    let id = f.id
    let isNeeds = false
    needsToDo.forEach(function(n, i) {
      if (id === n) {
        addListener(f)
      }
    })
    if (needsToDo.length === 0) {
      addListener(f)
    }
  })
}

window.addEventListener('DOMContentLoaded', addEventListeners)
addEventListeners()

function addListener(f) {
  let id = f.id
  let func = f.function
  if (!!document.getElementById(id)) {
    if (!!method) {
      if (method === 'on') {
        document.getElementById(id).onclick = func
      }
      else {
        document.getElementById(id).addEventListener('click', func)
      }
    }
    else {
      document.getElementById(id).addEventListener('click', func)
    }
  }
  else {
    needsToDo.push(id)
  }
}