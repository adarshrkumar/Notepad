require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = {
        baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
    };
    importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

require(["vs/editor/editor.main"], function () {
    let editor = monaco.editor.create(document.getElementById('container'), {
        value: [
            '<!DOCTYPE html>\n' + 
            '<html lang="en">\n' + 
            '\t<head>\n' + 
            '\t\t<meta charset="UTF-8">\n' + 
            '\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + 
            '\t\t<title>Document</title>\n' + 
            '\t</head>\n' + 
            '\t<body>\n' + 
            '\t\t\n' + 
            '\t</body>\n' + 
            '</html>'
        ].join('\n'),
        language: 'html',
        theme: 'vs-dark'
    });
});