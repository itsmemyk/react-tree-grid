import{_ as ue}from"./iframe-BwcNCjTm.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CXOcBcs0.js";import{D as ma,a as k,T as S}from"./DragManager-4zvg7VQl.js";import{G as c}from"./Grid-Cvrk97GC.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";function x(r={}){const{data:a,config:n}=r,o=s.useRef(null);o.current===null&&(o.current=new ma(n),a!=null&&a.length&&o.current.parse(a));const t=o.current,[i,d]=s.useState(()=>[...t._order]);s.useEffect(()=>{const l=()=>{d([...t._order])};return t.events.on(k.change,l),t.events.on(k.load,l),t.events.on(k.removeAll,l),t.events.on(k.filter,l),()=>{t.events.clear()}},[t]);const h=s.useCallback((l,f)=>t.add(l,f),[t]),u=s.useCallback(l=>t.remove(l),[t]),y=s.useCallback((l,f,de)=>t.update(l,f,de),[t]),v=s.useCallback((l,f)=>{t.sort(l,f),d([...t._order])},[t]),w=s.useCallback((l,f)=>{const de=t.filter(l,f);return d([...t._order]),de},[t]),_=s.useCallback(l=>{const f=t.resetFilter(l);return d([...t._order]),f},[t]),b=s.useCallback(l=>t.parse(l),[t]),ca=s.useCallback(()=>t.removeAll(),[t]);return{items:i,store:t,add:h,remove:u,update:y,getItem:s.useCallback(l=>t.getItem(l),[t]),getIndex:s.useCallback(l=>t.getIndex(l),[t]),getLength:s.useCallback(()=>t.getLength(),[t]),exists:s.useCallback(l=>t.exists(l),[t]),sort:v,filter:w,resetFilter:_,find:s.useCallback(l=>t.find(l),[t]),findAll:s.useCallback(l=>t.findAll(l),[t]),serialize:s.useCallback(()=>t.serialize(),[t]),parse:b,removeAll:ca}}const C=["Lead","Developer","QA Engineer","DevOps","Designer","PM"],oe=["Alpha","Beta","Gamma","Delta"],ie=["North","South","East","West"],se=["Alice Chen","Bob Rivera","Carla Müller","David Kim","Eva Torres","Frank Osei","Grace Liu","Hassan Ali","Iris Novak","James Okoro","Kira Singh","Liam Brown","Mina Sato","Noah Garcia","Olivia Jansen","Pavel Sokolov","Quinn Murphy","Rosa Fernandes","Samuel Ek","Tara Gupta"];function le(r){return Array.from({length:r},(a,n)=>({id:String(n+1),name:se[n%se.length],role:C[n%C.length],team:oe[n%oe.length],region:ie[n%ie.length],salary:45e3+Math.floor(Math.random()*8e4),age:22+n%35,active:n%5!==0}))}const p=le(50),sa=le(200),ha=le(5e3),g=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,resizable:!0},{id:"role",header:[{text:"Role"}],width:140,resizable:!0},{id:"team",header:[{text:"Team"}],width:120,resizable:!0},{id:"region",header:[{text:"Region"}],width:120,resizable:!0},{id:"salary",header:[{text:"Salary"}],width:120,resizable:!0,align:"right",template:r=>`$${Number(r).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}],m=500,Qa={title:"Grid",component:c,decorators:[r=>e.jsx(S,{children:e.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:e.jsx(r,{})})})],parameters:{layout:"fullscreen"}},j={name:"Basic Usage",args:{columns:g,data:p.slice(0,15),style:{width:"100%",height:m}}},D={name:"Virtual Scroll",args:{columns:g,data:ha,style:{width:"100%",height:m}}};function ua(){const r=[{id:"id",header:[{text:"# (frozen)"}],width:100},{id:"name",header:[{text:"Name (frozen)"}],width:200},{id:"role",header:[{text:"Role"}],width:220},{id:"team",header:[{text:"Team"}],width:220},{id:"region",header:[{text:"Region"}],width:220},{id:"salary",header:[{text:"Salary"}],width:200,align:"right",template:a=>`$${Number(a).toLocaleString()}`},{id:"active",header:[{text:"Active"}],width:200,align:"center",template:a=>a?"Yes":"No"},{id:"age",header:[{text:"Age (frozen)"}],width:120,align:"center"}];return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Scroll horizontally — first 2 columns and last column stay frozen. First and last rows stay frozen on vertical scroll."}),e.jsx(c,{columns:r,data:p,leftSplit:2,rightSplit:1,topSplit:1,bottomSplit:1,style:{width:"100%",height:m}})]})}const A={name:"Frozen Columns & Rows",render:()=>e.jsx(ua,{})},R={name:"Column Resize",args:{columns:g.map(r=>({...r,resizable:!0,minWidth:60,maxWidth:400})),data:p.slice(0,15),style:{width:"100%",height:m}}};function pa(){const{items:r,store:a}=x({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a header to sort. Ctrl+click for multi-column sort. Click again to cycle: asc → desc → none."}),e.jsx(c,{columns:g,data:r,store:a,sortable:!0,style:{width:"100%",height:m},onAfterSort:n=>console.log("Sort states:",n)})]})}const E={name:"Sorting",render:()=>e.jsx(pa,{})},la=[{id:"1",shift:"Morning Shift",animal_name:"Bella",animal_type:"Dog",animal_age:5,task:"Walk",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:3,contact:"(212) 555-0118",shelter_location:"Western Branch",animal_photo:"./img/animals/01.jpg"},{id:"2",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Feed",task_status:"Open",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"3",shift:"Evening Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"4",shift:"Morning Shift",animal_name:"Luna",animal_type:"Cat",animal_age:.5,task:"Play",task_status:"Completed",volunteer_name:"Michael Green",experience_level:1,contact:"(323) 555-0325",shelter_location:"Northern Branch",animal_photo:"./img/animals/04.jpg"},{id:"5",shift:"Evening Shift",animal_name:"Charlie",animal_type:"Dog",animal_age:1,task:"Medication",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:1,contact:"(212) 555-0118",shelter_location:"Eastern Branch",animal_photo:"./img/animals/05.jpg"},{id:"6",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Walk",task_status:"Open",volunteer_name:"John Smith",experience_level:3,contact:"(415) 555-0734",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"7",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"8",shift:"Morning Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Emily White",experience_level:3,contact:"(707) 555-0998",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"9",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Open",volunteer_name:"Jessica Brown",experience_level:2,contact:"(818) 555-0876",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"10",shift:"Morning Shift",animal_name:"Daisy",animal_type:"Dog",animal_age:7,task:"Walk",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:1,contact:"(323) 555-0411",shelter_location:"Northern Branch",animal_photo:"./img/animals/09.jpg"},{id:"11",shift:"Afternoon Shift",animal_name:"Toby",animal_type:"Dog",animal_age:5,task:"Clean cage",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Western Branch",animal_photo:"./img/animals/10.jpg"},{id:"12",shift:"Evening Shift",animal_name:"Maggie",animal_type:"Cat",animal_age:2,task:"Play",task_status:"Completed",volunteer_name:"Mark Foster",experience_level:3,contact:"(408) 555-0217",shelter_location:"Eastern Branch",animal_photo:"./img/animals/11.jpg"},{id:"13",shift:"Afternoon Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"14",shift:"Evening Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Play",task_status:"Completed",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"15",shift:"Morning Shift",animal_name:"Rocky",animal_type:"Cat",animal_age:4,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/12.jpg"},{id:"16",shift:"Afternoon Shift",animal_name:"Oliver",animal_type:"Cat",animal_age:3,task:"Feed",task_status:"In Progress",volunteer_name:"Michael Green",experience_level:2,contact:"(323) 555-0325",shelter_location:"Western Branch",animal_photo:"./img/animals/13.jpg"},{id:"17",shift:"Morning Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Play",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:2,contact:"(323) 555-0411",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"18",shift:"Afternoon Shift",animal_name:"Sasha",animal_type:"Cat",animal_age:7,task:"Walk",task_status:"In Progress",volunteer_name:"John Smith",experience_level:1,contact:"(415) 555-0734",shelter_location:"Southern Branch",animal_photo:"./img/animals/15.jpg"},{id:"19",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Completed",volunteer_name:"Michael Green",experience_level:3,contact:"(323) 555-0325",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"20",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"21",shift:"Evening Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Train",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"22",shift:"Afternoon Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Monica Hill",experience_level:1,contact:"(415) 555-0623",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"23",shift:"Evening Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"24",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Medication",task_status:"In Progress",volunteer_name:"Ben Carter",experience_level:3,contact:"(415) 555-0198",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"}],ga={Open:"#f59e0b","In Progress":"#0288d1",Completed:"#12a66a"},da=[{id:"animal_name",header:[{text:"Animal name"}],width:140,template:(r,a)=>e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("img",{src:a.animal_photo,alt:"",style:{borderRadius:"50%",height:28,width:28}}),a.animal_name]})},{id:"animal_type",header:[{text:"Animal type"}],width:130},{id:"animal_age",type:"number",header:[{text:"Age"}],width:66,align:"right"},{id:"task",header:[{text:"Task"}],width:96},{id:"task_status",header:[{text:"Task status"}],width:130,template:r=>{const a=r;return e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("span",{style:{background:ga[a],borderRadius:"50%",height:8,width:8}}),a]})}},{id:"volunteer_name",header:[{text:"Volunteer name"}],width:155},{id:"experience_level",type:"number",header:[{text:"Experience Level",align:"left"}],width:165,align:"left",template:r=>e.jsx("span",{style:{color:"#f59e0b",fontSize:18},children:"★".repeat(Number(r))})},{id:"contact",header:[{text:"Contact",align:"right"}],width:124,align:"right"},{id:"shelter_location",header:[{text:"Shelter location"}],width:155},{id:"shift",header:[{text:"Shift"}],width:120}];function xa(){const{items:r,store:a}=x({data:la});return s.useEffect(()=>{a.sort([{by:"volunteer_name",dir:"desc"},{by:"task_status",dir:"asc"},{by:"animal_type",dir:"asc"}])},[a]),e.jsx(c,{columns:da,data:r,store:a,sortable:!0,selection:"row",style:{width:"100%",height:m}})}const T={name:"Multi-Column Sorting",render:()=>e.jsx(xa,{})},P={name:"Grouping",render(){return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 48px)"},children:[e.jsxs("p",{style:{flexShrink:0,margin:"0 0 8px",fontSize:13},children:["Drag a column header onto the ",e.jsx("strong",{children:"Group by:"})," panel to group rows. Click the sort arrow to change group sort direction. Drag chips to reorder. Click ✕ to remove a grouping. Click the chevron to expand or collapse groups."]}),e.jsx(c,{columns:da,data:la,groupable:!0,sortable:!0,group:{order:["animal_type"]},style:{flex:1,minHeight:0,width:"100%"}})]})}},z={name:"Styling",render:()=>e.jsx(Ia,{})},M={name:"Row Selection",args:{columns:g,data:p.slice(0,20),selection:"row",multiselection:!0,style:{width:"100%",height:m}}},F={name:"Cell Selection",args:{columns:g,data:p.slice(0,20),selection:"cell",style:{width:"100%",height:m}}},B={name:"Complex Selection",args:{columns:g,data:p.slice(0,20),selection:"complex",multiselection:!0,style:{width:"100%",height:m}}};function ya(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:a,store:n}=x({data:p.slice(0,15)});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Double-click a cell to edit. Enter to save, Escape to cancel, Tab to move to next editable cell."}),e.jsx(c,{columns:r,data:a,store:n,editable:!0,selection:"cell",style:{width:"100%",height:m},onAfterEditEnd:(o,t,i)=>console.log(`Edited [${o}][${t}] →`,i)})]})}const I={name:"Inline Editing",render:()=>e.jsx(ya,{})};function fa(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:140},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:o=>`$${Number(o).toLocaleString()}`}],{items:a,store:n}=x({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Second header row has filters: text input for Name, dropdown for Role/Team, searchable combo for Region."}),e.jsx(c,{columns:r,data:a,store:n,style:{width:"100%",height:m}})]})}const N={name:"Header Filters",render:()=>e.jsx(fa,{})};function Sa(){const r=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60},{id:"name",header:[{text:"Name"}],footer:[{text:"Totals"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:120},{id:"salary",header:[{text:"Salary"}],width:140,align:"right",footer:[{content:"sum"},{content:"avg"}],template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",footer:[{content:"min"},{content:"max"}]}],{items:a,store:n}=x({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Footer rows show aggregations: count, sum, avg, min, max. Salary has two footer rows (sum + avg)."}),e.jsx(c,{columns:r,data:a,store:n,style:{width:"100%",height:m}})]})}const G={name:"Footer Summaries",render:()=>e.jsx(Sa,{})},H={name:"Cell Spans",args:{columns:g.slice(0,5),data:p.slice(0,12),spans:[{row:"1",column:"name",colspan:2,text:"Alice Chen — Lead",css:""},{row:"3",column:"team",rowspan:3,text:"Team Gamma (shared)",css:""},{row:"6",column:"name",colspan:3,rowspan:2,text:"Merged block (2×3)",css:""}],style:{width:"100%",height:m}}},L={name:"Column Reorder",args:{columns:g,data:p.slice(0,16),dragItem:"column",style:{width:"100%",height:m}}},$={name:"Column Reorder with Frozen Splits",args:{columns:g,data:p,dragItem:"column",leftSplit:2,rightSplit:1,style:{width:"100%",height:m}}};function wa(){const{items:r,store:a}=x({data:p.slice(0,10)});return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:12,display:"flex",gap:8},children:[e.jsx("button",{onClick:()=>{ue(async()=>{const{downloadGridAsCsv:n}=await import("./index-U4fRbjDe.js");return{downloadGridAsCsv:n}},[]).then(({downloadGridAsCsv:n})=>{n(a,g,"employees.csv")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export CSV"}),e.jsx("button",{onClick:()=>{ue(async()=>{const{downloadGridAsExcel:n}=await import("./index-U4fRbjDe.js");return{downloadGridAsExcel:n}},[]).then(({downloadGridAsExcel:n})=>{n(a,g,"employees.xlsx")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export Excel"})]}),e.jsx(c,{columns:g,data:r,store:a,style:{width:"100%",height:m}})]})}const W={name:"Export",render:()=>e.jsx(wa,{})};function _a(){const r=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60,resizable:!0},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120,sortable:!0,resizable:!0},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:130,sortable:!0,resizable:!0},{id:"salary",header:[{text:"Salary"}],footer:[{content:"sum"},{content:"avg"}],width:130,sortable:!0,resizable:!0,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],footer:[{content:"min"},{content:"max"}],width:80,sortable:!0,align:"center",editorType:"input"}],{items:a,store:n}=x({data:sa});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"All features active: sorting, filters, footers, resize, editing (dbl-click), selection (Ctrl/Shift+click), column drag reorder, 200 rows virtual scroll."}),e.jsx(c,{columns:r,data:a,store:n,sortable:!0,editable:!0,selection:"complex",multiselection:!0,dragItem:"column",leftSplit:1,style:{width:"100%",height:m},onAfterSort:o=>console.log("Sort:",o),onAfterEditEnd:(o,t,i)=>console.log(`Edit [${o}][${t}]:`,i),onAfterSelect:(o,t)=>console.log(`Select [${o}][${t}]`)})]})}const O={name:"Kitchen Sink (all features)",render:()=>e.jsx(_a,{})};function va(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:a,store:n}=x({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a cell, then use arrow keys to navigate. Tab/Shift+Tab wraps across rows. Enter to edit, Escape to cancel. PageUp/Down scrolls viewport. Ctrl+Arrow jumps to first/last row/col."}),e.jsx(c,{columns:r,data:a,store:n,editable:!0,selection:"complex",keyNavigation:!0,style:{width:"100%",height:m},onAfterSelect:(o,t)=>console.log(`Select [${o}][${t}]`),onAfterEditEnd:(o,t,i)=>console.log(`Edit [${o}][${t}]:`,i)})]})}const V={name:"Keyboard Navigation (arrow/tab/enter)",render:()=>e.jsx(va,{})};function ba(){const r=s.useMemo(()=>p.slice(0,20).map((n,o)=>({...n,role:o%4===0?"Senior Principal Software Engineer":n.role,region:o%3===0?"North American Operations":n.region})),[]),a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],adjust:"data"},{id:"role",header:[{text:"Role"}],adjust:!0},{id:"team",header:[{text:"Team"}],adjust:"header"},{id:"region",header:[{text:"Region"}],adjust:"data"},{id:"salary",header:[{text:"Salary"}],adjust:"data",align:"right",template:n=>`$${Number(n).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Columns auto-fit to widest data/header value via ",e.jsx("code",{children:"adjust"}),"."]}),e.jsx(c,{columns:a,data:r,style:{width:"100%",height:m}})]})}const K={name:"Adjust columns (auto-fit to content)",render:()=>e.jsx(ba,{})};function Ca(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],gravity:2},{id:"role",header:[{text:"Role"}],gravity:1},{id:"team",header:[{text:"Team"}],gravity:1},{id:"region",header:[{text:"Region"}],gravity:1},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:a=>`$${Number(a).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Flexible columns fill the container proportionally by ",e.jsx("code",{children:"gravity"}),". name takes 2× the share of its siblings."]}),e.jsx(c,{autoWidth:!0,columns:r,data:p,style:{width:"100%",height:m}})]})}const J={name:"Auto width (fill container by gravity)",render:()=>e.jsx(Ca,{})};function ka(){const r=s.useMemo(()=>[{id:"1",name:"Alice Chen",role:"Senior Principal Software Engineer working on distributed systems and event-sourcing pipelines",team:"Alpha",region:"North",salary:12e4,age:34,active:!0},{id:"2",name:"Bob Rivera",role:"QA Engineer",team:"Beta",region:"South",salary:8e4,age:28,active:!0},{id:"3",name:"Carla Müller",role:"Frontend Developer specializing in accessibility and design systems across product surfaces",team:"Gamma",region:"East",salary:95e3,age:31,active:!0}],[]),a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:140},{id:"role",header:[{text:"Role"}],width:200},{id:"team",header:[{text:"Team"}],width:100},{id:"region",header:[{text:"Region"}],width:100}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Rows grow vertically to fit wrapped cell text when ",e.jsx("code",{children:"autoHeight"})," is on."]}),e.jsx(c,{autoHeight:!0,columns:a,data:r,style:{width:"100%",height:m}})]})}const U={name:"Auto height (wrap cell content)",render:()=>e.jsx(ka,{})};function ja(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140,tooltipTemplate:(a,n)=>`${n.name} — ${a}`},{id:"team",header:[{text:"Team"}],width:120},{id:"region",header:[{text:"Region"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:a=>`$${Number(a).toLocaleString()}`,tooltipTemplate:a=>`Annual salary: $${Number(a).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Hover over cells. Role and Salary columns use ",e.jsx("code",{children:"tooltipTemplate"}),"; other columns show raw value."]}),e.jsx(c,{tooltip:!0,columns:r,data:p.slice(0,20),style:{width:"100%",height:m}})]})}const Y={name:"Tooltip (cell hover)",render:()=>e.jsx(ja,{})};function Da(){return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Drag rows to reorder them. A horizontal drop line shows the insertion point."}),e.jsx(c,{columns:g,data:p.slice(0,14),dragItem:"row",style:{width:"100%",height:m}})]})}const Q={name:"Row drag & drop",render:()=>e.jsx(Da,{})};function Aa(){const r=s.useRef(null),[a,n]=s.useState(!0),o=s.useMemo(()=>[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"city",header:[{text:"City"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:i=>`$${Number(i).toLocaleString()}`,mark:{min:"gridStoryMarkMin",max:"gridStoryMarkMax"}},{id:"team",header:[{text:"Team"}],width:120,mark:(i,d,h)=>h.team==="Gamma"?"gridStoryMarkGamma":!1}],[]),t=p.slice(0,12);return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Imperative API: addRowCss, addCellCss, showColumn/hideColumn. Salary uses min/max marks; Team uses a function mark."}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"},children:[e.jsx("button",{type:"button",onClick:()=>{var i,d;(i=r.current)==null||i.addRowCss("1","gridStoryRowAccent"),(d=r.current)==null||d.addCellCss("1","salary","gridStoryCellAccent")},children:"Highlight first row"}),e.jsx("button",{type:"button",onClick:()=>{var i,d;(i=r.current)==null||i.removeRowCss("1","gridStoryRowAccent"),(d=r.current)==null||d.removeCellCss("1","salary","gridStoryCellAccent")},children:"Clear highlight"}),e.jsxs("button",{type:"button",onClick:()=>{var i,d;a?(i=r.current)==null||i.hideColumn("city"):(d=r.current)==null||d.showColumn("city"),n(h=>!h)},children:[a?"Hide":"Show"," city column"]})]}),e.jsx("style",{children:`
        .gridStoryRowAccent { background: rgba(255, 214, 102, 0.28); }
        .gridStoryCellAccent { background: rgba(255, 107, 107, 0.16); color: #8f1d21; font-weight: 600; }
        .gridStoryMarkMin { background: rgba(56, 217, 169, 0.18); color: #087f5b; }
        .gridStoryMarkMax { background: rgba(255, 146, 43, 0.18); color: #d9480f; font-weight: 600; }
        .gridStoryMarkGamma { box-shadow: inset 0 0 0 1px rgba(66, 99, 235, 0.35); color: #364fc7; }
      `}),e.jsx(c,{ref:r,columns:o,data:t,style:{width:"100%",height:m}})]})}const X={name:"CSS API + marks",render:()=>e.jsx(Aa,{})},ce=Array.from({length:200},(r,a)=>({id:`${a+1}`,name:se[a%se.length],role:C[a%C.length],team:oe[a%oe.length],region:ie[a%ie.length],salary:5e4+a*317%6e4,age:22+a*7%40,active:a%3!==0}));function me(r){return async a=>{await new Promise(y=>setTimeout(y,300));const n=new URLSearchParams(a.split("?")[1]),o=Number(n.get("page")??1),t=Number(n.get("size")??50),i=n.get("sortBy"),d=n.get("sortDir");let h=[...r];i&&h.sort((y,v)=>{const w=String(y[i]??""),_=String(v[i]??"");return d==="desc"?_.localeCompare(w):w.localeCompare(_)});const u=(o-1)*t;return{ok:!0,json:async()=>({data:h.slice(u,u+t),total:h.length})}}}const he=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:100},{id:"salary",header:[{text:"Salary"}],width:100}],q={name:"DataProxy — Remote Pagination (append)",render:()=>e.jsx(S,{children:e.jsx(c,{columns:he,data:[],dataProxy:{url:"https://api.test/employees",pageSize:20,fetchFn:me(ce)},paginationMode:"append",style:{height:400,width:"100%"}})})},Z={name:"DataProxy — Remote Sort",render:()=>e.jsx(S,{children:e.jsx(c,{columns:he,data:[],dataProxy:{url:"https://api.test/employees",pageSize:50,fetchFn:me(ce)},remoteSort:!0,sortable:!0,style:{height:400,width:"100%"}})})},ee={name:"DataProxy — Polling (2s)",render:()=>{const[r,a]=s.useState(0),n=s.useMemo(()=>({url:"https://api.test/employees",pageSize:10,polling:2e3,fetchFn:async o=>(a(t=>t+1),me(ce)(o))}),[]);return e.jsxs(S,{children:[e.jsxs("p",{style:{margin:"0 0 8px"},children:["Tick: ",r," (data refreshes every 2s via polling)"]}),e.jsx(c,{columns:he,data:[],dataProxy:n,style:{height:320,width:"100%"}})]})}},te={name:"Formula Engine",render(){return e.jsx(S,{children:e.jsx(c,{columns:[{id:"label",header:[{text:"Label"}],width:120},{id:"value",header:[{text:"Value"}],width:100},{id:"doubled",header:[{text:"Doubled (=value*2)"}],width:160},{id:"total",header:[{text:"Total (=SUM)"}],width:160}],data:[{id:"r1",label:"Alpha",value:10,doubled:"=B1*2",total:""},{id:"r2",label:"Beta",value:20,doubled:"=B2*2",total:""},{id:"r3",label:"Gamma",value:30,doubled:"=B3*2",total:"=SUM(B1:B3)"}],formulas:!0,style:{height:200,width:"100%"}})})}},Ra=[{id:"1",name:"Alice Martin",role:"Engineer",department:"Product",status:"Active"},{id:"2",name:"Bob Chen",role:"Designer",department:"Design",status:"Active"},{id:"3",name:"Carol Davis",role:"Manager",department:"Ops",status:"Away"},{id:"4",name:"David Kim",role:"Engineer",department:"Platform",status:"Active"},{id:"5",name:"Eva Rossi",role:"Analyst",department:"Finance",status:"Active"},{id:"6",name:"Frank Müller",role:"Engineer",department:"Product",status:"Inactive"},{id:"7",name:"Grace Lee",role:"Designer",department:"Design",status:"Active"},{id:"8",name:"Hiro Tanaka",role:"Manager",department:"Ops",status:"Away"}],Ea={Active:"var(--react-tree-grid-color-success)",Away:"var(--react-tree-grid-color-warning)",Inactive:"var(--react-tree-grid-color-danger)"},Ta={Active:"#fff",Away:"rgba(0,0,0,0.75)",Inactive:"#fff"},Pa=[{id:"name",header:[{text:"Name"}],width:180,sortable:!0},{id:"role",header:[{text:"Role"}],width:140,sortable:!0},{id:"department",header:[{text:"Department"}],width:150,sortable:!0},{id:"status",header:[{text:"Status"}],width:120,template:r=>{const a=r;return e.jsx("span",{style:{display:"inline-block",padding:"2px 10px",borderRadius:"var(--react-tree-grid-radius-lg)",background:Ea[a],color:Ta[a],fontSize:11,fontWeight:500,letterSpacing:"0.02em"},children:a})}}],za=[{label:"Primary",cssVar:"--react-tree-grid-color-primary"},{label:"Secondary",cssVar:"--react-tree-grid-color-secondary"},{label:"Success",cssVar:"--react-tree-grid-color-success"},{label:"Warning",cssVar:"--react-tree-grid-color-warning"},{label:"Danger",cssVar:"--react-tree-grid-color-danger"}],Ma={colorPrimary:"#0d6efd",colorPrimaryHover:"#0b5ed7",colorSecondary:"#6c757d",colorSuccess:"#198754",colorWarning:"#ffc107",colorDanger:"#dc3545",colorBackground:"#ffffff",colorSurface:"#f8f9fa",colorText:"#212529",colorTextSecondary:"#6c757d",colorBorder:"#dee2e6",fontFamily:'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',fontSizeMd:"16px",radiusSm:"4px",radiusMd:"6px",radiusLg:"12px",shadowSm:"0 1px 2px rgba(0,0,0,0.075)",shadowMd:"0 .5rem 1rem rgba(0,0,0,0.15)",colorHeaderBackground:"#0d6efd",colorHeaderText:"#ffffff",colorRowHover:"rgba(13,110,253,0.06)",colorRowSelected:"rgba(13,110,253,0.12)",colorSortActive:"#ffffff",colorSortIdle:"rgba(255,255,255,0.5)"},Fa={colorPrimary:"#1976d2",colorPrimaryHover:"#1565c0",colorBackground:"#ffffff",colorSurface:"#fafafa",colorText:"#212121",colorTextSecondary:"#757575",colorBorder:"rgba(0,0,0,0.12)",fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',fontWeightMedium:"500",radiusSm:"0px",radiusMd:"4px",shadowSm:"0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",shadowMd:"0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",colorHeaderBackground:"#673ab7",colorHeaderText:"#ffffff",colorRowHover:"rgba(103,58,183,0.06)",colorRowSelected:"rgba(103,58,183,0.12)",colorSortActive:"#ffffff",colorSortIdle:"rgba(255,255,255,0.5)"},Ba={default:{},bootstrap:Ma,material:Fa},pe={default:"Default",bootstrap:"Bootstrap 5",material:"Material UI"};function Ia(){const[r,a]=s.useState("default"),n=Ba[r],o=Object.keys(n).length===0?"{}":`{
${Object.entries(n).map(([t,i])=>`  ${t}: '${i}'`).join(`,
`)}
}`;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:13,color:"#666"},children:"Theme:"}),e.jsx("select",{value:r,onChange:t=>a(t.target.value),style:{fontSize:13,padding:"4px 8px",borderRadius:4,border:"1px solid #ccc",cursor:"pointer"},children:Object.keys(pe).map(t=>e.jsx("option",{value:t,children:pe[t]},t))})]}),e.jsxs(S,{theme:"light",overrides:n,children:[e.jsx(c,{columns:Pa,data:Ra,sortable:!0,defaultSortStates:[{columnId:"name",order:"asc"}],selection:"row",multiselection:!0,style:{width:"100%",height:320}}),e.jsx("div",{style:{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"},children:za.map(({label:t,cssVar:i})=>e.jsx("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:"var(--react-tree-grid-radius-md)",background:`var(${i})`,color:"#fff",fontSize:11,fontWeight:500,letterSpacing:"0.02em"},children:t},t))})]}),e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 4px",fontSize:12,color:"#888",fontFamily:"monospace"},children:'<ThemeProvider theme="light" overrides={overrides}>'}),e.jsx("pre",{style:{margin:0,padding:"12px 16px",background:"#1e1e1e",color:"#d4d4d4",fontFamily:'"Fira Code", "Cascadia Code", Consolas, monospace',fontSize:12,borderRadius:6,overflowX:"auto",lineHeight:1.6},children:`const overrides = ${o}`})]})]})}const ae={name:"Freeze Panes (draggable)",render(){const[r,a]=s.useState(2);return e.jsxs(S,{children:[e.jsxs("p",{style:{margin:"0 0 8px",fontSize:13},children:["Frozen columns: ",e.jsx("strong",{children:r})," — drag the blue handle to change"]}),e.jsx(c,{columns:[{id:"id",header:[{text:"#"}],width:50},{id:"name",header:[{text:"Name"}],width:140},{id:"dept",header:[{text:"Department"}],width:140},{id:"role",header:[{text:"Role"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100},{id:"city",header:[{text:"City"}],width:120},{id:"start",header:[{text:"Start Date"}],width:120}],data:[{id:"1",name:"Alice",dept:"Engineering",role:"Lead",salary:12e4,city:"SF",start:"2020-01"},{id:"2",name:"Bob",dept:"Product",role:"PM",salary:11e4,city:"NYC",start:"2019-06"},{id:"3",name:"Carol",dept:"Design",role:"Senior",salary:95e3,city:"Austin",start:"2021-03"},{id:"4",name:"Dave",dept:"Engineering",role:"Mid",salary:9e4,city:"Seattle",start:"2022-01"}],leftSplit:r,freezable:!0,onFreeze:({left:n})=>a(n),style:{height:240,width:"100%"}})]})}},Na=le(8);function Ga(){const r=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role (select)"}],width:180,editTemplate:(o,t,i,d)=>e.jsx("select",{ref:d.ref,style:{width:"100%",height:"100%",border:"none",background:"transparent"},value:String(o),onChange:h=>d.onCommit(h.target.value),children:C.map(h=>e.jsx("option",{value:h,children:h},h))})},{id:"team",header:[{text:"Notes (textarea)"}],width:220,editTemplate:(o,t,i,d)=>e.jsx("textarea",{ref:d.ref,style:{width:"100%",height:"100%",resize:"none"},value:String(o),onChange:h=>d.onChange(h.target.value),onKeyDown:h=>{h.key==="Enter"&&h.stopPropagation()},onBlur:()=>d.onCommit()})}],{items:a,store:n}=x({data:Na});return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Double-click a cell. ",e.jsx("strong",{children:"Role"})," commits as soon as you pick an option. ",e.jsx("strong",{children:"Notes"})," keeps Enter for newlines — click outside to commit. Escape cancels either."]}),e.jsx(c,{columns:r,data:a,store:n,editable:!0,selection:"cell",style:{width:600,height:340},onAfterEditEnd:(o,t,i)=>console.log(`Edited [${o}][${t}] →`,i)})]})}const re={render:()=>e.jsx(Ga,{})},ge=["1","5","10","25","50","100"],Ha=g.map(r=>({...r,width:(r.width??100)+60,...r.id==="name"||r.id==="role"?{editorType:"input"}:{}}));function La(){const{items:r,store:a}=x({data:sa}),[n,o]=s.useState(["5"]),[t,i]=s.useState(["100"]),d=(u,y,v,w,_)=>{_(w.filter(b=>b!==u)),v(y.includes(u)?y.filter(b=>b!==u):[...y,u])},h=u=>({padding:"4px 10px",background:u?"#3b82f6":"#f3f4f6",color:u?"#fff":"#111",border:"1px solid #d1d5db",borderRadius:4,cursor:"pointer"});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Pin rows by ID to the top or bottom. Pinned rows leave the scrollable area, stay visible on vertical scroll, and scroll horizontally with the body. The first two columns are frozen; Name and Role are editable."}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6,marginBottom:12},children:[e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"},children:[e.jsx("span",{style:{width:60,fontSize:13},children:"Top:"}),ge.map(u=>e.jsxs("button",{type:"button",style:h(n.includes(u)),onClick:()=>d(u,n,o,t,i),children:["#",u]},u))]}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"},children:[e.jsx("span",{style:{width:60,fontSize:13},children:"Bottom:"}),ge.map(u=>e.jsxs("button",{type:"button",style:h(t.includes(u)),onClick:()=>d(u,t,i,n,o),children:["#",u]},u))]})]}),e.jsx(c,{columns:Ha,data:r,store:a,pinnedTopRows:n,pinnedBottomRows:t,leftSplit:2,editable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:m}})]})}const ne={name:"Pinned Rows",render:()=>e.jsx(La,{})};var xe,ye,fe;j.parameters={...j.parameters,docs:{...(xe=j.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  name: 'Basic Usage',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 15),
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(fe=(ye=j.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var Se,we,_e;D.parameters={...D.parameters,docs:{...(Se=D.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Virtual Scroll',
  args: {
    columns: baseColumns,
    data: data5000,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(_e=(we=D.parameters)==null?void 0:we.docs)==null?void 0:_e.source}}};var ve,be,Ce;A.parameters={...A.parameters,docs:{...(ve=A.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Frozen Columns & Rows',
  render: () => <FrozenSplitsDemo />
}`,...(Ce=(be=A.parameters)==null?void 0:be.docs)==null?void 0:Ce.source}}};var ke,je,De;R.parameters={...R.parameters,docs:{...(ke=R.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(De=(je=R.parameters)==null?void 0:je.docs)==null?void 0:De.source}}};var Ae,Re,Ee;E.parameters={...E.parameters,docs:{...(Ae=E.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  name: 'Sorting',
  render: () => <SortingDemo />
}`,...(Ee=(Re=E.parameters)==null?void 0:Re.docs)==null?void 0:Ee.source}}};var Te,Pe,ze;T.parameters={...T.parameters,docs:{...(Te=T.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'Multi-Column Sorting',
  render: () => <AnimalMultiSortDemo />
}`,...(ze=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:ze.source}}};var Me,Fe,Be;P.parameters={...P.parameters,docs:{...(Me=P.parameters)==null?void 0:Me.docs,source:{originalSource:`{
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
}`,...(Be=(Fe=P.parameters)==null?void 0:Fe.docs)==null?void 0:Be.source}}};var Ie,Ne,Ge;z.parameters={...z.parameters,docs:{...(Ie=z.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  name: 'Styling',
  render: () => <StylingDemo />
}`,...(Ge=(Ne=z.parameters)==null?void 0:Ne.docs)==null?void 0:Ge.source}}};var He,Le,$e;M.parameters={...M.parameters,docs:{...(He=M.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...($e=(Le=M.parameters)==null?void 0:Le.docs)==null?void 0:$e.source}}};var We,Oe,Ve;F.parameters={...F.parameters,docs:{...(We=F.parameters)==null?void 0:We.docs,source:{originalSource:`{
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
}`,...(Ve=(Oe=F.parameters)==null?void 0:Oe.docs)==null?void 0:Ve.source}}};var Ke,Je,Ue;B.parameters={...B.parameters,docs:{...(Ke=B.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
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
}`,...(Ue=(Je=B.parameters)==null?void 0:Je.docs)==null?void 0:Ue.source}}};var Ye,Qe,Xe;I.parameters={...I.parameters,docs:{...(Ye=I.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  name: 'Inline Editing',
  render: () => <EditingDemo />
}`,...(Xe=(Qe=I.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source}}};var qe,Ze,et;N.parameters={...N.parameters,docs:{...(qe=N.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  name: 'Header Filters',
  render: () => <HeaderFiltersDemo />
}`,...(et=(Ze=N.parameters)==null?void 0:Ze.docs)==null?void 0:et.source}}};var tt,at,rt;G.parameters={...G.parameters,docs:{...(tt=G.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  name: 'Footer Summaries',
  render: () => <FooterSummariesDemo />
}`,...(rt=(at=G.parameters)==null?void 0:at.docs)==null?void 0:rt.source}}};var nt,ot,it;H.parameters={...H.parameters,docs:{...(nt=H.parameters)==null?void 0:nt.docs,source:{originalSource:`{
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
}`,...(it=(ot=H.parameters)==null?void 0:ot.docs)==null?void 0:it.source}}};var st,lt,dt;L.parameters={...L.parameters,docs:{...(st=L.parameters)==null?void 0:st.docs,source:{originalSource:`{
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
}`,...(dt=(lt=L.parameters)==null?void 0:lt.docs)==null?void 0:dt.source}}};var ct,mt,ht;$.parameters={...$.parameters,docs:{...(ct=$.parameters)==null?void 0:ct.docs,source:{originalSource:`{
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
}`,...(ht=(mt=$.parameters)==null?void 0:mt.docs)==null?void 0:ht.source}}};var ut,pt,gt;W.parameters={...W.parameters,docs:{...(ut=W.parameters)==null?void 0:ut.docs,source:{originalSource:`{
  name: 'Export',
  render: () => <ExportDemo />
}`,...(gt=(pt=W.parameters)==null?void 0:pt.docs)==null?void 0:gt.source}}};var xt,yt,ft;O.parameters={...O.parameters,docs:{...(xt=O.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  name: 'Kitchen Sink (all features)',
  render: () => <KitchenSinkDemo />
}`,...(ft=(yt=O.parameters)==null?void 0:yt.docs)==null?void 0:ft.source}}};var St,wt,_t;V.parameters={...V.parameters,docs:{...(St=V.parameters)==null?void 0:St.docs,source:{originalSource:`{
  name: 'Keyboard Navigation (arrow/tab/enter)',
  render: () => <KeyboardNavDemo />
}`,...(_t=(wt=V.parameters)==null?void 0:wt.docs)==null?void 0:_t.source}}};var vt,bt,Ct;K.parameters={...K.parameters,docs:{...(vt=K.parameters)==null?void 0:vt.docs,source:{originalSource:`{
  name: 'Adjust columns (auto-fit to content)',
  render: () => <AdjustAutoWidthDemo />
}`,...(Ct=(bt=K.parameters)==null?void 0:bt.docs)==null?void 0:Ct.source}}};var kt,jt,Dt;J.parameters={...J.parameters,docs:{...(kt=J.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  name: 'Auto width (fill container by gravity)',
  render: () => <AutoWidthDemo />
}`,...(Dt=(jt=J.parameters)==null?void 0:jt.docs)==null?void 0:Dt.source}}};var At,Rt,Et;U.parameters={...U.parameters,docs:{...(At=U.parameters)==null?void 0:At.docs,source:{originalSource:`{
  name: 'Auto height (wrap cell content)',
  render: () => <AutoHeightDemo />
}`,...(Et=(Rt=U.parameters)==null?void 0:Rt.docs)==null?void 0:Et.source}}};var Tt,Pt,zt;Y.parameters={...Y.parameters,docs:{...(Tt=Y.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  name: 'Tooltip (cell hover)',
  render: () => <TooltipDemo />
}`,...(zt=(Pt=Y.parameters)==null?void 0:Pt.docs)==null?void 0:zt.source}}};var Mt,Ft,Bt;Q.parameters={...Q.parameters,docs:{...(Mt=Q.parameters)==null?void 0:Mt.docs,source:{originalSource:`{
  name: 'Row drag & drop',
  render: () => <RowDragDemo />
}`,...(Bt=(Ft=Q.parameters)==null?void 0:Ft.docs)==null?void 0:Bt.source}}};var It,Nt,Gt;X.parameters={...X.parameters,docs:{...(It=X.parameters)==null?void 0:It.docs,source:{originalSource:`{
  name: 'CSS API + marks',
  render: () => <CssApiAndMarksDemo />
}`,...(Gt=(Nt=X.parameters)==null?void 0:Nt.docs)==null?void 0:Gt.source}}};var Ht,Lt,$t;q.parameters={...q.parameters,docs:{...(Ht=q.parameters)==null?void 0:Ht.docs,source:{originalSource:`{
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
}`,...($t=(Lt=q.parameters)==null?void 0:Lt.docs)==null?void 0:$t.source}}};var Wt,Ot,Vt;Z.parameters={...Z.parameters,docs:{...(Wt=Z.parameters)==null?void 0:Wt.docs,source:{originalSource:`{
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
}`,...(Vt=(Ot=Z.parameters)==null?void 0:Ot.docs)==null?void 0:Vt.source}}};var Kt,Jt,Ut;ee.parameters={...ee.parameters,docs:{...(Kt=ee.parameters)==null?void 0:Kt.docs,source:{originalSource:`{
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
}`,...(Ut=(Jt=ee.parameters)==null?void 0:Jt.docs)==null?void 0:Ut.source}}};var Yt,Qt,Xt;te.parameters={...te.parameters,docs:{...(Yt=te.parameters)==null?void 0:Yt.docs,source:{originalSource:`{
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
}`,...(Xt=(Qt=te.parameters)==null?void 0:Qt.docs)==null?void 0:Xt.source}}};var qt,Zt,ea;ae.parameters={...ae.parameters,docs:{...(qt=ae.parameters)==null?void 0:qt.docs,source:{originalSource:`{
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
}`,...(ea=(Zt=ae.parameters)==null?void 0:Zt.docs)==null?void 0:ea.source}}};var ta,aa,ra;re.parameters={...re.parameters,docs:{...(ta=re.parameters)==null?void 0:ta.docs,source:{originalSource:`{
  render: () => <CustomEditorsDemo />
}`,...(ra=(aa=re.parameters)==null?void 0:aa.docs)==null?void 0:ra.source}}};var na,oa,ia;ne.parameters={...ne.parameters,docs:{...(na=ne.parameters)==null?void 0:na.docs,source:{originalSource:`{
  name: 'Pinned Rows',
  render: () => <PinnedRowsDemo />
}`,...(ia=(oa=ne.parameters)==null?void 0:oa.docs)==null?void 0:ia.source}}};const Xa=["Default","VirtualScroll","FrozenSplits","ColumnResize","Sorting","AnimalMultiSort","Grouping","Styling","RowSelection","CellSelection","ComplexSelection","InlineEditing","HeaderFilters","FooterSummaries","CellSpans","ColumnReorder","ColumnReorderWithSplits","Export","KitchenSink","KeyboardNavigation","AdjustColumns","AutoWidth","AutoHeight","TooltipStory","RowDrag","CssApiAndMarks","RemotePagination","RemoteSortFilter","Polling","FormulaEngine","FreezePanes","CustomCellEditors","PinnedRows"];export{K as AdjustColumns,T as AnimalMultiSort,U as AutoHeight,J as AutoWidth,F as CellSelection,H as CellSpans,L as ColumnReorder,$ as ColumnReorderWithSplits,R as ColumnResize,B as ComplexSelection,X as CssApiAndMarks,re as CustomCellEditors,j as Default,W as Export,G as FooterSummaries,te as FormulaEngine,ae as FreezePanes,A as FrozenSplits,P as Grouping,N as HeaderFilters,I as InlineEditing,V as KeyboardNavigation,O as KitchenSink,ne as PinnedRows,ee as Polling,q as RemotePagination,Z as RemoteSortFilter,Q as RowDrag,M as RowSelection,E as Sorting,z as Styling,Y as TooltipStory,D as VirtualScroll,Xa as __namedExportsOrder,Qa as default};
