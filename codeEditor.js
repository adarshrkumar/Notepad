javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();

require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

var languages = {
    html: {
        hasTheme: false,
        startingCode = 
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
        hasTheme: false,
    }, 
    javascript: {
        hasTheme: false,
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
}

Object.keys(languages).forEach(language => {
    monaco.languages.setMonarchTokensProvider(language, editorThemes[language]());
})

var editor

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

var language = alert(`What language do you want to use? (acceptable values are "${Object.keys(languages).join(', ')}")`)
if (!language || language == '' || !Object.keys(languages).includes(language)) {
    alert('Error: Invalid language value entered, defaulting to "html"')
    language = 'html'
}

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById('container'), {
        value: tempCode ?? languages[language].startingCode,
        language: language,
        theme: languages[language].hasTheme ? language : 'vs-dark'
    });

    editor.onKeyDown(keyDown);
});