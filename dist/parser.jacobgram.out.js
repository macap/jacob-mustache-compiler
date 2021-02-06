var Parser = (function (undefined) {
function Parser(environment){
if(!(this instanceof Parser)) return new Parser(environment);
var env,modules,imports;
env=modules=imports=environment;
this.action={"0":{"4":["shift",[4]],"5":["shift",[5]]},"1":{"0":["accept",[]]},"2":{"0":["reduce",[1,1,0]],"4":["shift",[4]],"5":["shift",[5]]},"3":{"0":["reduce",[2,1,1]],"4":["reduce",[2,1,1]],"5":["reduce",[2,1,1]]},"4":{"0":["reduce",[3,1,3]],"4":["reduce",[3,1,3]],"5":["reduce",[3,1,3]]},"5":{"4":["shift",[7]],"7":["shift",[8]]},"6":{"0":["reduce",[2,2,2]],"4":["reduce",[2,2,2]],"5":["reduce",[2,2,2]]},"7":{"6":["shift",[9]]},"8":{"4":["shift",[10]]},"9":{"0":["reduce",[3,3,4]],"4":["reduce",[3,3,4]],"5":["reduce",[3,3,4]]},"10":{"6":["shift",[11]]},"11":{"4":["shift",[4]],"5":["shift",[5]]},"12":{"4":["shift",[4]],"5":["shift",[13]]},"13":{"4":["shift",[7]],"7":["shift",[8]],"8":["shift",[14]]},"14":{"4":["shift",[15]]},"15":{"6":["shift",[16]]},"16":{"0":["reduce",[3,9,5]],"4":["reduce",[3,9,5]],"5":["reduce",[3,9,5]]}};
this.goto={"0":{"1":1,"2":2,"3":3},"2":{"3":6},"11":{"2":12,"3":3},"12":{"3":6}};
this.actions=[function(e) { console.log('final'); return e; },function(token) { return [token]; },function(tok1, tok2) { 
        return [...tok1, tok2];
    },function(text) { 
        const res = {tokenType: 'text', tokenVar: text };
        return res;
     },function(_, text){
        const res = {tokenType: 'tag', tokenVar: text };
        return res;
    },function(_, _, text, _, section) {
        const res = {tokenType: 'section', tokenVar: text, section: section };
        return res;
    },function(txt) { return txt },function(t1,t2) {

            return t1;
        }];
this.startstate=0;
this.symbolsTable={"<<EOF>>":0,"Start":1,"TPL_TOKENS":2,"TPL_TOKEN":3,"TEXT":4,"MUSTAG_START":5,"MUSTAG_END":6,"#":7,"/":8};
this.actionMode='function';
}
Parser.prototype.identity=function (x) {
        "use strict";
        return x;
    };
Parser.prototype.parse=function (lexer, context) {
        this.stack = [];
        this.context =  context || {};

        this.lexer = lexer;
        this.a = this.lexer.nextToken();
        this.stack.push({s: this.startstate, i: 0});
        this.accepted = false;
        this.inerror = false;
        while (!this.accepted && !this.inerror) {
            var top = this.stack[this.stack.length - 1];
            var s = top.s;
            //this.a = this.currentToken;
            if(lexer.isEOF(this.a))
                this.an = 0;
            else
                this.an = this.symbolsTable[this.a.name];
            var action = this.action[s][this.an];
            if (action !== undefined) {
                this[action[0]].apply(this, action[1]);
            } else {
                this.inerror = true;
                this.error(this.a,this);
            }
        }
        return top.i.value;
    };
Parser.prototype.shift=function (state) {
        "use strict";
        this.stack.push({s: state, i: this.a});
        this.a = this.lexer.nextToken();

    };
Parser.prototype.reduce=function (head, length, prodindex) {
        "use strict";
        //var prod = this.productions[prodnumber];
        var self = this;
        var rhs = this.stack.splice(-length, length);
        var t = this.stack[this.stack.length - 1];
        var ns = this.goto[t.s][head];
        var value;
        if (this.actions) {
            var action = this.actions[prodindex] || this.identity;
            var values = rhs.map(function (si) {
                return si.i.value;
            });

            if(self.actionMode==='constructor')
                value =  this.create(action,values);
            else
                value =  action.apply(this.context, values);
        }
        //If we are debugging

        if(this.symbols) {
            var nt = {name: this.symbols[head].name, value:value};
            this.stack.push({s: ns, i: nt});
        }
        else
        {
            this.stack.push({s: ns,i:{value: value}});
        }

    };
Parser.prototype.accept=function () {
        "use strict";
        this.accepted = true;
    };
Parser.prototype.error=function(token){
        if(typeof token === 'string')
        {
            throw Error(token);
        }
        if(this.lexer.isEOF(token)){
            throw Error("Unexpected EOF at "+this.lexer.jjline+':'+this.lexer.jjcol);
        } else
        throw Error('Unexpected token '+token.name+' "'+token.lexeme+'" at ('+token.pos.line+':'+token.pos.col+')');
    };
Parser.prototype.create=function(ctor,args){
        var args = [this.context].concat(args);
        var factory = ctor.bind.apply(ctor,args);
        return new factory();
    };
if (typeof(module) !== 'undefined') { module.exports = Parser; }
return Parser;
})();