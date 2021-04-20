(this.webpackJsonppuhelinluettelo=this.webpackJsonppuhelinluettelo||[]).push([[0],{39:function(e,t,n){},40:function(e,t,n){"use strict";n.r(t);var r=n(15),a=n.n(r),s=n(3),c="",i=(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_COUNTRY_INFO_WEATHERSTACK_API_KEY:"04d12abb0180279aa9271b48afe2cf24"}).REACT_APP_PHONEBOOK_SERVER_URL||"/api/")+"persons",o="A person with name {} has already been added to the phonebook. Would you like to update their information?",u=n(2),l=n(0),d=function(e){var t=e.content;return Object(l.jsx)("h1",{children:t})},f=function(e){var t=e.content;return Object(l.jsx)("h2",{children:t})},b=function(e){var t=e.entry,n=e.deleteHandler;return Object(l.jsxs)("div",{children:[t.name,":"," ",t.phoneNumber,Object(l.jsx)("button",{"data-id":t.id,onClick:n,children:"Delete"})]})},j=n(4),O=n.n(j);function h(e){return e.then((function(e){return e.data}))}var v={getAll:function(){var e=i;return h(O.a.get(e))},create:function(e){var t=i;return h(O.a.post(t,e))},update:function(e){var t="".concat(i,"/").concat(e.id);return h(O.a.put(t,e))},delete:function(e){var t="".concat(i,"/").concat(e);return O.a.delete(t)}},m={text:c,filter:c};var p=function(e){var t=e.title,n=e.entries,r=e.setEntries,a=e.setInfoMessage,c=e.setErrorMessage,i=Object(u.useState)(m),o=Object(s.a)(i,2),d=o[0],j=o[1];function O(e){var t=e.target.dataset.id,s=n.find((function(e){return e.id===t}));(function(e){var t='Do you want to delete entry called "'.concat(e,'"?');return!window.confirm(t)})(s.name)||v.delete(t).then((function(){var e='Entry "'.concat(s.name,'" was successfully deleted.');a(e),setTimeout((function(){return a(null)}),5e3)})).catch((function(e){var n="Unable to delete entry ".concat(t," (").concat(s.name,") from the server. ")+"Maybe it was deleted earlier or did never exist.";c(n),setTimeout((function(){return c(null)}),5e3)})).finally(r(n.filter((function(e){return e.id!==t}))))}return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(f,{content:t}),Object(l.jsxs)("div",{children:["Filter with:",Object(l.jsx)("input",{value:d.text,onChange:function(e){var t=e.target.value,n={text:t,filter:t.trim().toUpperCase()};j(n)}})]}),n.filter((function(e){return e.name.toUpperCase().includes(d.filter)})).map((function(e){return Object(l.jsx)(b,{entry:e,deleteHandler:O},e.id)}))]})},g=n(6),x=function(e){var t=e.title,n=e.entries,r=e.setEntries,a=e.setInfoMessage,i=e.setErrorMessage,d=Object(u.useState)(c),b=Object(s.a)(d,2),j=b[0],O=b[1],h=Object(u.useState)(c),m=Object(s.a)(h,2),p=m[0],x=m[1];function E(e){a(e),setTimeout((function(){return a(null)}),5e3)}function y(e){i(e),setTimeout((function(){return i(null)}),5e3)}return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(f,{content:t}),Object(l.jsxs)("form",{onSubmit:function(e){e.preventDefault();var t=j.trim();if(t.length<1)y("An empty name cannot be added to the phonebook.");else{var a=t.toUpperCase(),s=n.find((function(e){return e.name.toUpperCase()===a}));if(s){var i=o.replace("{}",s.name);if(window.confirm(i)){var u=Object(g.a)(Object(g.a)({},s),{},{phoneNumber:p});v.update(u).then((function(e){var t=n.map((function(t){return t.id!==u.id?t:e}));r(t),E('Entry "'.concat(u.name,'" was successfully updated.'))}))}}else{var l={name:j,phoneNumber:p};v.create(l).then((function(e){r(n.concat(e)),E('Entry "'.concat(l.name,'" was successfully added.'))})).catch((function(e){var t="Adding entry ".concat(l.name," failed");try{if(400===e.request.status){var n=JSON.parse(e.request.response);if(n.errors&&Array.isArray(n.errors))if(t+=" for the following reason",1===n.errors.length)(t+=": "+n.errors[0].message).endsWith(".")||(t+=".");else{t+="s:";for(var r=0;r<n.errors.length;r++)(t+=" (".concat(r+1,") ")+n.errors[r].message).endsWith(".")||(t+=".")}}}catch(a){t+=" for an unexpected reason"}y(t)}))}}O(c),x(c)},children:[Object(l.jsxs)("div",{children:["Name: ",Object(l.jsx)("input",{value:j,onChange:function(e){return O(e.target.value)}})]}),Object(l.jsxs)("div",{children:["Number: ",Object(l.jsx)("input",{value:p,onChange:function(e){return x(e.target.value)}})]}),Object(l.jsx)("div",{children:Object(l.jsx)("button",{type:"submit",children:"Add"})})]})]})},E=function(e){var t=e.content,n=e.baseClass,r=e.messageVisibleClass;null===t&&(t="");var a=n;return null!==t&&t.length>0&&(a+=" "+r),Object(l.jsx)("div",{className:a,children:t})},y=function(){var e=Object(u.useState)([]),t=Object(s.a)(e,2),n=t[0],r=t[1],a=Object(u.useState)(null),c=Object(s.a)(a,2),i=c[0],o=c[1],f=Object(u.useState)(null),b=Object(s.a)(f,2),j=b[0],O=b[1];return Object(u.useEffect)((function(){v.getAll().then((function(e){return r(e)}))}),[]),Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(d,{content:"Phonebook"}),Object(l.jsx)(x,{title:"Add a New Entry",entries:n,setEntries:r,setInfoMessage:O,setErrorMessage:o}),Object(l.jsx)(E,{content:i,baseClass:"notificationBox",messageVisibleClass:"errorVisible"}),Object(l.jsx)(E,{content:j,baseClass:"notificationBox",messageVisibleClass:"infoVisible"}),Object(l.jsx)(p,{title:"Saved Entries",entries:n,setEntries:r,setInfoMessage:O,setErrorMessage:o})]})};n(39);a.a.render(Object(l.jsx)(y,{}),document.getElementById("root"))}},[[40,1,2]]]);
//# sourceMappingURL=main.ec50410c.chunk.js.map