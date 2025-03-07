require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

var extentions = {
    'html': 'html',
    'css': 'css',
    'js': 'javascript',
    'json': 'json',
    'ts': 'typescript',
    'md': 'markdown',
    'txt': 'text',
    'py': 'python',
    'java': 'java',
    'c': 'c',
}

var languages = {
    html: {
        startingCode: 
`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        
    </body>
</html>`
    }, 
    css: {
    }, 
    javascript: {
    }, 
    json: {
        hasTheme: false,
    }, 
    typescript: {
        hasTheme: false,
    }, 
    python: {
        hasTheme: true,
    }, 
    java: {
        hasTheme: true,
    },
    markdown: {
        hasTheme: true,
    },
    text: {
    },
}

var buttons = [
    'download', 
    'delete', 
    {
        name: 'makeLink',
        func: 'getShareLinkCode'
    }, 
]

buttons.forEach(b => {
    if (typeof b === 'object') {
        document.querySelector(`#${b.name}`).onclick = window[b.func]
    }
    else document.querySelector(`#${b}`).onclick = window[b]
})

var editor

function getShareLinkCode() {
    var value = editor.getValue()
    getShareLink(value)
}

function keyDown(event) {
    if (event.code) {
        var value = editor.getValue()
        saveFile ? saveFile(value) : ''
    }
}

let proxy = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = {
        baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
    };
    importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

var ext = codeObj.ext

var language
if (!languages[ext]) {
    language = prompt(`What language do you want to use? (acceptable values are "${Object.keys(languages).join(', ')}")`)
    if (!language || language == '' || !Object.keys(languages).includes(language)) {
        alert('Error: Invalid language value entered, defaulting to "html"')
        language = 'html'
    }
}
else {
    language = languages[ext]
}

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById('container'), {
        value: codeObj.content ?? languages[language].startingCode,
        language: language,
        theme: !!editorThemes[language] ? language : 'vs-dark'
    });

    
    Object.keys(languages).forEach(l => {
        if (!editorThemes[l]) return
        monaco.languages.setMonarchTokensProvider(l, editorThemes[l]());
    })
    
    
    editor.onKeyDown(keyDown);
});

var previewWindow = null
function previewHTML() {
    let title = docTitle
    let ext = ''
    if (title.includes('.')) {
        ext = title.split('.')[1]
    }

    var value = editor.getValue()

    let eleVal = 'documentElement'
    if (value.includes('<html')) {
        value = value.split(`<html${value.split('<html')[1].split('>')[0]}>\n`)[1]
        if (value.includes('</html>')) {
            value = value.split('</html>')[0]
        }
    }
    else if (value.includes('<xml')) {
        value = value.split(`<xml${value.split('<xml')[1].split('>')[0]}>\n`)[1]
    }
    else if (value.includes('<?xml')) {
        value = value.split(`<?xml${value.split('<?xml')[1].split('>')[0]}>\n`)[1]
    }
    if (value.includes('<svg')) {
        eleVal = 'body'
    }
    previewWindow = open(`/preview.html?eleval=${eleVal}&content=${btoa(value)}`)
}

