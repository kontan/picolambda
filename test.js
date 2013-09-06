// Base ////////////////////////////////////////////////////////////
function combine(f) {
    return function (g) {
        return function (a) {
            return g(f(a));
        };
    };
}

// Equivalents: $true
function $const(a) {
    return function (b) {
        return a;
    };
}

// SKI Combinator /////////////////////////////////////////////////////////////////
function I(t) {
    return t;
}

function K(a) {
    return function (b) {
        return a;
    };
}

function S(x) {
    return function (y) {
        return function (z) {
            return x(z)(y(z));
        };
    };
}

// y combinator //////////////////////////////////////////////////////////////////
function y(r) {
    return (function (f) {
        return f(f);
    })(function (f) {
        return r(function (x) {
            return f(f)(x);
        });
    });
}

function unit(t) {
    return t;
}

// bottom //////////////////////////////////////////////////////////////////////
function bottom(t) {
    return bottom(t);
}

function $sqr(x) {
    return x(x);
}

function tuple(a) {
    return function (b) {
        return function (f) {
            return f(a)(b);
        };
    };
}

function fst(t) {
    return t($true);
}

function snd(t) {
    return t($false);
}

function left(x) {
    return function (l) {
        return function (r) {
            return l(x);
        };
    };
}

function right(x) {
    return function (l) {
        return function (r) {
            return r(x);
        };
    };
}

function either(e) {
    return e;
}

// Equivalents: const
function $true(f) {
    return function (t) {
        return f;
    };
}

function $false(f) {
    return function (t) {
        return t;
    };
}
function not(x) {
    return x($false)($true);
}
function and(x) {
    return function (y) {
        return y(x($true)($false))($false);
    };
}
function or(x) {
    return function (y) {
        return y($true)(x($true)($false));
    };
}
function then(x) {
    return function (y) {
        return or(not(x))(y);
    };
}
function iff(x) {
    return function (y) {
        return and(then(x)(y))(then(y)(x));
    };
}
function xor(x) {
    return function (y) {
        return not(iff(x)(y));
    };
}

function $if(condition) {
    return condition;
}
function unless(condition) {
    return not(condition);
}
function lif(condition) {
    return function (_then) {
        return function (_else) {
            return condition(_then)(_else)(unit);
        };
    };
}

function nothing(l) {
    return function (r) {
        return l(unit);
    };
}

function just(x) {
    return function (l) {
        return function (r) {
            return r(x);
        };
    };
}

function maybe(m) {
    return function (l) {
        return function (r) {
            return m(l)(r);
        };
    };
}

function nil(b) {
    return function (c) {
        return nothing(b)(c);
    };
}
function cons(x) {
    return function (xs) {
        return just(tuple(x)(xs));
    };
}
function head(xs) {
    return maybe(xs)(bottom)(fst);
}
function tail(xs) {
    return maybe(xs)(bottom)(snd);
}
function isNil(xs) {
    return maybe(xs)($const($true))($const($false));
}
function map(f) {
    return function (xs) {
        return lif(isNil(xs))($const(nil))(function (_) {
            return cons(f(head(xs)))(map(f)(tail(xs)));
        });
    };
}
function foldl(f) {
    return function (s) {
        return function (xs) {
            return lif(isNil(xs))($const(s))(function (_) {
                return foldl(f)(f(s)(head(xs)))(tail(xs));
            });
        };
    };
}
function unfoldr(f) {
    return function (s) {
        return maybe(f(s))($const(nil))(function (t) {
            return cons(fst(t))(unfoldr(f)(snd(t)));
        });
    };
}
function len(xs) {
    return foldl(function (n) {
        return function (_) {
            return succ(n);
        };
    })(zero)(xs);
}
function concat(xs) {
    return function (ys) {
        return maybe(xs)(function (_) {
            return ys;
        })(function (c) {
            return cons(fst(c))(concat(snd(c))(ys));
        });
    };
}
function flatten(xxs) {
    return foldl(concat)(xxs);
}
function box(t) {
    return cons(t)(nil);
}
function concat3(xs) {
    return function (ys) {
        return concat(concat(xs)(ys));
    };
}
function concat4(xs) {
    return function (ys) {
        return concat3(concat(xs)(ys));
    };
}
function concat5(xs) {
    return function (ys) {
        return concat4(concat(xs)(ys));
    };
}
function concat6(xs) {
    return function (ys) {
        return concat5(concat(xs)(ys));
    };
}
function concat7(xs) {
    return function (ys) {
        return concat6(concat(xs)(ys));
    };
}
function concat8(xs) {
    return function (ys) {
        return concat7(concat(xs)(ys));
    };
}
function concat9(xs) {
    return function (ys) {
        return concat8(concat(xs)(ys));
    };
}

