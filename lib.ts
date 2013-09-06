// Base ////////////////////////////////////////////////////////////

function combine<A,B,C>(f: (a: A)=>B): (g: (b: B)=>C) => (a: A) => C {
    return (g: (b: B)=>C) => (a: A) => g(f(a));
}

// Equivalents: $true
function $const<A,B>(a: A): (b: B) => A {
    return b=>a;
}

// SKI Combinator /////////////////////////////////////////////////////////////////

function I<T>(t: T): T {
    return t;
}

function K<A,B>(a: A): (b: B) => A {
    return b=>a;
}

function S<X,Y,Z>(x: (z: Z) => (y: Y) => X): (y: (z: Z)=> Y) => (z: Z) => X {
    return y => z => x(z)(y(z));
}

// y combinator //////////////////////////////////////////////////////////////////

function y(r: any): any{
    return ((f: any)=>f(f)) (f=> r (x => f(f)(x) ));
}

// Unit ////////////////////////////////////////////////////////////

interface Unit {
    <T>(t: T): T;
}

function unit<T>(t: T): T {
    return t;
}

// bottom //////////////////////////////////////////////////////////////////////

function bottom<T,S>(t: T): S {
    return bottom(t);
}

interface Sqr {
    <S>(x: Sqr): S;
}

function $sqr<S>(x: Sqr): S {
    return x(x);
}

// Tuple /////////////////////////////////////


interface Tuple<A,B> {
    <T>(h: (a: A)=>(b: B)=>T): T;    
}

function tuple<A,B,T>(a: A): (b: B) => Tuple<A,B> {
    return b=>f=>f(a)(b);
}

function fst<A,B>(t: Tuple<A,B>): A {
    return t($true);
}

function snd<A,B>(t: Tuple<A,B>): B {
    return t($false);
}

// Either ////////////////////////////////////

interface Either<A,B> {
    <T>(l: (a: A)=>T): (r: (b: B)=>T) => T; 
}

function left<L,R>(x: L): Either<L,R> {
    return l=>r=>l(x);
}

function right<L,R>(x: R): Either<L,R> {
    return l=>r=>r(x);
}

function either<L,R,T>(e: Either<L,R>): (l: (l: L)=>T) => (r: (r: R)=>T) => T {
    return e;
}


// Boolean ////////////////////////////////////////

interface Bool {
    <T>(t: T): (f: T) => T;
}

// Equivalents: const
function $true<T,S>(f: T): (t: S) => T {
    return t=>f;
}

function $false<T,S>(f: T): (t: S) => S {
    return t=>t;
}
function not(x: Bool): Bool {
    return x($false)($true);
}
function and(x: Bool): (y: Bool) => Bool {
    return y => y(x($true)($false))($false);
}
function or(x: Bool): (y: Bool) => Bool {
    return y => y($true)(x($true)($false));
}
function then(x: Bool): (y: Bool) => Bool {
    return y => or(not(x))(y);
}
function iff(x: Bool): (y: Bool) => Bool {
    return y => and(then(x)(y))(then(y)(x));
}
function xor(x: Bool): (y: Bool) => Bool {
    return y => not(iff(x)(y));
}

function $if<T>(condition: Bool) : (_then: T) => (_else: T) => T {
    return condition;
}
function unless<T>(condition: Bool) : (_then: T) => (_else: T) => T {
    return not(condition);
}
function lif<T>(condition: Bool) : (_then: (u: Unit)=>T) => (_else: (u: Unit)=>T) => T {
    return (_then: (u: Unit)=>T) => (_else: (u: Unit)=>T) => condition(_then)(_else)(unit);
}

// Maybe ///////////////////////////////////////////////////////////////////////////////

interface Maybe<R> {
    <T>(l: (u: Unit)=>T): (r: (r: R)=>T) => T; 
}

function nothing<R,T>(l: (u: Unit)=>T): (r: (r: R)=>T) => T {
    return r=>l(unit);
}

function just<R>(x: R): Maybe<R> {
    return l=>r=>r(x);
}

function maybe<R,T>(m: Maybe<R>): (l: (u: Unit)=>T) => (r: (r: R)=>T) => T {
    return (l: (u: Unit)=>T) => (r: (r: R)=>T) => m(l)(r);
}

// List /////////////////////////////////////////////

