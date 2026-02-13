var editorThemes = {
    python: function() {
        // Difficulty: "Moderate"
        // Python language definition.
        // Only trickiness is that we need to check strings before identifiers
        // since they have letter prefixes. We also treat ':' as an @open bracket
        // in order to get auto identation.
        return {
            defaultToken: '',
            tokenPostfix: '.python',

            keywords: [
                'and',
                'as',
                'assert',
                'break',
                'class',
                'continue',
                'def',
                'del',
                'elif',
                'else',
                'except',
                'exec',
                'finally',
                'for',
                'from',
                'global',
                'if',
                'import',
                'in',
                'is',
                'lambda',
                'None',
                'not',
                'or',
                'pass',
                'print',
                'raise',
                'return',
                'self',
                'try',
                'while',
                'with',
                'yield',

                'int',
                'float',
                'long',
                'complex',
                'hex',

                'abs',
                'all',
                'any',
                'apply',
                'basestring',
                'bin',
                'bool',
                'buffer',
                'bytearray',
                'callable',
                'chr',
                'classmethod',
                'cmp',
                'coerce',
                'compile',
                'complex',
                'delattr',
                'dict',
                'dir',
                'divmod',
                'enumerate',
                'eval',
                'execfile',
                'file',
                'filter',
                'format',
                'frozenset',
                'getattr',
                'globals',
                'hasattr',
                'hash',
                'help',
                'id',
                'input',
                'intern',
                'isinstance',
                'issubclass',
                'iter',
                'len',
                'locals',
                'list',
                'map',
                'max',
                'memoryview',
                'min',
                'next',
                'object',
                'oct',
                'open',
                'ord',
                'pow',
                'print',
                'property',
                'reversed',
                'range',
                'raw_input',
                'reduce',
                'reload',
                'repr',
                'reversed',
                'round',
                'set',
                'setattr',
                'slice',
                'sorted',
                'staticmethod',
                'str',
                'sum',
                'super',
                'tuple',
                'type',
                'unichr',
                'unicode',
                'vars',
                'xrange',
                'zip',

                'True',
                'False',

                '__dict__',
                '__methods__',
                '__members__',
                '__class__',
                '__bases__',
                '__name__',
                '__mro__',
                '__subclasses__',
                '__init__',
                '__import__'
            ],

            brackets: [
                { open: '{', close: '}', token: 'delimiter.curly' },
                { open: '[', close: ']', token: 'delimiter.bracket' },
                { open: '(', close: ')', token: 'delimiter.parenthesis' }
            ],

            tokenizer: {
                root: [
                    { include: '@whitespace' },
                    { include: '@numbers' },
                    { include: '@strings' },

                    [/[,:;]/, 'delimiter'],
                    [/[{}\[\]()]/, '@brackets'],

                    [/@[a-zA-Z]\w*/, 'tag'],
                    [/[a-zA-Z]\w*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }]
                ],

                // Deal with white space, including single and multi-line comments
                whitespace: [
                    [/\s+/, 'white'],
                    [/(^#.*$)/, 'comment'],
                    [/('''.*''')|(""".*""")/, 'string'],
                    [/'''.*$/, 'string', '@endDocString'],
                    [/""".*$/, 'string', '@endDblDocString']
                ],
                endDocString: [
                    [/\\'/, 'string'],
                    [/.*'''/, 'string', '@popall'],
                    [/.*$/, 'string']
                ],
                endDblDocString: [
                    [/\\"/, 'string'],
                    [/.*"""/, 'string', '@popall'],
                    [/.*$/, 'string']
                ],

                // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
                numbers: [
                    [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
                    [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number']
                ],

                // Recognize strings, including those broken across lines with \ (but not without)
                strings: [
                    [/'$/, 'string.escape', '@popall'],
                    [/'/, 'string.escape', '@stringBody'],
                    [/"$/, 'string.escape', '@popall'],
                    [/"/, 'string.escape', '@dblStringBody']
                ],
                stringBody: [
                    [/[^\\']+$/, 'string', '@popall'],
                    [/[^\\']+/, 'string'],
                    [/\\./, 'string'],
                    [/'/, 'string.escape', '@popall'],
                    [/\\$/, 'string']
                ],
                dblStringBody: [
                    [/[^\\"]+$/, 'string', '@popall'],
                    [/[^\\"]+/, 'string'],
                    [/\\./, 'string'],
                    [/"/, 'string.escape', '@popall'],
                    [/\\$/, 'string']
                ]
            }
        };
    },
    java: function() {
        // Difficulty: "Easy"
        // Language definition for Java
        return {
            defaultToken: '',
            tokenPostfix: '.java',

            keywords: [
                'abstract', 'continue', 'for', 'new', 'switch', 'assert', 'default',
                'goto', 'package', 'synchronized', 'boolean', 'do', 'if', 'private',
                'this', 'break', 'double', 'implements', 'protected', 'throw', 'byte',
                'else', 'import', 'public', 'throws', 'case', 'enum', 'instanceof', 'return',
                'transient', 'catch', 'extends', 'int', 'short', 'try', 'char', 'final',
                'interface', 'static', 'void', 'class', 'finally', 'long', 'strictfp',
                'volatile', 'const', 'float', 'native', 'super', 'while', 'true', 'false'
            ],

            operators: [
                '=', '>', '<', '!', '~', '?', ':',
                '==', '<=', '>=', '!=', '&&', '||', '++', '--',
                '+', '-', '*', '/', '&', '|', '^', '%', '<<',
                '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
                '^=', '%=', '<<=', '>>=', '>>>='
            ],

            // we include these common regular expressions
            symbols: /[=><!~?:&|+\-*\/\^%]+/,
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
            digits: /\d+(_+\d+)*/,
            octaldigits: /[0-7]+(_+[0-7]+)*/,
            binarydigits: /[0-1]+(_+[0-1]+)*/,
            hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

            // The main tokenizer for our languages
            tokenizer: {
                root: [
                    // identifiers and keywords
                    [/[a-zA-Z_$][\w$]*/, {
                        cases: {
                            '@keywords': { token: 'keyword.$0' },
                            '@default': 'identifier'
                        }
                    }],

                    // whitespace
                    { include: '@whitespace' },

                    // delimiters and operators
                    [/[{}()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'delimiter',
                            '@default': ''
                        }
                    }],

                    // @ annotations.
                    [/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'],

                    // numbers
                    [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
                    [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
                    [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
                    [/0(@octaldigits)[Ll]?/, 'number.octal'],
                    [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
                    [/(@digits)[fFdD]/, 'number.float'],
                    [/(@digits)[lL]?/, 'number'],

                    // delimiter: after number because of .\d floats
                    [/[;,.]/, 'delimiter'],

                    // strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/"/, 'string', '@string'],

                    // characters
                    [/'[^\\']'/, 'string'],
                    [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                    [/'/, 'string.invalid']
                ],

                whitespace: [
                    [/[ \t\r\n]+/, ''],
                    [/\/\*\*(?!\/)/, 'comment.doc', '@javadoc'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                ],

                comment: [
                    [/[^\/*]+/, 'comment'],
                    // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
                    // [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
                    [/\*\//, 'comment', '@pop'],
                    [/[\/*]/, 'comment']
                ],
                //Identical copy of comment above, except for the addition of .doc
                javadoc: [
                    [/[^\/*]+/, 'comment.doc'],
                    // [/\/\*/, 'comment.doc', '@push' ],    // nested comment not allowed :-(
                    [/\/\*/, 'comment.doc.invalid'],
                    [/\*\//, 'comment.doc', '@pop'],
                    [/[\/*]/, 'comment.doc']
                ],

                string: [
                    [/[^\\"]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, 'string', '@pop']
                ],
            },
        };
    },
    markdown: function() {
        // Difficulty: "Ultra-Violence"
        // Language definition for Markdown
        // Quite complex definition mostly due to almost full inclusion
        // of the HTML mode (so we can properly match nested HTML tag definitions)
        return {
            defaultToken: '',
            tokenPostfix: '.md',

            // escape codes
            control: /[\\`*_\[\]{}()#+\-\.!]/,
            noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
            escapes: /\\(?:@control)/,

            // escape codes for javascript/CSS strings
            jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

            // non matched elements
            empty: [
                'area', 'base', 'basefont', 'br', 'col', 'frame',
                'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param'
            ],

            tokenizer: {
                root: [

                    // headers (with #)
                    [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ['white', 'keyword', 'keyword', 'keyword']],

                    // headers (with =)
                    [/^\s*(=+|\-+)\s*$/, 'keyword'],

                    // headers (with ***)
                    [/^\s*((\*[ ]?)+)\s*$/, 'meta.separator'],

                    // quote
                    [/^\s*>+/, 'comment'],

                    // list (starting with * or number)
                    [/^\s*([\*\-+:]|\d+\.)\s/, 'keyword'],

                    // code block (4 spaces indent)
                    [/^(\t|[ ]{4})[^ ].*$/, 'string'],

                    // code block (3 tilde)
                    [/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: 'string', next: '@codeblock' }],

                    // github style code blocks (with backticks and language)
                    [/^\s*```\s*((?:\w|[\/\-#])+)\s*$/, { token: 'string', next: '@codeblockgh', nextEmbedded: '$1' }],

                    // github style code blocks (with backticks but no language)
                    [/^\s*```\s*$/, { token: 'string', next: '@codeblock' }],

                    // markup within lines
                    { include: '@linecontent' },
                ],

                codeblock: [
                    [/^\s*~~~\s*$/, { token: 'string', next: '@pop' }],
                    [/^\s*```\s*$/, { token: 'string', next: '@pop' }],
                    [/.*$/, 'variable.source'],
                ],

                // github style code blocks
                codeblockgh: [
                    [/```\s*$/, { token: 'variable.source', next: '@pop', nextEmbedded: '@pop' }],
                    [/[^`]+/, 'variable.source'],
                ],

                linecontent: [

                    // escapes
                    [/&\w+;/, 'string.escape'],
                    [/@escapes/, 'escape'],

                    // various markup
                    [/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
                    [/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, 'strong'],
                    [/\b_[^_]+_\b/, 'emphasis'],
                    [/\*([^\\*]|@escapes)+\*/, 'emphasis'],
                    [/`([^\\`]|@escapes)+`/, 'variable'],

                    // links
                    [/\{+[^}]+\}+/, 'string.target'],
                    [/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ['string.link', '', 'string.link']],
                    [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],

                    // or html
                    { include: 'html' },
                ],

                // Note: it is tempting to rather switch to the real HTML mode instead of building our own here
                // but currently there is a limitation in Monarch that prevents us from doing it: The opening
                // '<' would start the HTML mode, however there is no way to jump 1 character back to let the
                // HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
                // we cannot correctly tokenize it in that mode yet.
                html: [
                    // html tags
                    [/<(\w+)\/>/, 'tag'],
                    [/<(\w+)/, {
                        cases: {
                            '@empty': { token: 'tag', next: '@tag.$1' },
                            '@default': { token: 'tag', next: '@tag.$1' }
                        }
                    }],
                    [/<\/(\w+)\s*>/, { token: 'tag' }],

                    [/<!--/, 'comment', '@comment']
                ],

                comment: [
                    [/[^<\-]+/, 'comment.content'],
                    [/-->/, 'comment', '@pop'],
                    [/<!--/, 'comment.content.invalid'],
                    [/[<\-]/, 'comment.content']
                ],

                // Almost full HTML tag matching, complete with embedded scripts & styles
                tag: [
                    [/[ \t\r\n]+/, 'white'],
                    [/(type)(\s*=\s*)(")([^"]+)(")/, ['attribute.name.html', 'delimiter.html', 'string.html',
                        { token: 'string.html', switchTo: '@tag.$S2.$4' },
                        'string.html']],
                    [/(type)(\s*=\s*)(')([^']+)(')/, ['attribute.name.html', 'delimiter.html', 'string.html',
                        { token: 'string.html', switchTo: '@tag.$S2.$4' },
                        'string.html']],
                    [/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ['attribute.name.html', 'delimiter.html', 'string.html']],
                    [/\w+/, 'attribute.name.html'],
                    [/\/>/, 'tag', '@pop'],
                    [/>/, {
                        cases: {
                            '$S2==style': { token: 'tag', switchTo: 'embeddedStyle', nextEmbedded: 'text/css' },
                            '$S2==script': {
                                cases: {
                                    '$S3': { token: 'tag', switchTo: 'embeddedScript', nextEmbedded: '$S3' },
                                    '@default': { token: 'tag', switchTo: 'embeddedScript', nextEmbedded: 'text/javascript' }
                                }
                            },
                            '@default': { token: 'tag', next: '@pop' }
                        }
                    }],
                ],

                embeddedStyle: [
                    [/[^<]+/, ''],
                    [/<\/style\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
                    [/</, '']
                ],

                embeddedScript: [
                    [/[^<]+/, ''],
                    [/<\/script\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
                    [/</, '']
                ],
            }
        };
    }
}