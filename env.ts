


function interactive(f: (s: Str)=>Str, x: string): void {
    function church<T>(n: number): Natural {
        return (f: (s: T)=>T) => (x: T) => n ? church (n-1) (f) (f(x)) : x;
    }
    function unchurch(n: Natural): number {
        return n(x=>x+1)(0);
    }
    console.log(
            decode ("") (x=>y=>x+y) (n=>String.fromCharCode(unchurch(n)))
        (f(   
            encode ((i:Natural) => church(x.charCodeAt(unchurch(i)))) (church(x.length))
        ))
    );
}
