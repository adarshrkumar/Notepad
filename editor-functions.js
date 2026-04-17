const APP_BACKUP_FILE_EXT = 'tnynpd';
var docTitle = document.title

function rename(newName) {
    if (newName) {
        docTitle = newName
    }
    else {
        docTitle = prompt('Rename Document', docTitle)
    }
    setTitle()
}

function exportBackup(ext = APP_BACKUP_FILE_EXT) {
    let content;

    if (ext === APP_BACKUP_FILE_EXT) {
        let input = tinymce.activeEditor.getContent({ format: 'html' });
        let turndownService = new TurndownService();
        let markdown = turndownService.turndown(input);

        let author = localStorage.getItem('username') || '';
        let d = new Date();
        let dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        let frontmatter = `---\ntitle: ${docTitle}\nauthor: ${author}\ndate: ${dateStr}\n---\n\n`;
        content = frontmatter + markdown;
    }
    else if (ext === 'html') {
        content = tinymce.activeEditor.getContent({ format: 'html' });
    }
    else if (ext === 'md') {
        let html = tinymce.activeEditor.getContent({ format: 'html' });
        let turndownService = new TurndownService();
        content = turndownService.turndown(html);
    }
    else if (ext === 'txt') {
        let html = tinymce.activeEditor.getContent({ format: 'html' });
        let div = document.createElement('div');
        div.innerHTML = html;
        content = div.textContent || div.innerText || '';
    }

    let blob = new Blob([content], {type: 'text/plain'});
    let reader = new FileReader();
    reader.readAsText(blob);

    let link = document.querySelector('a#downloader');
    link.href = window.URL.createObjectURL(blob);
    let title = docTitle;
    if (!title) title = 'New Text File';
    link.download = `${title}.${ext}`;
    if (title) {
        link.click();
    }
}

function setTitle() {
    var ext
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

function saveFile(value) {
    let title = docTitle
    if (title === '' || !!title === false || title === null) return

    var ext = title
    if (ext.includes('.')) {
        ext = ext.split('.').slice(-1)
    }
    let author = localStorage.getItem('username')
    if (!!author === false) author = ''
    let d = new Date()
    let json = {
        title: title,
        extension: ext,
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
    return title
}

function getShareLink(fContent) {
    let fileName = docTitle
    fContent = btoa(fContent)
    let lHostPathName = `${location.host}/${location.pathname}`.replace('//', '/')
    let fLink = `${location.protocol}//${lHostPathName}?action=filelink&file=${fileName}&content=${fContent}`
    prompt('This is the link to share!', fLink)
}

function importFile(ext) {
    let readfile = document.querySelector("input[type='file']#readfile");
    if (ext) {
        readfile.accept = `.${ext}`;
        readfile.dataset.expectedExt = ext;
    }
    else {
        readfile.accept = '';
        readfile.dataset.expectedExt = '';
    }
    readfile.click();
}

function importBackup() {
    importFile(APP_BACKUP_FILE_EXT);
}

function exportFile() {
    let fileData = localStorage.getItem(`FILEDATA://${docTitle}`);
    let originalExt = null;

    if (fileData) {
        try {
            let json = JSON.parse(fileData);
            originalExt = json.extension;
        } catch (e) {
            // Failed to parse, continue without extension
        }
    }

    if (originalExt && originalExt !== APP_BACKUP_FILE_EXT) {
        exportBackup(originalExt);
    }
    else {
        const formats = ['html', 'md', 'txt'];
        let format = prompt(`Export as:\n${formats.join('\n')}`, 'md');
        if (!format) return;

        format = format.toLowerCase().trim();
        if (!formats.includes(format)) {
            alert(`Invalid format. Choose: ${formats.slice(0, -1).join(', ')}, or ${formats.slice(-1)}`);
            return;
        }

        exportBackup(format);
    }
}

function deleteFile() {
    var fTitle = docTitle
    console.log(`\`docTitle\` = "${docTitle}"`)
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

    if (index < 0) {
        location.href = `${location.pathname}?action=new`
    }

    location.href = '/'
}