function leaf(x) {
    return left(x);
}

function branch(a) {
    return function (b) {
        return right(tuple(a)(b));
    };
}

function zero(f) {
    return function (t) {
        return t;
    };
}

function succ(n) {
    return function (f) {
        return function (t) {
            return f(n(f)(t));
        };
    };
}

function isZero(n) {
    return n(function (_) {
        return $false;
    })($true);
}

function pred(n) {
    return function (f) {
        return function (x) {
            return n(function (g) {
                return function (h) {
                    return h(g(f));
                };
            })(function (u) {
                return x;
            })(function (u) {
                return u;
            });
        };
    };
}

function add(m) {
    return function (n) {
        return m(succ)(n);
    };
}

function sub(m) {
    return function (n) {
        return n(pred)(m);
    };
}
function mul(m) {
    return function (n) {
        return function (f) {
            return m(n(f));
        };
    };
}

function pow(m) {
    return function (n) {
        return n(m);
    };
}

function sqr(m) {
    return m(m);
}

function _0(f) {
    return function (t) {
        return t;
    };
}
function _1(f) {
    return function (t) {
        return f(t);
    };
}
function _2(f) {
    return function (t) {
        return f(f(t));
    };
}
function _3(f) {
    return function (t) {
        return f(f(f(t)));
    };
}
function _4(f) {
    return function (t) {
        return f(f(f(f(t))));
    };
}
function _5(f) {
    return function (t) {
        return f(f(f(f(f(t)))));
    };
}
function _6(f) {
    return function (t) {
        return f(f(f(f(f(f(t))))));
    };
}
function _7(f) {
    return function (t) {
        return f(f(f(f(f(f(f(t)))))));
    };
}
function _8(f) {
    return function (t) {
        return f(f(f(f(f(f(f(f(t))))))));
    };
}
function _9(f) {
    return function (t) {
        return f(f(f(f(f(f(f(f(f(t)))))))));
    };
}
function _d(f) {
    return function (t) {
        return f(f(f(f(f(f(f(f(f(f(t))))))))));
    };
}

//function _256<T>(_: Unit): Natural {
//    return (n => n(n)) (n => n(n)) ((f: (t: T)=>T) => (x: T) => f(f(x)));
//}
function d(n) {
    return function (m) {
        return add(mul(n)(_d))(m);
    };
}
function d2(y) {
    return function (z) {
        return d(y)(z);
    };
}
function d3(x) {
    return function (y) {
        return function (z) {
            return d(d(x)(y))(z);
        };
    };
}
function d4(w) {
    return function (x) {
        return function (y) {
            return function (z) {
                return d(d(d(w)(x))(y))(z);
            };
        };
    };
}
function d5(v) {
    return function (w) {
        return function (x) {
            return function (y) {
                return function (z) {
                    return d(d(d(d(v)(w))(x))(y))(z);
                };
            };
        };
    };
}

// Confusing function name! Hmm...
function char(x) {
    return function (y) {
        return function (z) {
            return box(d3(x)(y)(z));
        };
    };
}

function showBoolean(x) {
    return lif(x)($const(concat4(char(_1)(_1)(_6))(char(_1)(_1)(_4))(char(_1)(_1)(_7))(char(_1)(_0)(_1))))($const(concat5(char(_1)(_0)(_2))(char(_0)(_9)(_7))(char(_1)(_0)(_8))(char(_1)(_1)(_5))(char(_1)(_0)(_1))));
}

function showList(show) {
    return function (xs) {
        return (concat3(char(_0)(_9)(_1))(foldl(function (x) {
            return function (y) {
                return concat3(x)(show(y))(char(_0)(_4)(_4));
            };
        })(nil)(xs))(char(_0)(_9)(_3)));
    };
}

