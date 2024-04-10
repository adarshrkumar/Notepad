var bodyHTML = document.body.innerHTML
  
function getCode() {
  (new URLSearchParams(location.search)).get('content')
  if (!!code) code = btoa(code)
}

var code = getCode()
var lastCode = ''
addCode()
setInterval(addCode, 1)
function addCode() {
  code = getCode()
  if (!!code) {
    if (code !== lastCode) {
       if (code.endsWith('<')) {
         needsClose = '/>'
       }
       else if (code.endsWith('</')) {
         needsClose = '>'
       }
       else {
        needsClose = ''
       }
      let ELEMENTS = code.split('<')
      let i = 0
      ELEMENTS.forEach(e => {
        if (!!e) {
          if (e.includes(' ')) {
            e = e.split(' ')[0]
          }
          else {
            e = e.split('>')[0]
          }
          ELEMENTS[i] = e
          if (code.endsWith(`</${e}`)) {
            needsClose = '>'
          }
          else if (code.endsWith(`<${e}`)) {
            needsClose = '>'
          }
        }
        else {
          ELEMENTS[i] = ''
        }
      })
      document[parent.document.getElementById('eleVal').value].innerHTML = code + needsClose + bodyHTML
      lastCode = code
    }
  }
}



var dTitle = document.title
var pTitle = parent.document.title
setInterval(function() {
  if (document.title !== dTitle) {
    dTitle = document.title
    if (pTitle.includes(' | ')) {
      parent.document.title = `${dTitle} | ${parent.title} | ${pTitle.split(' | ')[1]}`
    }
    else {
      parent.document.title = `${dTitle} | ${parent.title} | ${pTitle}`
    }
  }
}, 1000)