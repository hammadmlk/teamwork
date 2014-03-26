//this should not exist as a separate file. 
// we have it for now to help generate a random hash
"use strict"

//should return a hash. Is returning a rand password for now.
function randomMD5Hash(){
    var pass = decimalTo26(Math.round(Math.random()*308915775))
    console.log(pass)
    return pass;
}

function decimalTo26(decimal){
    // takes a decimal and returns the base 26 representation string of length 6.
    // [input-->output],  [0 --> aaaaaa], [25 --> aaaaaz], [26 --> aaaaba], [17575 --> aaazzz]
    // 26todec(alphabetIndex*26^place). example for bzz 1*26^2 + 25*26^1 + 25*26^0
    // a is like 0. so aaaazz == zz just like 0007 == 7
    
    //print("==========");
    var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var divisor = decimal;
    var base=26; var qoutient; var remainder;
    var ans=[];
    var quotient;
    do {
        quotient = Math.floor(divisor/base);
        remainder = divisor%base;
        //console.log("q:", quotient, "d:", divisor, "r:", remainder);
        divisor = quotient;            
        ans.push(alphabets[remainder]);
    } while (quotient>0)
    
    while (ans.length<6){
        ans.push(alphabets[0]);
    }
    
    var ansx="";
    while(ans.length>0){
        ansx+=ans.pop();
    }
    //print (ansx);
    return ansx
};