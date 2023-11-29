let filesObj = localStorage.getItem('files')
if (!!filesObj) {
  filesObj = JSON.parse(filesObj)
}
else {
  filesObj = []
}

let filesEle = document.querySelector('#files > content')

filesObj.forEach(function(fileName, i) {
  let file = localStorage.getItem(`FILEDATA://${fileName}`)
  file = JSON.parse(file)
  let title = file.title
  let content = file.content
  let author = file.author
  let dateModofied = file.dateModofied

  let fileParent = document.createElement('div')
  fileParent.classList.add('grid-parent')

  let fileElement = document.createElement('a')
  fileElement.classList.add('grid-item')
  fileElement.href =  `editor?action=openfile&file=${title}`
  fileParent.appendChild(fileElement)

  let img = document.createElement('span')
  img.classList.add('img')
  img.classList.add('material-symbols-outlined')
  img.textContent = 'description'
  fileElement.appendChild(img)

  let titleParent = document.createElement('div')
  titleParent.classList.add('title-parent')

  let titleElement = document.createElement('h2')
  titleElement.textContent = title
  titleElement.classList.add('title')
  titleParent.appendChild(titleElement)

  fileElement.appendChild(titleParent)
  
  let authorElement = document.createElement('span')
  authorElement.textContent = author
  authorElement.classList.add('author')
  fileElement.appendChild(authorElement)

  let dateElement = document.createElement('span')
  dateElement.textContent = dateModofied
  dateElement.classList.add('date')
  fileElement.appendChild(dateElement)

  let optionsElement = document.createElement('div')
  optionsElement.classList.add('options')

  let deleteOption = document.createElement('a')

  deleteOption.classList.add('option')
  deleteOption.classList.add('material-symbols-outlined')
  deleteOption.classList.add('delete')

  deleteOption.textContent = 'delete'
  deleteOption.href = `javascript:deleteFile('.${deleteOption.classList.join('.')}')` 

  optionsElement.appendChild(deleteOption)

  fileParent.appendChild(optionsElement)

  filesEle.appendChild(fileParent)
});

function deleteFile(e) {
  if (typeof e === 'string') {
    e = document.querySelector(e)
  }
  else {
    e = e.target
  }
  var fTitle = e.querySelector('.title').textContent  
  localStorage.removeItem(`FILEDATA://${fTitle}`)

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
    let index = filesObj.indexOf(fTitle)
    filesObj.splice(index, 1)
  }
  localStorage.setItem('files', JSON.stringify(filesObj))
}