function showNum(n) {
    return box(n(succ)(d2(_4)(_8)));
}

function showMaybe(showR) {
    return function (m) {
        return maybe(m)(function (_) {
            return nil;
        })(function (r) {
            return showR(r);
        });
    };
}

function showTuple(showF) {
    return function (showS) {
        return function (t) {
            return concat5(box(d3(_0)(_4)(_0)))(showF(fst(t)))(box(d3(_0)(_4)(_4)))(showS(snd(t)))(box(d3(_0)(_4)(_1)));
        };
    };
}

function showEither(showL) {
    return function (showR) {
        return function (e) {
            return either(e)(function (l) {
                return showL(l);
            })(function (r) {
                return showR(r);
            });
        };
    };
}

function showTree(show) {
    return function (xs) {
        return either(xs)(function (b) {
            return show(b);
        })(function (r) {
            return concat5(box(d3(_0)(_6)(_0)))(showTree(show)(fst(r)))(box(d3(_0)(_4)(_4)))(showTree(show)(snd(r)))(box(d3(_0)(_6)(_2)));
        });
    };
}

// encode/decode /////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decode(empty) {
    return function (append) {
        return function (reader) {
            return function (y) {
                return foldl(append)(empty)(map(reader)(y));
            };
        };
    };
}

function encode(read) {
    return function (size) {
        return unfoldr(function (i) {
            return lif(isZero(sub(size)(i)))(function (_) {
                return nothing;
            })(function (_) {
                return just(tuple(read(i))(succ(i)));
            });
        })(_0);
    };
}
function interactive(f, x) {
    function church(n) {
        return function (f) {
            return function (x) {
                return n ? church(n - 1)(f)(f(x)) : x;
            };
        };
    }
    function unchurch(n) {
        return n(function (x) {
            return x + 1;
        })(0);
    }
    console.log(decode("")(function (x) {
        return function (y) {
            return x + y;
        };
    })(function (n) {
        return String.fromCharCode(unchurch(n));
    })(f(encode(function (i) {
        return church(x.charCodeAt(unchurch(i)));
    })(church(x.length)))));
}
var tests;
(function (tests) {
    // util ////////////////////////////////////////////////////////////////////////////////////////////////////
    function assert(name, ref, expr) {
        var result = decode("")(function (x) {
            return function (y) {
                return x + y;
            };
        })(function (n) {
            return String.fromCharCode(n(function (x) {
                return x + 1;
            })(0));
        })(expr);
        if (result != ref)
            throw new Error();
        console.log(name + ": " + result);
    }

    // Test /////////////////////////////////////////////////////////////////////////////////////////////
    // boolean
    assert("not true", "false", showBoolean(not($true)));
    assert("not false", "true", showBoolean(not($false)));
    assert("true and true", "true", showBoolean(and($true)($true)));
    assert("true and false", "false", showBoolean(and($true)($false)));
    assert("false and true", "false", showBoolean(and($false)($true)));
    assert("false and false", "false", showBoolean(and($false)($false)));
    assert("true or true", "true", showBoolean(or($true)($true)));
    assert("true or false", "true", showBoolean(or($true)($false)));
    assert("false or true", "true", showBoolean(or($false)($true)));
    assert("false or false", "false", showBoolean(or($false)($false)));
    assert("true then true", "true", showBoolean(then($true)($true)));
    assert("true then false", "false", showBoolean(then($true)($false)));
    assert("false then true", "true", showBoolean(then($false)($true)));
    assert("false then false", "true", showBoolean(then($false)($false)));
    assert("true iff true", "true", showBoolean(iff($true)($true)));
    assert("true iff false", "false", showBoolean(iff($true)($false)));
    assert("false iff true", "false", showBoolean(iff($false)($true)));
    assert("false iff false", "true", showBoolean(iff($false)($false)));
    assert("true xor true", "false", showBoolean(xor($true)($true)));
    assert("true xor false", "true", showBoolean(xor($true)($false)));
    assert("false xor true", "true", showBoolean(xor($false)($true)));
    assert("false xor false", "false", showBoolean(xor($false)($false)));

    // tuple
    assert("fst(tuple(_3)(_5))", "3", showNum(fst(tuple(_3)(_5))));
    assert("snd(tuple(_3)(_5))", "5", showNum(snd(tuple(_3)(_5))));

    assert("isZero 0", "true", showBoolean(isZero(_0)));
    assert("isZero 1", "false", showBoolean(isZero(_1)));
    assert("isZero 5", "false", showBoolean(isZero(_5)));
    assert("showNum 0", "0", showNum(_0));
    assert("showNum 5", "5", showNum(_5));
    assert("showNum 9", "9", showNum(_9));
    assert("showNum 10", ":", showNum(d2(_1)(_0)));
    assert("sub 7 4", "3", showNum(sub(_7)(_4)));

    assert("nil", "[]", showList(showBoolean)(nil));
    assert("[$true]", "[true,]", showList(showBoolean)(cons($true)(nil)));
    assert("[$true,$false]", "[true,false,]", showList(showBoolean)(cons($true)(cons($false)(nil))));
    assert("concat [] []", "[]", showList(showBoolean)(concat(nil)(nil)));
    assert("concat [] [false]", "[false,]", showList(showBoolean)(concat(nil)(cons($false)(nil))));
    assert("isNlil", "true", showBoolean(isNil(nil)));
    assert("concat [1] []", "[1,]", showList(showNum)(box(_1)));

    assert("len []", "0", showNum(len(nil)));
    assert("len [true]", "1", showNum(len(cons($true)(nil))));
    assert("len [true,false]", "2", showNum(len(cons($false)(cons($true)(nil)))));
    assert("add 2 3", "5", showNum(add(_2)(_3)));
    assert("d(_2)(_3)", "G", showNum(d(_2)(_3)));
    assert("true", "true", showBoolean($true));
    assert("false", "false", showBoolean($false));

    assert("nothing", "", showMaybe(showNum)(nothing));
    assert("just(5)", "5", showMaybe(showNum)(just(_5)));

    assert("tuple 1 2", "(1,2)", showTuple(showNum)(showNum)(tuple(_1)(_2)));
    assert("left 1", "1", showEither(showNum)(showBoolean)(left(_1)));
    assert("right true", "true", showEither(showNum)(showBoolean)(right($true)));

    assert("tree", "<1,<<2,3>,4>>", showTree(showNum)(branch(leaf(_1))(branch(branch(leaf(_2))(leaf(_3)))(leaf(_4)))));

    assert("foldl", "9", showNum(foldl(add)(_2)(cons(_3)(cons(_4)(nil)))));
    assert("unfoldr", "[9,8,7,6,5,4,3,2,1,]", showList(showNum)(unfoldr(function (x) {
        return lif(isZero(x))(function (_) {
            return nothing;
        })(function (_) {
            return just(tuple(x)(pred(x)));
        });
    })(_9)));

    assert("Hello,World", "Hello,world!", cons(d3(_0)(_7)(_2))(cons(d3(_1)(_0)(_1))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_1)(_1))(cons(d3(_0)(_4)(_4))(cons(d3(_1)(_1)(_9))(cons(d3(_1)(_1)(_1))(cons(d3(_1)(_1)(_4))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_0)(_0))(cons(d3(_0)(_3)(_3))(nil)))))))))))));

    var fact = function (f) {
        return function (n) {
            return (n == 0) ? 1 : n * f(n - 1);
        };
    };
    console.log("y factorial 10: " + y(fact)(10));

    console.log("Echo: ");
    interactive(unit, "Hello,World");

    console.log("Caesar cipher:");
    interactive(function (x) {
        return concat6(x)(char(_0)(_3)(_2))(char(_0)(_6)(_1))(char(_0)(_6)(_2))(char(_0)(_3)(_2))(map(succ)(x));
    }, "Hello,World");

    function user(name) {
        return function (age) {
            return tuple(name)(age);
        };
    }
    function name(u) {
        return fst(u);
    }
    function age(u) {
        return snd(u);
    }
    var yuzuko = user("Yuzuko")(16);
    var yukari = user("Yukari")(16);
    console.log(name(yuzuko));
    console.log(age(yukari));
})(tests || (tests = {}));
