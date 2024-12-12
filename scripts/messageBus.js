"use strict";const INDEX_THRESHOLD=32767;let topics,index,messageBus;class InternalMessageBus{constructor(){topics={},index=0}subscribe(e,t,o=null){if(!e)return console.error("Undefined subscription topic for callback: "),void console.error(t);if("function"!=typeof t)throw console.error("Topic "+e+" encountered error with callback: "),console.log(t),"callback must be a function";topics.hasOwnProperty(e)||(topics[e]={});let r=index.toString();return topics[e][r]={callback:t,target:o},++index>INDEX_THRESHOLD&&console.warn(`WARNING: Subscriber threshold reached for topic ${e}!`),{unsubscribe:function(){delete topics[e][r]},topic:e}}publish(e,t=null){let o=[];if(topics.hasOwnProperty(e)){let t=topics[e],r=[];for(let e=1;e<arguments.length;e++)r.push(arguments[e]);for(let e in t)try{let s=t[e];s.callback.apply(s.target,r)}catch(e){o.push(e)}if(o.length>0)for(let e=0;e<o.length;e++)console.error(o[e])}}}messageBus=new InternalMessageBus;