// List<T> = Maybe<Tuple<T,List<T>>>
interface List<T> {
    <T>(b: (l: Unit)=>T): (c: (r: List<T>)=>T) => T; 
}
function nil<T>(b: (l: Unit)=>T): (c: (r: List<T>)=>T) => T {
    return c => nothing(b)(c);
}
function cons<T>(x: T): (xs: List<T>) => List<T> {
    return xs=>just(tuple(x)(xs));
}
function head<T>(xs: List<T>): T {
    return maybe(xs)(bottom)(fst);
}
function tail<T>(xs: List<T>): List<T> {
    return maybe(xs)(bottom)(snd);
}
function isNil<T>(xs: List<T>): Bool {
    return maybe(xs)($const($true))($const($false));
}
function map<T,S>(f: (t: T)=>S): (xs: List<T>) => List<S> {
    return (xs: List<T>) => lif(isNil(xs))($const(nil))(_=>cons(f(head(xs)))(map(f)(tail(xs))));
}
function foldl<T,S>(f: (s: S) => (t: T)=>S): (s: S) => (xs: List<T>) => S {
    return (s: S) => (xs: List<T>) => lif(isNil(xs))($const(s))(_=>foldl(f)(f(s)(head(xs)))(tail(xs)));
}
function unfoldr<T,S>(f: (s: S) => Maybe<Tuple<T,S>>): (s: S) => List<T> {
    return (s: S) => maybe (f(s)) ($const(nil)) ((t: Tuple<T,S>)=>cons(fst(t))(unfoldr(f)(snd(t))))
}
function len<T>(xs: List<T>): Natural {
    return foldl((n: Natural)=>_=>succ(n))(zero)(xs);
}
function concat<T>(xs: List<T>): (ys: List<T>) => List<T> {
    return ys => maybe (xs) (_=>ys) ( (c: Tuple<T,List<T>>) =>cons(fst(c))(concat(snd(c))(ys) ) )
}
function flatten<T>(xxs: List<List<T>>): List<T> {
    return foldl(concat)(xxs);
}
function box<T>(t : T): List<T> {
    return cons(t)(nil);
}
function concat3<T>(xs: List<T>): typeof concat  { return ys => concat  (concat(xs)(ys)) }
function concat4<T>(xs: List<T>): typeof concat3 { return ys => concat3 (concat(xs)(ys)) }
function concat5<T>(xs: List<T>): typeof concat4 { return ys => concat4 (concat(xs)(ys)) }
function concat6<T>(xs: List<T>): typeof concat5 { return ys => concat5 (concat(xs)(ys)) }
function concat7<T>(xs: List<T>): typeof concat6 { return ys => concat6 (concat(xs)(ys)) }
function concat8<T>(xs: List<T>): typeof concat7 { return ys => concat7 (concat(xs)(ys)) }
function concat9<T>(xs: List<T>): typeof concat8 { return ys => concat8 (concat(xs)(ys)) }



// Tree ///////////////////////////////////////////////////////////////////////////////

// Tree<T> = Either<T,Tuple<Tree<T>,Tree<T>>>
interface Tree<T> {
    (left: (l: T)=>T): (right: (r: Tuple<Tree<T>,Tree<T>>)=>T) => T; 
}

function leaf<T>(x: T): Tree<T> {
    return left(x);
} 

function branch<T>(a: Tree<T>): (b: Tree<T>) => Tree<T> {
    return b => right(tuple(a)(b));
}



// Number /////////////////////////////////////////////////////////////////////////////////////////////////

interface Natural {
    <T>(f: (t: T)=>T): (t: T)=> T;
}

function zero<T>(f: (t: T)=>T): (t: T)=> T { 
    return t=>t;
} 

function succ<T>(n: Natural): Natural {
    return (f: (t: T)=>T) => (t: T) => f(n(f)(t));
}

function isZero(n: Natural): Bool {
    return n(_=>$false)($true);
}

function pred<T>(n: Natural): Natural {
    return (f: (t: T)=>T) => (x: T) => n ( g => (h: (t:T)=>T) =>h(g(f))) (u=>x) (u=>u);
}

function add(m: Natural): (n: Natural) => Natural {
    return n=>m(succ)(n);
}

function sub(m: Natural): (n: Natural) => Natural {
    return n=>n(pred)(m);
}
function mul(m: Natural): (n: Natural) => Natural {
    return n=>(f: <T>(t: T)=>T)=>m(n(f));
}

function pow(m: Natural): (n: Natural) => Natural {
    return n=>n(m);
}

function sqr(m: Natural): Natural {
    return m(m);
}

function _0<T>(f: (t: T)=>T): (t: T)=> T { return t=>                   t           ; }
function _1<T>(f: (t: T)=>T): (t: T)=> T { return t=>                 f(t)          ; }
function _2<T>(f: (t: T)=>T): (t: T)=> T { return t=>               f(f(t))         ; }
function _3<T>(f: (t: T)=>T): (t: T)=> T { return t=>             f(f(f(t)))        ; }
function _4<T>(f: (t: T)=>T): (t: T)=> T { return t=>           f(f(f(f(t))))       ; }
function _5<T>(f: (t: T)=>T): (t: T)=> T { return t=>         f(f(f(f(f(t)))))      ; }
function _6<T>(f: (t: T)=>T): (t: T)=> T { return t=>       f(f(f(f(f(f(t))))))     ; }
function _7<T>(f: (t: T)=>T): (t: T)=> T { return t=>     f(f(f(f(f(f(f(t)))))))    ; }
function _8<T>(f: (t: T)=>T): (t: T)=> T { return t=>   f(f(f(f(f(f(f(f(t))))))))   ; }
function _9<T>(f: (t: T)=>T): (t: T)=> T { return t=> f(f(f(f(f(f(f(f(f(t)))))))))  ; }
function _d<T>(f: (t: T)=>T): (t: T)=> T { return t=>f(f(f(f(f(f(f(f(f(f(t)))))))))); }

