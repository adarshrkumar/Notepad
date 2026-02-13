let toolbar = document.querySelector('.toolbar')
let sWidth = 8*2
let eS = document.querySelectorAll('.toolbar > *')
let hasDone = false
eS.forEach(e => {
    sWidth+=e.clientWidth
    sWidth+=8
    hasDone = true
})

let wWidth = window.innerWidth
if (sWidth >= wWidth) {
    toolbar.style.paddingBottom = '0'
}
