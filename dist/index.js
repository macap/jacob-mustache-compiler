var MyParser = require('./parser.jacobgram.out.js');
var MyLexer = require('./lexer.jacoblex.out.js')

function parse(input, vars = {}) {
    var lexer = new MyLexer();
    var parser = new MyParser();
    lexer.setInput(input);
    return parser.parse(lexer, {...vars});
}

module.exports = parse