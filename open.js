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

    let fileElement = document.createElement('a')
    fileElement.classList.add('grid-item')
    fileElement.href =  `editor?action=openfile&file=${title}`

    let titleElement = document.createElement('h2')
    titleElement.textContent = title
    titleElement.classList.add('title')
    fileElement.appendChild(titleElement)

    let authorElement = document.createElement('span')
    authorElement.textContent = author
    authorElement.classList.add('author')
    fileElement.appendChild(authorElement)

    let dateElement = document.createElement('span')
    dateElement.textContent = dateModofied
    dateElement.classList.add('date')
    fileElement.appendChild(dateElement)

    filesEle.appendChild(fileElement)
});