!function(){var e,t,n={2929:function(e,t,n){"use strict";var r,o=n(655),i=n(7093),s=n.n(i);!function(e){e.PEG_HOLE="PEG_HOLE",e.FRAME="FRAME"}(r||(r={}));const a={minArea:100,minExtent:.75,minVertexCount:4,topN:3,adaptive:!1,useOtsu:!1};new class extends class{constructor(){this.ready=new Promise((e=>{s().onRuntimeInitialized=()=>{e(null)}})),this.debug=!1,this.configs=null,this.handleMessage()}onRequestPivot(e,t,n){return(0,o.mG)(this,void 0,void 0,(function*(){return new(s().Point)(0,0)}))}onRequestProcessing(e,t,n,r,i){return(0,o.mG)(this,void 0,void 0,(function*(){return t.clone()}))}createImageMat(e){const{width:t,height:n,buffer:r}=e,o=new(s().Mat)(n,t,s().CV_8UC4);return o.data.set(new Uint8ClampedArray(r)),o}pong(e){return(0,o.mG)(this,void 0,void 0,(function*(){yield this.ready,this.respond(e)}))}requestPivot(e){return(0,o.mG)(this,void 0,void 0,(function*(){const{mode:t,image:n,ROI:r}=e.data.body,o=this.createImageMat(n),i=new(s().Rect)(r.x,r.y,r.width,r.height);try{const n=yield this.onRequestPivot(t,o,i);this.respond(e,{result:{pivot:n}})}catch(t){this.handleError(e,t)}finally{o.delete()}}))}requestProcessing(e){return(0,o.mG)(this,void 0,void 0,(function*(){const{mode:t,refImage:n,ROI:r,pivot:o}=this.configs,i=this.createImageMat(e.data.body.image);try{const s=yield this.onRequestProcessing(t,i,n,r,o),{buffer:a}=new Uint8ClampedArray(s.data);this.respond(e,{result:{image:{buffer:a,width:s.cols,height:s.rows}},transfer:[a]}),s.delete()}catch(t){this.handleError(e,t)}finally{i.delete()}}))}setConfigs(e){const{mode:t,fitFrame:n,refImage:r,ROI:o,pivot:i}=e.data.body.configs;this.configs={mode:t,fitFrame:n,refImage:this.createImageMat(r),pivot:new(s().Point)(i.x,i.y),ROI:new(s().Rect)(o.x,o.y,o.width,o.height)},this.respond(e)}setDebugMode(e){this.debug=e.data.body.debug}clean(e){var t;null===(t=this.configs)||void 0===t||t.refImage.delete(),this.configs=null,this.respond(e)}checkConfig(){if(!this.configs)throw new Error("[worker] configs not set")}respond(e,{result:t,error:n,transfer:r}={}){self.postMessage({respondTo:e.data.request,id:e.data.id,error:n,result:t},r||[])}handleError(e,t){console.error("[worker]",t),this.respond(e,{error:t.message})}handleMessage(){self.addEventListener("message",(e=>(0,o.mG)(this,void 0,void 0,(function*(){var t;switch(null===(t=e.data)||void 0===t?void 0:t.request){case"ping":yield this.pong(e);break;case"set-debug":this.setDebugMode(e);break;case"set-configs":this.setConfigs(e);break;case"clean":this.clean(e);break;case"request-pivot":yield this.requestPivot(e);break;case"request-processing":yield this.requestProcessing(e);break;default:console.warn("[worker] unknown message",e)}}))))}}{constructor(){super(...arguments),this.baseSize=null}findPolygons(e,t,{minArea:n,minExtent:r,minVertexCount:o,topN:i,adaptive:a,useOtsu:c}){const u=e.roi(t),l=new(s().Mat);if(s().cvtColor(u,l,s().COLOR_RGBA2GRAY,0),a)s().adaptiveThreshold(l,l,255,s().ADAPTIVE_THRESH_GAUSSIAN_C,s().THRESH_BINARY_INV,21,2);else{let e=s().THRESH_BINARY_INV;c&&(e|=s().THRESH_OTSU),s().threshold(l,l,100,255,e)}const d=c?t.width*t.height*.9:1/0,h=new(s().MatVector),f=new(s().Mat);s().findContours(l,h,f,s().RETR_LIST,s().CHAIN_APPROX_SIMPLE);const g=[];for(let e=0;e<h.size();++e){const i=h.get(e),a=s().contourArea(i),c=s().arcLength(i,!0),l=new(s().Mat);if(s().approxPolyDP(i,l,.02*c,!0),l.rows>=o&&a>n&&a<d&&s().isContourConvex(l)){const n=s().minAreaRect(l),{width:o,height:i}=n.size,c=a/(o*i);if(c<r)continue;if(g.push({area:a,extent:c,rectSize:new(s().Size)(Math.max(o,i),Math.min(o,i)),center:new(s().Point)(t.x+n.center.x,t.y+n.center.y),angle:o<i?n.angle+90:n.angle}),this.debug){s().drawContours(u,h,e,new(s().Scalar)(255,0,0,255),3);const t=s().rotatedRectPoints(n);for(let e=0;e<4;e++)s().line(u,t[e],t[(e+1)%4],new(s().Scalar)(0,0,255,255),3,s().LINE_AA,0)}}i.delete(),l.delete()}h.delete(),f.delete(),l.delete(),u.delete(),function(e,t=10){let n=e.length;for(let r=0;r<n;r++){const o=e[r];for(let i=r+1;i<n;i++){const r=e[i];Math.abs(o.center.x-r.center.x)<t&&Math.abs(o.center.y-r.center.y)<t&&(e.splice(i,1),i--,n--)}}}(g),g.sort(((e,t)=>t.area-e.area));const p=g.slice(0,i);return p.sort(((e,t)=>e.center.x-t.center.x)),p}findPolygonsWithTries(e,t,n=a){const r=Object.assign(Object.assign(Object.assign({},a),n),{adaptive:!1}),o=this.findPolygons(e,t,r);return o.length===r.topN?o:(this.debug&&console.log("%c[worker] non-adaptive threshold failed, trying adaptive...","color: #f60"),this.findPolygons(e,t,Object.assign(Object.assign({},r),{adaptive:!0})))}pegHoleRotation(e,t){const n=this.findPolygonsWithTries(e,t,{useOtsu:!0,minVertexCount:5});if(n.length<3)throw new Error("タップ穴を検出できませんでした");const{center:r}=n[0],{center:o}=n[1],i=new(s().Point)(o.x,o.y);return this.debug&&n.forEach((({center:t})=>{s().circle(e,t,10,new(s().Scalar)(255,0,0,255),-1)})),{center:i,angle:180*Math.atan2(o.y-r.y,o.x-r.x)/Math.PI,rectSize:n[0].rectSize}}frameRotation(e,t){const n=e.cols*e.rows,r=this.findPolygonsWithTries(e,t,{minArea:.5*n,minExtent:0,minVertexCount:4,topN:1})[0];if(!r)throw new Error("フレームを検出できませんでした");return this.debug&&s().circle(e,r.center,10,new(s().Scalar)(255,0,0,255),-1),{center:r.center,angle:r.angle,rectSize:r.rectSize}}calcRotation(e,t,n){return e===r.PEG_HOLE?this.pegHoleRotation(t,n):this.frameRotation(t,n)}getRotationMatrix(e,t,n,r,o,i){const a=[1,0,e.x,0,1,e.y,0,0,1],c=[1,0,n,0,1,r,0,0,1],u=-t*Math.PI/180,l=Math.cos(u),d=Math.sin(u),h=[a,c,[l,-d,0,d,l,0,0,0,1],[o,0,0,0,i,0,0,0,1],[1,0,-e.x,0,1,-e.y,0,0,1]].reduce(((e,t)=>function(e,t){const n=[];for(let r=0;r<2;r++)for(let o=0;o<3;o++){let i=0;for(let n=0;n<3;n++)i+=e[3*r+n]*t[3*n+o];n[3*r+o]=i}return n.push(0,0,1),n}(e,t)));return s().matFromArray(2,3,s().CV_64FC1,h.slice(0,6))}setConfigs(e){super.setConfigs(e);const{mode:t,refImage:n,ROI:r}=this.configs,{rectSize:o}=this.calcRotation(t,n,r);this.baseSize=o}clean(e){super.clean(e),this.baseSize=null}onRequestPivot(e,t,n){return(0,o.mG)(this,void 0,void 0,(function*(){const{center:r}=this.calcRotation(e,t,n);return r}))}onRequestProcessing(e,t,n,i,a){return(0,o.mG)(this,void 0,void 0,(function*(){const o=new(s().Size)(n.cols%2==0?n.cols:n.cols+1,n.rows%2==0?n.rows:n.rows+1),c=new(s().Mat);s().copyMakeBorder(t,c,0,Math.max(0,o.height-t.rows),0,Math.max(0,o.width-t.cols),s().BORDER_CONSTANT,new(s().Scalar)(255,255,255,255));const{center:u,angle:l,rectSize:d}=this.calcRotation(e,c,i),h=a.x-u.x,f=a.y-u.y;let g=1,p=1;e===r.FRAME&&this.configs.fitFrame&&(g=this.baseSize.width/d.width,p=this.baseSize.height/d.height);const m=this.getRotationMatrix(u,l,h,f,g,p),v=new(s().Mat);return s().warpAffine(c,v,m,o,s().INTER_LINEAR,s().BORDER_CONSTANT,new(s().Scalar)(255,255,255,255)),m.delete(),c.delete(),v}))}}},3499:function(){},2999:function(){},8300:function(){}},r={};function o(e){var t=r[e];if(void 0!==t)return t.exports;var i=r[e]={id:e,exports:{}};return n[e].call(i.exports,i,i.exports,o),i.exports}o.m=n,o.x=function(){var e=o.O(void 0,[216,977],(function(){return o(2929)}));return o.O(e)},e=[],o.O=function(t,n,r,i){if(!n){var s=1/0;for(l=0;l<e.length;l++){n=e[l][0],r=e[l][1],i=e[l][2];for(var a=!0,c=0;c<n.length;c++)(!1&i||s>=i)&&Object.keys(o.O).every((function(e){return o.O[e](n[c])}))?n.splice(c--,1):(a=!1,i<s&&(s=i));if(a){e.splice(l--,1);var u=r();void 0!==u&&(t=u)}}return t}i=i||0;for(var l=e.length;l>0&&e[l-1][2]>i;l--)e[l]=e[l-1];e[l]=[n,r,i]},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,{a:t}),t},o.d=function(e,t){for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.f={},o.e=function(e){return Promise.all(Object.keys(o.f).reduce((function(t,n){return o.f[n](e,t),t}),[]))},o.u=function(e){return{216:"vendors",977:"opencv"}[e]+"."+{216:"2a42100c994558b3f97c",977:"a1d009f617e5a1f5d520"}[e]+".js"},o.miniCssF=function(e){},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.j=696,function(){var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e}(),function(){var e={696:1};o.f.i=function(t,n){e[t]||importScripts(o.p+o.u(t))};var t=self.webpackChunkkeyframe_refiner=self.webpackChunkkeyframe_refiner||[],n=t.push.bind(t);t.push=function(t){var r=t[0],i=t[1],s=t[2];for(var a in i)o.o(i,a)&&(o.m[a]=i[a]);for(s&&s(o);r.length;)e[r.pop()]=1;n(t)}}(),t=o.x,o.x=function(){return Promise.all([o.e(216),o.e(977)]).then(t)},o.x()}();