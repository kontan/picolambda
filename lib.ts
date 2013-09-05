// Base ////////////////////////////////////////////////////////////

function combine<A,B,C>(f: (a: A)=>B): (g: (b: B)=>C) => (a: A) => C {
    return (g: (b: B)=>C) => (a: A) => g(f(a));
}

function Const<A,B>(a: A): (b: B) => A {
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

function y(r){
    return (f => f(f)) (f => (r (x => ((f (f)) (x) ))));
}

// Unit ////////////////////////////////////////////////////////////

interface Unit {
    <T>(t: T): T;
}

function unit<T>(t: T): T {
    return t;
}

function bottom<T,S>(t: T): S {
    return bottom(t);
}

// Tuple /////////////////////////////////////


interface Tuple<T,S> {
    <U>(h: (a: T)=>(b: S)=>U): U;    
}

function tuple<T,S,U>(x: T): (y: S) => Tuple<T,S> {
    return y => h => h(x)(y);
}

function fst<T,S>(t: Tuple<T,S>): T {
    return t($true);
}

function snd<T,S>(t: Tuple<T,S>): S {
    return t($false);
}

// Either ////////////////////////////////////

interface Either<L,R> {
    <T>(left: (l: L)=>T): (right: (r: R)=>T) => T; 
}

function left<L,R>(x: L): Either<L,R> {
    return l => r=>l(x);
}

function right<L,R>(x: R): Either<L,R> {
    return l => r=>r(x);
}

function either<L,R,T>(e: Either<L,R>): (left: (l: L)=>T) => (right: (r: R)=>T) => T {
    return left => right => e(left)(right);
}


// Boolean ////////////////////////////////////////

interface Bool {
    <T>(t: T): (f: T) => T;
}

function $true<T,S>(f: T): (t: S) => T {
    return (t: T) => f;
}
function $false<T,S>(f: T): (t: S) => S {
    return (t: T) => t;
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
function $if<T>(condition: Bool) : (_then: (u: Unit)=>T) => (_else: (u: Unit)=>T) => T {
    return _then => _else => condition(_then)(_else)(unit);
}

// Maybe ///////////////////////////////////////////////////////////////////////////////

interface Maybe<R> {
    <T>(left: ()=>T): (right: (r: R)=>T) => T; 
}

function nothing<R,T>(left: (u: Unit)=>T): (right: (r: R)=>T) => T {
    return right => left(unit);
}

function just<R>(x: R): Maybe<R> {
    return l => r =>r(x);
}

function maybe<R,T>(m: Maybe<R>): (left: (u: Unit)=>T) => (right: (r: R)=>T) => T {
    return left => right => m(left)(right);
}

// List /////////////////////////////////////////////

// List<T> = Either<Unit,Tuple<T,List<T>>>
interface List<T> {
    <T>(b: (l: Unit)=>T): (c: (r: List<T>)=>T) => T; 
}
function nil<T>(b: (l: Unit)=>T): (c: (r: List<T>)=>T) => T {
    return c=>b(unit);
}
function cons<T>(x: T): (xs: List<T>) => List<T> {
    return xs=>right(tuple(x)(xs));
}
function head<T>(xs: List<T>): T {
    return either(xs)(bottom)(r => fst(r));
}
function tail<T>(xs: List<T>): List<T> {
    return either(xs)(bottom)(r => snd(r));
}
function isNil<T>(xs: List<T>): Bool {
    return either(xs)(l=>$true)(r => $false);
}
function map<T,S>(f: (t: T)=>S): (xs: List<T>) => List<S> {
    return xs => $if(isNil(xs))((_)=>nil)((_)=>cons(f(head(xs)))(map(f)(tail(xs))));
}
function foldl<T,S>(f: (s: S) => (t: T)=>S): (s: S) => (xs: List<T>) => S {
    return s => xs => $if(isNil(xs))((_)=>s)((_)=>foldl(f)(f(s)(head(xs)))(tail(xs)));
}
function unfoldr<T,S>(f: (s: S) => Maybe<Tuple<T,S>>): (s: S) => List<T> {
    return s=>maybe(f(s))((_)=>nil)(t=>cons(fst(t))(unfoldr(f)(snd(t))));
}
function len<T>(xs: List<T>): Natural {
    return foldl(n=>_=>succ(n))(zero)(xs);
}
function concat<T>(xs: List<T>): (ys: List<T>) => List<T> {
    return ys => either(xs)(_=>ys)(c=>cons(fst(c))(concat(snd(c))(ys) ) )
}
function flatten<T>(xxs: List<List<T>>): List<T> {
    return foldl(concat)(xxs);
}
function box<T>(t : T): List<T> {
    return cons(t)(nil);
}
function concat3<T>(xs: List<T>): (ys: List<T>) =>(zs: List<T>) =>  List<T> {
    return ys => zs => concat(xs)(concat(ys)(zs));
}
function concat4<T>(xs: List<T>): (ws: List<T>) => (ys: List<T>) =>(zs: List<T>) =>  List<T> {
    return ws => ys => zs =>concat(xs)(concat3 (ws) (ys) (zs));
}
function concat5<T>(xs: List<T>): (ks: List<T>) => (ws: List<T>) => (ys: List<T>) =>(zs: List<T>) =>  List<T> {
    return ks => ws => ys => zs => concat(xs)(concat4 (ks) (ws) (ys) (zs));
}
function concat6<T>(vs: List<T>): (xs: List<T>) => (ks: List<T>) => (ws: List<T>) => (ys: List<T>) =>(zs: List<T>) =>  List<T> {
    return xs => ks => ws => ys => zs => concat(vs)( concat5 (xs) (ks) (ws) (ys) (zs) );
}



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
    return f => t => f(n(f)(t));
}

function isZero(n: Natural): Bool {
    return n(_=>$false)($true);
}

function pred(n: Natural): Natural {
    return f=>x=>n(g=>h=>h(g(f)))(u=>x)(u=>u);
}

function add(m: Natural): (n: Natural) => Natural {
    return n=>m(succ)(n);
}

function sub(m: Natural): (n: Natural) => Natural {
    return n=>n(pred)(m);
}
function mul(m: Natural): (n: Natural) => Natural {
    return n=>f=>m(n(f));
}

function pow(m: Natural): (n: Natural) => Natural {
    return n=>n(m);
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

function _256(_: Unit): Natural {
    return (n => n(n)) (n => n(n)) (f => x => f(f(x)));
}

function d(n: Natural): (m: Natural) => Natural {
    return m=>add(mul(n)(_d))(m);
}
function d2                                              (y: Natural):   (z: Natural) => Natural { return          z=>                  d(y)(z); }
function d3                              (x: Natural):   (y: Natural) => (z: Natural) => Natural { return       y=>z=>            d(d(x)(y))(z); }
function d4              (w: Natural):   (x: Natural) => (y: Natural) => (z: Natural) => Natural { return    x=>y=>z=>      d(d(d(w)(x))(y))(z); }
function d5(v: Natural): (w: Natural) => (x: Natural) => (y: Natural) => (z: Natural) => Natural { return w=>x=>y=>z=>d(d(d(d(v)(w))(x))(y))(z); }


// Text ///////////////////////////////////////////////////////////////////////////////////////

// Text = List<Natural> = Either<Unit,Tuple<Natural,List<Natural>>>
interface Str {
    (b: (l: Unit)=>Natural): (c: (r: List<Natural>)=>Natural) => Natural; 
}

function char(x: Natural): (y: Natural) => (z: Natural) => List<Natural> {
    return y => z => box(d3(x)(y)(z));
}

function showBoolean(x: Bool): Str {
    return $if(x)(Const(
            cons( d3(_1)(_1)(_6) )( // t
            cons( d3(_1)(_1)(_4) )( // r
            cons( d3(_1)(_1)(_7) )( // u
            cons( d3(_1)(_0)(_1) )( // e
            nil
            ))))
        ))(Const(
            cons( d3(_1)(_0)(_2) )( // f
            cons( d3(_0)(_9)(_7) )( // a
            cons( d3(_1)(_0)(_8) )( // l
            cons( d3(_1)(_1)(_5) )( // s
            cons( d3(_1)(_0)(_1) )( // e
            nil
            )))))
        ));
}

function showList<T>(show: (x: T)=>Str): (xs: List<T>) => Str{
    return xs => concat(
        cons( d3(_0)(_9)(_1) )(  // [
        foldl(x=>y=>concat3(x)(show(y))(
            box( d3(_0)(_4)(_4))    // ,
        ) ) (nil)(xs)

        ))(
            box( d3(_0)(_9)(_3) )  // ["]"]
        );
}

function showNum(n: Natural): Str {
    return cons( 
            n(succ)(d2(_4)(_8)) // 0
        )(nil);
}

function showMaybe<R>(showR: (r: R)=>Str): (m: Maybe<R>) => Str {
    return m => maybe(m)(()=>nil)(r=>showR(r));
}

function showTuple<F,S>(showF: (f: F)=>Str): (showS: (s: S)=>Str) => (t: Tuple<F,S>) => Str {
    return showS => t => concat5 (box(d3(_0)(_4)(_0))) (showF(fst(t))) (box(d3(_0)(_4)(_4))) (showS(snd(t))) (box(d3(_0)(_4)(_1)));
}


function showEither<L,R>(showL: (l: L)=>Str): (showR: (r: R)=>Str) => (e: Either<L,R>) => Str {
    return showR => e => either(e)(l=>showL(l))(r=>showR(r));
}


function showTree<T>(show: (x: T)=>Str): (xs: Tree<T>) => Str {
    return xs => either(xs)(b=>show(b))(r=> concat5 (box(d3(_0)(_6)(_0))) (showTree(show)(fst(r))) (box(d3(_0)(_4)(_4))) (showTree(show)(snd(r))) (box(d3(_0)(_6)(_2))) );
}

// encode/decode /////////////////////////////////////////////////////////////////////////////////////////////////////////////

function decode<S>(empty: S): (append: (s: S) => (t: S) => S) => (toNumber: (n: Natural) => S) => (y: List<Natural>) => S {
    return append => toNumber => y => foldl(append)(empty)(map(x=> toNumber(x) )(y));
}

function encode<S,N>(read: (i: N)=>Natural): (size: Natural) => List<Natural> {
    return size => unfoldr(i=>$if 
        (isZero( sub(size)(i) )) 
        (_=> nothing)
        (_=> just(tuple(   read(i)   )(succ(i))) )
    )(_0);
}