// Base ////////////////////////////////////////////////////////////
function combine(f) {
    return function (g) {
        return function (a) {
            return g(f(a));
        };
    };
}

function Const(a) {
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

function unit(t) {
    return t;
}

function bottom(t) {
    return bottom(t);
}

function tuple(f) {
    return function (s) {
        return function (t) {
            return t(f)(s);
        };
    };
}

function fst(t) {
    return t(function (f) {
        return function (s) {
            return f;
        };
    });
}

function snd(t) {
    return t(function (f) {
        return function (s) {
            return s;
        };
    });
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
    return function (left) {
        return function (right) {
            return e(left)(right);
        };
    };
}

function True(f) {
    return function (t) {
        return f;
    };
}
function False(f) {
    return function (t) {
        return t;
    };
}
function not(x) {
    return x(True)(False);
}
function and(x) {
    return function (y) {
        return y(x(True)(False))(False);
    };
}
function or(x) {
    return function (y) {
        return y(True)(x(True)(False));
    };
}
function If(condition) {
    return function (_then) {
        return function (_else) {
            return condition(_then)(_else)(unit);
        };
    };
}

function nothing(left) {
    return function (right) {
        return left(unit);
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
    return function (left) {
        return function (right) {
            return m(left)(right);
        };
    };
}

function nil(b) {
    return function (c) {
        return b(unit);
    };
}
function cons(x) {
    return function (xs) {
        return right(tuple(x)(xs));
    };
}
function head(xs) {
    return either(xs)(bottom)(function (r) {
        return fst(r);
    });
}
function tail(xs) {
    return either(xs)(bottom)(function (r) {
        return snd(r);
    });
}
function isNil(xs) {
    return either(xs)(function (l) {
        return True;
    })(function (r) {
        return False;
    });
}
function map(f) {
    return function (xs) {
        return If(isNil(xs))(function (_) {
            return nil;
        })(function (_) {
            return cons(f(head(xs)))(map(f)(tail(xs)));
        });
    };
}
function foldl(f) {
    return function (s) {
        return function (xs) {
            return If(isNil(xs))(function (_) {
                return s;
            })(function (_) {
                return foldl(f)(f(s)(head(xs)))(tail(xs));
            });
        };
    };
}
function unfoldr(f) {
    return function (s) {
        return maybe(f(s))(function (_) {
            return nil;
        })(function (t) {
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
        return either(xs)(function (_) {
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
        return function (zs) {
            return concat(xs)(concat(ys)(zs));
        };
    };
}
function concat4(xs) {
    return function (ws) {
        return function (ys) {
            return function (zs) {
                return concat(xs)(concat3(ws)(ys)(zs));
            };
        };
    };
}
function concat5(xs) {
    return function (ks) {
        return function (ws) {
            return function (ys) {
                return function (zs) {
                    return concat(xs)(concat4(ks)(ws)(ys)(zs));
                };
            };
        };
    };
}
function concat6(vs) {
    return function (xs) {
        return function (ks) {
            return function (ws) {
                return function (ys) {
                    return function (zs) {
                        return concat(vs)(concat5(xs)(ks)(ws)(ys)(zs));
                    };
                };
            };
        };
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
        return False;
    })(True);
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

function _256(_) {
    return (function (n) {
        return n(n);
    })(function (n) {
        return n(n);
    })(function (f) {
        return function (x) {
            return f(f(x));
        };
    });
}

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

function showBoolean(x) {
    return If(x)(Const(cons(d3(_1)(_1)(_6))(cons(d3(_1)(_1)(_4))(cons(d3(_1)(_1)(_7))(cons(d3(_1)(_0)(_1))(nil))))))(Const(cons(d3(_1)(_0)(_2))(cons(d3(_0)(_9)(_7))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_1)(_5))(cons(d3(_1)(_0)(_1))(nil)))))));
}

function showList(show) {
    return function (xs) {
        return concat(cons(d3(_0)(_9)(_1))(foldl(function (x) {
            return function (y) {
                return concat3(x)(show(y))(box(d3(_0)(_4)(_4)));
            };
        })(nil)(xs)))(box(d3(_0)(_9)(_3)));
    };
}

function showNum(n) {
    return cons(n(succ)(d2(_4)(_8)))(nil);
}

function showMaybe(showR) {
    return function (m) {
        return maybe(m)(function () {
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
        return function (toNumber) {
            return function (y) {
                return foldl(append)(empty)(map(function (x) {
                    return toNumber(x);
                })(y));
            };
        };
    };
}

function encode(read) {
    return function (size) {
        return unfoldr(function (i) {
            return If(isZero(sub(size)(i)))(function (_) {
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
assert("isZero 0", "true", showBoolean(isZero(_0)));
assert("isZero 1", "false", showBoolean(isZero(_1)));
assert("isZero 5", "false", showBoolean(isZero(_5)));
assert("showNum 0", "0", showNum(_0));
assert("showNum 5", "5", showNum(_5));
assert("showNum 9", "9", showNum(_9));
assert("showNum 10", ":", showNum(d2(_1)(_0)));
assert("sub 7 4", "3", showNum(sub(_7)(_4)));

assert("nil", "[]", showList(showBoolean)(nil));
assert("[True]", "[true,]", showList(showBoolean)(cons(True)(nil)));
assert("[True,False]", "[true,false,]", showList(showBoolean)(cons(True)(cons(False)(nil))));
assert("concat [] []", "[]", showList(showBoolean)(concat(nil)(nil)));
assert("concat [] [false]", "[false,]", showList(showBoolean)(concat(nil)(cons(False)(nil))));
assert("isNlil", "true", showBoolean(isNil(nil)));
assert("concat [1] []", "[1,]", showList(showNum)(box(_1)));

assert("len []", "0", showNum(len(nil)));
assert("len [true]", "1", showNum(len(cons(True)(nil))));
assert("len [true,false]", "2", showNum(len(cons(False)(cons(True)(nil)))));
assert("add 2 3", "5", showNum(add(_2)(_3)));
assert("d(_2)(_3)", "G", showNum(d(_2)(_3)));
assert("true", "true", showBoolean(True));
assert("false", "false", showBoolean(False));

assert("nothing", "", showMaybe(showNum)(nothing));
assert("just(5)", "5", showMaybe(showNum)(just(_5)));

assert("tuple 1 2", "(1,2)", showTuple(showNum)(showNum)(tuple(_1)(_2)));
assert("left 1", "1", showEither(showNum)(showBoolean)(left(_1)));
assert("right true", "true", showEither(showNum)(showBoolean)(right(True)));

assert("tree", "<1,<<2,3>,4>>", showTree(showNum)(branch(leaf(_1))(branch(branch(leaf(_2))(leaf(_3)))(leaf(_4)))));

assert("foldl", "9", showNum(foldl(add)(_2)(cons(_3)(cons(_4)(nil)))));
assert("unfoldr", "[9,8,7,6,5,4,3,2,1,]", showList(showNum)(unfoldr(function (x) {
    return If(isZero(x))(function (_) {
        return nothing;
    })(function (_) {
        return just(tuple(x)(pred(x)));
    });
})(_9)));

assert("Hello,World", "Hello,world!", cons(d3(_0)(_7)(_2))(cons(d3(_1)(_0)(_1))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_1)(_1))(cons(d3(_0)(_4)(_4))(cons(d3(_1)(_1)(_9))(cons(d3(_1)(_1)(_1))(cons(d3(_1)(_1)(_4))(cons(d3(_1)(_0)(_8))(cons(d3(_1)(_0)(_0))(cons(d3(_0)(_3)(_3))(nil)))))))))))));

console.log("Echo: ");
interactive(unit, "Hello,World");

console.log("Caesar cipher:");
interactive(function (x) {
    return concat6(x)(box(d2(_3)(_2)))(box(d2(_6)(_1)))(box(d2(_6)(_2)))(box(d2(_3)(_2)))(map(succ)(x));
}, "Hello,World");

function f(x) {
    return f;
}

f(10)(20)(true);

function g(x) {
    return f;
}
