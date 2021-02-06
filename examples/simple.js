var parser = require('../dist/index')

const text = 'hello<strong>world from {{city}}!</strong><ul>{{#visitors}}<li>{{visitor}} from {{city}}</li>{{/visitors}}</ul>and all others!';

console.log(
    parser(text)
);