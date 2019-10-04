(function(root, module){

  'use strict';

  var namespace   = 'KeyMan';

  // Exposure!!
  ;((typeof exports) === "object" && (typeof module) === "object")
    ? (module.exports = factory())
    : (
      (typeof define === "function" && define.amd)
        ? define([], factory)
        : (root[namespace] = factory())
      );

})(this, function(){

  var debug = false;

  function is_supported(){
    var e = new KeyboardEvent('');
    return (
      Object.hasOwnProperty.call(e.__proto__, 'code')
      ||
      Object.hasOwnProperty.call(e.__proto__, 'key')
    );
  }

  (function(){
  })();

  // For `e.key` and `e.code` and `e.keyIdentifier`
  // String based key mappings.
  //
  // @see
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#Key_values_on_Windows_(and_char_values_of_IE)
  var CodeTranslator = {
    "digit1":         ['1'],
    "digit2":         ['2'],
    "digit3":         ['3'],
    "digit4":         ['4'],
    "digit5":         ['5'],
    "digit6":         ['6'],
    "digit7":         ['7'],
    "digit8":         ['8'],
    "digit9":         ['9'],
    "digit0":         ['0'],
    "keya":           ['a'],
    "keyb":           ['b'],
    "keyc":           ['c'],
    "keyd":           ['d'],
    "keye":           ['e'],
    "keyf":           ['f'],
    "keyg":           ['g'],
    "keyh":           ['h'],
    "keyi":           ['i'],
    "keyj":           ['j'],
    "keyk":           ['k'],
    "keyl":           ['l'],
    "keym":           ['m'],
    "keyn":           ['n'],
    "keyo":           ['o'],
    "keyp":           ['p'],
    "keyq":           ['q'],
    "keyr":           ['r'],
    "keys":           ['s'],
    "keyt":           ['t'],
    "keyu":           ['u'],
    "keyv":           ['v'],
    "keyw":           ['w'],
    "keyx":           ['x'],
    "keyy":           ['y'],
    "keyz":           ['z'],
    "comma":          [','],
    "period":         ['.'],
    "semicolon":      [';'],
    "quote":          ['\''],
    "space":          [' '],
    "bracketleft":    ['['],
    "bracketright":   [']'],
    "backquote":      ['`'],
    "backslash":      ['\\'],
    "minus":          ['-'],
    "equal":          ['='],
    "altleft":        ['alt'],
    "altright":       ['alt'],
    "capslock":       ['caps'],
    "controlleft":    ['ctrl'],
    "controlright":   ['ctrl'],
    "control":        ['ctrl'],
    "osleft":         ['meta'],
    "osright":        ['meta'],
    "shiftleft":      ['shift'],
    "shiftright":     ['shift'],
    "contextmenu":    ['menu'],
    "arrowdown":      ['down'],
    "down":           ['arrowdown'],
    "arrowleft":      ['left'],
    "left":           ['arrowleft'],
    "arrowright":     ['right'],
    "right":          ['arrowright'],
    "arrowup":        ['up'],
    "up":             ['arrowup'],
    "escape":         ['esc'],
    "slash":          ['/'],
    "numpadadd":      ['add'],
    "numpadcomma":    ['comma'],
    "numpaddecimal":  ['decimal'],
    "numpaddivide":   ['divide'],
    "numpadenter":    ['enter'],
    "numpadequal":    ['equal'],
    "numpadmultiply": ['multiply'],
    "numpadsubtract": ['subtract'],
    "tab":            ['tab'],
    "backspace":      ['backspace']
  }

  // Common translator.
  // (for convinience)
  var CommonTransator = {
    '"':          ['doublequote'],
    '\'':         ['singlequote'],
    '\\':         ['backslash'],
    '/':          ['slash'],
    ';':          ['semicolon'],
    '`':          ['backquote'],
    '.':          ['period'],
    ',':          ['comma'],
    ' ':          ['space'],
    'alt':        ['option'],
    'enter':      ['return'],
    //'+':          ['add'],
    //'-':          ['minus'],
    //'*':          ['multiply'],
  }

  // For non-printable keys.
  var KeyCodeTranslator = {
    3:   ['cancel'],
    8:   ['backspace'],
    9:   ['tab'],
    12:  ['clear'],
    13:  ['enter'],
    14:  ['entersp'],
    16:  ['shift'],
    17:  ['ctrl'],
    18:  ['alt'],
    19:  ['pause'],
    20:  ['capslock'],
    21:  ['kana'],
    22:  ['eisu'],
    23:  ['junja'],
    24:  ['final'],
    25:  ['hanja'],
    27:  ['escape'],
    28:  ['convert'],
    29:  ['nonconvert'],
    30:  ['accept'],
    31:  ['modechange'],
    33:  ['pageup'],
    34:  ['pagedown'],
    35:  ['end'],
    36:  ['home'],
    37:  ['leftarrow'],
    38:  ['uparrow'],
    39:  ['rifghtarrow'],
    40:  ['downarrow'],
    44:  ['printscreen'],
    45:  ['insert'],
    46:  ['delete'],
    91:  ['lwinkey'],
    92:  ['rwinkey'],
    93:  ['contextmenu'],
    95:  ['sleep'],
    181: ["volumemute"],
    182: ["volumedown"],
    183: ["volumeup"],
  }

  // For some browsers that cant obtain actually pushed keys.
  // ex: Safari
  var ModifiableKeys = [
    '1','2','3','4','5','6', '7', '8', '9', '0','-','=',
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    'enter', 'return', 'CR',
    'backspace', 'BS',
    'tab',
    'escape', 'ESC',
    ',', 'comma',
    '.', 'period',
    '[', ']',
    '\\', ';', '\''
  ];


  function add_common_translation(arr, str, pushing){
    var matched;

    str = str.toLowerCase();
    if(Object.hasOwnProperty.call(CommonTransator, str)){
      matched = true;
      CommonTransator[str].map(function(c){
        if(c && !in_array(arr, c)){
          arr.push(c);
        }
      });
    }

    if(matched || pushing === true){
      if(str && !in_array(arr, str)){
        arr.push(str);
      }
    }

    return arr;
  }

  function add_code(arr, code, pushing){
    code = code.toLowerCase();
    if(Object.hasOwnProperty.call(CodeTranslator, code)){
      var l = CodeTranslator[code];
      l.map(function(c){
        if(!in_array(arr, c)){
          arr = add_common_translation(arr, c, true);
        }
      });
    }

    if(pushing === true){
      if(!in_array(arr, code)){
        arr = add_common_translation(arr, code, true);
      }
    }

    return arr;
  }

  function add_keycode(arr, keycode){
    if(Object.hasOwnProperty.call(KeyCodeTranslator, keycode)){
      KeyCodeTranslator[keycode].map(function(m){
        arr = add_code(arr, m);
      });
    }
    return arr;
  }

  function in_array(arr, v){
    for(var i = 0; i < arr.length; i++){
      if(arr[i] === v){
        return true;
      }
    }
  }

  function keycode_to_chr(keycode){
    return String.fromCharCode(keycode).toLowerCase();
  }

  function arr_unique(arr){
    var ret = [];
    for(var i = 0; i < arr.length; i++){
      if(!in_array(ret, arr[i])){
        ret.push(arr[i]);
      }
    }
    return ret;
  }

  function push_unique_list(arr, n){
    var f = arr.filter(function(m){
      return (diff_concat(m, n).length === 0);
    });

    if(f.length === 0){
      arr.push(n);
    }

    return arr;
  }

  function remove_nonprintable(str){
    return str.trim().replace(/[^\x20-\x7E]+/g, '');
  }

  // make_combination :: KeyboardEvent -> Array
  //
  function make_combination(e){
    var chr;
    var combination  = [];
    var pushed = [];    // Storing actually pushed keys. (If available)
    var sents  = [];    // Storing sent charcters.
    var modifier = [];

    ['metaKey', 'shiftKey', 'ctrlKey', 'altKey'].map(function(k){
      var p = (e[k] && e[k] === true);
      // for f**king iOS inputs
      if(!p && e.type === 'keypress' && k === 'shiftKey'){
        var s = String.fromCharCode(e.which);
        // Treats upper case char as Shift + lower one.
        p = (s === s.toUpperCase() && s !== s.toLowerCase());
      }
      if(p){
        var n = k.replace('Key', '');
        // Remove dup entry, and move to pushed list.
        modifier.push(n);
      }
    });

    // e.code <- Old string-based key identifier. code translation only.
    if(e.code){
      pushed = add_code(pushed, e.code);
      pushed = add_common_translation(pushed, e.code, false);
    }

    // e.key <- Nice :)
    if(e.key){
      sents = add_code(sents, e.key, true);
      sents = add_common_translation(sents, e.key, true);
    }

    // e.keyCode and e.charCode
    // Both Deprecated? Really?
    if(e.keyCode > 0){
      if(e.charCode > 0){
        if(e.keyCode === e.charCode){
          chr = keycode_to_chr(e.keyCode);
          sents = add_common_translation(sents, chr, true);
        }
      }else{
        pushed = add_keycode(pushed, e.keyCode);
      }
    }

    // Deprecated. (but reliable for Webkit now 2016-02-04)
    // Its easy to obtain 
    if(e.keyIdentifier){
      if(e.keyIdentifier.match(/U\+/)){
        var id = e.keyIdentifier.replace('U+', '');
        chr = remove_nonprintable(hexdecode(id));
        if(chr && chr.length > 0){
          sents = add_common_translation(sents, chr, true);
        }
      }else{
        sents = add_code(sents, e.keyIdentifier, true);
      }
    }

    // Last Hope
    if(pushed.length === 0 && sents.length === 0){
      sents = add_common_translation(sents, keycode_to_chr(e.keyCode), true);
    }

    if(debug){
      console.log('-------------------------------------');
      console.log(e);
      console.log('PUSHED: ', pushed);
      console.log('MOD:    ', modifier);
      console.log('SENT:   ', sents);
    }

    // Make combinations
    if(pushed.length > 0){
      pushed.map(function(p){
        push_unique_list(combination, arr_unique([p].concat(modifier.filter(function(m){
          return (!in_array(pushed, m));
        }))));
      });
    }

    if(sents.length > 0){
      sents.map(function(n){
        // Check letter or not.
        // For some browsers which cant get actually pushed key.
        if(pushed.length === 0 && ModifiableKeys.indexOf(n) > -1){
          if(!in_array(modifier, n) && !in_array(pushed, n)){
            push_unique_list(combination, [n].concat(modifier));
          }
        }else{
          if(!in_array(modifier, n) && !in_array(pushed, n)){
            push_unique_list(combination, [n]);
          }
        }
      });
    }

    return combination;
  }


  function hexdecode(hex){
    var j;
    var hexes = hex.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++){
      back += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return back;
  }


  function diff_concat(arr1, arr2){
    return arr1.filter(function(v){
      return !in_array(arr2, v);
    }).concat(arr2.filter(function(v){
      return !in_array(arr1, v);
    }));
  }


  function match(e, keys){
    var pushed, matched;

    pushed  = make_combination(e);
    keys    = keys.map(function(v){ return v.toLowerCase(); });

    matched = pushed.filter(function(p){
      return diff_concat(p, keys).length === 0;
    });

    return (matched.length > 0)
           ? {pushed: pushed, matched: matched}
           : false;
  }


  function is_f(c){
    return (typeof(c) === 'function');
  }


  function is_a(a){
    return a.constructor === Array;
  }


  function make_mapping(keys, callback){

    var maps =[];

    keys = (is_a(keys) ? keys : [keys]);

    var grp = keys.filter(function(k){
      return is_a(k);
    });

    var knm = keys.filter(function(k){
      return !is_a(k);
    });

    if(grp.length > 0){
      grp.map(function(ks){
        ks.map(function(k){
          maps.push([k].concat(knm));
        });
      });
    }else{
      maps.push(knm);
    }

    return maps.map(function(m){
      return {
        keys: m,
        action: callback
      }
    });
  }

  if(!is_supported()){
    console.error('This browser does not support both of KeyboardEvent.code and KeyboardEvent.key. Some key combinations with modifier can not be detected.');
  }


  return function Module(o){

    if(o.debug){
      debug = true;
    }

    var self = this;
    var bound = [];

    self.map = function(){
      if(arguments[0] instanceof KeyboardEvent){
        var e = arguments[0];
        return function(keys, callback){
          make_mapping(keys, callback).map(function(b){
            self.match(e, b);
          });
        }
      }else{
        return self.bind([{
          keys:   arguments[0],
          action: arguments[1]
        }]);
      }
    }

    self.bind = function(binds){
      if(!is_a(binds)){
        binds = [binds];
      }

      binds.map(function(b){
        make_mapping(b.keys, b.action).map(function(bm){
          bound.push(bm);
        });
      });

      return self;
    }

    self.match = function(e, b){
      var matched = match(e, b.keys);
      if(matched && b.action && is_f(b.action)){
        b.action(matched, e);
      }
    }

    self.listen = function(e){
      bound.map(function(b){
        self.match(e, b);
      });

      return function(callback){
        (is_f(callback)) && callback(make_combination(e), e);
      }
    }

    self.is_supported = function(){
      return is_supported();
    }
  }


});
