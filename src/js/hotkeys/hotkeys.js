if(!Array.prototype.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++) if(this[i]===obj) return i;
        return -1;
    };
}

var _api,
_keyMap = {
    backspace: 8, tab: 9, clear: 12,
    enter: 13, 'return': 13,
    esc: 27, escape: 27, space: 32,
    left: 37, up: 38, right: 39, down: 40,
    del: 46, 'delete': 46,
    home: 36, end: 35,
    pageup: 33, pagedown: 34,
    ',': 188, '.': 190, '/': 191,
    '`': 192, '-': 189, '=': 187,
    ';': 186, '\'': 222,
    '[': 219, ']': 221, '\\': 220
},
_scope = 'all',
_modifier = {
    '⇧': 16, shift: 16,
    '⌥': 18, alt: 18, option: 18,
    '⌃': 17, ctrl: 17, control: 17,
    '⌘': 91, command: 91
},
_downKeys=[],
modifierMap = {
    16:'shiftKey',
    18:'altKey',
    17:'ctrlKey',
    91:'metaKey'
},
_mods = { 16: false, 18: false, 17: false, 91: false },

code = function(x){
    console.log();
  return _keyMap[x] || x.toUpperCase().charCodeAt(0);
},
_handlers={};

for(k=1;k<20;k++) {
    _keyMap['f'+k] = 111+k;
}


function setScope(scope){ _scope = scope || 'all';}
function getScope(){ return _scope || 'all';}

function addEvent(object, event, method) {
    if (object.addEventListener){
        object.addEventListener(event, method, false);
    }else if(object.attachEvent){
        object.attachEvent('on'+event, function(){ method(window.event); });
    }
}

function isPressed(keyCode) {
    if(typeof(keyCode) === 'string'){
        keyCode = code(keyCode);
    }
    return _downKeys.indexOf(keyCode) !==-1;
}

function getPressedKeyCodes (argument) { return _downKeys.slice(0);}

function dispatch (event) {
    var key = event.keyCode,scope,asterisk = _handlers['*'];

    if(_downKeys.indexOf(key)===-1) _downKeys.push(key);
    if(key === 93 || key === 224) key = 91;
    if(key in _mods) {
        _mods[key] = true;
        for(var k in _modifier)if(_modifier[k] === key) hotkeys[k] = true;
        if(!asterisk) return;
    }
    for(var e in _mods) _mods[e] = event[modifierMap[e]];

    if(!hotkeys.filter.call(this,event)) return;
    scope = getScope();

    if(asterisk) for (i = 0; i < asterisk.length; i++) {
        if(asterisk[i].scope === scope) eventHandler(event,asterisk[i],scope);
    }

    if (!(key in _handlers)) return;

    for (i = 0; i < _handlers[key].length; i++) {
        eventHandler(event,_handlers[key][i],scope);
    }
}

function eventHandler(event,handler,scope){
    var modifiersMatch;

    if(handler.scope === scope || handler.scope === 'all'){
        modifiersMatch = handler.mods.length > 0;
        for(var y in _mods){
            if((!_mods[y] && handler.mods.indexOf(+y) > -1) ||
                (_mods[y] && handler.mods.indexOf(+y) === -1)) modifiersMatch = false;
        }
        if((handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch || handler.shortcut === '*'){
            if(handler.method(event, handler)===false){
                if(event.preventDefault) event.preventDefault();
                else event.returnValue = false;
                if(event.stopPropagation) event.stopPropagation();
                if(event.cancelBubble) event.cancelBubble = true;
            }
        }
    }
}

function unbind (key,scope) {
    var multipleKeys = getKeys(key),keys,mods = [],obj;
    for (var i = 0; i < multipleKeys.length; i++) {

        keys =multipleKeys[i].split('+');

        if(keys.length > 1) mods=getMods(keys);

        key = keys[keys.length - 1];
        key = code(key);

        if(scope === undefined) scope = getScope();

        if (!_handlers[key]) return;

        for (var r = 0; r < _handlers[key].length; r++) {
            obj = _handlers[key][r];

            if (obj.scope === scope && compareArray(obj.mods, mods)) {
              _handlers[key][r] = {};
            }
        }
    }
}

function deleteScope(scope){
    var key, handlers, i;
    for (key in _handlers) {
        handlers = _handlers[key];
        for (i = 0; i < handlers.length; ) {
            if (handlers[i].scope === scope) handlers.splice(i, 1);
            else i++;
        }
    }
}

function compareArray(a1, a2) {
    if (a1.length !== a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

function filter(event){
    var tagName = (event.target || event.srcElement).tagName;

    return !(tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
}

function getMods (key) {
    var mods = key.slice(0, key.length - 1);
    for (var i = 0; i < mods.length; i++) mods[i] = _modifier[mods[i]];
    return mods;
}

function getKeys(key) {
    var keys;
    key = key.replace(/\s/g, '');
    keys = key.split(',');
    if ((keys[keys.length - 1]) === '') keys[keys.length - 2] += ',';
    return keys;
}

addEvent(document, 'keydown', function(event) {
    dispatch(event);
});
addEvent(document, 'keyup',function(event){
    clearModifier(event);
});

function clearModifier(event){
    var key = event.keyCode,
        i = _downKeys.indexOf(key);

    if(i>=0) _downKeys.splice(i,1);

    if(key === 93 || key === 224) key = 91;
    if(key in _mods) {
        _mods[key] = false;
        for(var k in _modifier) if(_modifier[k] === key) hotkeys[k] = false;
    }
}

function hotkeys(key,scope,method){
    var keys = getKeys(key), mods=[],i=0;

    if (method === undefined) {
        method = scope;
        scope = 'all';
    }

    for(;i < keys.length; i++){
        key = keys[i].split('+');
        mods = [];

        if (key.length > 1){
            mods = getMods(key);
            key = [key[key.length-1]];
        }

        key = key[0];
        key = key === '*' ? '*' : code(key);

        if (!(key in _handlers)) _handlers[key] = [];
        _handlers[key].push({shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods});
    }
}
_api = {
    setScope:setScope,
    getScope:getScope,
    deleteScope:deleteScope,
    getPressedKeyCodes:getPressedKeyCodes,
    isPressed:isPressed,
    filter:filter,
    unbind:unbind
};
for (var a in _api) hotkeys[a] = _api[a];

var _hotkeys = window.hotkeys
hotkeys.noConflict = function( deep ) {
    if ( deep && window.hotkeys === hotkeys ) {
        window.hotkeys = _hotkeys;
    }
    return hotkeys;
};
window.hotkeys = hotkeys;
