// util ////////////////////////////////////////////////////////////////////////////////////////////////////

function assert(name: string, ref: string, expr: any){
    var result = decode("")(x=>y=>x+y)(n=>String.fromCharCode(n(x=>x+1)(0))  )(expr);
    if(result != ref) throw new Error();
    console.log(name + ": " + result);    
}

// Test /////////////////////////////////////////////////////////////////////////////////////////////


// boolean
assert("not true",         "false",              showBoolean(     not($true)                                     ));
assert("not false",         "true",              showBoolean(     not($false)                                     ));
assert("true and true",     "true",              showBoolean(     and($true)($true)                                     ));
assert("true and false",    "false",             showBoolean(     and($true)($false)                                     ));
assert("false and true",     "false",            showBoolean(     and($false)($true)                                     ));
assert("false and false",    "false",            showBoolean(     and($false)($false)                                     ));
assert("true or true",     "true",               showBoolean(     or($true)($true)                                     ));
assert("true or false",    "true",               showBoolean(     or($true)($false)                                     ));
assert("false or true",     "true",              showBoolean(     or($false)($true)                                     ));
assert("false or false",    "false",             showBoolean(     or($false)($false)                                     ));
assert("true then true",     "true",               showBoolean(     then($true)($true)                                     ));
assert("true then false",    "false",              showBoolean(     then($true)($false)                                     ));
assert("false then true",     "true",             showBoolean(     then($false)($true)                                     ));
assert("false then false",    "true",              showBoolean(     then($false)($false)                                     ));
assert("true iff true",     "true",               showBoolean(     iff($true)($true)                                     ));
assert("true iff false",    "false",              showBoolean(     iff($true)($false)                                     ));
assert("false iff true",     "false",             showBoolean(     iff($false)($true)                                     ));
assert("false iff false",    "true",              showBoolean(     iff($false)($false)                                     ));
assert("true xor true",     "false",               showBoolean(     xor($true)($true)                                     ));
assert("true xor false",    "true",              showBoolean(     xor($true)($false)                                     ));
assert("false xor true",     "true",             showBoolean(     xor($false)($true)                                     ));
assert("false xor false",    "false",              showBoolean(     xor($false)($false)                                     ));

// tuple
assert("fst(tuple(_3)(_5))",    "3",              showNum(     fst(tuple(_3)(_5))                                     ));
assert("snd(tuple(_3)(_5))",    "5",              showNum(     snd(tuple(_3)(_5))                                     ));


assert("isZero 0",         "true",              showBoolean(     isZero(_0)                                     ));
assert("isZero 1",         "false",             showBoolean(     isZero(_1)                                     ));
assert("isZero 5",         "false",             showBoolean(     isZero(_5)                                     ));
assert("showNum 0",        "0",                 showNum(     _0                                             ));
assert("showNum 5",        "5",                 showNum(     _5                                             ));
assert("showNum 9",        "9",                 showNum(     _9                                             ));
assert("showNum 10",       ":",                 showNum(     d2(_1)(_0)                                     ));
assert("sub 7 4",          "3",                 showNum(     sub(_7)(_4)                                     ));

assert("nil",                "[]",              showList(showBoolean)(  nil                                 ));
assert("[$true]",             "[true,]",         showList(showBoolean)(  cons($true)(nil)                     ));
assert("[$true,$false]",       "[true,false,]",   showList(showBoolean)(  cons($true)(cons($false)(nil))        ));
assert("concat [] []",       "[]",              showList(showBoolean)(  concat( nil ) (nil)                 ));
assert("concat [] [false]",  "[false,]",        showList(showBoolean)(  concat( nil ) (cons($false)(nil))    ));
assert("isNlil",             "true",            showBoolean(            isNil(nil)                          ));
assert("concat [1] []",      "[1,]",            showList(showNum)(      box(_1)                             ));

assert("len []",            "0",                showNum(   len(nil)                            ));
assert("len [true]",        "1",                showNum(   len(cons($true)(nil))                ));
assert("len [true,false]",  "2",                showNum(   len(cons($false)(cons($true)(nil)))   ));
assert("add 2 3",           "5",                showNum(   add(_2)(_3)                         ));
assert("d(_2)(_3)",         "G",                showNum(   d(_2)(_3)                           ));
assert("true",              "true",             showBoolean(   $true      ));
assert("false",             "false",            showBoolean(   $false     ));

assert("nothing",           "",                 showMaybe(showNum)(  nothing    ));
assert("just(5)",           "5",                showMaybe(showNum)(  just(_5)   ));

assert("tuple 1 2",         "(1,2)",            showTuple(showNum)(showNum)(    tuple(_1)(_2)    ));
assert("left 1",            "1",                showEither(showNum)(showBoolean)(    left(_1)        ));
assert("right true",        "true",             showEither(showNum)(showBoolean)(    right($true)        ));


assert("tree",              "<1,<<2,3>,4>>",    showTree(showNum)(  branch(leaf(_1))(branch(branch(leaf(_2))(leaf(_3)))(leaf(_4)))   ));

assert("foldl",             "9",                showNum(    foldl(add)(_2)(cons(_3)(cons(_4)(nil))                          )));
assert("unfoldr",           "[9,8,7,6,5,4,3,2,1,]", showList(showNum)(   unfoldr (x=>$if(isZero(x))(_=>nothing)(_=>just(tuple(x)(pred(x))))) (_9)    ));

assert("Hello,World", "Hello,world!",
    cons(d3(_0)(_7)(_2) )( // H
    cons(d3(_1)(_0)(_1) )( // e
    cons(d3(_1)(_0)(_8) )( // l
    cons(d3(_1)(_0)(_8) )( // l
    cons(d3(_1)(_1)(_1) )( // o
    cons(d3(_0)(_4)(_4) )( // ,
    cons(d3(_1)(_1)(_9) )( // w
    cons(d3(_1)(_1)(_1) )( // o
    cons(d3(_1)(_1)(_4) )( // r
    cons(d3(_1)(_0)(_8) )( // l
    cons(d3(_1)(_0)(_0) )( // d
    cons(d3(_0)(_3)(_3) )( // !
    nil
    )))))))))))
));

var fact = f=> n => (n == 0) ? 1 : n * f (n-1);
console.log("y factorial 10: " + y(fact)(10));

console.log("Echo: ");
interactive(unit, "Hello,World");


console.log("Caesar cipher:");
interactive(x=>concat6 
    (x)                     // plain text
    (char(_0)(_3)(_2))      // " "
    (char(_0)(_6)(_1))      // "="
    (char(_0)(_6)(_2))      // ">"
    (char(_0)(_3)(_2))      // " "
    (map(succ)(x))          // encrypted text
, "Hello,World");





