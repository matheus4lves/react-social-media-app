(self.webpackChunksocial_media_app=self.webpackChunksocial_media_app||[]).push([[274],{7274:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});var a=s(7294),r=s(195),l=s(3983),c=s(9669),n=s.n(c),o=s(9847);const i=function(){const e=(0,a.useContext)(l.Z),[t,s]=(0,r.x)({searchTerm:"",results:[],show:"neither",requestCount:0});function c(t){27==t.keyCode&&e({type:"searchClosed"})}return(0,a.useEffect)((()=>(document.addEventListener("keyup",c),()=>document.removeEventListener("keyup",c))),[]),(0,a.useEffect)((()=>{if(t.searchTerm.trim()){s((e=>{e.show="loading"}));const e=setTimeout((()=>{s((e=>{e.requestCount++}))}),750);return()=>clearTimeout(e)}s((e=>{e.show="neither"}))}),[t.searchTerm]),(0,a.useEffect)((()=>{if(t.requestCount){const e=n().CancelToken.source();async function a(){try{const a=await n().post("/search",{searchTerm:t.searchTerm},{cancelToken:e.token});s((e=>{e.results=a.data,e.show="results"}))}catch(e){console.log(e.response.data)}}return a(),()=>e.cancel()}}),[t.requestCount]),a.createElement(a.Fragment,null,a.createElement("div",{className:"search-overlay-top shadow-sm"},a.createElement("div",{className:"container container--narrow"},a.createElement("label",{htmlFor:"live-search-field",className:"search-overlay-icon"},a.createElement("i",{className:"fas fa-search"})),a.createElement("input",{onChange:function(e){const t=e.target.value;s((e=>{e.searchTerm=t}))},autoFocus:!0,type:"text",autoComplete:"off",id:"live-search-field",className:"live-search-field",placeholder:"What are you interested in?"}),a.createElement("span",{onClick:()=>e({type:"searchClosed"}),className:"close-live-search"},a.createElement("i",{className:"fas fa-times-circle"})))),a.createElement("div",{className:"search-overlay-bottom"},a.createElement("div",{className:"container container--narrow py-3"},a.createElement("div",{className:"circle-loader "+("loading"==t.show?"circle-loader--visible":"")}),a.createElement("div",{className:"live-search-results "+("results"==t.show?"live-search-results--visible":"")},Boolean(t.results.length)&&a.createElement("div",{className:"list-group shadow-sm"},a.createElement("div",{className:"list-group-item active"},a.createElement("strong",null,"Search Results")," (",t.results.length," ",t.results.length>1?"items":"item"," found)"),t.results.map((t=>a.createElement(o.Z,{post:t,key:t._id,onClick:()=>{e({type:"searchClosed"})}})))),!Boolean(t.results.length)&&a.createElement("p",{className:"alert alert-danger text-danger shadow-sm"}," ","Sorry, we could not find any results for that search.")))))}}}]);