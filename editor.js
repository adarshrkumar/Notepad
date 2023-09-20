localStorage.removeItem('code')
var history = ['']
var histI = 0
var histIsM = true
var histIsP = true
var dtitle = document.title
var title = 'New Text File'
var ext = 'txt'
var hasUpdatedPreview = false
var isPreview = false
var alertShown = false
var theAlert = false

function go() {
  let input = document.getElementsByTagName('textarea')[0].value;

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
  if (ext === 'txt') {
    link.download = `${title}.txt`  ;
  }
  else {
    link.download = `${title}`  ;
  }
  if (Boolean(document.querySelector('textarea').value) || Boolean(title)) {
    link.click();
  }
  checkHTML()
}

function reset() {
  document.getElementsByTagName('textarea')[0].value = '';
  document.title = dtitle
  title = 'New Text File'
  document.querySelector('input#title').value = ''
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
      document.getElementsByTagName('textarea')[0].value = readerEvent.target.result; // this is the content!
   }
  let fname = readfile.value.split('\\')[readfile.value.split('\\').length - 1]
  let ftitle = ''
  if (fname.split('.')[fname.split('.').length - 1] === 'txt') {
    ftitle = fname.split(`.${fname.split('.')[fname.split('.').length - 1]}`)[0]
  }
  else {
    ftitle = fname
    ext = fname.split('.')[fname.split('.').length - 1]
  }
  if (ftitle.split('').length <= 0) {
    document.title = dtitle
  }
  else {
    document.title = `${ftitle} | ${dtitle}`
  }
  document.querySelector('input#title').value = ftitle
  title = ftitle
  checkHTML()
}

document.getElementsByTagName('textarea')[0].addEventListener('keyup', checkHTML)

function checkHTML() {
  var main = document.querySelector('main')
  var preview = main.querySelector('iframe#preview')
  var span = main.querySelector('span')
  var textarea = main.querySelector('textarea')
  if (ext === 'html' || ext === 'htm' || ext === 'mht') {
    setTimeout(function() {
//      alert(true)
      let value = document.querySelector('textarea').value
      localStorage.setItem('code', value)
      preview.style.display = ''
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
      document.getElementsByTagName('textarea')[0].id = 'code'
    }, 1)
  }
  else if (isPreview === true) {
    preview.style.display = 'none'
    span.style.display = 'none'
    preview.src = `/preview.html`
    textarea.style = ''
    hasShown = false
    document.getElementsByTagName('textarea')[0].removeAttribute('id')
  }
  histI++
  history[histI + 1] = false
  history[histI] = document.getElementsByTagName('textarea')[0].value
  console.log(history)
}

function replace(cmd) {
  let main = document.querySelector('main')
  let textarea = main.querySelector('textarea')
  let value = textarea.value
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
    document.getElementsByTagName('textarea')[0].value = history[histI]
  }
  checkHTML()
}

function redo() {
  if (histI <= history.length - 1) {
    histI++
    while (history[histI] === false) {
      histI++
    }
    document.getElementsByTagName('textarea')[0].value = history[histI]
  }
  checkHTML()
}

checkHTML()



if (!!go) go.addEventListener('click', go)
if (!!reset) reset.addEventListener('click', reset)

if (!!undo) undo.addEventListener('click', undo)
if (!!redo) redo.addEventListener('click', redo)

if (!!replaceThis) replaceThis.addEventListener('click', function(e) { replace('single', e) })
if (!!replaceAll) replaceAll.addEventListener('click', function(e) { replace('all', e) })

if (!!takeFile) {
  takeFile.addEventListener('click', function(e) {
    document.querySelector(`input[type='file']#readfile`).click()
  })
}

if (!!enableHTML) enableHTML.addEventListener('click', checkHTML)