import{_ as ce}from"./iframe-senLckfG.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CXOcBcs0.js";import{D as ta,a as v,T as y}from"./DragManager-C5_IVYfK.js";import{G as c}from"./Grid-DQyDi8ra.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";function x(r={}){const{data:t,config:n}=r,o=s.useRef(null);o.current===null&&(o.current=new ta(n),t!=null&&t.length&&o.current.parse(t));const a=o.current,[l,h]=s.useState(()=>[...a._order]);s.useEffect(()=>{const i=()=>{h([...a._order])};return a.events.on(v.change,i),a.events.on(v.load,i),a.events.on(v.removeAll,i),a.events.on(v.filter,i),()=>{a.events.clear()}},[a]);const p=s.useCallback((i,g)=>a.add(i,g),[a]),S=s.useCallback(i=>a.remove(i),[a]),f=s.useCallback((i,g,oe)=>a.update(i,g,oe),[a]),ne=s.useCallback((i,g)=>{a.sort(i,g),h([...a._order])},[a]),w=s.useCallback((i,g)=>{const oe=a.filter(i,g);return h([...a._order]),oe},[a]),_=s.useCallback(i=>{const g=a.resetFilter(i);return h([...a._order]),g},[a]),Zt=s.useCallback(i=>a.parse(i),[a]),ea=s.useCallback(()=>a.removeAll(),[a]);return{items:l,store:a,add:p,remove:S,update:f,getItem:s.useCallback(i=>a.getItem(i),[a]),getIndex:s.useCallback(i=>a.getIndex(i),[a]),getLength:s.useCallback(()=>a.getLength(),[a]),exists:s.useCallback(i=>a.exists(i),[a]),sort:ne,filter:w,resetFilter:_,find:s.useCallback(i=>a.find(i),[a]),findAll:s.useCallback(i=>a.findAll(i),[a]),serialize:s.useCallback(()=>a.serialize(),[a]),parse:Zt,removeAll:ea}}const ee=["Lead","Developer","QA Engineer","DevOps","Designer","PM"],te=["Alpha","Beta","Gamma","Delta"],ae=["North","South","East","West"],re=["Alice Chen","Bob Rivera","Carla Müller","David Kim","Eva Torres","Frank Osei","Grace Liu","Hassan Ali","Iris Novak","James Okoro","Kira Singh","Liam Brown","Mina Sato","Noah Garcia","Olivia Jansen","Pavel Sokolov","Quinn Murphy","Rosa Fernandes","Samuel Ek","Tara Gupta"];function ie(r){return Array.from({length:r},(t,n)=>({id:String(n+1),name:re[n%re.length],role:ee[n%ee.length],team:te[n%te.length],region:ae[n%ae.length],salary:45e3+Math.floor(Math.random()*8e4),age:22+n%35,active:n%5!==0}))}const m=ie(50),aa=ie(200),ra=ie(5e3),u=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,resizable:!0},{id:"role",header:[{text:"Role"}],width:140,resizable:!0},{id:"team",header:[{text:"Team"}],width:120,resizable:!0},{id:"region",header:[{text:"Region"}],width:120,resizable:!0},{id:"salary",header:[{text:"Salary"}],width:120,resizable:!0,align:"right",template:r=>`$${Number(r).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}],d=500,Ia={title:"Grid",component:c,decorators:[r=>e.jsx(y,{children:e.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:e.jsx(r,{})})})],parameters:{layout:"fullscreen"}},b={name:"Basic Usage",args:{columns:u,data:m.slice(0,15),style:{width:"100%",height:d}}},k={name:"Virtual Scroll",args:{columns:u,data:ra,style:{width:"100%",height:d}}};function na(){const r=[{id:"id",header:[{text:"# (frozen)"}],width:100},{id:"name",header:[{text:"Name (frozen)"}],width:200},{id:"role",header:[{text:"Role"}],width:220},{id:"team",header:[{text:"Team"}],width:220},{id:"region",header:[{text:"Region"}],width:220},{id:"salary",header:[{text:"Salary"}],width:200,align:"right",template:t=>`$${Number(t).toLocaleString()}`},{id:"active",header:[{text:"Active"}],width:200,align:"center",template:t=>t?"Yes":"No"},{id:"age",header:[{text:"Age (frozen)"}],width:120,align:"center"}];return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Scroll horizontally — first 2 columns and last column stay frozen. First and last rows stay frozen on vertical scroll."}),e.jsx(c,{columns:r,data:m,leftSplit:2,rightSplit:1,topSplit:1,bottomSplit:1,style:{width:"100%",height:d}})]})}const C={name:"Frozen Columns & Rows",render:()=>e.jsx(na,{})},j={name:"Column Resize",args:{columns:u.map(r=>({...r,resizable:!0,minWidth:60,maxWidth:400})),data:m.slice(0,15),style:{width:"100%",height:d}}};function oa(){const{items:r,store:t}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a header to sort. Ctrl+click for multi-column sort. Click again to cycle: asc → desc → none."}),e.jsx(c,{columns:u,data:r,store:t,sortable:!0,style:{width:"100%",height:d},onAfterSort:n=>console.log("Sort states:",n)})]})}const A={name:"Sorting",render:()=>e.jsx(oa,{})},Xt=[{id:"1",shift:"Morning Shift",animal_name:"Bella",animal_type:"Dog",animal_age:5,task:"Walk",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:3,contact:"(212) 555-0118",shelter_location:"Western Branch",animal_photo:"./img/animals/01.jpg"},{id:"2",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Feed",task_status:"Open",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"3",shift:"Evening Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"4",shift:"Morning Shift",animal_name:"Luna",animal_type:"Cat",animal_age:.5,task:"Play",task_status:"Completed",volunteer_name:"Michael Green",experience_level:1,contact:"(323) 555-0325",shelter_location:"Northern Branch",animal_photo:"./img/animals/04.jpg"},{id:"5",shift:"Evening Shift",animal_name:"Charlie",animal_type:"Dog",animal_age:1,task:"Medication",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:1,contact:"(212) 555-0118",shelter_location:"Eastern Branch",animal_photo:"./img/animals/05.jpg"},{id:"6",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Walk",task_status:"Open",volunteer_name:"John Smith",experience_level:3,contact:"(415) 555-0734",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"7",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"8",shift:"Morning Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Emily White",experience_level:3,contact:"(707) 555-0998",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"9",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Open",volunteer_name:"Jessica Brown",experience_level:2,contact:"(818) 555-0876",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"10",shift:"Morning Shift",animal_name:"Daisy",animal_type:"Dog",animal_age:7,task:"Walk",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:1,contact:"(323) 555-0411",shelter_location:"Northern Branch",animal_photo:"./img/animals/09.jpg"},{id:"11",shift:"Afternoon Shift",animal_name:"Toby",animal_type:"Dog",animal_age:5,task:"Clean cage",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Western Branch",animal_photo:"./img/animals/10.jpg"},{id:"12",shift:"Evening Shift",animal_name:"Maggie",animal_type:"Cat",animal_age:2,task:"Play",task_status:"Completed",volunteer_name:"Mark Foster",experience_level:3,contact:"(408) 555-0217",shelter_location:"Eastern Branch",animal_photo:"./img/animals/11.jpg"},{id:"13",shift:"Afternoon Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"14",shift:"Evening Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Play",task_status:"Completed",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"15",shift:"Morning Shift",animal_name:"Rocky",animal_type:"Cat",animal_age:4,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/12.jpg"},{id:"16",shift:"Afternoon Shift",animal_name:"Oliver",animal_type:"Cat",animal_age:3,task:"Feed",task_status:"In Progress",volunteer_name:"Michael Green",experience_level:2,contact:"(323) 555-0325",shelter_location:"Western Branch",animal_photo:"./img/animals/13.jpg"},{id:"17",shift:"Morning Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Play",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:2,contact:"(323) 555-0411",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"18",shift:"Afternoon Shift",animal_name:"Sasha",animal_type:"Cat",animal_age:7,task:"Walk",task_status:"In Progress",volunteer_name:"John Smith",experience_level:1,contact:"(415) 555-0734",shelter_location:"Southern Branch",animal_photo:"./img/animals/15.jpg"},{id:"19",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Completed",volunteer_name:"Michael Green",experience_level:3,contact:"(323) 555-0325",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"20",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"21",shift:"Evening Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Train",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"22",shift:"Afternoon Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Monica Hill",experience_level:1,contact:"(415) 555-0623",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"23",shift:"Evening Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"24",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Medication",task_status:"In Progress",volunteer_name:"Ben Carter",experience_level:3,contact:"(415) 555-0198",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"}],ia={Open:"#f59e0b","In Progress":"#0288d1",Completed:"#12a66a"},qt=[{id:"animal_name",header:[{text:"Animal name"}],width:140,template:(r,t)=>e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("img",{src:t.animal_photo,alt:"",style:{borderRadius:"50%",height:28,width:28}}),t.animal_name]})},{id:"animal_type",header:[{text:"Animal type"}],width:130},{id:"animal_age",type:"number",header:[{text:"Age"}],width:66,align:"right"},{id:"task",header:[{text:"Task"}],width:96},{id:"task_status",header:[{text:"Task status"}],width:130,template:r=>{const t=r;return e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("span",{style:{background:ia[t],borderRadius:"50%",height:8,width:8}}),t]})}},{id:"volunteer_name",header:[{text:"Volunteer name"}],width:155},{id:"experience_level",type:"number",header:[{text:"Experience Level",align:"left"}],width:165,align:"left",template:r=>e.jsx("span",{style:{color:"#f59e0b",fontSize:18},children:"★".repeat(Number(r))})},{id:"contact",header:[{text:"Contact",align:"right"}],width:124,align:"right"},{id:"shelter_location",header:[{text:"Shelter location"}],width:155},{id:"shift",header:[{text:"Shift"}],width:120}];function sa(){const{items:r,store:t}=x({data:Xt});return s.useEffect(()=>{t.sort([{by:"volunteer_name",dir:"desc"},{by:"task_status",dir:"asc"},{by:"animal_type",dir:"asc"}])},[t]),e.jsx(c,{columns:qt,data:r,store:t,sortable:!0,selection:"row",style:{width:"100%",height:d}})}const D={name:"Multi-Column Sorting",render:()=>e.jsx(sa,{})},R={name:"Grouping",render(){return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 48px)"},children:[e.jsxs("p",{style:{flexShrink:0,margin:"0 0 8px",fontSize:13},children:["Drag a column header onto the ",e.jsx("strong",{children:"Group by:"})," panel to group rows. Click the sort arrow to change group sort direction. Drag chips to reorder. Click ✕ to remove a grouping. Click the chevron to expand or collapse groups."]}),e.jsx(c,{columns:qt,data:Xt,groupable:!0,sortable:!0,group:{order:["animal_type"]},style:{flex:1,minHeight:0,width:"100%"}})]})}},T={name:"Styling",render:()=>e.jsx(Da,{})},E={name:"Row Selection",args:{columns:u,data:m.slice(0,20),selection:"row",multiselection:!0,style:{width:"100%",height:d}}},M={name:"Cell Selection",args:{columns:u,data:m.slice(0,20),selection:"cell",style:{width:"100%",height:d}}},z={name:"Complex Selection",args:{columns:u,data:m.slice(0,20),selection:"complex",multiselection:!0,style:{width:"100%",height:d}}};function la(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:t,store:n}=x({data:m.slice(0,15)});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Double-click a cell to edit. Enter to save, Escape to cancel, Tab to move to next editable cell."}),e.jsx(c,{columns:r,data:t,store:n,editable:!0,selection:"cell",style:{width:"100%",height:d},onAfterEditEnd:(o,a,l)=>console.log(`Edited [${o}][${a}] →`,l)})]})}const P={name:"Inline Editing",render:()=>e.jsx(la,{})};function da(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:140},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:o=>`$${Number(o).toLocaleString()}`}],{items:t,store:n}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Second header row has filters: text input for Name, dropdown for Role/Team, searchable combo for Region."}),e.jsx(c,{columns:r,data:t,store:n,style:{width:"100%",height:d}})]})}const F={name:"Header Filters",render:()=>e.jsx(da,{})};function ca(){const r=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60},{id:"name",header:[{text:"Name"}],footer:[{text:"Totals"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:120},{id:"salary",header:[{text:"Salary"}],width:140,align:"right",footer:[{content:"sum"},{content:"avg"}],template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",footer:[{content:"min"},{content:"max"}]}],{items:t,store:n}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Footer rows show aggregations: count, sum, avg, min, max. Salary has two footer rows (sum + avg)."}),e.jsx(c,{columns:r,data:t,store:n,style:{width:"100%",height:d}})]})}const B={name:"Footer Summaries",render:()=>e.jsx(ca,{})},I={name:"Cell Spans",args:{columns:u.slice(0,5),data:m.slice(0,12),spans:[{row:"1",column:"name",colspan:2,text:"Alice Chen — Lead",css:""},{row:"3",column:"team",rowspan:3,text:"Team Gamma (shared)",css:""},{row:"6",column:"name",colspan:3,rowspan:2,text:"Merged block (2×3)",css:""}],style:{width:"100%",height:d}}},N={name:"Column Reorder",args:{columns:u,data:m.slice(0,16),dragItem:"column",style:{width:"100%",height:d}}},G={name:"Column Reorder with Frozen Splits",args:{columns:u,data:m,dragItem:"column",leftSplit:2,rightSplit:1,style:{width:"100%",height:d}}};function ma(){const{items:r,store:t}=x({data:m.slice(0,10)});return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:12,display:"flex",gap:8},children:[e.jsx("button",{onClick:()=>{ce(async()=>{const{downloadGridAsCsv:n}=await import("./index-U4fRbjDe.js");return{downloadGridAsCsv:n}},[]).then(({downloadGridAsCsv:n})=>{n(t,u,"employees.csv")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export CSV"}),e.jsx("button",{onClick:()=>{ce(async()=>{const{downloadGridAsExcel:n}=await import("./index-U4fRbjDe.js");return{downloadGridAsExcel:n}},[]).then(({downloadGridAsExcel:n})=>{n(t,u,"employees.xlsx")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export Excel"})]}),e.jsx(c,{columns:u,data:r,store:t,style:{width:"100%",height:d}})]})}const H={name:"Export",render:()=>e.jsx(ma,{})};function ha(){const r=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60,resizable:!0},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120,sortable:!0,resizable:!0},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:130,sortable:!0,resizable:!0},{id:"salary",header:[{text:"Salary"}],footer:[{content:"sum"},{content:"avg"}],width:130,sortable:!0,resizable:!0,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],footer:[{content:"min"},{content:"max"}],width:80,sortable:!0,align:"center",editorType:"input"}],{items:t,store:n}=x({data:aa});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"All features active: sorting, filters, footers, resize, editing (dbl-click), selection (Ctrl/Shift+click), column drag reorder, 200 rows virtual scroll."}),e.jsx(c,{columns:r,data:t,store:n,sortable:!0,editable:!0,selection:"complex",multiselection:!0,dragItem:"column",leftSplit:1,style:{width:"100%",height:d},onAfterSort:o=>console.log("Sort:",o),onAfterEditEnd:(o,a,l)=>console.log(`Edit [${o}][${a}]:`,l),onAfterSelect:(o,a)=>console.log(`Select [${o}][${a}]`)})]})}const L={name:"Kitchen Sink (all features)",render:()=>e.jsx(ha,{})};function ua(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:t,store:n}=x({data:m});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a cell, then use arrow keys to navigate. Tab/Shift+Tab wraps across rows. Enter to edit, Escape to cancel. PageUp/Down scrolls viewport. Ctrl+Arrow jumps to first/last row/col."}),e.jsx(c,{columns:r,data:t,store:n,editable:!0,selection:"complex",keyNavigation:!0,style:{width:"100%",height:d},onAfterSelect:(o,a)=>console.log(`Select [${o}][${a}]`),onAfterEditEnd:(o,a,l)=>console.log(`Edit [${o}][${a}]:`,l)})]})}const $={name:"Keyboard Navigation (arrow/tab/enter)",render:()=>e.jsx(ua,{})};function pa(){const r=s.useMemo(()=>m.slice(0,20).map((n,o)=>({...n,role:o%4===0?"Senior Principal Software Engineer":n.role,region:o%3===0?"North American Operations":n.region})),[]),t=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],adjust:"data"},{id:"role",header:[{text:"Role"}],adjust:!0},{id:"team",header:[{text:"Team"}],adjust:"header"},{id:"region",header:[{text:"Region"}],adjust:"data"},{id:"salary",header:[{text:"Salary"}],adjust:"data",align:"right",template:n=>`$${Number(n).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Columns auto-fit to widest data/header value via ",e.jsx("code",{children:"adjust"}),"."]}),e.jsx(c,{columns:t,data:r,style:{width:"100%",height:d}})]})}const W={name:"Adjust columns (auto-fit to content)",render:()=>e.jsx(pa,{})};function ga(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],gravity:2},{id:"role",header:[{text:"Role"}],gravity:1},{id:"team",header:[{text:"Team"}],gravity:1},{id:"region",header:[{text:"Region"}],gravity:1},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:t=>`$${Number(t).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Flexible columns fill the container proportionally by ",e.jsx("code",{children:"gravity"}),". name takes 2× the share of its siblings."]}),e.jsx(c,{autoWidth:!0,columns:r,data:m,style:{width:"100%",height:d}})]})}const O={name:"Auto width (fill container by gravity)",render:()=>e.jsx(ga,{})};function xa(){const r=s.useMemo(()=>[{id:"1",name:"Alice Chen",role:"Senior Principal Software Engineer working on distributed systems and event-sourcing pipelines",team:"Alpha",region:"North",salary:12e4,age:34,active:!0},{id:"2",name:"Bob Rivera",role:"QA Engineer",team:"Beta",region:"South",salary:8e4,age:28,active:!0},{id:"3",name:"Carla Müller",role:"Frontend Developer specializing in accessibility and design systems across product surfaces",team:"Gamma",region:"East",salary:95e3,age:31,active:!0}],[]),t=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:140},{id:"role",header:[{text:"Role"}],width:200},{id:"team",header:[{text:"Team"}],width:100},{id:"region",header:[{text:"Region"}],width:100}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Rows grow vertically to fit wrapped cell text when ",e.jsx("code",{children:"autoHeight"})," is on."]}),e.jsx(c,{autoHeight:!0,columns:t,data:r,style:{width:"100%",height:d}})]})}const V={name:"Auto height (wrap cell content)",render:()=>e.jsx(xa,{})};function ya(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140,tooltipTemplate:(t,n)=>`${n.name} — ${t}`},{id:"team",header:[{text:"Team"}],width:120},{id:"region",header:[{text:"Region"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:t=>`$${Number(t).toLocaleString()}`,tooltipTemplate:t=>`Annual salary: $${Number(t).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Hover over cells. Role and Salary columns use ",e.jsx("code",{children:"tooltipTemplate"}),"; other columns show raw value."]}),e.jsx(c,{tooltip:!0,columns:r,data:m.slice(0,20),style:{width:"100%",height:d}})]})}const K={name:"Tooltip (cell hover)",render:()=>e.jsx(ya,{})};function fa(){return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Drag rows to reorder them. A horizontal drop line shows the insertion point."}),e.jsx(c,{columns:u,data:m.slice(0,14),dragItem:"row",style:{width:"100%",height:d}})]})}const J={name:"Row drag & drop",render:()=>e.jsx(fa,{})};function Sa(){const r=s.useRef(null),[t,n]=s.useState(!0),o=s.useMemo(()=>[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"city",header:[{text:"City"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:l=>`$${Number(l).toLocaleString()}`,mark:{min:"gridStoryMarkMin",max:"gridStoryMarkMax"}},{id:"team",header:[{text:"Team"}],width:120,mark:(l,h,p)=>p.team==="Gamma"?"gridStoryMarkGamma":!1}],[]),a=m.slice(0,12);return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Imperative API: addRowCss, addCellCss, showColumn/hideColumn. Salary uses min/max marks; Team uses a function mark."}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"},children:[e.jsx("button",{type:"button",onClick:()=>{var l,h;(l=r.current)==null||l.addRowCss("1","gridStoryRowAccent"),(h=r.current)==null||h.addCellCss("1","salary","gridStoryCellAccent")},children:"Highlight first row"}),e.jsx("button",{type:"button",onClick:()=>{var l,h;(l=r.current)==null||l.removeRowCss("1","gridStoryRowAccent"),(h=r.current)==null||h.removeCellCss("1","salary","gridStoryCellAccent")},children:"Clear highlight"}),e.jsxs("button",{type:"button",onClick:()=>{var l,h;t?(l=r.current)==null||l.hideColumn("city"):(h=r.current)==null||h.showColumn("city"),n(p=>!p)},children:[t?"Hide":"Show"," city column"]})]}),e.jsx("style",{children:`
        .gridStoryRowAccent { background: rgba(255, 214, 102, 0.28); }
        .gridStoryCellAccent { background: rgba(255, 107, 107, 0.16); color: #8f1d21; font-weight: 600; }
        .gridStoryMarkMin { background: rgba(56, 217, 169, 0.18); color: #087f5b; }
        .gridStoryMarkMax { background: rgba(255, 146, 43, 0.18); color: #d9480f; font-weight: 600; }
        .gridStoryMarkGamma { box-shadow: inset 0 0 0 1px rgba(66, 99, 235, 0.35); color: #364fc7; }
      `}),e.jsx(c,{ref:r,columns:o,data:a,style:{width:"100%",height:d}})]})}const U={name:"CSS API + marks",render:()=>e.jsx(Sa,{})},se=Array.from({length:200},(r,t)=>({id:`${t+1}`,name:re[t%re.length],role:ee[t%ee.length],team:te[t%te.length],region:ae[t%ae.length],salary:5e4+t*317%6e4,age:22+t*7%40,active:t%3!==0}));function le(r){return async t=>{await new Promise(f=>setTimeout(f,300));const n=new URLSearchParams(t.split("?")[1]),o=Number(n.get("page")??1),a=Number(n.get("size")??50),l=n.get("sortBy"),h=n.get("sortDir");let p=[...r];l&&p.sort((f,ne)=>{const w=String(f[l]??""),_=String(ne[l]??"");return h==="desc"?_.localeCompare(w):w.localeCompare(_)});const S=(o-1)*a;return{ok:!0,json:async()=>({data:p.slice(S,S+a),total:p.length})}}}const de=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:100},{id:"salary",header:[{text:"Salary"}],width:100}],Y={name:"DataProxy — Remote Pagination (append)",render:()=>e.jsx(y,{children:e.jsx(c,{columns:de,data:[],dataProxy:{url:"https://api.test/employees",pageSize:20,fetchFn:le(se)},paginationMode:"append",style:{height:400,width:"100%"}})})},Q={name:"DataProxy — Remote Sort",render:()=>e.jsx(y,{children:e.jsx(c,{columns:de,data:[],dataProxy:{url:"https://api.test/employees",pageSize:50,fetchFn:le(se)},remoteSort:!0,sortable:!0,style:{height:400,width:"100%"}})})},X={name:"DataProxy — Polling (2s)",render:()=>{const[r,t]=s.useState(0),n=s.useMemo(()=>({url:"https://api.test/employees",pageSize:10,polling:2e3,fetchFn:async o=>(t(a=>a+1),le(se)(o))}),[]);return e.jsxs(y,{children:[e.jsxs("p",{style:{margin:"0 0 8px"},children:["Tick: ",r," (data refreshes every 2s via polling)"]}),e.jsx(c,{columns:de,data:[],dataProxy:n,style:{height:320,width:"100%"}})]})}},q={name:"Formula Engine",render(){return e.jsx(y,{children:e.jsx(c,{columns:[{id:"label",header:[{text:"Label"}],width:120},{id:"value",header:[{text:"Value"}],width:100},{id:"doubled",header:[{text:"Doubled (=value*2)"}],width:160},{id:"total",header:[{text:"Total (=SUM)"}],width:160}],data:[{id:"r1",label:"Alpha",value:10,doubled:"=B1*2",total:""},{id:"r2",label:"Beta",value:20,doubled:"=B2*2",total:""},{id:"r3",label:"Gamma",value:30,doubled:"=B3*2",total:"=SUM(B1:B3)"}],formulas:!0,style:{height:200,width:"100%"}})})}},wa=[{id:"1",name:"Alice Martin",role:"Engineer",department:"Product",status:"Active"},{id:"2",name:"Bob Chen",role:"Designer",department:"Design",status:"Active"},{id:"3",name:"Carol Davis",role:"Manager",department:"Ops",status:"Away"},{id:"4",name:"David Kim",role:"Engineer",department:"Platform",status:"Active"},{id:"5",name:"Eva Rossi",role:"Analyst",department:"Finance",status:"Active"},{id:"6",name:"Frank Müller",role:"Engineer",department:"Product",status:"Inactive"},{id:"7",name:"Grace Lee",role:"Designer",department:"Design",status:"Active"},{id:"8",name:"Hiro Tanaka",role:"Manager",department:"Ops",status:"Away"}],_a={Active:"var(--react-tree-grid-color-success)",Away:"var(--react-tree-grid-color-warning)",Inactive:"var(--react-tree-grid-color-danger)"},va={Active:"#fff",Away:"rgba(0,0,0,0.75)",Inactive:"#fff"},ba=[{id:"name",header:[{text:"Name"}],width:180,sortable:!0},{id:"role",header:[{text:"Role"}],width:140,sortable:!0},{id:"department",header:[{text:"Department"}],width:150,sortable:!0},{id:"status",header:[{text:"Status"}],width:120,template:r=>{const t=r;return e.jsx("span",{style:{display:"inline-block",padding:"2px 10px",borderRadius:"var(--react-tree-grid-radius-lg)",background:_a[t],color:va[t],fontSize:11,fontWeight:500,letterSpacing:"0.02em"},children:t})}}],ka=[{label:"Primary",cssVar:"--react-tree-grid-color-primary"},{label:"Secondary",cssVar:"--react-tree-grid-color-secondary"},{label:"Success",cssVar:"--react-tree-grid-color-success"},{label:"Warning",cssVar:"--react-tree-grid-color-warning"},{label:"Danger",cssVar:"--react-tree-grid-color-danger"}],Ca={colorPrimary:"#0d6efd",colorPrimaryHover:"#0b5ed7",colorSecondary:"#6c757d",colorSuccess:"#198754",colorWarning:"#ffc107",colorDanger:"#dc3545",colorBackground:"#ffffff",colorSurface:"#f8f9fa",colorText:"#212529",colorTextSecondary:"#6c757d",colorBorder:"#dee2e6",fontFamily:'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',fontSizeMd:"16px",radiusSm:"4px",radiusMd:"6px",radiusLg:"12px",shadowSm:"0 1px 2px rgba(0,0,0,0.075)",shadowMd:"0 .5rem 1rem rgba(0,0,0,0.15)",colorHeaderBackground:"#0d6efd",colorHeaderText:"#ffffff",colorRowHover:"rgba(13,110,253,0.06)",colorRowSelected:"rgba(13,110,253,0.12)",colorSortActive:"#ffffff",colorSortIdle:"rgba(255,255,255,0.5)"},ja={colorPrimary:"#1976d2",colorPrimaryHover:"#1565c0",colorBackground:"#ffffff",colorSurface:"#fafafa",colorText:"#212121",colorTextSecondary:"#757575",colorBorder:"rgba(0,0,0,0.12)",fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',fontWeightMedium:"500",radiusSm:"0px",radiusMd:"4px",shadowSm:"0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",shadowMd:"0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",colorHeaderBackground:"#673ab7",colorHeaderText:"#ffffff",colorRowHover:"rgba(103,58,183,0.06)",colorRowSelected:"rgba(103,58,183,0.12)",colorSortActive:"#ffffff",colorSortIdle:"rgba(255,255,255,0.5)"},Aa={default:{},bootstrap:Ca,material:ja},me={default:"Default",bootstrap:"Bootstrap 5",material:"Material UI"};function Da(){const[r,t]=s.useState("default"),n=Aa[r],o=Object.keys(n).length===0?"{}":`{
${Object.entries(n).map(([a,l])=>`  ${a}: '${l}'`).join(`,
`)}
}`;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:13,color:"#666"},children:"Theme:"}),e.jsx("select",{value:r,onChange:a=>t(a.target.value),style:{fontSize:13,padding:"4px 8px",borderRadius:4,border:"1px solid #ccc",cursor:"pointer"},children:Object.keys(me).map(a=>e.jsx("option",{value:a,children:me[a]},a))})]}),e.jsxs(y,{theme:"light",overrides:n,children:[e.jsx(c,{columns:ba,data:wa,sortable:!0,defaultSortStates:[{columnId:"name",order:"asc"}],selection:"row",multiselection:!0,style:{width:"100%",height:320}}),e.jsx("div",{style:{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"},children:ka.map(({label:a,cssVar:l})=>e.jsx("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:"var(--react-tree-grid-radius-md)",background:`var(${l})`,color:"#fff",fontSize:11,fontWeight:500,letterSpacing:"0.02em"},children:a},a))})]}),e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 4px",fontSize:12,color:"#888",fontFamily:"monospace"},children:'<ThemeProvider theme="light" overrides={overrides}>'}),e.jsx("pre",{style:{margin:0,padding:"12px 16px",background:"#1e1e1e",color:"#d4d4d4",fontFamily:'"Fira Code", "Cascadia Code", Consolas, monospace',fontSize:12,borderRadius:6,overflowX:"auto",lineHeight:1.6},children:`const overrides = ${o}`})]})]})}const Z={name:"Freeze Panes (draggable)",render(){const[r,t]=s.useState(2);return e.jsxs(y,{children:[e.jsxs("p",{style:{margin:"0 0 8px",fontSize:13},children:["Frozen columns: ",e.jsx("strong",{children:r})," — drag the blue handle to change"]}),e.jsx(c,{columns:[{id:"id",header:[{text:"#"}],width:50},{id:"name",header:[{text:"Name"}],width:140},{id:"dept",header:[{text:"Department"}],width:140},{id:"role",header:[{text:"Role"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100},{id:"city",header:[{text:"City"}],width:120},{id:"start",header:[{text:"Start Date"}],width:120}],data:[{id:"1",name:"Alice",dept:"Engineering",role:"Lead",salary:12e4,city:"SF",start:"2020-01"},{id:"2",name:"Bob",dept:"Product",role:"PM",salary:11e4,city:"NYC",start:"2019-06"},{id:"3",name:"Carol",dept:"Design",role:"Senior",salary:95e3,city:"Austin",start:"2021-03"},{id:"4",name:"Dave",dept:"Engineering",role:"Mid",salary:9e4,city:"Seattle",start:"2022-01"}],leftSplit:r,freezable:!0,onFreeze:({left:n})=>t(n),style:{height:240,width:"100%"}})]})}};var he,ue,pe;b.parameters={...b.parameters,docs:{...(he=b.parameters)==null?void 0:he.docs,source:{originalSource:`{
  name: 'Basic Usage',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 15),
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(pe=(ue=b.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var ge,xe,ye;k.parameters={...k.parameters,docs:{...(ge=k.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: 'Virtual Scroll',
  args: {
    columns: baseColumns,
    data: data5000,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ye=(xe=k.parameters)==null?void 0:xe.docs)==null?void 0:ye.source}}};var fe,Se,we;C.parameters={...C.parameters,docs:{...(fe=C.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'Frozen Columns & Rows',
  render: () => <FrozenSplitsDemo />
}`,...(we=(Se=C.parameters)==null?void 0:Se.docs)==null?void 0:we.source}}};var _e,ve,be;j.parameters={...j.parameters,docs:{...(_e=j.parameters)==null?void 0:_e.docs,source:{originalSource:`{
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
}`,...(be=(ve=j.parameters)==null?void 0:ve.docs)==null?void 0:be.source}}};var ke,Ce,je;A.parameters={...A.parameters,docs:{...(ke=A.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  name: 'Sorting',
  render: () => <SortingDemo />
}`,...(je=(Ce=A.parameters)==null?void 0:Ce.docs)==null?void 0:je.source}}};var Ae,De,Re;D.parameters={...D.parameters,docs:{...(Ae=D.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  name: 'Multi-Column Sorting',
  render: () => <AnimalMultiSortDemo />
}`,...(Re=(De=D.parameters)==null?void 0:De.docs)==null?void 0:Re.source}}};var Te,Ee,Me;R.parameters={...R.parameters,docs:{...(Te=R.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'Grouping',
  render() {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 48px)'
    }}>
        <p style={{
        flexShrink: 0,
        margin: '0 0 8px',
        fontSize: 13
      }}>
          Drag a column header onto the <strong>Group by:</strong> panel to group rows.
          Click the sort arrow to change group sort direction. Drag chips to reorder.
          Click ✕ to remove a grouping. Click the chevron to expand or collapse groups.
        </p>
        <Grid<AnimalTask> columns={animalColumns} data={animalDataset} groupable sortable group={{
        order: ['animal_type']
      }} style={{
        flex: 1,
        minHeight: 0,
        width: '100%'
      }} />
      </div>;
  }
}`,...(Me=(Ee=R.parameters)==null?void 0:Ee.docs)==null?void 0:Me.source}}};var ze,Pe,Fe;T.parameters={...T.parameters,docs:{...(ze=T.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  name: 'Styling',
  render: () => <StylingDemo />
}`,...(Fe=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:Fe.source}}};var Be,Ie,Ne;E.parameters={...E.parameters,docs:{...(Be=E.parameters)==null?void 0:Be.docs,source:{originalSource:`{
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
}`,...(Ne=(Ie=E.parameters)==null?void 0:Ie.docs)==null?void 0:Ne.source}}};var Ge,He,Le;M.parameters={...M.parameters,docs:{...(Ge=M.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
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
}`,...(Le=(He=M.parameters)==null?void 0:He.docs)==null?void 0:Le.source}}};var $e,We,Oe;z.parameters={...z.parameters,docs:{...($e=z.parameters)==null?void 0:$e.docs,source:{originalSource:`{
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
}`,...(Oe=(We=z.parameters)==null?void 0:We.docs)==null?void 0:Oe.source}}};var Ve,Ke,Je;P.parameters={...P.parameters,docs:{...(Ve=P.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  name: 'Inline Editing',
  render: () => <EditingDemo />
}`,...(Je=(Ke=P.parameters)==null?void 0:Ke.docs)==null?void 0:Je.source}}};var Ue,Ye,Qe;F.parameters={...F.parameters,docs:{...(Ue=F.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  name: 'Header Filters',
  render: () => <HeaderFiltersDemo />
}`,...(Qe=(Ye=F.parameters)==null?void 0:Ye.docs)==null?void 0:Qe.source}}};var Xe,qe,Ze;B.parameters={...B.parameters,docs:{...(Xe=B.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  name: 'Footer Summaries',
  render: () => <FooterSummariesDemo />
}`,...(Ze=(qe=B.parameters)==null?void 0:qe.docs)==null?void 0:Ze.source}}};var et,tt,at;I.parameters={...I.parameters,docs:{...(et=I.parameters)==null?void 0:et.docs,source:{originalSource:`{
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
}`,...(at=(tt=I.parameters)==null?void 0:tt.docs)==null?void 0:at.source}}};var rt,nt,ot;N.parameters={...N.parameters,docs:{...(rt=N.parameters)==null?void 0:rt.docs,source:{originalSource:`{
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
}`,...(ot=(nt=N.parameters)==null?void 0:nt.docs)==null?void 0:ot.source}}};var it,st,lt;G.parameters={...G.parameters,docs:{...(it=G.parameters)==null?void 0:it.docs,source:{originalSource:`{
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
}`,...(lt=(st=G.parameters)==null?void 0:st.docs)==null?void 0:lt.source}}};var dt,ct,mt;H.parameters={...H.parameters,docs:{...(dt=H.parameters)==null?void 0:dt.docs,source:{originalSource:`{
  name: 'Export',
  render: () => <ExportDemo />
}`,...(mt=(ct=H.parameters)==null?void 0:ct.docs)==null?void 0:mt.source}}};var ht,ut,pt;L.parameters={...L.parameters,docs:{...(ht=L.parameters)==null?void 0:ht.docs,source:{originalSource:`{
  name: 'Kitchen Sink (all features)',
  render: () => <KitchenSinkDemo />
}`,...(pt=(ut=L.parameters)==null?void 0:ut.docs)==null?void 0:pt.source}}};var gt,xt,yt;$.parameters={...$.parameters,docs:{...(gt=$.parameters)==null?void 0:gt.docs,source:{originalSource:`{
  name: 'Keyboard Navigation (arrow/tab/enter)',
  render: () => <KeyboardNavDemo />
}`,...(yt=(xt=$.parameters)==null?void 0:xt.docs)==null?void 0:yt.source}}};var ft,St,wt;W.parameters={...W.parameters,docs:{...(ft=W.parameters)==null?void 0:ft.docs,source:{originalSource:`{
  name: 'Adjust columns (auto-fit to content)',
  render: () => <AdjustAutoWidthDemo />
}`,...(wt=(St=W.parameters)==null?void 0:St.docs)==null?void 0:wt.source}}};var _t,vt,bt;O.parameters={...O.parameters,docs:{...(_t=O.parameters)==null?void 0:_t.docs,source:{originalSource:`{
  name: 'Auto width (fill container by gravity)',
  render: () => <AutoWidthDemo />
}`,...(bt=(vt=O.parameters)==null?void 0:vt.docs)==null?void 0:bt.source}}};var kt,Ct,jt;V.parameters={...V.parameters,docs:{...(kt=V.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  name: 'Auto height (wrap cell content)',
  render: () => <AutoHeightDemo />
}`,...(jt=(Ct=V.parameters)==null?void 0:Ct.docs)==null?void 0:jt.source}}};var At,Dt,Rt;K.parameters={...K.parameters,docs:{...(At=K.parameters)==null?void 0:At.docs,source:{originalSource:`{
  name: 'Tooltip (cell hover)',
  render: () => <TooltipDemo />
}`,...(Rt=(Dt=K.parameters)==null?void 0:Dt.docs)==null?void 0:Rt.source}}};var Tt,Et,Mt;J.parameters={...J.parameters,docs:{...(Tt=J.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  name: 'Row drag & drop',
  render: () => <RowDragDemo />
}`,...(Mt=(Et=J.parameters)==null?void 0:Et.docs)==null?void 0:Mt.source}}};var zt,Pt,Ft;U.parameters={...U.parameters,docs:{...(zt=U.parameters)==null?void 0:zt.docs,source:{originalSource:`{
  name: 'CSS API + marks',
  render: () => <CssApiAndMarksDemo />
}`,...(Ft=(Pt=U.parameters)==null?void 0:Pt.docs)==null?void 0:Ft.source}}};var Bt,It,Nt;Y.parameters={...Y.parameters,docs:{...(Bt=Y.parameters)==null?void 0:Bt.docs,source:{originalSource:`{
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
}`,...(Nt=(It=Y.parameters)==null?void 0:It.docs)==null?void 0:Nt.source}}};var Gt,Ht,Lt;Q.parameters={...Q.parameters,docs:{...(Gt=Q.parameters)==null?void 0:Gt.docs,source:{originalSource:`{
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
}`,...(Lt=(Ht=Q.parameters)==null?void 0:Ht.docs)==null?void 0:Lt.source}}};var $t,Wt,Ot;X.parameters={...X.parameters,docs:{...($t=X.parameters)==null?void 0:$t.docs,source:{originalSource:`{
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
}`,...(Ot=(Wt=X.parameters)==null?void 0:Wt.docs)==null?void 0:Ot.source}}};var Vt,Kt,Jt;q.parameters={...q.parameters,docs:{...(Vt=q.parameters)==null?void 0:Vt.docs,source:{originalSource:`{
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
}`,...(Jt=(Kt=q.parameters)==null?void 0:Kt.docs)==null?void 0:Jt.source}}};var Ut,Yt,Qt;Z.parameters={...Z.parameters,docs:{...(Ut=Z.parameters)==null?void 0:Ut.docs,source:{originalSource:`{
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
}`,...(Qt=(Yt=Z.parameters)==null?void 0:Yt.docs)==null?void 0:Qt.source}}};const Na=["Default","VirtualScroll","FrozenSplits","ColumnResize","Sorting","AnimalMultiSort","Grouping","Styling","RowSelection","CellSelection","ComplexSelection","InlineEditing","HeaderFilters","FooterSummaries","CellSpans","ColumnReorder","ColumnReorderWithSplits","Export","KitchenSink","KeyboardNavigation","AdjustColumns","AutoWidth","AutoHeight","TooltipStory","RowDrag","CssApiAndMarks","RemotePagination","RemoteSortFilter","Polling","FormulaEngine","FreezePanes"];export{W as AdjustColumns,D as AnimalMultiSort,V as AutoHeight,O as AutoWidth,M as CellSelection,I as CellSpans,N as ColumnReorder,G as ColumnReorderWithSplits,j as ColumnResize,z as ComplexSelection,U as CssApiAndMarks,b as Default,H as Export,B as FooterSummaries,q as FormulaEngine,Z as FreezePanes,C as FrozenSplits,R as Grouping,F as HeaderFilters,P as InlineEditing,$ as KeyboardNavigation,L as KitchenSink,X as Polling,Y as RemotePagination,Q as RemoteSortFilter,J as RowDrag,E as RowSelection,A as Sorting,T as Styling,K as TooltipStory,k as VirtualScroll,Na as __namedExportsOrder,Ia as default};
