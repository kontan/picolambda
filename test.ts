// util ////////////////////////////////////////////////////////////////////////////////////////////////////

function assert(name: string, ref: string, expr: any){
    var result = decode("")(x=>y=>x+y)(n=>String.fromCharCode(n(x=>x+1)(0))  )(expr);
    if(result != ref) throw new Error();
    console.log(name + ": " + result);    
}

// Test /////////////////////////////////////////////////////////////////////////////////////////////

assert("isZero 0",         "true",              showBoolean(     isZero(_0)                                     ));
assert("isZero 1",         "false",             showBoolean(     isZero(_1)                                     ));
assert("isZero 5",         "false",             showBoolean(     isZero(_5)                                     ));
assert("showNum 0",        "0",                 showNum(     _0                                             ));
assert("showNum 5",        "5",                 showNum(     _5                                             ));
assert("showNum 9",        "9",                 showNum(     _9                                             ));
assert("showNum 10",       ":",                 showNum(     d2(_1)(_0)                                     ));
assert("sub 7 4",          "3",                 showNum(     sub(_7)(_4)                                     ));

assert("nil",                "[]",              showList(showBoolean)(  nil                                 ));
assert("[True]",             "[true,]",         showList(showBoolean)(  cons(True)(nil)                     ));
assert("[True,False]",       "[true,false,]",   showList(showBoolean)(  cons(True)(cons(False)(nil))        ));
assert("concat [] []",       "[]",              showList(showBoolean)(  concat( nil ) (nil)                 ));
assert("concat [] [false]",  "[false,]",        showList(showBoolean)(  concat( nil ) (cons(False)(nil))    ));
assert("isNlil",             "true",            showBoolean(            isNil(nil)                          ));
assert("concat [1] []",      "[1,]",            showList(showNum)(      box(_1)                             ));

assert("len []",            "0",                showNum(   len(nil)                            ));
assert("len [true]",        "1",                showNum(   len(cons(True)(nil))                ));
assert("len [true,false]",  "2",                showNum(   len(cons(False)(cons(True)(nil)))   ));
assert("add 2 3",           "5",                showNum(   add(_2)(_3)                         ));
assert("d(_2)(_3)",         "G",                showNum(   d(_2)(_3)                           ));
assert("true",              "true",             showBoolean(   True      ));
assert("false",             "false",            showBoolean(   False     ));

assert("nothing",           "",                 showMaybe(showNum)(  nothing    ));
assert("just(5)",           "5",                showMaybe(showNum)(  just(_5)   ));

assert("tuple 1 2",         "(1,2)",            showTuple(showNum)(showNum)(    tuple(_1)(_2)    ));
assert("left 1",            "1",                showEither(showNum)(showBoolean)(    left(_1)        ));
assert("right true",        "true",             showEither(showNum)(showBoolean)(    right(True)        ));


assert("tree",              "<1,<<2,3>,4>>",    showTree(showNum)(  branch(leaf(_1))(branch(branch(leaf(_2))(leaf(_3)))(leaf(_4)))   ));

assert("foldl",             "9",                showNum(    foldl(add)(_2)(cons(_3)(cons(_4)(nil))                          )));
assert("unfoldr",           "[9,8,7,6,5,4,3,2,1,]", showList(showNum)(   unfoldr (x=>If(isZero(x))(_=>nothing)(_=>just(tuple(x)(pred(x))))) (_9)    ));

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


console.log("Echo: ");
interactive(unit, "Hello,World");


console.log("Caesar cipher:");
interactive(x=>concat6 
    (x)               // plain text
    (box(d2(_3)(_2))) // " "
    (box(d2(_6)(_1))) // "="
    (box(d2(_6)(_2))) // ">"
    (box(d2(_3)(_2))) // " "
    (map(succ)(x))    // encrypted text
, "Hello,World");







interface Var<T> {
    (x: T): Var<T>;
    <S>(y: S): S; 
}

function f<T>(x: T) : Var<T> {
    return f;
}


f(10)(20)(true);

function g<T>(x: Either<T,T>) : Var<Either<T,T>> {
    return f;
}


//g(right(10))






