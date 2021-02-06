# jacob-mustache-compiler

Mustache compiler - well not exaclty. For now it contains language parser with support for variables and sections, which returns text with mustache tags in json structure. Section elements are grouped into array and variables are extracted from the text. It can be a solid base for building your own templating function or, after some improvements, an actual mustache compiler *but you're probably better with the original one*.

I built it as a proof of concept for creating template parser, and it turned out to be pretty easy with any BISON-like tool, like [jacob](https://github.com/Canna71/Jacob). You can use it as a starting point for building your own compiler, or just an example if you are curious how "hard" it is to build one.

## Example

Input:
```html
hello<strong>world from {{city}}!</strong><ul>{{#visitors}}<li>{{visitor}} from {{city}}</li>{{/visitors}}</ul>and all others!
```

Output:
```json
[
   {
      "tokenType":"text",
      "tokenVar":"hello<strong>world from "
   },
   {
      "tokenType":"tag",
      "tokenVar":"city"
   },
   {
      "tokenType":"text",
      "tokenVar":"!</strong><ul>"
   },
   {
      "tokenType":"section",
      "tokenVar":"visitors",
      "section":[
         {
            "tokenType":"text",
            "tokenVar":"<li>"
         },
         {
            "tokenType":"tag",
            "tokenVar":"visitor"
         },
         {
            "tokenType":"text",
            "tokenVar":" from "
         },
         {
            "tokenType":"tag",
            "tokenVar":"city"
         },
         {
            "tokenType":"text",
            "tokenVar":"</li>"
         }
      ]
   },
   {
      "tokenType":"text",
      "tokenVar":"</ul>and all others!"
   }
]
```

## Usage

I've attached compiled versions of lexer and parser, so you just have to import one file, and can use the compiler right away:

```
var parser = require('../dist/index')

console.log(
    parser('<span>{{var}}</span>')
);
```

### Current language definition

Currently compiler returns parsed text in json

- text like `hello world` will result in `{ tokenType: "text", tokenVar: "hello world" }`
- variables like `{{foo}}` will result in `{ tokenType: "tag", tokenVar: "foo" }`
- sections like `{{#bars}} ... {{/bars}}` will result in `{ tokenType: "section", tokenVar: "bars", section: [] }` where section field will contain all parsed content within that section

You can adjust that to your needs by editing *parser.jacobgram*

### Running examples from repository

```
node examples/simple.js
```

## Development

1. Install dependencies 
```
yarn
```
2. If you want to compile lexer and parser
```
yarn build
```
3. If you want to run dev.js "playground file"
```
yarn dev
```
4. Updating "dist" version
```
yarn dist
```

### Structure

- *dist/lexer.jacoblex.out.js* - compiled lexer generated by jacob
- *dist/parser.jacobgram.out.js* - compiled parser generated by jacob
- *dist/index.js* - ready to use module


- *src/lexer.jacoblexer* - lexer definition source
- *src/parser.jacobgram* - parser definition source
- *src/index.js* - entry file
- *src/dev.js* - playground
- *index.test.js* - tests

## Troubleshooting

Apparently jacob uses dos carriage return character in its cmd file, so If you are using linux, and encounter this error message:
```
$ jacob -t src/lexer.jacoblex && jacob -g src/parser.jacobgram
/usr/bin/env: ‘node\r’: No such file or directory
error Command failed with exit code 127.
```
you can fix jacob cmd line endings with [dos2unix](http://manpages.ubuntu.com/manpages/focal/pl/man1/dos2unix.1.html)

```dos2unix -- node_modules/jacob/cmd/cmd.js ```

## References

- [Mustache language spec](http://mustache.github.io/mustache.5.html)
- [JACOB - BISON like Lexer & Parser generator](https://github.com/Canna71/Jacob)

## Ideas

To make it an actual mustache compiler, I'd first create handlers for language expressions - variables and various types of sections, and then after passing them to parser, replace returned json with the actual code, by calling the handlers. The worst part (recognizing language) is already done, so that shouldn't be too hard.

You can pass any arguments to parser
```
parse(....)
```
and call them there as you would in javascript
```
context: 
```

