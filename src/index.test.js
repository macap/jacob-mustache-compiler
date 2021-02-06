var parser = require('./index')

test('parses plain text', () => {
    const input = ("<h1>test</h1>");
    expect(parser(input)).toEqual([{"tokenType": "text", "tokenVar": "<h1>test</h1>"}]);
});


test('parses simple tag', () => {
    const input = ("{{name}}");
    expect(parser(input)).toEqual([{"tokenType": "tag", "tokenVar": "name"}]);
});

test('parsessection with plain content', () => {
    const input = ("{{#name}}content{{/name}}");
    expect(parser(input)).toEqual([{"section": [{"tokenType": "text", "tokenVar": "content"}], "tokenType": "section", "tokenVar": "name"}]);
});

test('parses section with dynamiccontent', () => {
    const input = ("{{#name}}{{content}}{{content2}}{{/name}}");
    expect(parser(input)).toEqual([{"section": [{"tokenType": "tag", "tokenVar": "content"}, {"tokenType": "tag", "tokenVar": "content2"}], "tokenType": "section", "tokenVar": "name"}]);
});

test('parsesmixed content', () => {
    const input = ("<h1>{{#name}}{{content}}{{content2}}test{{/name}}test{{name}}test</h1>");
    expect(parser(input)).toEqual([{"tokenType": "text", "tokenVar": "<h1>"}, {"section": [{"tokenType": "tag", "tokenVar": "content"}, {"tokenType": "tag", "tokenVar": "content2"}, {"tokenType": "text", "tokenVar": "test"}], "tokenType": "section", "tokenVar": "name"}, {"tokenType": "text", "tokenVar": "test"}, {"tokenType": "tag", "tokenVar": "name"}, {"tokenType": "text", "tokenVar": "test</h1>"}]);
})

test('throws on broken content', () => {
    const input = ("{{{foo}}{{/bar}}</h1>");
    expect(() => { parser(input) }).toThrow();
})