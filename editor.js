var currentState = null

var custMenuItems = [
    {
        name: 'Rename',
        func: rename,
    },
    {
        name: 'Save',
        func: saveContent,
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
        func: downloadFile,
    },
    {
        name: 'Share',
        func: getShareLink,
    },
    {
        name: 'CodeEditor',
        func: openInCodeEditor,
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
        newFile: { title: 'File', items: 'rename save delete | upload download | share print codeeditor' }
    },
    menubar: 'newFile edit view insert format tools table help',

    placeholder: 'Type here...',
    content_style: '.toolbar { border-bottom: none; }',
    setup: (editor) => {
        currentState = 'editor'
        editor.on('change', () => {
            saveContent()
        });

        addMenuItems(editor)
    }
});

function saveContent(info) {
    let value = tinymce.activeEditor.getContent({ format: 'html' });

    var turndownService = new TurndownService()
    var md = turndownService.turndown(value)

    var type = 'text'
    if (info) {
        if (info.type) {
            type = info.type
            if (type === 'image') {
                if (info.content) {
                    value = info.content
                }
            }
        }
    }
    return saveFile(md);
}

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

var theAlert = false
var container = document.querySelector('.container')
var textarea = container.querySelector('textarea')

function downloadFile() {
    let input = tinymce.activeEditor.getContent({ format: 'html' });

    var turndownService = new TurndownService()
    var md = turndownService.turndown(input)

    download(md)
}

var readfile = document.querySelector("input[type='file']#readfile");

readfile.onchange = object => {
    // getting a hold of the file reference
    var file = object.target.files[0];
    if (!file) return

    let filename = file.name
    var ext = filename.split('.').slice(-1).join('.')
    let title = ''
    if (filename.split('.').slice(-1) === 'txt') {
        title = filename.split('.').slice(0, -1).join('.')
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

            if (ext === 'txt') {
                if (text.includes('\n')) {
                    text = text.split('\n').join('<br>')
                }
            }

            tinymce.activeEditor.setContent(text);
        }
    }

    if (title.split('').length <= 0) {
        document.title = docTitle
    }
    else {
        document.title = `${title} | ${docTitle}`
    }
    docTitle = title
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
            saveContent({type: 'image', content: path})
        }
    }
    reader.readAsDataURL(file);

    return state
}

function outputsize() {
    if (currentState !== 'image' && document.querySelector('textarea').clientWidth < 150) {
        textarea.style.width = `${150}px`
    }
}
outputsize()

new ResizeObserver(outputsize).observe(textarea)

function getShareLinkTinyMCE() {
    let fContent = tinymce.activeEditor.getContent({ format: 'html' });

    var turndownService = new TurndownService()
    var md = turndownService.turndown(fContent)

    getShareLink(md)
}

function openInCodeEditor() {
    var title = saveContent()
    location.href = `/code-editor.html?action=openfile&file=${title}`
}

function upload() {
    readfile.click()
}

var isUpload = (new URLSearchParams(location.search)).get('action') === 'upload'
if (isUpload) {
    window.addEventListener('DOMContentLoaded', upload)
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
