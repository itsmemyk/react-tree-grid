import{_ as ie}from"./iframe-8jxEgnkV.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CXOcBcs0.js";import{D as $t,a as v,T as y}from"./DragManager-hDm14j5N.js";import{G as c}from"./Grid-zUnyN8K0.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";function x(a={}){const{data:r,config:n}=a,o=i.useRef(null);o.current===null&&(o.current=new $t(n),r!=null&&r.length&&o.current.parse(r));const t=o.current,[l,h]=i.useState(()=>[...t._order]);i.useEffect(()=>{const s=()=>{h([...t._order])};return t.events.on(v.change,s),t.events.on(v.load,s),t.events.on(v.removeAll,s),t.events.on(v.filter,s),()=>{t.events.clear()}},[t]);const p=i.useCallback((s,g)=>t.add(s,g),[t]),S=i.useCallback(s=>t.remove(s),[t]),w=i.useCallback((s,g,re)=>t.update(s,g,re),[t]),te=i.useCallback((s,g)=>{t.sort(s,g),h([...t._order])},[t]),b=i.useCallback((s,g)=>{const re=t.filter(s,g);return h([...t._order]),re},[t]),f=i.useCallback(s=>{const g=t.resetFilter(s);return h([...t._order]),g},[t]),Lt=i.useCallback(s=>t.parse(s),[t]),_t=i.useCallback(()=>t.removeAll(),[t]);return{items:l,store:t,add:p,remove:S,update:w,getItem:i.useCallback(s=>t.getItem(s),[t]),getIndex:i.useCallback(s=>t.getIndex(s),[t]),getLength:i.useCallback(()=>t.getLength(),[t]),exists:i.useCallback(s=>t.exists(s),[t]),sort:te,filter:b,resetFilter:f,find:i.useCallback(s=>t.find(s),[t]),findAll:i.useCallback(s=>t.findAll(s),[t]),serialize:i.useCallback(()=>t.serialize(),[t]),parse:Lt,removeAll:_t}}const q=["Lead","Developer","QA Engineer","DevOps","Designer","PM"],X=["Alpha","Beta","Gamma","Delta"],Z=["North","South","East","West"],ee=["Alice Chen","Bob Rivera","Carla Müller","David Kim","Eva Torres","Frank Osei","Grace Liu","Hassan Ali","Iris Novak","James Okoro","Kira Singh","Liam Brown","Mina Sato","Noah Garcia","Olivia Jansen","Pavel Sokolov","Quinn Murphy","Rosa Fernandes","Samuel Ek","Tara Gupta"];function ae(a){return Array.from({length:a},(r,n)=>({id:String(n+1),name:ee[n%ee.length],role:q[n%q.length],team:X[n%X.length],region:Z[n%Z.length],salary:45e3+Math.floor(Math.random()*8e4),age:22+n%35,active:n%5!==0}))}const m=ae(50),Ht=ae(200),Bt=ae(5e3),u=[{id:"id",header:[{text:"#"}],width:60,sortable:!0},{id:"name",header:[{text:"Name"}],width:160,sortable:!0,resizable:!0},{id:"role",header:[{text:"Role"}],width:140,sortable:!0,resizable:!0},{id:"team",header:[{text:"Team"}],width:120,sortable:!0,resizable:!0},{id:"region",header:[{text:"Region"}],width:120,sortable:!0,resizable:!0},{id:"salary",header:[{text:"Salary"}],width:120,sortable:!0,resizable:!0,align:"right",template:a=>`$${Number(a).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,sortable:!0,align:"center"}],d=500,mr={title:"Components/Grid",component:c,decorators:[a=>e.jsx(y,{children:e.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:e.jsx(a,{})})})],parameters:{layout:"fullscreen"}},C={args:{columns:u,data:m.slice(0,15),style:{width:"100%",height:d}}},j={name:"Virtual Scroll (5000 rows)",args:{columns:u,data:Bt,style:{width:"100%",height:d}}};function Wt(){const a=[{id:"id",header:[{text:"# (frozen)"}],width:100},{id:"name",header:[{text:"Name (frozen)"}],width:200},{id:"role",header:[{text:"Role"}],width:220},{id:"team",header:[{text:"Team"}],width:220},{id:"region",header:[{text:"Region"}],width:220},{id:"salary",header:[{text:"Salary"}],width:200,align:"right",template:r=>`$${Number(r).toLocaleString()}`},{id:"active",header:[{text:"Active"}],width:200,align:"center",template:r=>r?"Yes":"No"},{id:"age",header:[{text:"Age (frozen)"}],width:120,align:"center"}];return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Scroll horizontally — first 2 columns and last column stay frozen. First and last rows stay frozen on vertical scroll."}),e.jsx(c,{columns:a,data:m,leftSplit:2,rightSplit:1,topSplit:1,bottomSplit:1,style:{width:"100%",height:d}})]})}const A={name:"Frozen Columns & Rows",render:()=>e.jsx(Wt,{})},R={name:"Column Resize (drag header edges)",args:{columns:u.map(a=>({...a,resizable:!0,minWidth:60,maxWidth:400})),data:m.slice(0,15),style:{width:"100%",height:d}}};function Kt(){const{items:a,store:r}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a header to sort. Ctrl+click for multi-column sort. Click again to cycle: asc → desc → none."}),e.jsx(c,{columns:u,data:a,store:r,sortable:!0,style:{width:"100%",height:d},onAfterSort:n=>console.log("Sort states:",n)})]})}const k={name:"Sorting (click headers)",render:()=>e.jsx(Kt,{})},E={name:"Row Selection (click to select)",args:{columns:u,data:m.slice(0,20),selection:"row",multiselection:!0,style:{width:"100%",height:d}}},T={name:"Cell Selection",args:{columns:u,data:m.slice(0,20),selection:"cell",style:{width:"100%",height:d}}},D={name:"Complex Selection (row + cell)",args:{columns:u,data:m.slice(0,20),selection:"complex",multiselection:!0,style:{width:"100%",height:d}}};function Ot(){const a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:r,store:n}=x({data:m.slice(0,15)});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Double-click a cell to edit. Enter to save, Escape to cancel, Tab to move to next editable cell."}),e.jsx(c,{columns:a,data:r,store:n,editable:!0,selection:"cell",style:{width:"100%",height:d},onAfterEditEnd:(o,t,l)=>console.log(`Edited [${o}][${t}] →`,l)})]})}const z={name:"Inline Cell Editing (double-click)",render:()=>e.jsx(Ot,{})};function Vt(){const a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:140},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:o=>`$${Number(o).toLocaleString()}`}],{items:r,store:n}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Second header row has filters: text input for Name, dropdown for Role/Team, searchable combo for Region."}),e.jsx(c,{columns:a,data:r,store:n,style:{width:"100%",height:d}})]})}const F={name:"Header Filters (select, input, combo)",render:()=>e.jsx(Vt,{})};function Yt(){const a=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60},{id:"name",header:[{text:"Name"}],footer:[{text:"Totals"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:120},{id:"salary",header:[{text:"Salary"}],width:140,align:"right",footer:[{content:"sum"},{content:"avg"}],template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",footer:[{content:"min"},{content:"max"}]}],{items:r,store:n}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Footer rows show aggregations: count, sum, avg, min, max. Salary has two footer rows (sum + avg)."}),e.jsx(c,{columns:a,data:r,store:n,style:{width:"100%",height:d}})]})}const P={name:"Footer Summaries (sum, avg, count, min, max)",render:()=>e.jsx(Yt,{})},M={name:"Cell Spans (rowspan/colspan)",args:{columns:u.slice(0,5),data:m.slice(0,12),spans:[{row:"1",column:"name",colspan:2,text:"Alice Chen — Lead",css:""},{row:"3",column:"team",rowspan:3,text:"Team Gamma (shared)",css:""},{row:"6",column:"name",colspan:3,rowspan:2,text:"Merged block (2×3)",css:""}],style:{width:"100%",height:d}}},N={name:"Column Reorder (drag headers)",args:{columns:u,data:m.slice(0,16),dragItem:"column",style:{width:"100%",height:d}}},G={name:"Column Reorder + Frozen Splits",args:{columns:u,data:m,dragItem:"column",leftSplit:2,rightSplit:1,style:{width:"100%",height:d}}};function Ut(){const{items:a,store:r}=x({data:m.slice(0,10)});return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:12,display:"flex",gap:8},children:[e.jsx("button",{onClick:()=>{ie(async()=>{const{downloadGridAsCsv:n}=await import("./index-U4fRbjDe.js");return{downloadGridAsCsv:n}},[]).then(({downloadGridAsCsv:n})=>{n(r,u,"employees.csv")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export CSV"}),e.jsx("button",{onClick:()=>{ie(async()=>{const{downloadGridAsExcel:n}=await import("./index-U4fRbjDe.js");return{downloadGridAsExcel:n}},[]).then(({downloadGridAsExcel:n})=>{n(r,u,"employees.xlsx")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export Excel"})]}),e.jsx(c,{columns:u,data:a,store:r,style:{width:"100%",height:d}})]})}const I={name:"CSV & Excel Export",render:()=>e.jsx(Ut,{})};function Qt(){const a=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60,resizable:!0},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120,sortable:!0,resizable:!0},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:130,sortable:!0,resizable:!0},{id:"salary",header:[{text:"Salary"}],footer:[{content:"sum"},{content:"avg"}],width:130,sortable:!0,resizable:!0,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],footer:[{content:"min"},{content:"max"}],width:80,sortable:!0,align:"center",editorType:"input"}],{items:r,store:n}=x({data:Ht});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"All features active: sorting, filters, footers, resize, editing (dbl-click), selection (Ctrl/Shift+click), column drag reorder, 200 rows virtual scroll."}),e.jsx(c,{columns:a,data:r,store:n,sortable:!0,editable:!0,selection:"complex",multiselection:!0,dragItem:"column",leftSplit:1,style:{width:"100%",height:d},onAfterSort:o=>console.log("Sort:",o),onAfterEditEnd:(o,t,l)=>console.log(`Edit [${o}][${t}]:`,l),onAfterSelect:(o,t)=>console.log(`Select [${o}][${t}]`)})]})}const L={name:"Kitchen Sink (all features)",render:()=>e.jsx(Qt,{})};function Jt(){const a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:r,store:n}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a cell, then use arrow keys to navigate. Tab/Shift+Tab wraps across rows. Enter to edit, Escape to cancel. PageUp/Down scrolls viewport. Ctrl+Arrow jumps to first/last row/col."}),e.jsx(c,{columns:a,data:r,store:n,editable:!0,selection:"complex",keyNavigation:!0,style:{width:"100%",height:d},onAfterSelect:(o,t)=>console.log(`Select [${o}][${t}]`),onAfterEditEnd:(o,t,l)=>console.log(`Edit [${o}][${t}]:`,l)})]})}const _={name:"Keyboard Navigation (arrow/tab/enter)",render:()=>e.jsx(Jt,{})};function qt(){const a=i.useMemo(()=>m.slice(0,20).map((n,o)=>({...n,role:o%4===0?"Senior Principal Software Engineer":n.role,region:o%3===0?"North American Operations":n.region})),[]),r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],adjust:"data"},{id:"role",header:[{text:"Role"}],adjust:!0},{id:"team",header:[{text:"Team"}],adjust:"header"},{id:"region",header:[{text:"Region"}],adjust:"data"},{id:"salary",header:[{text:"Salary"}],adjust:"data",align:"right",template:n=>`$${Number(n).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Columns auto-fit to widest data/header value via ",e.jsx("code",{children:"adjust"}),"."]}),e.jsx(c,{columns:r,data:a,style:{width:"100%",height:d}})]})}const $={name:"Adjust columns (auto-fit to content)",render:()=>e.jsx(qt,{})};function Xt(){const a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],gravity:2},{id:"role",header:[{text:"Role"}],gravity:1},{id:"team",header:[{text:"Team"}],gravity:1},{id:"region",header:[{text:"Region"}],gravity:1},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:r=>`$${Number(r).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Flexible columns fill the container proportionally by ",e.jsx("code",{children:"gravity"}),". name takes 2× the share of its siblings."]}),e.jsx(c,{autoWidth:!0,columns:a,data:m,style:{width:"100%",height:d}})]})}const H={name:"Auto width (fill container by gravity)",render:()=>e.jsx(Xt,{})};function Zt(){const a=i.useMemo(()=>[{id:"1",name:"Alice Chen",role:"Senior Principal Software Engineer working on distributed systems and event-sourcing pipelines",team:"Alpha",region:"North",salary:12e4,age:34,active:!0},{id:"2",name:"Bob Rivera",role:"QA Engineer",team:"Beta",region:"South",salary:8e4,age:28,active:!0},{id:"3",name:"Carla Müller",role:"Frontend Developer specializing in accessibility and design systems across product surfaces",team:"Gamma",region:"East",salary:95e3,age:31,active:!0}],[]),r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:140},{id:"role",header:[{text:"Role"}],width:200},{id:"team",header:[{text:"Team"}],width:100},{id:"region",header:[{text:"Region"}],width:100}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Rows grow vertically to fit wrapped cell text when ",e.jsx("code",{children:"autoHeight"})," is on."]}),e.jsx(c,{autoHeight:!0,columns:r,data:a,style:{width:"100%",height:d}})]})}const B={name:"Auto height (wrap cell content)",render:()=>e.jsx(Zt,{})};function er(){const a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140,tooltipTemplate:(r,n)=>`${n.name} — ${r}`},{id:"team",header:[{text:"Team"}],width:120},{id:"region",header:[{text:"Region"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:r=>`$${Number(r).toLocaleString()}`,tooltipTemplate:r=>`Annual salary: $${Number(r).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Hover over cells. Role and Salary columns use ",e.jsx("code",{children:"tooltipTemplate"}),"; other columns show raw value."]}),e.jsx(c,{tooltip:!0,columns:a,data:m.slice(0,20),style:{width:"100%",height:d}})]})}const W={name:"Tooltip (cell hover)",render:()=>e.jsx(er,{})};function tr(){return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Drag rows to reorder them. A horizontal drop line shows the insertion point."}),e.jsx(c,{columns:u,data:m.slice(0,14),dragItem:"row",style:{width:"100%",height:d}})]})}const K={name:"Row drag & drop",render:()=>e.jsx(tr,{})};function rr(){const a=i.useRef(null),[r,n]=i.useState(!0),o=i.useMemo(()=>[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"city",header:[{text:"City"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:l=>`$${Number(l).toLocaleString()}`,mark:{min:"gridStoryMarkMin",max:"gridStoryMarkMax"}},{id:"team",header:[{text:"Team"}],width:120,mark:(l,h,p)=>p.team==="Gamma"?"gridStoryMarkGamma":!1}],[]),t=m.slice(0,12);return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Imperative API: addRowCss, addCellCss, showColumn/hideColumn. Salary uses min/max marks; Team uses a function mark."}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"},children:[e.jsx("button",{type:"button",onClick:()=>{var l,h;(l=a.current)==null||l.addRowCss("1","gridStoryRowAccent"),(h=a.current)==null||h.addCellCss("1","salary","gridStoryCellAccent")},children:"Highlight first row"}),e.jsx("button",{type:"button",onClick:()=>{var l,h;(l=a.current)==null||l.removeRowCss("1","gridStoryRowAccent"),(h=a.current)==null||h.removeCellCss("1","salary","gridStoryCellAccent")},children:"Clear highlight"}),e.jsxs("button",{type:"button",onClick:()=>{var l,h;r?(l=a.current)==null||l.hideColumn("city"):(h=a.current)==null||h.showColumn("city"),n(p=>!p)},children:[r?"Hide":"Show"," city column"]})]}),e.jsx("style",{children:`
        .gridStoryRowAccent { background: rgba(255, 214, 102, 0.28); }
        .gridStoryCellAccent { background: rgba(255, 107, 107, 0.16); color: #8f1d21; font-weight: 600; }
        .gridStoryMarkMin { background: rgba(56, 217, 169, 0.18); color: #087f5b; }
        .gridStoryMarkMax { background: rgba(255, 146, 43, 0.18); color: #d9480f; font-weight: 600; }
        .gridStoryMarkGamma { box-shadow: inset 0 0 0 1px rgba(66, 99, 235, 0.35); color: #364fc7; }
      `}),e.jsx(c,{ref:a,columns:o,data:t,style:{width:"100%",height:d}})]})}const O={name:"CSS API + marks",render:()=>e.jsx(rr,{})},ne=Array.from({length:200},(a,r)=>({id:`${r+1}`,name:ee[r%ee.length],role:q[r%q.length],team:X[r%X.length],region:Z[r%Z.length],salary:5e4+r*317%6e4,age:22+r*7%40,active:r%3!==0}));function oe(a){return async r=>{await new Promise(w=>setTimeout(w,300));const n=new URLSearchParams(r.split("?")[1]),o=Number(n.get("page")??1),t=Number(n.get("size")??50),l=n.get("sortBy"),h=n.get("sortDir");let p=[...a];l&&p.sort((w,te)=>{const b=String(w[l]??""),f=String(te[l]??"");return h==="desc"?f.localeCompare(b):b.localeCompare(f)});const S=(o-1)*t;return{ok:!0,json:async()=>({data:p.slice(S,S+t),total:p.length})}}}const se=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:100},{id:"salary",header:[{text:"Salary"}],width:100}],V={name:"DataProxy — Remote Pagination (append)",render:()=>e.jsx(y,{children:e.jsx(c,{columns:se,data:[],dataProxy:{url:"https://api.test/employees",pageSize:20,fetchFn:oe(ne)},paginationMode:"append",style:{height:400,width:"100%"}})})},Y={name:"DataProxy — Remote Sort",render:()=>e.jsx(y,{children:e.jsx(c,{columns:se,data:[],dataProxy:{url:"https://api.test/employees",pageSize:50,fetchFn:oe(ne)},remoteSort:!0,sortable:!0,style:{height:400,width:"100%"}})})},U={name:"DataProxy — Polling (2s)",render:()=>{const[a,r]=i.useState(0),n=i.useMemo(()=>({url:"https://api.test/employees",pageSize:10,polling:2e3,fetchFn:async o=>(r(t=>t+1),oe(ne)(o))}),[]);return e.jsxs(y,{children:[e.jsxs("p",{style:{margin:"0 0 8px"},children:["Tick: ",a," (data refreshes every 2s via polling)"]}),e.jsx(c,{columns:se,data:[],dataProxy:n,style:{height:320,width:"100%"}})]})}},Q={name:"Formula Engine",render(){return e.jsx(y,{children:e.jsx(c,{columns:[{id:"label",header:[{text:"Label"}],width:120},{id:"value",header:[{text:"Value"}],width:100},{id:"doubled",header:[{text:"Doubled (=value*2)"}],width:160},{id:"total",header:[{text:"Total (=SUM)"}],width:160}],data:[{id:"r1",label:"Alpha",value:10,doubled:"=B1*2",total:""},{id:"r2",label:"Beta",value:20,doubled:"=B2*2",total:""},{id:"r3",label:"Gamma",value:30,doubled:"=B3*2",total:"=SUM(B1:B3)"}],formulas:!0,style:{height:200,width:"100%"}})})}},J={name:"Freeze Panes (draggable)",render(){const[a,r]=i.useState(2);return e.jsxs(y,{children:[e.jsxs("p",{style:{margin:"0 0 8px",fontSize:13},children:["Frozen columns: ",e.jsx("strong",{children:a})," — drag the blue handle to change"]}),e.jsx(c,{columns:[{id:"id",header:[{text:"#"}],width:50},{id:"name",header:[{text:"Name"}],width:140},{id:"dept",header:[{text:"Department"}],width:140},{id:"role",header:[{text:"Role"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100},{id:"city",header:[{text:"City"}],width:120},{id:"start",header:[{text:"Start Date"}],width:120}],data:[{id:"1",name:"Alice",dept:"Engineering",role:"Lead",salary:12e4,city:"SF",start:"2020-01"},{id:"2",name:"Bob",dept:"Product",role:"PM",salary:11e4,city:"NYC",start:"2019-06"},{id:"3",name:"Carol",dept:"Design",role:"Senior",salary:95e3,city:"Austin",start:"2021-03"},{id:"4",name:"Dave",dept:"Engineering",role:"Mid",salary:9e4,city:"Seattle",start:"2022-01"}],leftSplit:a,freezable:!0,onFreeze:({left:n})=>r(n),style:{height:240,width:"100%"}})]})}};var le,de,ce;C.parameters={...C.parameters,docs:{...(le=C.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    columns: baseColumns,
    data: data50.slice(0, 15),
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ce=(de=C.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var me,he,ue;j.parameters={...j.parameters,docs:{...(me=j.parameters)==null?void 0:me.docs,source:{originalSource:`{
  name: 'Virtual Scroll (5000 rows)',
  args: {
    columns: baseColumns,
    data: data5000,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ue=(he=j.parameters)==null?void 0:he.docs)==null?void 0:ue.source}}};var pe,ge,xe;A.parameters={...A.parameters,docs:{...(pe=A.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  name: 'Frozen Columns & Rows',
  render: () => <FrozenSplitsDemo />
}`,...(xe=(ge=A.parameters)==null?void 0:ge.docs)==null?void 0:xe.source}}};var ye,we,Se;R.parameters={...R.parameters,docs:{...(ye=R.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  name: 'Column Resize (drag header edges)',
  args: {
    columns: baseColumns.map(c => ({
      ...c,
      resizable: true,
      minWidth: 60,
      maxWidth: 400
    })),
    data: data50.slice(0, 15),
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(Se=(we=R.parameters)==null?void 0:we.docs)==null?void 0:Se.source}}};var be,fe,ve;k.parameters={...k.parameters,docs:{...(be=k.parameters)==null?void 0:be.docs,source:{originalSource:`{
  name: 'Sorting (click headers)',
  render: () => <SortingDemo />
}`,...(ve=(fe=k.parameters)==null?void 0:fe.docs)==null?void 0:ve.source}}};var Ce,je,Ae;E.parameters={...E.parameters,docs:{...(Ce=E.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'Row Selection (click to select)',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 20),
    selection: 'row',
    multiselection: true,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(Ae=(je=E.parameters)==null?void 0:je.docs)==null?void 0:Ae.source}}};var Re,ke,Ee;T.parameters={...T.parameters,docs:{...(Re=T.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  name: 'Cell Selection',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 20),
    selection: 'cell',
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(Ee=(ke=T.parameters)==null?void 0:ke.docs)==null?void 0:Ee.source}}};var Te,De,ze;D.parameters={...D.parameters,docs:{...(Te=D.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'Complex Selection (row + cell)',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 20),
    selection: 'complex',
    multiselection: true,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ze=(De=D.parameters)==null?void 0:De.docs)==null?void 0:ze.source}}};var Fe,Pe,Me;z.parameters={...z.parameters,docs:{...(Fe=z.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  name: 'Inline Cell Editing (double-click)',
  render: () => <EditingDemo />
}`,...(Me=(Pe=z.parameters)==null?void 0:Pe.docs)==null?void 0:Me.source}}};var Ne,Ge,Ie;F.parameters={...F.parameters,docs:{...(Ne=F.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  name: 'Header Filters (select, input, combo)',
  render: () => <HeaderFiltersDemo />
}`,...(Ie=(Ge=F.parameters)==null?void 0:Ge.docs)==null?void 0:Ie.source}}};var Le,_e,$e;P.parameters={...P.parameters,docs:{...(Le=P.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  name: 'Footer Summaries (sum, avg, count, min, max)',
  render: () => <FooterSummariesDemo />
}`,...($e=(_e=P.parameters)==null?void 0:_e.docs)==null?void 0:$e.source}}};var He,Be,We;M.parameters={...M.parameters,docs:{...(He=M.parameters)==null?void 0:He.docs,source:{originalSource:`{
  name: 'Cell Spans (rowspan/colspan)',
  args: {
    columns: baseColumns.slice(0, 5),
    data: data50.slice(0, 12),
    spans: [{
      row: '1',
      column: 'name',
      colspan: 2,
      text: 'Alice Chen — Lead',
      css: ''
    }, {
      row: '3',
      column: 'team',
      rowspan: 3,
      text: 'Team Gamma (shared)',
      css: ''
    }, {
      row: '6',
      column: 'name',
      colspan: 3,
      rowspan: 2,
      text: 'Merged block (2×3)',
      css: ''
    }] satisfies GridSpan[],
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(We=(Be=M.parameters)==null?void 0:Be.docs)==null?void 0:We.source}}};var Ke,Oe,Ve;N.parameters={...N.parameters,docs:{...(Ke=N.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  name: 'Column Reorder (drag headers)',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 16),
    dragItem: 'column',
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(Ve=(Oe=N.parameters)==null?void 0:Oe.docs)==null?void 0:Ve.source}}};var Ye,Ue,Qe;G.parameters={...G.parameters,docs:{...(Ye=G.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  name: 'Column Reorder + Frozen Splits',
  args: {
    columns: baseColumns,
    data: data50,
    dragItem: 'column',
    leftSplit: 2,
    rightSplit: 1,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(Qe=(Ue=G.parameters)==null?void 0:Ue.docs)==null?void 0:Qe.source}}};var Je,qe,Xe;I.parameters={...I.parameters,docs:{...(Je=I.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  name: 'CSV & Excel Export',
  render: () => <ExportDemo />
}`,...(Xe=(qe=I.parameters)==null?void 0:qe.docs)==null?void 0:Xe.source}}};var Ze,et,tt;L.parameters={...L.parameters,docs:{...(Ze=L.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  name: 'Kitchen Sink (all features)',
  render: () => <KitchenSinkDemo />
}`,...(tt=(et=L.parameters)==null?void 0:et.docs)==null?void 0:tt.source}}};var rt,at,nt;_.parameters={..._.parameters,docs:{...(rt=_.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  name: 'Keyboard Navigation (arrow/tab/enter)',
  render: () => <KeyboardNavDemo />
}`,...(nt=(at=_.parameters)==null?void 0:at.docs)==null?void 0:nt.source}}};var ot,st,it;$.parameters={...$.parameters,docs:{...(ot=$.parameters)==null?void 0:ot.docs,source:{originalSource:`{
  name: 'Adjust columns (auto-fit to content)',
  render: () => <AdjustAutoWidthDemo />
}`,...(it=(st=$.parameters)==null?void 0:st.docs)==null?void 0:it.source}}};var lt,dt,ct;H.parameters={...H.parameters,docs:{...(lt=H.parameters)==null?void 0:lt.docs,source:{originalSource:`{
  name: 'Auto width (fill container by gravity)',
  render: () => <AutoWidthDemo />
}`,...(ct=(dt=H.parameters)==null?void 0:dt.docs)==null?void 0:ct.source}}};var mt,ht,ut;B.parameters={...B.parameters,docs:{...(mt=B.parameters)==null?void 0:mt.docs,source:{originalSource:`{
  name: 'Auto height (wrap cell content)',
  render: () => <AutoHeightDemo />
}`,...(ut=(ht=B.parameters)==null?void 0:ht.docs)==null?void 0:ut.source}}};var pt,gt,xt;W.parameters={...W.parameters,docs:{...(pt=W.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  name: 'Tooltip (cell hover)',
  render: () => <TooltipDemo />
}`,...(xt=(gt=W.parameters)==null?void 0:gt.docs)==null?void 0:xt.source}}};var yt,wt,St;K.parameters={...K.parameters,docs:{...(yt=K.parameters)==null?void 0:yt.docs,source:{originalSource:`{
  name: 'Row drag & drop',
  render: () => <RowDragDemo />
}`,...(St=(wt=K.parameters)==null?void 0:wt.docs)==null?void 0:St.source}}};var bt,ft,vt;O.parameters={...O.parameters,docs:{...(bt=O.parameters)==null?void 0:bt.docs,source:{originalSource:`{
  name: 'CSS API + marks',
  render: () => <CssApiAndMarksDemo />
}`,...(vt=(ft=O.parameters)==null?void 0:ft.docs)==null?void 0:vt.source}}};var Ct,jt,At;V.parameters={...V.parameters,docs:{...(Ct=V.parameters)==null?void 0:Ct.docs,source:{originalSource:`{
  name: 'DataProxy — Remote Pagination (append)',
  render: () => <ThemeProvider>
      <Grid columns={proxyColumns} data={[]} dataProxy={{
      url: 'https://api.test/employees',
      pageSize: 20,
      fetchFn: makeMockFetch(ALL_EMPLOYEES)
    }} paginationMode="append" style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(At=(jt=V.parameters)==null?void 0:jt.docs)==null?void 0:At.source}}};var Rt,kt,Et;Y.parameters={...Y.parameters,docs:{...(Rt=Y.parameters)==null?void 0:Rt.docs,source:{originalSource:`{
  name: 'DataProxy — Remote Sort',
  render: () => <ThemeProvider>
      <Grid columns={proxyColumns} data={[]} dataProxy={{
      url: 'https://api.test/employees',
      pageSize: 50,
      fetchFn: makeMockFetch(ALL_EMPLOYEES)
    }} remoteSort sortable style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Et=(kt=Y.parameters)==null?void 0:kt.docs)==null?void 0:Et.source}}};var Tt,Dt,zt;U.parameters={...U.parameters,docs:{...(Tt=U.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  name: 'DataProxy — Polling (2s)',
  render: () => {
    const [tick, setTick] = useState(0);
    const dataProxy = useMemo(() => ({
      url: 'https://api.test/employees',
      pageSize: 10,
      polling: 2000,
      fetchFn: async (url: string) => {
        setTick(t => t + 1);
        return makeMockFetch(ALL_EMPLOYEES)(url);
      }
    }), []);
    return <ThemeProvider>
        <p style={{
        margin: '0 0 8px'
      }}>Tick: {tick} (data refreshes every 2s via polling)</p>
        <Grid columns={proxyColumns} data={[]} dataProxy={dataProxy} style={{
        height: 320,
        width: '100%'
      }} />
      </ThemeProvider>;
  }
}`,...(zt=(Dt=U.parameters)==null?void 0:Dt.docs)==null?void 0:zt.source}}};var Ft,Pt,Mt;Q.parameters={...Q.parameters,docs:{...(Ft=Q.parameters)==null?void 0:Ft.docs,source:{originalSource:`{
  name: 'Formula Engine',
  render() {
    return <ThemeProvider>
        <Grid columns={[{
        id: 'label',
        header: [{
          text: 'Label'
        }],
        width: 120
      }, {
        id: 'value',
        header: [{
          text: 'Value'
        }],
        width: 100
      }, {
        id: 'doubled',
        header: [{
          text: 'Doubled (=value*2)'
        }],
        width: 160
      }, {
        id: 'total',
        header: [{
          text: 'Total (=SUM)'
        }],
        width: 160
      }]} data={[{
        id: 'r1',
        label: 'Alpha',
        value: 10,
        doubled: '=B1*2',
        total: ''
      }, {
        id: 'r2',
        label: 'Beta',
        value: 20,
        doubled: '=B2*2',
        total: ''
      }, {
        id: 'r3',
        label: 'Gamma',
        value: 30,
        doubled: '=B3*2',
        total: '=SUM(B1:B3)'
      }]} formulas={true} style={{
        height: 200,
        width: '100%'
      }} />
      </ThemeProvider>;
  }
}`,...(Mt=(Pt=Q.parameters)==null?void 0:Pt.docs)==null?void 0:Mt.source}}};var Nt,Gt,It;J.parameters={...J.parameters,docs:{...(Nt=J.parameters)==null?void 0:Nt.docs,source:{originalSource:`{
  name: 'Freeze Panes (draggable)',
  render() {
    const [frozen, setFrozen] = useState(2);
    return <ThemeProvider>
        <p style={{
        margin: '0 0 8px',
        fontSize: 13
      }}>
          Frozen columns: <strong>{frozen}</strong> — drag the blue handle to change
        </p>
        <Grid columns={[{
        id: 'id',
        header: [{
          text: '#'
        }],
        width: 50
      }, {
        id: 'name',
        header: [{
          text: 'Name'
        }],
        width: 140
      }, {
        id: 'dept',
        header: [{
          text: 'Department'
        }],
        width: 140
      }, {
        id: 'role',
        header: [{
          text: 'Role'
        }],
        width: 140
      }, {
        id: 'salary',
        header: [{
          text: 'Salary'
        }],
        width: 100
      }, {
        id: 'city',
        header: [{
          text: 'City'
        }],
        width: 120
      }, {
        id: 'start',
        header: [{
          text: 'Start Date'
        }],
        width: 120
      }]} data={[{
        id: '1',
        name: 'Alice',
        dept: 'Engineering',
        role: 'Lead',
        salary: 120000,
        city: 'SF',
        start: '2020-01'
      }, {
        id: '2',
        name: 'Bob',
        dept: 'Product',
        role: 'PM',
        salary: 110000,
        city: 'NYC',
        start: '2019-06'
      }, {
        id: '3',
        name: 'Carol',
        dept: 'Design',
        role: 'Senior',
        salary: 95000,
        city: 'Austin',
        start: '2021-03'
      }, {
        id: '4',
        name: 'Dave',
        dept: 'Engineering',
        role: 'Mid',
        salary: 90000,
        city: 'Seattle',
        start: '2022-01'
      }]} leftSplit={frozen} freezable={true} onFreeze={({
        left
      }) => setFrozen(left)} style={{
        height: 240,
        width: '100%'
      }} />
      </ThemeProvider>;
  }
}`,...(It=(Gt=J.parameters)==null?void 0:Gt.docs)==null?void 0:It.source}}};const hr=["Default","VirtualScroll","FrozenSplits","ColumnResize","Sorting","RowSelection","CellSelection","ComplexSelection","InlineEditing","HeaderFilters","FooterSummaries","CellSpans","ColumnReorder","ColumnReorderWithSplits","Export","KitchenSink","KeyboardNavigation","AdjustColumns","AutoWidth","AutoHeight","TooltipStory","RowDrag","CssApiAndMarks","RemotePagination","RemoteSortFilter","Polling","FormulaEngine","FreezePanes"];export{$ as AdjustColumns,B as AutoHeight,H as AutoWidth,T as CellSelection,M as CellSpans,N as ColumnReorder,G as ColumnReorderWithSplits,R as ColumnResize,D as ComplexSelection,O as CssApiAndMarks,C as Default,I as Export,P as FooterSummaries,Q as FormulaEngine,J as FreezePanes,A as FrozenSplits,F as HeaderFilters,z as InlineEditing,_ as KeyboardNavigation,L as KitchenSink,U as Polling,V as RemotePagination,Y as RemoteSortFilter,K as RowDrag,E as RowSelection,k as Sorting,W as TooltipStory,j as VirtualScroll,hr as __namedExportsOrder,mr as default};
