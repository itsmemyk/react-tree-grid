import{_ as le}from"./iframe-0zq1ujIM.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CXOcBcs0.js";import{D as Ot,a as v,T as y}from"./DragManager-I0dlV2Nj.js";import{G as c}from"./Grid-Cl6PUJzz.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";function x(n={}){const{data:t,config:r}=n,o=s.useRef(null);o.current===null&&(o.current=new Ot(r),t!=null&&t.length&&o.current.parse(t));const a=o.current,[d,h]=s.useState(()=>[...a._order]);s.useEffect(()=>{const i=()=>{h([...a._order])};return a.events.on(v.change,i),a.events.on(v.load,i),a.events.on(v.removeAll,i),a.events.on(v.filter,i),()=>{a.events.clear()}},[a]);const p=s.useCallback((i,g)=>a.add(i,g),[a]),_=s.useCallback(i=>a.remove(i),[a]),S=s.useCallback((i,g,ne)=>a.update(i,g,ne),[a]),ae=s.useCallback((i,g)=>{a.sort(i,g),h([...a._order])},[a]),w=s.useCallback((i,g)=>{const ne=a.filter(i,g);return h([...a._order]),ne},[a]),f=s.useCallback(i=>{const g=a.resetFilter(i);return h([...a._order]),g},[a]),$t=s.useCallback(i=>a.parse(i),[a]),Wt=s.useCallback(()=>a.removeAll(),[a]);return{items:d,store:a,add:p,remove:_,update:S,getItem:s.useCallback(i=>a.getItem(i),[a]),getIndex:s.useCallback(i=>a.getIndex(i),[a]),getLength:s.useCallback(()=>a.getLength(),[a]),exists:s.useCallback(i=>a.exists(i),[a]),sort:ae,filter:w,resetFilter:f,find:s.useCallback(i=>a.find(i),[a]),findAll:s.useCallback(i=>a.findAll(i),[a]),serialize:s.useCallback(()=>a.serialize(),[a]),parse:$t,removeAll:Wt}}const X=["Lead","Developer","QA Engineer","DevOps","Designer","PM"],Z=["Alpha","Beta","Gamma","Delta"],ee=["North","South","East","West"],te=["Alice Chen","Bob Rivera","Carla Müller","David Kim","Eva Torres","Frank Osei","Grace Liu","Hassan Ali","Iris Novak","James Okoro","Kira Singh","Liam Brown","Mina Sato","Noah Garcia","Olivia Jansen","Pavel Sokolov","Quinn Murphy","Rosa Fernandes","Samuel Ek","Tara Gupta"];function re(n){return Array.from({length:n},(t,r)=>({id:String(r+1),name:te[r%te.length],role:X[r%X.length],team:Z[r%Z.length],region:ee[r%ee.length],salary:45e3+Math.floor(Math.random()*8e4),age:22+r%35,active:r%5!==0}))}const m=re(50),Kt=re(200),Vt=re(5e3),u=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,resizable:!0},{id:"role",header:[{text:"Role"}],width:140,resizable:!0},{id:"team",header:[{text:"Team"}],width:120,resizable:!0},{id:"region",header:[{text:"Region"}],width:120,resizable:!0},{id:"salary",header:[{text:"Salary"}],width:120,resizable:!0,align:"right",template:n=>`$${Number(n).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}],l=500,_a={title:"Grid",component:c,decorators:[n=>e.jsx(y,{children:e.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:e.jsx(n,{})})})],parameters:{layout:"fullscreen"}},b={name:"Basic Usage",args:{columns:u,data:m.slice(0,15),style:{width:"100%",height:l}}},C={name:"Virtual Scroll",args:{columns:u,data:Vt,style:{width:"100%",height:l}}};function Jt(){const n=[{id:"id",header:[{text:"# (frozen)"}],width:100},{id:"name",header:[{text:"Name (frozen)"}],width:200},{id:"role",header:[{text:"Role"}],width:220},{id:"team",header:[{text:"Team"}],width:220},{id:"region",header:[{text:"Region"}],width:220},{id:"salary",header:[{text:"Salary"}],width:200,align:"right",template:t=>`$${Number(t).toLocaleString()}`},{id:"active",header:[{text:"Active"}],width:200,align:"center",template:t=>t?"Yes":"No"},{id:"age",header:[{text:"Age (frozen)"}],width:120,align:"center"}];return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Scroll horizontally — first 2 columns and last column stay frozen. First and last rows stay frozen on vertical scroll."}),e.jsx(c,{columns:n,data:m,leftSplit:2,rightSplit:1,topSplit:1,bottomSplit:1,style:{width:"100%",height:l}})]})}const k={name:"Frozen Columns & Rows",render:()=>e.jsx(Jt,{})},j={name:"Column Resize",args:{columns:u.map(n=>({...n,resizable:!0,minWidth:60,maxWidth:400})),data:m.slice(0,15),style:{width:"100%",height:l}}};function Ut(){const{items:n,store:t}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a header to sort. Ctrl+click for multi-column sort. Click again to cycle: asc → desc → none."}),e.jsx(c,{columns:u,data:n,store:t,sortable:!0,style:{width:"100%",height:l},onAfterSort:r=>console.log("Sort states:",r)})]})}const A={name:"Sorting",render:()=>e.jsx(Ut,{})},Yt=[{id:"1",shift:"Morning Shift",animal_name:"Bella",animal_type:"Dog",animal_age:5,task:"Walk",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:3,contact:"(212) 555-0118",shelter_location:"Western Branch",animal_photo:"./img/animals/01.jpg"},{id:"2",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Feed",task_status:"Open",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"3",shift:"Evening Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"4",shift:"Morning Shift",animal_name:"Luna",animal_type:"Cat",animal_age:.5,task:"Play",task_status:"Completed",volunteer_name:"Michael Green",experience_level:1,contact:"(323) 555-0325",shelter_location:"Northern Branch",animal_photo:"./img/animals/04.jpg"},{id:"5",shift:"Evening Shift",animal_name:"Charlie",animal_type:"Dog",animal_age:1,task:"Medication",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:1,contact:"(212) 555-0118",shelter_location:"Eastern Branch",animal_photo:"./img/animals/05.jpg"},{id:"6",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Walk",task_status:"Open",volunteer_name:"John Smith",experience_level:3,contact:"(415) 555-0734",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"7",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"8",shift:"Morning Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Emily White",experience_level:3,contact:"(707) 555-0998",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"9",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Open",volunteer_name:"Jessica Brown",experience_level:2,contact:"(818) 555-0876",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"10",shift:"Morning Shift",animal_name:"Daisy",animal_type:"Dog",animal_age:7,task:"Walk",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:1,contact:"(323) 555-0411",shelter_location:"Northern Branch",animal_photo:"./img/animals/09.jpg"},{id:"11",shift:"Afternoon Shift",animal_name:"Toby",animal_type:"Dog",animal_age:5,task:"Clean cage",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Western Branch",animal_photo:"./img/animals/10.jpg"},{id:"12",shift:"Evening Shift",animal_name:"Maggie",animal_type:"Cat",animal_age:2,task:"Play",task_status:"Completed",volunteer_name:"Mark Foster",experience_level:3,contact:"(408) 555-0217",shelter_location:"Eastern Branch",animal_photo:"./img/animals/11.jpg"},{id:"13",shift:"Afternoon Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"14",shift:"Evening Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Play",task_status:"Completed",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"15",shift:"Morning Shift",animal_name:"Rocky",animal_type:"Cat",animal_age:4,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/12.jpg"},{id:"16",shift:"Afternoon Shift",animal_name:"Oliver",animal_type:"Cat",animal_age:3,task:"Feed",task_status:"In Progress",volunteer_name:"Michael Green",experience_level:2,contact:"(323) 555-0325",shelter_location:"Western Branch",animal_photo:"./img/animals/13.jpg"},{id:"17",shift:"Morning Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Play",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:2,contact:"(323) 555-0411",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"18",shift:"Afternoon Shift",animal_name:"Sasha",animal_type:"Cat",animal_age:7,task:"Walk",task_status:"In Progress",volunteer_name:"John Smith",experience_level:1,contact:"(415) 555-0734",shelter_location:"Southern Branch",animal_photo:"./img/animals/15.jpg"},{id:"19",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Completed",volunteer_name:"Michael Green",experience_level:3,contact:"(323) 555-0325",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"20",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"21",shift:"Evening Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Train",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"22",shift:"Afternoon Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Monica Hill",experience_level:1,contact:"(415) 555-0623",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"23",shift:"Evening Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"24",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Medication",task_status:"In Progress",volunteer_name:"Ben Carter",experience_level:3,contact:"(415) 555-0198",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"}],Qt={Open:"#f59e0b","In Progress":"#0288d1",Completed:"#12a66a"},qt=[{id:"animal_name",header:[{text:"Animal name"}],width:140,template:(n,t)=>e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("img",{src:t.animal_photo,alt:"",style:{borderRadius:"50%",height:28,width:28}}),t.animal_name]})},{id:"animal_type",header:[{text:"Animal type"}],width:130},{id:"animal_age",type:"number",header:[{text:"Age"}],width:66,align:"right"},{id:"task",header:[{text:"Task"}],width:96},{id:"task_status",header:[{text:"Task status"}],width:130,template:n=>{const t=n;return e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("span",{style:{background:Qt[t],borderRadius:"50%",height:8,width:8}}),t]})}},{id:"volunteer_name",header:[{text:"Volunteer name"}],width:155},{id:"experience_level",type:"number",header:[{text:"Experience Level",align:"left"}],width:165,align:"left",template:n=>e.jsx("span",{style:{color:"#f59e0b",fontSize:18},children:"★".repeat(Number(n))})},{id:"contact",header:[{text:"Contact",align:"right"}],width:124,align:"right"},{id:"shelter_location",header:[{text:"Shelter location"}],width:155},{id:"shift",header:[{text:"Shift"}],width:120}];function Xt(){const{items:n,store:t}=x({data:Yt});return s.useEffect(()=>{t.sort([{by:"volunteer_name",dir:"desc"},{by:"task_status",dir:"asc"},{by:"animal_type",dir:"asc"}])},[t]),e.jsx(c,{columns:qt,data:n,store:t,sortable:!0,selection:"row",style:{width:"100%",height:l}})}const D={name:"Multi-Column Sorting",render:()=>e.jsx(Xt,{})},E={name:"Row Selection",args:{columns:u,data:m.slice(0,20),selection:"row",multiselection:!0,style:{width:"100%",height:l}}},R={name:"Cell Selection",args:{columns:u,data:m.slice(0,20),selection:"cell",style:{width:"100%",height:l}}},T={name:"Complex Selection",args:{columns:u,data:m.slice(0,20),selection:"complex",multiselection:!0,style:{width:"100%",height:l}}};function Zt(){const n=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:t,store:r}=x({data:m.slice(0,15)});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Double-click a cell to edit. Enter to save, Escape to cancel, Tab to move to next editable cell."}),e.jsx(c,{columns:n,data:t,store:r,editable:!0,selection:"cell",style:{width:"100%",height:l},onAfterEditEnd:(o,a,d)=>console.log(`Edited [${o}][${a}] →`,d)})]})}const M={name:"Inline Editing",render:()=>e.jsx(Zt,{})};function ea(){const n=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:140},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:o=>`$${Number(o).toLocaleString()}`}],{items:t,store:r}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Second header row has filters: text input for Name, dropdown for Role/Team, searchable combo for Region."}),e.jsx(c,{columns:n,data:t,store:r,style:{width:"100%",height:l}})]})}const z={name:"Header Filters",render:()=>e.jsx(ea,{})};function ta(){const n=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60},{id:"name",header:[{text:"Name"}],footer:[{text:"Totals"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:120},{id:"salary",header:[{text:"Salary"}],width:140,align:"right",footer:[{content:"sum"},{content:"avg"}],template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",footer:[{content:"min"},{content:"max"}]}],{items:t,store:r}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Footer rows show aggregations: count, sum, avg, min, max. Salary has two footer rows (sum + avg)."}),e.jsx(c,{columns:n,data:t,store:r,style:{width:"100%",height:l}})]})}const P={name:"Footer Summaries",render:()=>e.jsx(ta,{})},F={name:"Cell Spans",args:{columns:u.slice(0,5),data:m.slice(0,12),spans:[{row:"1",column:"name",colspan:2,text:"Alice Chen — Lead",css:""},{row:"3",column:"team",rowspan:3,text:"Team Gamma (shared)",css:""},{row:"6",column:"name",colspan:3,rowspan:2,text:"Merged block (2×3)",css:""}],style:{width:"100%",height:l}}},B={name:"Column Reorder",args:{columns:u,data:m.slice(0,16),dragItem:"column",style:{width:"100%",height:l}}},I={name:"Column Reorder with Frozen Splits",args:{columns:u,data:m,dragItem:"column",leftSplit:2,rightSplit:1,style:{width:"100%",height:l}}};function aa(){const{items:n,store:t}=x({data:m.slice(0,10)});return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:12,display:"flex",gap:8},children:[e.jsx("button",{onClick:()=>{le(async()=>{const{downloadGridAsCsv:r}=await import("./index-U4fRbjDe.js");return{downloadGridAsCsv:r}},[]).then(({downloadGridAsCsv:r})=>{r(t,u,"employees.csv")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export CSV"}),e.jsx("button",{onClick:()=>{le(async()=>{const{downloadGridAsExcel:r}=await import("./index-U4fRbjDe.js");return{downloadGridAsExcel:r}},[]).then(({downloadGridAsExcel:r})=>{r(t,u,"employees.xlsx")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export Excel"})]}),e.jsx(c,{columns:u,data:n,store:t,style:{width:"100%",height:l}})]})}const N={name:"Export",render:()=>e.jsx(aa,{})};function na(){const n=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60,resizable:!0},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120,sortable:!0,resizable:!0},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:130,sortable:!0,resizable:!0},{id:"salary",header:[{text:"Salary"}],footer:[{content:"sum"},{content:"avg"}],width:130,sortable:!0,resizable:!0,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],footer:[{content:"min"},{content:"max"}],width:80,sortable:!0,align:"center",editorType:"input"}],{items:t,store:r}=x({data:Kt});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"All features active: sorting, filters, footers, resize, editing (dbl-click), selection (Ctrl/Shift+click), column drag reorder, 200 rows virtual scroll."}),e.jsx(c,{columns:n,data:t,store:r,sortable:!0,editable:!0,selection:"complex",multiselection:!0,dragItem:"column",leftSplit:1,style:{width:"100%",height:l},onAfterSort:o=>console.log("Sort:",o),onAfterEditEnd:(o,a,d)=>console.log(`Edit [${o}][${a}]:`,d),onAfterSelect:(o,a)=>console.log(`Select [${o}][${a}]`)})]})}const G={name:"Kitchen Sink (all features)",render:()=>e.jsx(na,{})};function ra(){const n=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:t,store:r}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a cell, then use arrow keys to navigate. Tab/Shift+Tab wraps across rows. Enter to edit, Escape to cancel. PageUp/Down scrolls viewport. Ctrl+Arrow jumps to first/last row/col."}),e.jsx(c,{columns:n,data:t,store:r,editable:!0,selection:"complex",keyNavigation:!0,style:{width:"100%",height:l},onAfterSelect:(o,a)=>console.log(`Select [${o}][${a}]`),onAfterEditEnd:(o,a,d)=>console.log(`Edit [${o}][${a}]:`,d)})]})}const H={name:"Keyboard Navigation (arrow/tab/enter)",render:()=>e.jsx(ra,{})};function oa(){const n=s.useMemo(()=>m.slice(0,20).map((r,o)=>({...r,role:o%4===0?"Senior Principal Software Engineer":r.role,region:o%3===0?"North American Operations":r.region})),[]),t=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],adjust:"data"},{id:"role",header:[{text:"Role"}],adjust:!0},{id:"team",header:[{text:"Team"}],adjust:"header"},{id:"region",header:[{text:"Region"}],adjust:"data"},{id:"salary",header:[{text:"Salary"}],adjust:"data",align:"right",template:r=>`$${Number(r).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Columns auto-fit to widest data/header value via ",e.jsx("code",{children:"adjust"}),"."]}),e.jsx(c,{columns:t,data:n,style:{width:"100%",height:l}})]})}const L={name:"Adjust columns (auto-fit to content)",render:()=>e.jsx(oa,{})};function ia(){const n=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],gravity:2},{id:"role",header:[{text:"Role"}],gravity:1},{id:"team",header:[{text:"Team"}],gravity:1},{id:"region",header:[{text:"Region"}],gravity:1},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:t=>`$${Number(t).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Flexible columns fill the container proportionally by ",e.jsx("code",{children:"gravity"}),". name takes 2× the share of its siblings."]}),e.jsx(c,{autoWidth:!0,columns:n,data:m,style:{width:"100%",height:l}})]})}const $={name:"Auto width (fill container by gravity)",render:()=>e.jsx(ia,{})};function sa(){const n=s.useMemo(()=>[{id:"1",name:"Alice Chen",role:"Senior Principal Software Engineer working on distributed systems and event-sourcing pipelines",team:"Alpha",region:"North",salary:12e4,age:34,active:!0},{id:"2",name:"Bob Rivera",role:"QA Engineer",team:"Beta",region:"South",salary:8e4,age:28,active:!0},{id:"3",name:"Carla Müller",role:"Frontend Developer specializing in accessibility and design systems across product surfaces",team:"Gamma",region:"East",salary:95e3,age:31,active:!0}],[]),t=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:140},{id:"role",header:[{text:"Role"}],width:200},{id:"team",header:[{text:"Team"}],width:100},{id:"region",header:[{text:"Region"}],width:100}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Rows grow vertically to fit wrapped cell text when ",e.jsx("code",{children:"autoHeight"})," is on."]}),e.jsx(c,{autoHeight:!0,columns:t,data:n,style:{width:"100%",height:l}})]})}const W={name:"Auto height (wrap cell content)",render:()=>e.jsx(sa,{})};function la(){const n=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140,tooltipTemplate:(t,r)=>`${r.name} — ${t}`},{id:"team",header:[{text:"Team"}],width:120},{id:"region",header:[{text:"Region"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:t=>`$${Number(t).toLocaleString()}`,tooltipTemplate:t=>`Annual salary: $${Number(t).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Hover over cells. Role and Salary columns use ",e.jsx("code",{children:"tooltipTemplate"}),"; other columns show raw value."]}),e.jsx(c,{tooltip:!0,columns:n,data:m.slice(0,20),style:{width:"100%",height:l}})]})}const O={name:"Tooltip (cell hover)",render:()=>e.jsx(la,{})};function da(){return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Drag rows to reorder them. A horizontal drop line shows the insertion point."}),e.jsx(c,{columns:u,data:m.slice(0,14),dragItem:"row",style:{width:"100%",height:l}})]})}const K={name:"Row drag & drop",render:()=>e.jsx(da,{})};function ca(){const n=s.useRef(null),[t,r]=s.useState(!0),o=s.useMemo(()=>[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"city",header:[{text:"City"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:d=>`$${Number(d).toLocaleString()}`,mark:{min:"gridStoryMarkMin",max:"gridStoryMarkMax"}},{id:"team",header:[{text:"Team"}],width:120,mark:(d,h,p)=>p.team==="Gamma"?"gridStoryMarkGamma":!1}],[]),a=m.slice(0,12);return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Imperative API: addRowCss, addCellCss, showColumn/hideColumn. Salary uses min/max marks; Team uses a function mark."}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"},children:[e.jsx("button",{type:"button",onClick:()=>{var d,h;(d=n.current)==null||d.addRowCss("1","gridStoryRowAccent"),(h=n.current)==null||h.addCellCss("1","salary","gridStoryCellAccent")},children:"Highlight first row"}),e.jsx("button",{type:"button",onClick:()=>{var d,h;(d=n.current)==null||d.removeRowCss("1","gridStoryRowAccent"),(h=n.current)==null||h.removeCellCss("1","salary","gridStoryCellAccent")},children:"Clear highlight"}),e.jsxs("button",{type:"button",onClick:()=>{var d,h;t?(d=n.current)==null||d.hideColumn("city"):(h=n.current)==null||h.showColumn("city"),r(p=>!p)},children:[t?"Hide":"Show"," city column"]})]}),e.jsx("style",{children:`
        .gridStoryRowAccent { background: rgba(255, 214, 102, 0.28); }
        .gridStoryCellAccent { background: rgba(255, 107, 107, 0.16); color: #8f1d21; font-weight: 600; }
        .gridStoryMarkMin { background: rgba(56, 217, 169, 0.18); color: #087f5b; }
        .gridStoryMarkMax { background: rgba(255, 146, 43, 0.18); color: #d9480f; font-weight: 600; }
        .gridStoryMarkGamma { box-shadow: inset 0 0 0 1px rgba(66, 99, 235, 0.35); color: #364fc7; }
      `}),e.jsx(c,{ref:n,columns:o,data:a,style:{width:"100%",height:l}})]})}const V={name:"CSS API + marks",render:()=>e.jsx(ca,{})},oe=Array.from({length:200},(n,t)=>({id:`${t+1}`,name:te[t%te.length],role:X[t%X.length],team:Z[t%Z.length],region:ee[t%ee.length],salary:5e4+t*317%6e4,age:22+t*7%40,active:t%3!==0}));function ie(n){return async t=>{await new Promise(S=>setTimeout(S,300));const r=new URLSearchParams(t.split("?")[1]),o=Number(r.get("page")??1),a=Number(r.get("size")??50),d=r.get("sortBy"),h=r.get("sortDir");let p=[...n];d&&p.sort((S,ae)=>{const w=String(S[d]??""),f=String(ae[d]??"");return h==="desc"?f.localeCompare(w):w.localeCompare(f)});const _=(o-1)*a;return{ok:!0,json:async()=>({data:p.slice(_,_+a),total:p.length})}}}const se=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:100},{id:"salary",header:[{text:"Salary"}],width:100}],J={name:"DataProxy — Remote Pagination (append)",render:()=>e.jsx(y,{children:e.jsx(c,{columns:se,data:[],dataProxy:{url:"https://api.test/employees",pageSize:20,fetchFn:ie(oe)},paginationMode:"append",style:{height:400,width:"100%"}})})},U={name:"DataProxy — Remote Sort",render:()=>e.jsx(y,{children:e.jsx(c,{columns:se,data:[],dataProxy:{url:"https://api.test/employees",pageSize:50,fetchFn:ie(oe)},remoteSort:!0,sortable:!0,style:{height:400,width:"100%"}})})},Y={name:"DataProxy — Polling (2s)",render:()=>{const[n,t]=s.useState(0),r=s.useMemo(()=>({url:"https://api.test/employees",pageSize:10,polling:2e3,fetchFn:async o=>(t(a=>a+1),ie(oe)(o))}),[]);return e.jsxs(y,{children:[e.jsxs("p",{style:{margin:"0 0 8px"},children:["Tick: ",n," (data refreshes every 2s via polling)"]}),e.jsx(c,{columns:se,data:[],dataProxy:r,style:{height:320,width:"100%"}})]})}},Q={name:"Formula Engine",render(){return e.jsx(y,{children:e.jsx(c,{columns:[{id:"label",header:[{text:"Label"}],width:120},{id:"value",header:[{text:"Value"}],width:100},{id:"doubled",header:[{text:"Doubled (=value*2)"}],width:160},{id:"total",header:[{text:"Total (=SUM)"}],width:160}],data:[{id:"r1",label:"Alpha",value:10,doubled:"=B1*2",total:""},{id:"r2",label:"Beta",value:20,doubled:"=B2*2",total:""},{id:"r3",label:"Gamma",value:30,doubled:"=B3*2",total:"=SUM(B1:B3)"}],formulas:!0,style:{height:200,width:"100%"}})})}},q={name:"Freeze Panes (draggable)",render(){const[n,t]=s.useState(2);return e.jsxs(y,{children:[e.jsxs("p",{style:{margin:"0 0 8px",fontSize:13},children:["Frozen columns: ",e.jsx("strong",{children:n})," — drag the blue handle to change"]}),e.jsx(c,{columns:[{id:"id",header:[{text:"#"}],width:50},{id:"name",header:[{text:"Name"}],width:140},{id:"dept",header:[{text:"Department"}],width:140},{id:"role",header:[{text:"Role"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100},{id:"city",header:[{text:"City"}],width:120},{id:"start",header:[{text:"Start Date"}],width:120}],data:[{id:"1",name:"Alice",dept:"Engineering",role:"Lead",salary:12e4,city:"SF",start:"2020-01"},{id:"2",name:"Bob",dept:"Product",role:"PM",salary:11e4,city:"NYC",start:"2019-06"},{id:"3",name:"Carol",dept:"Design",role:"Senior",salary:95e3,city:"Austin",start:"2021-03"},{id:"4",name:"Dave",dept:"Engineering",role:"Mid",salary:9e4,city:"Seattle",start:"2022-01"}],leftSplit:n,freezable:!0,onFreeze:({left:r})=>t(r),style:{height:240,width:"100%"}})]})}};var de,ce,me;b.parameters={...b.parameters,docs:{...(de=b.parameters)==null?void 0:de.docs,source:{originalSource:`{
  name: 'Basic Usage',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 15),
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(me=(ce=b.parameters)==null?void 0:ce.docs)==null?void 0:me.source}}};var he,ue,pe;C.parameters={...C.parameters,docs:{...(he=C.parameters)==null?void 0:he.docs,source:{originalSource:`{
  name: 'Virtual Scroll',
  args: {
    columns: baseColumns,
    data: data5000,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(pe=(ue=C.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var ge,xe,ye;k.parameters={...k.parameters,docs:{...(ge=k.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: 'Frozen Columns & Rows',
  render: () => <FrozenSplitsDemo />
}`,...(ye=(xe=k.parameters)==null?void 0:xe.docs)==null?void 0:ye.source}}};var Se,_e,we;j.parameters={...j.parameters,docs:{...(Se=j.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Column Resize',
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
}`,...(we=(_e=j.parameters)==null?void 0:_e.docs)==null?void 0:we.source}}};var fe,ve,be;A.parameters={...A.parameters,docs:{...(fe=A.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'Sorting',
  render: () => <SortingDemo />
}`,...(be=(ve=A.parameters)==null?void 0:ve.docs)==null?void 0:be.source}}};var Ce,ke,je;D.parameters={...D.parameters,docs:{...(Ce=D.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'Multi-Column Sorting',
  render: () => <AnimalMultiSortDemo />
}`,...(je=(ke=D.parameters)==null?void 0:ke.docs)==null?void 0:je.source}}};var Ae,De,Ee;E.parameters={...E.parameters,docs:{...(Ae=E.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  name: 'Row Selection',
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
}`,...(Ee=(De=E.parameters)==null?void 0:De.docs)==null?void 0:Ee.source}}};var Re,Te,Me;R.parameters={...R.parameters,docs:{...(Re=R.parameters)==null?void 0:Re.docs,source:{originalSource:`{
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
}`,...(Me=(Te=R.parameters)==null?void 0:Te.docs)==null?void 0:Me.source}}};var ze,Pe,Fe;T.parameters={...T.parameters,docs:{...(ze=T.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  name: 'Complex Selection',
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
}`,...(Fe=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:Fe.source}}};var Be,Ie,Ne;M.parameters={...M.parameters,docs:{...(Be=M.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  name: 'Inline Editing',
  render: () => <EditingDemo />
}`,...(Ne=(Ie=M.parameters)==null?void 0:Ie.docs)==null?void 0:Ne.source}}};var Ge,He,Le;z.parameters={...z.parameters,docs:{...(Ge=z.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  name: 'Header Filters',
  render: () => <HeaderFiltersDemo />
}`,...(Le=(He=z.parameters)==null?void 0:He.docs)==null?void 0:Le.source}}};var $e,We,Oe;P.parameters={...P.parameters,docs:{...($e=P.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  name: 'Footer Summaries',
  render: () => <FooterSummariesDemo />
}`,...(Oe=(We=P.parameters)==null?void 0:We.docs)==null?void 0:Oe.source}}};var Ke,Ve,Je;F.parameters={...F.parameters,docs:{...(Ke=F.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  name: 'Cell Spans',
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
}`,...(Je=(Ve=F.parameters)==null?void 0:Ve.docs)==null?void 0:Je.source}}};var Ue,Ye,Qe;B.parameters={...B.parameters,docs:{...(Ue=B.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  name: 'Column Reorder',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 16),
    dragItem: 'column',
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(Qe=(Ye=B.parameters)==null?void 0:Ye.docs)==null?void 0:Qe.source}}};var qe,Xe,Ze;I.parameters={...I.parameters,docs:{...(qe=I.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  name: 'Column Reorder with Frozen Splits',
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
}`,...(Ze=(Xe=I.parameters)==null?void 0:Xe.docs)==null?void 0:Ze.source}}};var et,tt,at;N.parameters={...N.parameters,docs:{...(et=N.parameters)==null?void 0:et.docs,source:{originalSource:`{
  name: 'Export',
  render: () => <ExportDemo />
}`,...(at=(tt=N.parameters)==null?void 0:tt.docs)==null?void 0:at.source}}};var nt,rt,ot;G.parameters={...G.parameters,docs:{...(nt=G.parameters)==null?void 0:nt.docs,source:{originalSource:`{
  name: 'Kitchen Sink (all features)',
  render: () => <KitchenSinkDemo />
}`,...(ot=(rt=G.parameters)==null?void 0:rt.docs)==null?void 0:ot.source}}};var it,st,lt;H.parameters={...H.parameters,docs:{...(it=H.parameters)==null?void 0:it.docs,source:{originalSource:`{
  name: 'Keyboard Navigation (arrow/tab/enter)',
  render: () => <KeyboardNavDemo />
}`,...(lt=(st=H.parameters)==null?void 0:st.docs)==null?void 0:lt.source}}};var dt,ct,mt;L.parameters={...L.parameters,docs:{...(dt=L.parameters)==null?void 0:dt.docs,source:{originalSource:`{
  name: 'Adjust columns (auto-fit to content)',
  render: () => <AdjustAutoWidthDemo />
}`,...(mt=(ct=L.parameters)==null?void 0:ct.docs)==null?void 0:mt.source}}};var ht,ut,pt;$.parameters={...$.parameters,docs:{...(ht=$.parameters)==null?void 0:ht.docs,source:{originalSource:`{
  name: 'Auto width (fill container by gravity)',
  render: () => <AutoWidthDemo />
}`,...(pt=(ut=$.parameters)==null?void 0:ut.docs)==null?void 0:pt.source}}};var gt,xt,yt;W.parameters={...W.parameters,docs:{...(gt=W.parameters)==null?void 0:gt.docs,source:{originalSource:`{
  name: 'Auto height (wrap cell content)',
  render: () => <AutoHeightDemo />
}`,...(yt=(xt=W.parameters)==null?void 0:xt.docs)==null?void 0:yt.source}}};var St,_t,wt;O.parameters={...O.parameters,docs:{...(St=O.parameters)==null?void 0:St.docs,source:{originalSource:`{
  name: 'Tooltip (cell hover)',
  render: () => <TooltipDemo />
}`,...(wt=(_t=O.parameters)==null?void 0:_t.docs)==null?void 0:wt.source}}};var ft,vt,bt;K.parameters={...K.parameters,docs:{...(ft=K.parameters)==null?void 0:ft.docs,source:{originalSource:`{
  name: 'Row drag & drop',
  render: () => <RowDragDemo />
}`,...(bt=(vt=K.parameters)==null?void 0:vt.docs)==null?void 0:bt.source}}};var Ct,kt,jt;V.parameters={...V.parameters,docs:{...(Ct=V.parameters)==null?void 0:Ct.docs,source:{originalSource:`{
  name: 'CSS API + marks',
  render: () => <CssApiAndMarksDemo />
}`,...(jt=(kt=V.parameters)==null?void 0:kt.docs)==null?void 0:jt.source}}};var At,Dt,Et;J.parameters={...J.parameters,docs:{...(At=J.parameters)==null?void 0:At.docs,source:{originalSource:`{
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
}`,...(Et=(Dt=J.parameters)==null?void 0:Dt.docs)==null?void 0:Et.source}}};var Rt,Tt,Mt;U.parameters={...U.parameters,docs:{...(Rt=U.parameters)==null?void 0:Rt.docs,source:{originalSource:`{
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
}`,...(Mt=(Tt=U.parameters)==null?void 0:Tt.docs)==null?void 0:Mt.source}}};var zt,Pt,Ft;Y.parameters={...Y.parameters,docs:{...(zt=Y.parameters)==null?void 0:zt.docs,source:{originalSource:`{
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
}`,...(Ft=(Pt=Y.parameters)==null?void 0:Pt.docs)==null?void 0:Ft.source}}};var Bt,It,Nt;Q.parameters={...Q.parameters,docs:{...(Bt=Q.parameters)==null?void 0:Bt.docs,source:{originalSource:`{
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
}`,...(Nt=(It=Q.parameters)==null?void 0:It.docs)==null?void 0:Nt.source}}};var Gt,Ht,Lt;q.parameters={...q.parameters,docs:{...(Gt=q.parameters)==null?void 0:Gt.docs,source:{originalSource:`{
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
}`,...(Lt=(Ht=q.parameters)==null?void 0:Ht.docs)==null?void 0:Lt.source}}};const wa=["Default","VirtualScroll","FrozenSplits","ColumnResize","Sorting","AnimalMultiSort","RowSelection","CellSelection","ComplexSelection","InlineEditing","HeaderFilters","FooterSummaries","CellSpans","ColumnReorder","ColumnReorderWithSplits","Export","KitchenSink","KeyboardNavigation","AdjustColumns","AutoWidth","AutoHeight","TooltipStory","RowDrag","CssApiAndMarks","RemotePagination","RemoteSortFilter","Polling","FormulaEngine","FreezePanes"];export{L as AdjustColumns,D as AnimalMultiSort,W as AutoHeight,$ as AutoWidth,R as CellSelection,F as CellSpans,B as ColumnReorder,I as ColumnReorderWithSplits,j as ColumnResize,T as ComplexSelection,V as CssApiAndMarks,b as Default,N as Export,P as FooterSummaries,Q as FormulaEngine,q as FreezePanes,k as FrozenSplits,z as HeaderFilters,M as InlineEditing,H as KeyboardNavigation,G as KitchenSink,Y as Polling,J as RemotePagination,U as RemoteSortFilter,K as RowDrag,E as RowSelection,A as Sorting,O as TooltipStory,C as VirtualScroll,wa as __namedExportsOrder,_a as default};
