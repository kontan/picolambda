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
    return function (ws) {
        return concat3(concat(xs)(ws));
    };
}
function concat5(xs) {
    return function (ks) {
        return concat4(concat(xs)(ks));
    };
}
function concat6(vs) {
    return function (xs) {
        return concat5(concat(vs)(xs));
    };
}
function concat7(xs) {
    return function (ys) {
        return concat6(concat(xs)(ys));
    };
}
function concat8(xs) {
    return function (ws) {
        return concat7(concat(xs)(ws));
    };
}
function concat9(xs) {
    return function (ks) {
        return concat8(concat(xs)(ks));
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
