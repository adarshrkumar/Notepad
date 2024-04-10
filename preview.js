var urlParams = new URLSearchParams(location.search)
var bodyHTML = document.body.innerHTML
  
function getCode() {
  var c = urlParams.get('content')
  if (!!c) c = btoa(c)
  return c
}

var eleVal = urlParams.get('eleval')
var code = getCode()
addCode()
setInterval(addCode, 1)
function addCode() {
  code = getCode()
  if (!!code) {
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
    document[eleVal].innerHTML = code + needsClose + bodyHTML
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