//function _256<T>(_: Unit): Natural {
//    return (n => n(n)) (n => n(n)) ((f: (t: T)=>T) => (x: T) => f(f(x)));
//}

function d(n: Natural): (m: Natural) => Natural {
    return m=>add(mul(n)(_d))(m);
}
function d2                                              (y: Natural):   (z: Natural) => Natural { return          z=>                  d(y)(z); }
function d3                              (x: Natural):   (y: Natural) => (z: Natural) => Natural { return       y=>z=>            d(d(x)(y))(z); }
function d4              (w: Natural):   (x: Natural) => (y: Natural) => (z: Natural) => Natural { return    x=>y=>z=>      d(d(d(w)(x))(y))(z); }
function d5(v: Natural): (w: Natural) => (x: Natural) => (y: Natural) => (z: Natural) => Natural { return w=>x=>y=>z=>d(d(d(d(v)(w))(x))(y))(z); }


// Text ///////////////////////////////////////////////////////////////////////////////////////

interface Char {
    <T>(f: (t: T)=>T): (t: T)=> T;
}

// Text = List<Char> = Either<Unit,Tuple<Char,List<Char>>>
interface Str {
    (b: (l: Unit)=>Char): (c: (r: List<Char>)=>Char) => Char; 
}

// Confusing function name! Hmm...
function char(x: Char): Str {
    return y => z => box(d3(x)(y)(z));
}

function showBoolean(x: Bool): Str {
    return lif(x)($const(concat4
            (char(_1)(_1)(_6)) // t
            (char(_1)(_1)(_4)) // r
            (char(_1)(_1)(_7)) // u
            (char(_1)(_0)(_1)) // e
        ))($const(concat5
            (char(_1)(_0)(_2)) // f
            (char(_0)(_9)(_7)) // a
            (char(_1)(_0)(_8)) // l
            (char(_1)(_1)(_5)) // s
            (char(_1)(_0)(_1)) // e
        ));
}

function showList<T>(show: (x: T)=>Str): (xs: List<T>) => Str{
    return xs => (concat3
        (char(_0)(_9)(_1))                                                  // [
        (foldl ((x: Str) => (y: T) => concat3(x)(show(y))(char(_0)(_4)(_4))) (nil)(xs))     // hoge,
        (char(_0)(_9)(_3))                                                 // ]
    );
}

function showNum(n: Natural): Str {
    return box(n(succ)(d2(_4)(_8))); // 0
}

function showMaybe<R>(showR: (r: R)=>Str): (m: Maybe<R>) => Str {
    return (m: Maybe<R>) => maybe(m)(_=>nil)(r=>showR(r));
}

function showTuple<F,S>(showF: (f: F)=>Str): (showS: (s: S)=>Str) => (t: Tuple<F,S>) => Str {
    return showS => (t: Tuple<F,S>) => concat5 (box(d3(_0)(_4)(_0))) (showF(fst(t))) (box(d3(_0)(_4)(_4))) (showS(snd(t))) (box(d3(_0)(_4)(_1)));
}


function showEither<L,R>(showL: (l: L)=>Str): (showR: (r: R)=>Str) => (e: Either<L,R>) => Str {
    return showR => (e: Either<L,R>) => either(e)(l=>showL(l))(r=>showR(r));
}


function showTree<T>(show: (x: T)=>Str): (xs: Tree<T>) => Str {
    return (xs: Tree<T>) => either (xs) (b=>show(b)) ((r: Tuple<T,Tree<T>>)=> concat5 (box(d3(_0)(_6)(_0))) (showTree(show)(fst(r))) (box(d3(_0)(_4)(_4))) (showTree(show)(snd(r))) (box(d3(_0)(_6)(_2))) );
}

// encode/decode /////////////////////////////////////////////////////////////////////////////////////////////////////////////

function decode<S>(empty: S): (append: (s: S) => (t: S) => S) => (reader: (n: Natural) => S) => (y: List<Natural>) => S {
    return (append: (s: S) => (t: S) => S) => (reader: (n: Natural) => S) => (y: List<Natural>) => foldl(append)(empty)(map(reader)(y));
}

function encode(read: (i: Natural)=>Natural): (size: Natural) => List<Natural> {
    return (size: Natural) => unfoldr( (i:Natural) => lif 
        (isZero( sub(size)(i) )) 
        (_=> nothing)
        (_=> just(tuple(   read(i)   )(succ(i))) )
    )(_0);
}