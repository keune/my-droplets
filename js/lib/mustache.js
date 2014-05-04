/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
(function(b,a){if(typeof exports==="object"&&exports){a(exports)}else{if(typeof define==="function"&&define.amd){define(a({}))}else{b.Mustache=a({})}}}(this,function(a){var u=Object.prototype.toString;var k=Array.isArray||function(x){return u.call(x)==="[object Array]"};function b(x){return typeof x==="function"}function e(x){return x.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var g=RegExp.prototype.test;function q(y,x){return g.call(y,x)}var j=/\S/;function h(x){return !q(j,x)}var d={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function m(x){return String(x).replace(/[&<>"'\/]/g,function(y){return d[y]})}var f=/\s*/;var l=/\s+/;var t=/\s*=/;var n=/\s*\}/;var r=/#|\^|\/|>|\{|&|=|!/;function w(Q,F){if(!Q){return[]}var H=[];var G=[];var C=[];var R=false;var O=false;function N(){if(R&&!O){while(C.length){delete G[C.pop()]}}else{C=[]}R=false;O=false}var J,E,P;function D(S){if(typeof S==="string"){S=S.split(l,2)}if(!k(S)||S.length!==2){throw new Error("Invalid tags: "+S)}J=new RegExp(e(S[0])+"\\s*");E=new RegExp("\\s*"+e(S[1]));P=new RegExp("\\s*"+e("}"+S[1]))}D(F||a.tags);var z=new s(Q);var A,y,I,L,B,x;while(!z.eos()){A=z.pos;I=z.scanUntil(J);if(I){for(var M=0,K=I.length;M<K;++M){L=I.charAt(M);if(h(L)){C.push(G.length)}else{O=true}G.push(["text",L,A,A+1]);A+=1;if(L==="\n"){N()}}}if(!z.scan(J)){break}R=true;y=z.scan(r)||"name";z.scan(f);if(y==="="){I=z.scanUntil(t);z.scan(t);z.scanUntil(E)}else{if(y==="{"){I=z.scanUntil(P);z.scan(n);z.scanUntil(E);y="&"}else{I=z.scanUntil(E)}}if(!z.scan(E)){throw new Error("Unclosed tag at "+z.pos)}B=[y,I,A,z.pos];G.push(B);if(y==="#"||y==="^"){H.push(B)}else{if(y==="/"){x=H.pop();if(!x){throw new Error('Unopened section "'+I+'" at '+A)}if(x[1]!==I){throw new Error('Unclosed section "'+x[1]+'" at '+A)}}else{if(y==="name"||y==="{"||y==="&"){O=true}else{if(y==="="){D(I)}}}}}x=H.pop();if(x){throw new Error('Unclosed section "'+x[1]+'" at '+z.pos)}return v(c(G))}function c(C){var y=[];var A,x;for(var z=0,B=C.length;z<B;++z){A=C[z];if(A){if(A[0]==="text"&&x&&x[0]==="text"){x[1]+=A[1];x[3]=A[3]}else{y.push(A);x=A}}}return y}function v(C){var E=[];var B=E;var D=[];var y,A;for(var x=0,z=C.length;x<z;++x){y=C[x];switch(y[0]){case"#":case"^":B.push(y);D.push(y);B=y[4]=[];break;case"/":A=D.pop();A[5]=y[2];B=D.length>0?D[D.length-1][4]:E;break;default:B.push(y)}}return E}function s(x){this.string=x;this.tail=x;this.pos=0}s.prototype.eos=function(){return this.tail===""};s.prototype.scan=function(z){var y=this.tail.match(z);if(!y||y.index!==0){return""}var x=y[0];this.tail=this.tail.substring(x.length);this.pos+=x.length;return x};s.prototype.scanUntil=function(z){var y=this.tail.search(z),x;switch(y){case -1:x=this.tail;this.tail="";break;case 0:x="";break;default:x=this.tail.substring(0,y);this.tail=this.tail.substring(y)}this.pos+=x.length;return x};function p(y,x){this.view=y==null?{}:y;this.cache={".":this.view};this.parent=x}p.prototype.push=function(x){return new p(x,this)};p.prototype.lookup=function(z){var x=this.cache;var B;if(z in x){B=x[z]}else{var A=this,C,y;while(A){if(z.indexOf(".")>0){B=A.view;C=z.split(".");y=0;while(B!=null&&y<C.length){B=B[C[y++]]}}else{B=A.view[z]}if(B!=null){break}A=A.parent}x[z]=B}if(b(B)){B=B.call(this.view)}return B};function o(){this.cache={}}o.prototype.clearCache=function(){this.cache={}};o.prototype.parse=function(z,y){var x=this.cache;var A=x[z];if(A==null){A=x[z]=w(z,y)}return A};o.prototype.render=function(A,x,z){var B=this.parse(A);var y=(x instanceof p)?x:new p(x);return this.renderTokens(B,y,z,A)};o.prototype.renderTokens=function(F,x,D,I){var B="";var J=this;function y(K){return J.render(K,x,D)}var z,G;for(var C=0,E=F.length;C<E;++C){z=F[C];switch(z[0]){case"#":G=x.lookup(z[1]);if(!G){continue}if(k(G)){for(var A=0,H=G.length;A<H;++A){B+=this.renderTokens(z[4],x.push(G[A]),D,I)}}else{if(typeof G==="object"||typeof G==="string"){B+=this.renderTokens(z[4],x.push(G),D,I)}else{if(b(G)){if(typeof I!=="string"){throw new Error("Cannot use higher-order sections without the original template")}G=G.call(x.view,I.slice(z[3],z[5]),y);if(G!=null){B+=G}}else{B+=this.renderTokens(z[4],x,D,I)}}}break;case"^":G=x.lookup(z[1]);if(!G||(k(G)&&G.length===0)){B+=this.renderTokens(z[4],x,D,I)}break;case">":if(!D){continue}G=b(D)?D(z[1]):D[z[1]];if(G!=null){B+=this.renderTokens(this.parse(G),x,D,G)}break;case"&":G=x.lookup(z[1]);if(G!=null){B+=G}break;case"name":G=x.lookup(z[1]);if(G!=null){B+=a.escape(G)}break;case"text":B+=z[1];break}}return B};a.name="mustache.js";a.version="0.8.1";a.tags=["{{","}}"];var i=new o();a.clearCache=function(){return i.clearCache()};a.parse=function(y,x){return i.parse(y,x)};a.render=function(z,x,y){return i.render(z,x,y)};a.to_html=function(A,y,z,B){var x=a.render(A,y,z);if(b(B)){B(x)}else{return x}};a.escape=m;a.Scanner=s;a.Context=p;a.Writer=o;return a}));