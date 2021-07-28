!function(){"use strict";const t="http://www.w3.org/2000/svg";class e{constructor(t){this.seed=t}next(){return this.seed?(2**31-1&(this.seed=Math.imul(48271,this.seed)))/2**31:Math.random()}}function n(t,e,n,s,o){return{type:"path",ops:h(t,e,n,s,o)}}function s(t,e,s){const o=(t||[]).length;if(o>2){const n=[];for(let e=0;e<o-1;e++)n.push(...h(t[e][0],t[e][1],t[e+1][0],t[e+1][1],s));return e&&n.push(...h(t[o-1][0],t[o-1][1],t[0][0],t[0][1],s)),{type:"path",ops:n}}return 2===o?n(t[0][0],t[0][1],t[1][0],t[1][1],s):{type:"path",ops:[]}}function o(t,e,n,o,i){return function(t,e){return s(t,!0,e)}([[t,e],[t+n,e],[t+n,e+o],[t,e+o]],i)}function i(t,e,n,s,o){return function(t,e,n,s){const[o,i]=u(s.increment,t,e,s.rx,s.ry,1,s.increment*a(.1,a(.4,1,n),n),n);let r=d(o,null,n);if(!n.disableMultiStroke){const[o]=u(s.increment,t,e,s.rx,s.ry,1.5,0,n),i=d(o,null,n);r=r.concat(i)}return{estimatedPoints:i,opset:{type:"path",ops:r}}}(t,e,o,function(t,e,n){const s=Math.sqrt(2*Math.PI*Math.sqrt((Math.pow(t/2,2)+Math.pow(e/2,2))/2)),o=Math.max(n.curveStepCount,n.curveStepCount/Math.sqrt(200)*s),i=2*Math.PI/o;let r=Math.abs(t/2),a=Math.abs(e/2);const h=1-n.curveFitting;return r+=c(r*h,n),a+=c(a*h,n),{increment:i,rx:r,ry:a}}(n,s,o)).opset}function r(t){return t.randomizer||(t.randomizer=new e(t.seed||0)),t.randomizer.next()}function a(t,e,n,s=1){return n.roughness*s*(r(n)*(e-t)+t)}function c(t,e,n=1){return a(-t,t,e,n)}function h(t,e,n,s,o,i=!1){const r=i?o.disableMultiStrokeFill:o.disableMultiStroke,a=l(t,e,n,s,o,!0,!1);if(r)return a;const c=l(t,e,n,s,o,!0,!0);return a.concat(c)}function l(t,e,n,s,o,i,a){const h=Math.pow(t-n,2)+Math.pow(e-s,2),l=Math.sqrt(h);let d=1;d=l<200?1:l>500?.4:-.0016668*l+1.233334;let u=o.maxRandomnessOffset||0;u*u*100>h&&(u=l/10);const m=u/2,f=.2+.2*r(o);let g=o.bowing*o.maxRandomnessOffset*(s-e)/200,p=o.bowing*o.maxRandomnessOffset*(t-n)/200;g=c(g,o,d),p=c(p,o,d);const _=[],v=()=>c(m,o,d),w=()=>c(u,o,d);return i&&(a?_.push({op:"move",data:[t+v(),e+v()]}):_.push({op:"move",data:[t+c(u,o,d),e+c(u,o,d)]})),a?_.push({op:"bcurveTo",data:[g+t+(n-t)*f+v(),p+e+(s-e)*f+v(),g+t+2*(n-t)*f+v(),p+e+2*(s-e)*f+v(),n+v(),s+v()]}):_.push({op:"bcurveTo",data:[g+t+(n-t)*f+w(),p+e+(s-e)*f+w(),g+t+2*(n-t)*f+w(),p+e+2*(s-e)*f+w(),n+w(),s+w()]}),_}function d(t,e,n){const s=t.length,o=[];if(s>3){const i=[],r=1-n.curveTightness;o.push({op:"move",data:[t[1][0],t[1][1]]});for(let e=1;e+2<s;e++){const n=t[e];i[0]=[n[0],n[1]],i[1]=[n[0]+(r*t[e+1][0]-r*t[e-1][0])/6,n[1]+(r*t[e+1][1]-r*t[e-1][1])/6],i[2]=[t[e+1][0]+(r*t[e][0]-r*t[e+2][0])/6,t[e+1][1]+(r*t[e][1]-r*t[e+2][1])/6],i[3]=[t[e+1][0],t[e+1][1]],o.push({op:"bcurveTo",data:[i[1][0],i[1][1],i[2][0],i[2][1],i[3][0],i[3][1]]})}if(e&&2===e.length){const t=n.maxRandomnessOffset;o.push({op:"lineTo",data:[e[0]+c(t,n),e[1]+c(t,n)]})}}else 3===s?(o.push({op:"move",data:[t[1][0],t[1][1]]}),o.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===s&&o.push(...h(t[0][0],t[0][1],t[1][0],t[1][1],n));return o}function u(t,e,n,s,o,i,r,a){const h=[],l=[],d=c(.5,a)-Math.PI/2;l.push([c(i,a)+e+.9*s*Math.cos(d-t),c(i,a)+n+.9*o*Math.sin(d-t)]);for(let r=d;r<2*Math.PI+d-.01;r+=t){const t=[c(i,a)+e+s*Math.cos(r),c(i,a)+n+o*Math.sin(r)];h.push(t),l.push(t)}return l.push([c(i,a)+e+s*Math.cos(d+2*Math.PI+.5*r),c(i,a)+n+o*Math.sin(d+2*Math.PI+.5*r)]),l.push([c(i,a)+e+.98*s*Math.cos(d+r),c(i,a)+n+.98*o*Math.sin(d+r)]),l.push([c(i,a)+e+.9*s*Math.cos(d+.5*r),c(i,a)+n+.9*o*Math.sin(d+.5*r)]),[l,h]}function m(t,e){return{maxRandomnessOffset:2,roughness:"highlight"===t?3:1.5,bowing:1,stroke:"#000",strokeWidth:1.5,curveTightness:0,curveFitting:.95,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1,dashOffset:-1,dashGap:-1,zigzagOffset:-1,combineNestedSvgPaths:!1,disableMultiStroke:"double"!==t,disableMultiStrokeFill:!1,seed:e}}function f(e,r,a,c,h,l){const d=[];let u=a.strokeWidth||2;const f=function(t){const e=t.padding;if(e||0===e){if("number"==typeof e)return[e,e,e,e];if(Array.isArray(e)){const t=e;if(t.length)switch(t.length){case 4:return[...t];case 1:return[t[0],t[0],t[0],t[0]];case 2:return[...t,...t];case 3:return[...t,t[1]];default:return[t[0],t[1],t[2],t[3]]}}}return[5,5,5,5]}(a),g=void 0===a.animate||!!a.animate,p=a.iterations||2,_=a.rtl?1:0,v=m("single",l);switch(a.type){case"underline":{const t=r.y+r.h+f[2];for(let e=_;e<p+_;e++)e%2?d.push(n(r.x+r.w,t,r.x,t,v)):d.push(n(r.x,t,r.x+r.w,t,v));break}case"strike-through":{const t=r.y+r.h/2;for(let e=_;e<p+_;e++)e%2?d.push(n(r.x+r.w,t,r.x,t,v)):d.push(n(r.x,t,r.x+r.w,t,v));break}case"box":{const t=r.x-f[3],e=r.y-f[0],n=r.w+(f[1]+f[3]),s=r.h+(f[0]+f[2]);for(let i=0;i<p;i++)d.push(o(t,e,n,s,v));break}case"bracket":{const t=Array.isArray(a.brackets)?a.brackets:a.brackets?[a.brackets]:["right"],e=r.x-2*f[3],n=r.x+r.w+2*f[1],o=r.y-2*f[0],i=r.y+r.h+2*f[2];for(const a of t){let t;switch(a){case"bottom":t=[[e,r.y+r.h],[e,i],[n,i],[n,r.y+r.h]];break;case"top":t=[[e,r.y],[e,o],[n,o],[n,r.y]];break;case"left":t=[[r.x,o],[e,o],[e,i],[r.x,i]];break;case"right":t=[[r.x+r.w,o],[n,o],[n,i],[r.x+r.w,i]]}t&&d.push(s(t,!1,v))}break}case"crossed-off":{const t=r.x,e=r.y,s=t+r.w,o=e+r.h;for(let i=_;i<p+_;i++)i%2?d.push(n(s,o,t,e,v)):d.push(n(t,e,s,o,v));for(let i=_;i<p+_;i++)i%2?d.push(n(t,o,s,e,v)):d.push(n(s,e,t,o,v));break}case"circle":{const t=m("double",l),e=r.w+(f[1]+f[3]),n=r.h+(f[0]+f[2]),s=r.x-f[3]+e/2,o=r.y-f[0]+n/2,a=Math.floor(p/2),c=p-2*a;for(let r=0;r<a;r++)d.push(i(s,o,e,n,t));for(let t=0;t<c;t++)d.push(i(s,o,e,n,v));break}case"highlight":{const t=m("highlight",l);u=.95*r.h;const e=r.y+r.h/2;for(let s=_;s<p+_;s++)s%2?d.push(n(r.x+r.w,e,r.x,e,t)):d.push(n(r.x,e,r.x+r.w,e,t));break}}if(d.length){const n=function(t){const e=[];for(const n of t){let t="";for(const s of n.ops){const n=s.data;switch(s.op){case"move":t.trim()&&e.push(t.trim()),t=`M${n[0]} ${n[1]} `;break;case"bcurveTo":t+=`C${n[0]} ${n[1]}, ${n[2]} ${n[3]}, ${n[4]} ${n[5]} `;break;case"lineTo":t+=`L${n[0]} ${n[1]} `}}t.trim()&&e.push(t.trim())}return e}(d),s=[],o=[];let i=0;const r=(t,e,n)=>t.setAttribute(e,n);for(const c of n){const n=document.createElementNS(t,"path");if(r(n,"d",c),r(n,"fill","none"),r(n,"stroke",a.color||"currentColor"),r(n,"stroke-width",""+u),g){const t=n.getTotalLength();s.push(t),i+=t}e.appendChild(n),o.push(n)}if(g){let t=0;for(let e=0;e<o.length;e++){const n=o[e],r=s[e],a=i?h*(r/i):0,l=c+t,d=n.style;d.strokeDashoffset=""+r,d.strokeDasharray=""+r,d.animation=`rough-notation-dash ${a}ms ease-out ${l}ms forwards`,t+=a}}}}class g{constructor(t,e){this._state="unattached",this._resizing=!1,this._seed=Math.floor(Math.random()*2**31),this._lastSizes=[],this._animationDelay=0,this._resizeListener=()=>{this._resizing||(this._resizing=!0,setTimeout((()=>{this._resizing=!1,"showing"===this._state&&this.haveRectsChanged()&&this.show()}),400))},this._e=t,this._config=JSON.parse(JSON.stringify(e)),this.attach()}get animate(){return this._config.animate}set animate(t){this._config.animate=t}get animationDuration(){return this._config.animationDuration}set animationDuration(t){this._config.animationDuration=t}get iterations(){return this._config.iterations}set iterations(t){this._config.iterations=t}get color(){return this._config.color}set color(t){this._config.color!==t&&(this._config.color=t,this.refresh())}get strokeWidth(){return this._config.strokeWidth}set strokeWidth(t){this._config.strokeWidth!==t&&(this._config.strokeWidth=t,this.refresh())}get padding(){return this._config.padding}set padding(t){this._config.padding!==t&&(this._config.padding=t,this.refresh())}attach(){if("unattached"===this._state&&this._e.parentElement){!function(){if(!window.__rno_kf_s){const t=window.__rno_kf_s=document.createElement("style");t.textContent="@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }",document.head.appendChild(t)}}();const e=this._svg=document.createElementNS(t,"svg");e.setAttribute("class","rough-annotation");const n=e.style;n.position="absolute",n.top="0",n.left="0",n.overflow="visible",n.pointerEvents="none",n.width="100px",n.height="100px";const s="highlight"===this._config.type;if(this._e.insertAdjacentElement(s?"beforebegin":"afterend",e),this._state="not-showing",s){const t=window.getComputedStyle(this._e).position;(!t||"static"===t)&&(this._e.style.position="relative")}this.attachListeners()}}detachListeners(){window.removeEventListener("resize",this._resizeListener),this._ro&&this._ro.unobserve(this._e)}attachListeners(){this.detachListeners(),window.addEventListener("resize",this._resizeListener,{passive:!0}),!this._ro&&"ResizeObserver"in window&&(this._ro=new window.ResizeObserver((t=>{for(const e of t)e.contentRect&&this._resizeListener()}))),this._ro&&this._ro.observe(this._e)}haveRectsChanged(){if(this._lastSizes.length){const t=this.rects();if(t.length!==this._lastSizes.length)return!0;for(let e=0;e<t.length;e++)if(!this.isSameRect(t[e],this._lastSizes[e]))return!0}return!1}isSameRect(t,e){const n=(t,e)=>Math.round(t)===Math.round(e);return n(t.x,e.x)&&n(t.y,e.y)&&n(t.w,e.w)&&n(t.h,e.h)}isShowing(){return"not-showing"!==this._state}refresh(){this.isShowing()&&!this.pendingRefresh&&(this.pendingRefresh=Promise.resolve().then((()=>{this.isShowing()&&this.show(),delete this.pendingRefresh})))}show(){switch(this._state){case"unattached":break;case"showing":this.hide(),this._svg&&this.render(this._svg,!0);break;case"not-showing":this.attach(),this._svg&&this.render(this._svg,!1)}}hide(){if(this._svg)for(;this._svg.lastChild;)this._svg.removeChild(this._svg.lastChild);this._state="not-showing"}remove(){this._svg&&this._svg.parentElement&&this._svg.parentElement.removeChild(this._svg),this._svg=void 0,this._state="unattached",this.detachListeners()}render(t,e){let n=this._config;e&&(n=JSON.parse(JSON.stringify(this._config)),n.animate=!1);const s=this.rects();let o=0;s.forEach((t=>o+=t.w));const i=n.animationDuration||800;let r=0;for(let e=0;e<s.length;e++){const a=i*(s[e].w/o);f(t,s[e],n,r+this._animationDelay,a,this._seed),r+=a}this._lastSizes=s,this._state="showing"}rects(){const t=[];if(this._svg)if(this._config.multiline){const e=this._e.getClientRects();for(let n=0;n<e.length;n++)t.push(this.svgRect(this._svg,e[n]))}else t.push(this.svgRect(this._svg,this._e.getBoundingClientRect()));return t}svgRect(t,e){const n=t.getBoundingClientRect(),s=e;return{x:(s.x||s.left)-(n.x||n.left),y:(s.y||s.top)-(n.y||n.top),w:s.width,h:s.height}}}function p(t,e){return new g(t,e)}const _=IntersectionObserver?new IntersectionObserver((function(t,e){t.filter((function(t){return t.isIntersecting})).forEach((function(t){const e=t.target,n=v.filter((function(t){return t.id===e.dataset.annotateId}))[0].annotation;n?n.show():console.error("Couldn't find annotation")}))}),{threshold:[1]}):null;let v,w,y,b,L,E,C,k,M,x;function S(t){let e=!1;window.addEventListener("scroll",(function(t){e=!0})),setInterval((function(){e&&(t(),e=!1)}),250)}function A(){w&&w.classList.add("content--target-offset-logos"),y&&(y.classList.add("header--opaque"),b&&(b.classList.add("logos--bar-sticky"),b.style.top=y.getBoundingClientRect().bottom-y.getBoundingClientRect().top+"px")),L&&L.classList.add("toc--target-offset-logos")}function R(){y&&b&&(y.getBoundingClientRect().bottom>=b.getBoundingClientRect().top?b.classList.add("logos--bar-sticky-detached"):b.classList.remove("logos--bar-sticky-detached"))}function O(t){const e=t.dataset.hasOwnProperty("metricsPageUrl")?window.location.href:t.href;z(t,e,t.dataset.metricsName)}function B(t){const e=new URL(t.href);try{if(e.searchParams.has("utm_source")||e.searchParams.set("utm_source","juniorguru"),!e.searchParams.has("utm_medium")){const n=t.dataset.metricsUtmMedium||"content";e.searchParams.set("utm_medium",n)}if(!e.searchParams.has("utm_campaign")){const n=t.dataset.metricsUtmCampaign||"juniorguru";e.searchParams.set("utm_campaign",n)}t.href=""+e}catch(e){console.error&&console.error("Couldn't modify link",t.href,"to contain UTM params",e)}}function N(t){z(t,t.href,"outbound"),t.dataset.hasOwnProperty("metricsNoUtm")||B(t)}function I(t){if(!t||!t.href||!t.href.match(/^http/))return!1;try{const e=new URL(t.href).hostname.replace("www.","");return!("localhost"==e||"junior.guru"==e)}catch(t){return!1}}function z(t,e,n){t.addEventListener("mousedown",(function(t){try{gtag("event","click",{event_category:n,event_label:e,transport_type:"beacon"})}catch(t){console.error&&console.error("Couldn't send event",n,"with URL",e)}}))}function q(){if(!window.location.hash||!document.querySelector(".more--collapsed "+window.location.hash))return;const t=(""+window.location.hash).replace(/^#/,""),e=document.getElementById(t);let n=e;for(;n;){if(n.className.match("more--collapsed")){n.getElementsByClassName("more__button")[0].dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}));break}n=n.parentElement}e.scrollIntoView()}document.addEventListener("DOMContentLoaded",(function(){v=Array.from(document.querySelectorAll("*[data-annotate-circle]")).map((function(t,e){const n=e.toString(),s=p(t,{type:"circle",color:"#1755d1",padding:20,animationDuration:1600});return _?(t.dataset.annotateId=n,_.observe(t)):s.show(),{id:n,annotation:s}})),v=v.concat(Array.from(document.querySelectorAll("*[data-annotate]")).map((function(t,e){const n=e.toString(),s=p(t,{type:"underline",color:"#1755d1",animationDuration:1600,multiline:!0});return _?(t.dataset.annotateId=n,_.observe(t)):s.show(),{id:n,annotation:s}})))})),document.addEventListener("DOMContentLoaded",(function(){const t=Array.from(document.getElementsByClassName("header__subnav"))[0],e=Array.from(document.getElementsByClassName("header__subnav-tab-control--active"))[0];t&&e&&t.scrollWidth>window.innerWidth&&(t.scrollLeft=Math.max((t.scrollWidth-window.innerWidth)/2,e.getBoundingClientRect().left-10))})),document.addEventListener("DOMContentLoaded",(function(){w=Array.from(document.getElementsByClassName("content"))[0],y=Array.from(document.getElementsByClassName("header"))[0],b=Array.from(document.getElementsByClassName("logos--bar"))[0],L=Array.from(document.getElementsByClassName("toc"))[0],A()})),window.addEventListener("resize",A),document.addEventListener("DOMContentLoaded",R),window.addEventListener("resize",R),S(R),document.addEventListener("DOMContentLoaded",(function(){const t=document.querySelector(".content__section--hidden");t&&window.location.search.includes("state=success")&&(t.style.display="block")})),document.addEventListener("DOMContentLoaded",(function(){!gtag&&console.log&&console.error("GA not available, junior.guru metrics turned off"),document.querySelectorAll?(Array.from(document.querySelectorAll("*[data-metrics]")).forEach(O),Array.from(document.querySelectorAll("*[data-metrics-utm]")).forEach(B),Array.from(document.querySelectorAll("a")).filter(I).forEach(N)):console.error("document.querySelectorAll() not available, junior.guru metrics turned off")})),document.addEventListener("DOMContentLoaded",(function(){Array.from(document.getElementsByClassName("more")).forEach((function(t){const e=document.createElement("div");e.classList.add("more__container"),Array.from(t.childNodes).forEach((function(t){e.appendChild(t)})),t.appendChild(e);const n=document.createElement("p");n.classList.add("button-compartment"),n.classList.add("more__cover"),n.addEventListener("click",(function(t){e.removeChild(n),e.classList.remove("more--collapsed")}));const s=document.createElement("span");s.textContent="Zobrazit víc",s.classList.add("button"),s.classList.add("button--link"),s.classList.add("more__button"),n.appendChild(s),e.classList.add("more--collapsed"),e.appendChild(n)})),q()})),window.addEventListener("hashchange",q),document.addEventListener("DOMContentLoaded",(function(){const t=document.querySelector(".testimonials"),e=Array.from(document.querySelectorAll(".testimonials__item"));if(!t||!e.length)return;const n=document.createElement("ul");n.classList.add("testimonials__labels");const s=[];function o(t){s.forEach((function(t){t.classList.remove("testimonials__label--active")})),s[t].classList.add("testimonials__label--active"),e.forEach((function(t){t.classList.add("testimonials__item--inactive")})),e[t].classList.remove("testimonials__item--inactive")}e.forEach((function(t,e){const o=document.createElement("li");o.textContent=""+(e+1),o.classList.add("testimonials__label"),n.appendChild(o),s.push(o)})),t.insertBefore(n,t.firstChild),s.forEach((function(t,e){t.addEventListener("click",(function(){o(e)}))})),o(0)}));let D,T,P,W=[],$=[];function U(){if(C&&k&&(k.getBoundingClientRect().bottom>C.getBoundingClientRect().top?k.classList.add("toc__content--irrelevant"):k.classList.remove("toc__content--irrelevant")),E){const t=E.getBoundingClientRect().top+D;if(M){const e=H(W,t);M.innerHTML=e?e.innerHTML:x}Array.from(document.getElementsByClassName("toc__item--active")).forEach((function(t){t.classList.remove("toc__item--active")}));const e=H($,t);if(k&&e){const t=J(e),n=document.querySelectorAll('.toc__item a[href="#'+t+'"]')[0],s=G(n,"toc__item");s&&s.classList.add("toc__item--active"),Array.from(document.getElementsByClassName("toc__subitem--active")).forEach((function(t){t.classList.remove("toc__subitem--active")}));const o=G(n,"toc__subitem");o&&o.classList.add("toc__subitem--active")}}}function j(t){const e=document.createElement("a");e.classList.add("toc-permalink"),e.textContent="odkaz sem",e.href="#"+J(t),t.appendChild(e)}function F(t){return t.map((function(t){return Array.from(document.getElementsByClassName(t))})).reduce((function(t,e){return t.concat(e)}),[])}function H(t,e){e=(e||0)+120;const n=t.map((function(t){const e=t.getBoundingClientRect().bottom;return[t,e]})).filter((function(t){return!t[0].classList.contains("content__subsection-heading")||!G(t[0],"more--collapsed")})).filter((function(t){return t[1]<e}));return n.length<1?null:1==n.length?n[0][0]:n.reduce((function(t,e){return t[1]>e[1]?t:e}))[0]}function J(t){for(;t;){if(t.id)return t.id;t=t.parentElement}}function G(t,e){for(;t;){if(t.classList.contains(e))return t;t=t.parentElement}}
/*! instant.page v3.0.0 - (C) 2019 Alexandre Dieulot - https://instant.page/license */document.addEventListener("DOMContentLoaded",(function(){E=document.getElementsByClassName("header")[0],C=document.getElementsByClassName("footer")[0],k=document.getElementsByClassName("toc__content")[0],M=document.getElementsByClassName("header__tocbar-heading")[0],x=M?M.innerHTML:void 0,W=F(["engage__heading","content__section-heading"]),$=F(["engage__heading","content__section-heading","content__subsection-heading"]);const t=document.querySelector([".content__target",".content__section[id]",".content__section-heading[id]",".content__subsection-heading[id]"].join(", "));if(t){const e=getComputedStyle(t,"::before");D=parseInt(e.getPropertyValue("height"),10)}else D=0;if(U(),k){const t=document.querySelectorAll(".content__section-heading, .content__subsection-heading");Array.from(t).forEach(j)}})),S(U);const V=new Set,Q=document.createElement("link"),Z=Q.relList&&Q.relList.supports&&Q.relList.supports("prefetch")&&window.IntersectionObserver&&"isIntersecting"in IntersectionObserverEntry.prototype,K="instantAllowQueryString"in document.body.dataset,X="instantAllowExternalLinks"in document.body.dataset,Y="instantWhitelist"in document.body.dataset;let tt=65,et=!1,nt=!1,st=!1;if("instantIntensity"in document.body.dataset){const t=document.body.dataset.instantIntensity;if("mousedown"==t.substr(0,"mousedown".length))et=!0,"mousedown-only"==t&&(nt=!0);else if("viewport"==t.substr(0,"viewport".length))navigator.connection&&(navigator.connection.saveData||navigator.connection.effectiveType.includes("2g"))||("viewport"==t?document.documentElement.clientWidth*document.documentElement.clientHeight<45e4&&(st=!0):"viewport-all"==t&&(st=!0));else{const e=parseInt(t);isNaN(e)||(tt=e)}}if(Z){const t={capture:!0,passive:!0};if(nt||document.addEventListener("touchstart",(function(t){P=performance.now();const e=t.target.closest("a");if(!it(e))return;rt(e.href)}),t),et?document.addEventListener("mousedown",(function(t){const e=t.target.closest("a");if(!it(e))return;rt(e.href)}),t):document.addEventListener("mouseover",(function(t){if(performance.now()-P<1100)return;const e=t.target.closest("a");if(!it(e))return;e.addEventListener("mouseout",ot,{passive:!0}),T=setTimeout((()=>{rt(e.href),T=void 0}),tt)}),t),st){let t;t=window.requestIdleCallback?t=>{requestIdleCallback(t,{timeout:1500})}:t=>{t()},t((()=>{const t=new IntersectionObserver((e=>{e.forEach((e=>{if(e.isIntersecting){const n=e.target;t.unobserve(n),rt(n.href)}}))}));document.querySelectorAll("a").forEach((e=>{it(e)&&t.observe(e)}))}))}}function ot(t){t.relatedTarget&&t.target.closest("a")==t.relatedTarget.closest("a")||T&&(clearTimeout(T),T=void 0)}function it(t){if(t&&t.href&&(!Y||"instant"in t.dataset)&&(X||t.origin==location.origin||"instant"in t.dataset)&&["http:","https:"].includes(t.protocol)&&("http:"!=t.protocol||"https:"!=location.protocol)&&(K||!t.search||"instant"in t.dataset)&&!(t.hash&&t.pathname+t.search==location.pathname+location.search||"noInstant"in t.dataset))return!0}function rt(t){if(V.has(t))return;const e=document.createElement("link");e.rel="prefetch",e.href=t,document.head.appendChild(e),V.add(t)}}();
