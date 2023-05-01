let section = document.querySelector('section')
let sWidth = 8*2
let eS = document.querySelectorAll('section > *')
let hasDone = false
eS.forEach(e => {
  if (e.querySelector('*').id !== 'readfile') {
    sWidth+=e.clientWidth
    sWidth+=8
    hasDone = true
  }
})
if (hasDone) {
  sWidth-=8
}

let wWidth = window.innerWidth
if (sWidth >= wWidth) {
  section.style = 'overflow-x: scroll !important; margin-bottom: 0px;'
}