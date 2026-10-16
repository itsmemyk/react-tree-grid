import{_ as ue}from"./iframe-C_Cj2U3v.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CXOcBcs0.js";import{D as ma,a as A,T as b}from"./DragManager-Dby8_QFd.js";import{G as m}from"./Grid-DlZBTzRI.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";function S(r={}){const{data:a,config:n}=r,o=s.useRef(null);o.current===null&&(o.current=new ma(n),a!=null&&a.length&&o.current.parse(a));const t=o.current,[i,d]=s.useState(()=>[...t._order]);s.useEffect(()=>{const l=()=>{d([...t._order])};return t.events.on(A.change,l),t.events.on(A.load,l),t.events.on(A.removeAll,l),t.events.on(A.filter,l),()=>{t.events.clear()}},[t]);const c=s.useCallback((l,v)=>t.add(l,v),[t]),u=s.useCallback(l=>t.remove(l),[t]),y=s.useCallback((l,v,ce)=>t.update(l,v,ce),[t]),_=s.useCallback((l,v)=>{t.sort(l,v),d([...t._order])},[t]),x=s.useCallback((l,v)=>{const ce=t.filter(l,v);return d([...t._order]),ce},[t]),w=s.useCallback(l=>{const v=t.resetFilter(l);return d([...t._order]),v},[t]),f=s.useCallback(l=>t.parse(l),[t]),C=s.useCallback(()=>t.removeAll(),[t]);return{items:i,store:t,add:c,remove:u,update:y,getItem:s.useCallback(l=>t.getItem(l),[t]),getIndex:s.useCallback(l=>t.getIndex(l),[t]),getLength:s.useCallback(()=>t.getLength(),[t]),exists:s.useCallback(l=>t.exists(l),[t]),sort:_,filter:x,resetFilter:w,find:s.useCallback(l=>t.find(l),[t]),findAll:s.useCallback(l=>t.findAll(l),[t]),serialize:s.useCallback(()=>t.serialize(),[t]),parse:f,removeAll:C}}const k=["Lead","Developer","QA Engineer","DevOps","Designer","PM"],j=["Alpha","Beta","Gamma","Delta"],se=["North","South","East","West"],le=["Alice Chen","Bob Rivera","Carla Müller","David Kim","Eva Torres","Frank Osei","Grace Liu","Hassan Ali","Iris Novak","James Okoro","Kira Singh","Liam Brown","Mina Sato","Noah Garcia","Olivia Jansen","Pavel Sokolov","Quinn Murphy","Rosa Fernandes","Samuel Ek","Tara Gupta"];function de(r){return Array.from({length:r},(a,n)=>({id:String(n+1),name:le[n%le.length],role:k[n%k.length],team:j[n%j.length],region:se[n%se.length],salary:45e3+Math.floor(Math.random()*8e4),age:22+n%35,active:n%5!==0}))}const p=de(50),sa=de(200),ha=de(5e3),g=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,resizable:!0},{id:"role",header:[{text:"Role"}],width:140,resizable:!0},{id:"team",header:[{text:"Team"}],width:120,resizable:!0},{id:"region",header:[{text:"Region"}],width:120,resizable:!0},{id:"salary",header:[{text:"Salary"}],width:120,resizable:!0,align:"right",template:r=>`$${Number(r).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}],h=500,Xa={title:"Grid",component:m,decorators:[r=>e.jsx(b,{children:e.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:e.jsx(r,{})})})],parameters:{layout:"fullscreen"}},D={name:"Basic Usage",args:{columns:g,data:p.slice(0,15),style:{width:"100%",height:h}}},R={name:"Virtual Scroll",args:{columns:g,data:ha,style:{width:"100%",height:h}}};function ua(){const r=[{id:"id",header:[{text:"# (frozen)"}],width:100},{id:"name",header:[{text:"Name (frozen)"}],width:200},{id:"role",header:[{text:"Role"}],width:220},{id:"team",header:[{text:"Team"}],width:220},{id:"region",header:[{text:"Region"}],width:220},{id:"salary",header:[{text:"Salary"}],width:200,align:"right",template:a=>`$${Number(a).toLocaleString()}`},{id:"active",header:[{text:"Active"}],width:200,align:"center",template:a=>a?"Yes":"No"},{id:"age",header:[{text:"Age (frozen)"}],width:120,align:"center"}];return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Scroll horizontally — first 2 columns and last column stay frozen. First and last rows stay frozen on vertical scroll."}),e.jsx(m,{columns:r,data:p,leftSplit:2,rightSplit:1,topSplit:1,bottomSplit:1,style:{width:"100%",height:h}})]})}const E={name:"Frozen Columns & Rows",render:()=>e.jsx(ua,{})},T={name:"Column Resize",args:{columns:g.map(r=>({...r,resizable:!0,minWidth:60,maxWidth:400})),data:p.slice(0,15),style:{width:"100%",height:h}}};function pa(){const{items:r,store:a}=S({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a header to sort. Click again to toggle asc ↔ desc. Ctrl+click adds a column to a multi-column sort."}),e.jsx(m,{columns:g,data:r,store:a,sortable:!0,style:{width:"100%",height:h},onAfterSort:n=>console.log("Sort states:",n)})]})}const M={name:"Sorting",render:()=>e.jsx(pa,{})},la=[{id:"1",shift:"Morning Shift",animal_name:"Bella",animal_type:"Dog",animal_age:5,task:"Walk",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:3,contact:"(212) 555-0118",shelter_location:"Western Branch",animal_photo:"./img/animals/01.jpg"},{id:"2",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Feed",task_status:"Open",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"3",shift:"Evening Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"4",shift:"Morning Shift",animal_name:"Luna",animal_type:"Cat",animal_age:.5,task:"Play",task_status:"Completed",volunteer_name:"Michael Green",experience_level:1,contact:"(323) 555-0325",shelter_location:"Northern Branch",animal_photo:"./img/animals/04.jpg"},{id:"5",shift:"Evening Shift",animal_name:"Charlie",animal_type:"Dog",animal_age:1,task:"Medication",task_status:"Completed",volunteer_name:"Anna Brown",experience_level:1,contact:"(212) 555-0118",shelter_location:"Eastern Branch",animal_photo:"./img/animals/05.jpg"},{id:"6",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Walk",task_status:"Open",volunteer_name:"John Smith",experience_level:3,contact:"(415) 555-0734",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"7",shift:"Afternoon Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"8",shift:"Morning Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Emily White",experience_level:3,contact:"(707) 555-0998",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"9",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Open",volunteer_name:"Jessica Brown",experience_level:2,contact:"(818) 555-0876",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"10",shift:"Morning Shift",animal_name:"Daisy",animal_type:"Dog",animal_age:7,task:"Walk",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:1,contact:"(323) 555-0411",shelter_location:"Northern Branch",animal_photo:"./img/animals/09.jpg"},{id:"11",shift:"Afternoon Shift",animal_name:"Toby",animal_type:"Dog",animal_age:5,task:"Clean cage",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Western Branch",animal_photo:"./img/animals/10.jpg"},{id:"12",shift:"Evening Shift",animal_name:"Maggie",animal_type:"Cat",animal_age:2,task:"Play",task_status:"Completed",volunteer_name:"Mark Foster",experience_level:3,contact:"(408) 555-0217",shelter_location:"Eastern Branch",animal_photo:"./img/animals/11.jpg"},{id:"13",shift:"Afternoon Shift",animal_name:"Max",animal_type:"Dog",animal_age:2,task:"Walk",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Southern Branch",animal_photo:"./img/animals/03.jpg"},{id:"14",shift:"Evening Shift",animal_name:"Whiskers",animal_type:"Cat",animal_age:7,task:"Play",task_status:"Completed",volunteer_name:"Ben Carter",experience_level:2,contact:"(415) 555-0198",shelter_location:"Southern Branch",animal_photo:"./img/animals/02.jpg"},{id:"15",shift:"Morning Shift",animal_name:"Rocky",animal_type:"Cat",animal_age:4,task:"Train",task_status:"In Progress",volunteer_name:"Sarah Johnson",experience_level:3,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/12.jpg"},{id:"16",shift:"Afternoon Shift",animal_name:"Oliver",animal_type:"Cat",animal_age:3,task:"Feed",task_status:"In Progress",volunteer_name:"Michael Green",experience_level:2,contact:"(323) 555-0325",shelter_location:"Western Branch",animal_photo:"./img/animals/13.jpg"},{id:"17",shift:"Morning Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Play",task_status:"Completed",volunteer_name:"Daniel Harris",experience_level:2,contact:"(323) 555-0411",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"18",shift:"Afternoon Shift",animal_name:"Sasha",animal_type:"Cat",animal_age:7,task:"Walk",task_status:"In Progress",volunteer_name:"John Smith",experience_level:1,contact:"(415) 555-0734",shelter_location:"Southern Branch",animal_photo:"./img/animals/15.jpg"},{id:"19",shift:"Evening Shift",animal_name:"Milo",animal_type:"Cat",animal_age:3,task:"Medication",task_status:"Completed",volunteer_name:"Michael Green",experience_level:3,contact:"(323) 555-0325",shelter_location:"Southern Branch",animal_photo:"./img/animals/08.jpg"},{id:"20",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"21",shift:"Evening Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Train",task_status:"In Progress",volunteer_name:"Monica Hill",experience_level:2,contact:"(415) 555-0623",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"},{id:"22",shift:"Afternoon Shift",animal_name:"Oscar",animal_type:"Dog",animal_age:3,task:"Walk",task_status:"Completed",volunteer_name:"Monica Hill",experience_level:1,contact:"(415) 555-0623",shelter_location:"Eastern Branch",animal_photo:"./img/animals/07.jpg"},{id:"23",shift:"Evening Shift",animal_name:"Cleo",animal_type:"Cat",animal_age:4,task:"Feed",task_status:"Completed",volunteer_name:"Sarah Johnson",experience_level:2,contact:"(310) 555-0247",shelter_location:"Western Branch",animal_photo:"./img/animals/14.jpg"},{id:"24",shift:"Morning Shift",animal_name:"Bear",animal_type:"Dog",animal_age:6,task:"Medication",task_status:"In Progress",volunteer_name:"Ben Carter",experience_level:3,contact:"(415) 555-0198",shelter_location:"Northern Branch",animal_photo:"./img/animals/06.jpg"}],ga={Open:"#f59e0b","In Progress":"#0288d1",Completed:"#12a66a"},da=[{id:"animal_name",header:[{text:"Animal name"}],width:140,template:(r,a)=>e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("img",{src:a.animal_photo,alt:"",style:{borderRadius:"50%",height:28,width:28}}),a.animal_name]})},{id:"animal_type",header:[{text:"Animal type"}],width:130},{id:"animal_age",type:"number",header:[{text:"Age"}],width:66,align:"right"},{id:"task",header:[{text:"Task"}],width:96},{id:"task_status",header:[{text:"Task status"}],width:130,template:r=>{const a=r;return e.jsxs("span",{style:{alignItems:"center",display:"inline-flex",gap:8},children:[e.jsx("span",{style:{background:ga[a],borderRadius:"50%",height:8,width:8}}),a]})}},{id:"volunteer_name",header:[{text:"Volunteer name"}],width:155},{id:"experience_level",type:"number",header:[{text:"Experience Level",align:"left"}],width:165,align:"left",template:r=>e.jsx("span",{style:{color:"#f59e0b",fontSize:18},children:"★".repeat(Number(r))})},{id:"contact",header:[{text:"Contact",align:"right"}],width:124,align:"right"},{id:"shelter_location",header:[{text:"Shelter location"}],width:155},{id:"shift",header:[{text:"Shift"}],width:120}];function xa(){const{items:r,store:a}=S({data:la});return s.useEffect(()=>{a.sort([{by:"volunteer_name",dir:"desc"},{by:"task_status",dir:"asc"},{by:"animal_type",dir:"asc"}])},[a]),e.jsx(m,{columns:da,data:r,store:a,sortable:!0,selection:"row",style:{width:"100%",height:h}})}const P={name:"Multi-Column Sorting",render:()=>e.jsx(xa,{})},z={name:"Grouping",render(){return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 48px)"},children:[e.jsxs("p",{style:{flexShrink:0,margin:"0 0 8px",fontSize:13},children:["Drag a column header onto the ",e.jsx("strong",{children:"Group by:"})," panel to group rows. Click the sort arrow to change group sort direction. Drag chips to reorder. Click ✕ to remove a grouping. Click the chevron to expand or collapse groups."]}),e.jsx(m,{columns:da,data:la,groupable:!0,sortable:!0,group:{order:["animal_type"]},style:{flex:1,minHeight:0,width:"100%"}})]})}},F={name:"Styling",render:()=>e.jsx(Na,{})},B={name:"Row Selection",args:{columns:g,data:p.slice(0,20),selection:"row",multiselection:!0,style:{width:"100%",height:h}}},I={name:"Cell Selection",args:{columns:g,data:p.slice(0,20),selection:"cell",style:{width:"100%",height:h}}},N={name:"Complex Selection",args:{columns:g,data:p.slice(0,20),selection:"complex",multiselection:!0,style:{width:"100%",height:h}}};function ya(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:a,store:n}=S({data:p.slice(0,15)});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Double-click a cell to edit. Enter to save, Escape to cancel, Tab to move to next editable cell."}),e.jsx(m,{columns:r,data:a,store:n,editable:!0,selection:"cell",style:{width:"100%",height:h},onAfterEditEnd:(o,t,i)=>console.log(`Edited [${o}][${t}] →`,i)})]})}const G={name:"Inline Editing",render:()=>e.jsx(ya,{})};function fa(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:140},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:o=>`$${Number(o).toLocaleString()}`}],{items:a,store:n}=S({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Second header row has filters: text input for Name, dropdown for Role/Team, searchable combo for Region."}),e.jsx(m,{columns:r,data:a,store:n,style:{width:"100%",height:h}})]})}const H={name:"Header Filters",render:()=>e.jsx(fa,{})};function Sa(){const r=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60},{id:"name",header:[{text:"Name"}],footer:[{text:"Rows / totals"},{text:"Averages / range"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:120},{id:"salary",header:[{text:"Salary"}],width:140,align:"right",footer:[{content:"sum",template:o=>`Sum $${Number(o).toLocaleString()}`},{content:"avg",template:o=>`Avg $${Math.round(Number(o)).toLocaleString()}`}],template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:100,align:"center",footer:[{content:"min",template:o=>`Min ${o}`},{content:"max",template:o=>`Max ${o}`}]}],{items:a,store:n}=S({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Footer rows show aggregations: count, sum, avg, min, max. Salary has two footer rows (sum + avg)."}),e.jsx(m,{columns:r,data:a,store:n,style:{width:"100%",height:h}})]})}const $={name:"Footer Summaries",render:()=>e.jsx(Sa,{})},L={name:"Cell Spans",args:{columns:g.slice(0,5),data:p.slice(0,12),spans:[{row:"1",column:"name",colspan:2,text:"Alice Chen — Lead",css:""},{row:"3",column:"team",rowspan:3,text:"Team Gamma (shared)",css:""},{row:"6",column:"name",colspan:3,rowspan:2,text:"Merged block (2×3)",css:""}],style:{width:"100%",height:h}}},W={name:"Column Reorder",args:{columns:g,data:p.slice(0,16),dragItem:"column",style:{width:"100%",height:h}}},O={name:"Column Reorder with Frozen Splits",args:{columns:g,data:p,dragItem:"column",leftSplit:2,rightSplit:1,style:{width:"100%",height:h}}};function wa(){const{items:r,store:a}=S({data:p.slice(0,10)});return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:12,display:"flex",gap:8},children:[e.jsx("button",{onClick:()=>{ue(async()=>{const{downloadGridAsCsv:n}=await import("./index-B1EyHz8p.js");return{downloadGridAsCsv:n}},[]).then(({downloadGridAsCsv:n})=>{n(a,g,"employees.csv")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export CSV"}),e.jsx("button",{onClick:()=>{ue(async()=>{const{downloadGridAsExcel:n}=await import("./index-B1EyHz8p.js");return{downloadGridAsExcel:n}},[]).then(({downloadGridAsExcel:n})=>{n(a,g,"employees.xlsx")})},style:{padding:"6px 16px",cursor:"pointer"},children:"Export Excel"})]}),e.jsx(m,{columns:g,data:r,store:a,style:{width:"100%",height:h}})]})}const V={name:"Export",render:()=>e.jsx(wa,{})};function va(){const r=[{id:"id",header:[{text:"#"}],footer:[{content:"count"}],width:60,resizable:!0},{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"role",header:[{text:"Role"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120,sortable:!0,resizable:!0},{id:"region",header:[{text:"Region"},{content:"comboFilter"}],width:130,sortable:!0,resizable:!0},{id:"salary",header:[{text:"Salary"}],footer:[{content:"sum"},{content:"avg"}],width:130,sortable:!0,resizable:!0,align:"right",editorType:"input",type:"number",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],footer:[{content:"min"},{content:"max"}],width:80,sortable:!0,align:"center",editorType:"input",type:"number"},{id:"active",header:[{text:"Active"}],width:90,align:"center",type:"boolean",editorType:"checkbox",template:o=>o?"✓":"—"}],{items:a,store:n}=S({data:sa});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"All features active: sorting, filters, footers, resize, editing (dbl-click, Enter or F2; Salary and Age only accept numbers), Space toggles Active, keyboard navigation, selection (Ctrl/Shift+click), column drag reorder, 200 rows virtual scroll."}),e.jsx(m,{columns:r,data:a,store:n,sortable:!0,editable:!0,selection:"complex",multiselection:!0,dragItem:"column",leftSplit:1,keyNavigation:!0,style:{width:"100%",height:h},onAfterSort:o=>console.log("Sort:",o),onAfterEditEnd:(o,t,i)=>console.log(`Edit [${o}][${t}]:`,i),onAfterSelect:(o,t)=>console.log(`Select [${o}][${t}]`)})]})}const K={name:"Kitchen Sink (all features)",render:()=>e.jsx(va,{})};function _a(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160,editorType:"input"},{id:"role",header:[{text:"Role"}],width:140,editorType:"input"},{id:"team",header:[{text:"Team"}],width:120,editorType:"input"},{id:"region",header:[{text:"Region"}],width:120,editorType:"input"},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",editorType:"input",template:o=>`$${Number(o).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center",editorType:"input"}],{items:a,store:n}=S({data:p});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Click a cell, then use arrow keys to navigate. Tab/Shift+Tab wraps across rows. Enter to edit, Escape to cancel. PageUp/Down scrolls viewport. Ctrl+Arrow jumps to first/last row/col."}),e.jsx(m,{columns:r,data:a,store:n,editable:!0,selection:"complex",keyNavigation:!0,style:{width:"100%",height:h},onAfterSelect:(o,t)=>console.log(`Select [${o}][${t}]`),onAfterEditEnd:(o,t,i)=>console.log(`Edit [${o}][${t}]:`,i)})]})}const J={name:"Keyboard Navigation (arrow/tab/enter)",render:()=>e.jsx(_a,{})};function ba(){const r=s.useMemo(()=>p.slice(0,20).map((n,o)=>({...n,role:o%4===0?"Senior Principal Software Engineer":n.role,region:o%3===0?"North American Operations":n.region})),[]),a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],adjust:"data"},{id:"role",header:[{text:"Role"}],adjust:!0},{id:"team",header:[{text:"Team"}],adjust:"header"},{id:"region",header:[{text:"Region"}],adjust:"data"},{id:"salary",header:[{text:"Salary"}],adjust:"data",align:"right",template:n=>`$${Number(n).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Columns auto-fit to widest data/header value via ",e.jsx("code",{children:"adjust"}),"."]}),e.jsx(m,{columns:a,data:r,style:{width:"100%",height:h}})]})}const U={name:"Adjust columns (auto-fit to content)",render:()=>e.jsx(ba,{})};function Ca(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],gravity:2},{id:"role",header:[{text:"Role"}],gravity:1},{id:"team",header:[{text:"Team"}],gravity:1},{id:"region",header:[{text:"Region"}],gravity:1},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:a=>`$${Number(a).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Flexible columns fill the container proportionally by ",e.jsx("code",{children:"gravity"}),". name takes 2× the share of its siblings."]}),e.jsx(m,{autoWidth:!0,columns:r,data:p,style:{width:"100%",height:h}})]})}const Y={name:"Auto width (fill container by gravity)",render:()=>e.jsx(Ca,{})};function ka(){const r=s.useMemo(()=>[{id:"1",name:"Alice Chen",role:"Senior Principal Software Engineer working on distributed systems and event-sourcing pipelines",team:"Alpha",region:"North",salary:12e4,age:34,active:!0},{id:"2",name:"Bob Rivera",role:"QA Engineer",team:"Beta",region:"South",salary:8e4,age:28,active:!0},{id:"3",name:"Carla Müller",role:"Frontend Developer specializing in accessibility and design systems across product surfaces",team:"Gamma",region:"East",salary:95e3,age:31,active:!0}],[]),a=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:140},{id:"role",header:[{text:"Role"}],width:200},{id:"team",header:[{text:"Team"}],width:100},{id:"region",header:[{text:"Region"}],width:100}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Rows grow vertically to fit wrapped cell text when ",e.jsx("code",{children:"autoHeight"})," is on."]}),e.jsx(m,{autoHeight:!0,columns:a,data:r,style:{width:"100%",height:h}})]})}const Q={name:"Auto height (wrap cell content)",render:()=>e.jsx(ka,{})};function ja(){const r=[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140,tooltipTemplate:(a,n)=>`${n.name} — ${a}`},{id:"team",header:[{text:"Team"}],width:120},{id:"region",header:[{text:"Region"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:a=>`$${Number(a).toLocaleString()}`,tooltipTemplate:a=>`Annual salary: $${Number(a).toLocaleString()}`},{id:"age",header:[{text:"Age"}],width:80,align:"center"}];return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Hover over cells. Role and Salary columns use ",e.jsx("code",{children:"tooltipTemplate"}),"; other columns show raw value."]}),e.jsx(m,{tooltip:!0,columns:r,data:p.slice(0,20),style:{width:"100%",height:h}})]})}const X={name:"Tooltip (cell hover)",render:()=>e.jsx(ja,{})};function Aa(){return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Drag rows to reorder them. A horizontal drop line shows the insertion point."}),e.jsx(m,{columns:g,data:p.slice(0,14),dragItem:"row",style:{width:"100%",height:h}})]})}const q={name:"Row drag & drop",render:()=>e.jsx(Aa,{})};function Da(){const r=s.useRef(null),[a,n]=s.useState(!0),o=s.useMemo(()=>[{id:"id",header:[{text:"#"}],width:60},{id:"name",header:[{text:"Name"}],width:160},{id:"region",header:[{text:"Region"}],width:120},{id:"salary",header:[{text:"Salary"}],width:120,align:"right",template:i=>`$${Number(i).toLocaleString()}`,mark:{min:"gridStoryMarkMin",max:"gridStoryMarkMax"}},{id:"team",header:[{text:"Team"}],width:120,mark:(i,d,c)=>c.team==="Gamma"?"gridStoryMarkGamma":!1}],[]),t=p.slice(0,12);return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Imperative API: addRowCss, addCellCss, showColumn/hideColumn. Salary uses min/max marks; Team uses a function mark."}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"},children:[e.jsx("button",{type:"button",onClick:()=>{var i,d;(i=r.current)==null||i.addRowCss("1","gridStoryRowAccent"),(d=r.current)==null||d.addCellCss("1","salary","gridStoryCellAccent")},children:"Highlight first row"}),e.jsx("button",{type:"button",onClick:()=>{var i,d;(i=r.current)==null||i.removeRowCss("1","gridStoryRowAccent"),(d=r.current)==null||d.removeCellCss("1","salary","gridStoryCellAccent")},children:"Clear highlight"}),e.jsxs("button",{type:"button",onClick:()=>{var i,d;a?(i=r.current)==null||i.hideColumn("region"):(d=r.current)==null||d.showColumn("region"),n(c=>!c)},children:[a?"Hide":"Show"," region column"]})]}),e.jsx("style",{children:`
        .gridStoryRowAccent { background: rgba(255, 214, 102, 0.28); }
        .gridStoryCellAccent { background: rgba(255, 107, 107, 0.16); color: #8f1d21; font-weight: 600; }
        .gridStoryMarkMin { background: rgba(56, 217, 169, 0.18); color: #087f5b; }
        .gridStoryMarkMax { background: rgba(255, 146, 43, 0.18); color: #d9480f; font-weight: 600; }
        .gridStoryMarkGamma { box-shadow: inset 0 0 0 1px rgba(66, 99, 235, 0.35); color: #364fc7; }
      `}),e.jsx(m,{ref:r,columns:o,data:t,style:{width:"100%",height:h}})]})}const Z={name:"CSS API + marks",render:()=>e.jsx(Da,{})},me=Array.from({length:200},(r,a)=>({id:`${a+1}`,name:le[a%le.length],role:k[a%k.length],team:j[a%j.length],region:se[a%se.length],salary:5e4+a*317%6e4,age:22+a*7%40,active:a%3!==0}));function he(r){return async a=>{await new Promise(y=>setTimeout(y,300));const n=new URLSearchParams(a.split("?")[1]),o=Number(n.get("page")??1),t=Number(n.get("size")??50),i=n.getAll("sortBy"),d=n.getAll("sortDir");let c=[...r];for(const[y,_]of n){const x=/^filter\[(.+)\]$/.exec(y);if(!x||!_)continue;const w=_.toLowerCase();c=c.filter(f=>String(f[x[1]]??"").toLowerCase().includes(w))}i.length&&c.sort((y,_)=>{for(let x=0;x<i.length;x++){const w=y[i[x]],f=_[i[x]],C=typeof w=="number"&&typeof f=="number"?w-f:String(w??"").localeCompare(String(f??""));if(C!==0)return d[x]==="desc"?-C:C}return 0});const u=(o-1)*t;return{ok:!0,json:async()=>({data:c.slice(u,u+t),total:c.length})}}}const ca=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"}],width:100},{id:"salary",header:[{text:"Salary"}],width:100}],ee={name:"DataProxy — Remote Pagination (append)",render:()=>e.jsx(b,{children:e.jsx(m,{columns:ca,data:[],dataProxy:{url:"https://api.test/employees",pageSize:20,fetchFn:he(me)},paginationMode:"append",style:{height:400,width:"100%"}})})},Ra=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:160},{id:"role",header:[{text:"Role"}],width:140},{id:"team",header:[{text:"Team"},{content:"selectFilter"}],width:120,filterOptions:[...j]},{id:"salary",header:[{text:"Salary"},{text:""}],width:100}],te={name:"DataProxy — Remote Sort & Filter",render:()=>e.jsx(b,{children:e.jsx(m,{columns:Ra,data:[],dataProxy:{url:"https://api.test/employees",pageSize:50,fetchFn:he(me)},paginationMode:"append",remoteSort:!0,remoteFilter:!0,sortable:!0,style:{height:400,width:"100%"}})})},ae={name:"DataProxy — Polling (2s)",render:()=>{const[r,a]=s.useState(0),n=s.useMemo(()=>({url:"https://api.test/employees",pageSize:10,polling:2e3,fetchFn:async o=>(a(t=>t+1),he(me)(o))}),[]);return e.jsxs(b,{children:[e.jsxs("p",{style:{margin:"0 0 8px"},children:["Tick: ",r," (data refreshes every 2s via polling)"]}),e.jsx(m,{columns:ca,data:[],dataProxy:n,style:{height:320,width:"100%"}})]})}},re={name:"Formula Engine",render(){return e.jsx(b,{children:e.jsx(m,{columns:[{id:"label",header:[{text:"Label"}],width:120},{id:"value",header:[{text:"Value"}],width:100},{id:"doubled",header:[{text:"Doubled (=value*2)"}],width:160},{id:"total",header:[{text:"Total (=SUM)"}],width:160}],data:[{id:"r1",label:"Alpha",value:10,doubled:"=B1*2",total:""},{id:"r2",label:"Beta",value:20,doubled:"=B2*2",total:""},{id:"r3",label:"Gamma",value:30,doubled:"=B3*2",total:"=SUM(B1:B3)"}],formulas:!0,style:{height:200,width:"100%"}})})}},Ea=[{id:"1",name:"Alice Martin",role:"Engineer",department:"Product",status:"Active"},{id:"2",name:"Bob Chen",role:"Designer",department:"Design",status:"Active"},{id:"3",name:"Carol Davis",role:"Manager",department:"Ops",status:"Away"},{id:"4",name:"David Kim",role:"Engineer",department:"Platform",status:"Active"},{id:"5",name:"Eva Rossi",role:"Analyst",department:"Finance",status:"Active"},{id:"6",name:"Frank Müller",role:"Engineer",department:"Product",status:"Inactive"},{id:"7",name:"Grace Lee",role:"Designer",department:"Design",status:"Active"},{id:"8",name:"Hiro Tanaka",role:"Manager",department:"Ops",status:"Away"}],Ta={Active:"var(--react-tree-grid-color-success)",Away:"var(--react-tree-grid-color-warning)",Inactive:"var(--react-tree-grid-color-danger)"},Ma={Active:"#fff",Away:"rgba(0,0,0,0.75)",Inactive:"#fff"},Pa=[{id:"name",header:[{text:"Name"}],width:180,sortable:!0},{id:"role",header:[{text:"Role"}],width:140,sortable:!0},{id:"department",header:[{text:"Department"}],width:150,sortable:!0},{id:"status",header:[{text:"Status"}],width:120,template:r=>{const a=r;return e.jsx("span",{style:{display:"inline-block",padding:"2px 10px",borderRadius:"var(--react-tree-grid-radius-lg)",background:Ta[a],color:Ma[a],fontSize:11,fontWeight:500,letterSpacing:"0.02em"},children:a})}}],za=[{label:"Primary",cssVar:"--react-tree-grid-color-primary"},{label:"Secondary",cssVar:"--react-tree-grid-color-secondary"},{label:"Success",cssVar:"--react-tree-grid-color-success"},{label:"Warning",cssVar:"--react-tree-grid-color-warning"},{label:"Danger",cssVar:"--react-tree-grid-color-danger"}],Fa={colorPrimary:"#0d6efd",colorPrimaryHover:"#0b5ed7",colorSecondary:"#6c757d",colorSuccess:"#198754",colorWarning:"#ffc107",colorDanger:"#dc3545",colorBackground:"#ffffff",colorSurface:"#f8f9fa",colorText:"#212529",colorTextSecondary:"#6c757d",colorBorder:"#dee2e6",fontFamily:'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',fontSizeMd:"16px",radiusSm:"4px",radiusMd:"6px",radiusLg:"12px",shadowSm:"0 1px 2px rgba(0,0,0,0.075)",shadowMd:"0 .5rem 1rem rgba(0,0,0,0.15)",colorHeaderBackground:"#0d6efd",colorHeaderText:"#ffffff",colorRowHover:"rgba(13,110,253,0.06)",colorRowSelected:"rgba(13,110,253,0.12)",colorSortActive:"#ffffff",colorSortIdle:"rgba(255,255,255,0.5)"},Ba={colorPrimary:"#1976d2",colorPrimaryHover:"#1565c0",colorBackground:"#ffffff",colorSurface:"#fafafa",colorText:"#212121",colorTextSecondary:"#757575",colorBorder:"rgba(0,0,0,0.12)",fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',fontWeightMedium:"500",radiusSm:"0px",radiusMd:"4px",shadowSm:"0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",shadowMd:"0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",colorHeaderBackground:"#673ab7",colorHeaderText:"#ffffff",colorRowHover:"rgba(103,58,183,0.06)",colorRowSelected:"rgba(103,58,183,0.12)",colorSortActive:"#ffffff",colorSortIdle:"rgba(255,255,255,0.5)"},Ia={default:{},bootstrap:Fa,material:Ba},pe={default:"Default",bootstrap:"Bootstrap 5",material:"Material UI"};function Na(){const[r,a]=s.useState("default"),n=Ia[r],o=Object.keys(n).length===0?"{}":`{
${Object.entries(n).map(([t,i])=>`  ${t}: '${i}'`).join(`,
`)}
}`;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:13,color:"#666"},children:"Theme:"}),e.jsx("select",{value:r,onChange:t=>a(t.target.value),style:{fontSize:13,padding:"4px 8px",borderRadius:4,border:"1px solid #ccc",cursor:"pointer"},children:Object.keys(pe).map(t=>e.jsx("option",{value:t,children:pe[t]},t))})]}),e.jsxs(b,{theme:"light",overrides:n,children:[e.jsx(m,{columns:Pa,data:Ea,sortable:!0,defaultSortStates:[{columnId:"name",order:"asc"}],selection:"row",multiselection:!0,style:{width:"100%",height:320}}),e.jsx("div",{style:{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"},children:za.map(({label:t,cssVar:i})=>e.jsx("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:"var(--react-tree-grid-radius-md)",background:`var(${i})`,color:"#fff",fontSize:11,fontWeight:500,letterSpacing:"0.02em"},children:t},t))})]}),e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 4px",fontSize:12,color:"#888",fontFamily:"monospace"},children:'<ThemeProvider theme="light" overrides={overrides}>'}),e.jsx("pre",{style:{margin:0,padding:"12px 16px",background:"#1e1e1e",color:"#d4d4d4",fontFamily:'"Fira Code", "Cascadia Code", Consolas, monospace',fontSize:12,borderRadius:6,overflowX:"auto",lineHeight:1.6},children:`const overrides = ${o}`})]})]})}const ne={name:"Freeze Panes (draggable)",render(){const[r,a]=s.useState(2);return e.jsxs(b,{children:[e.jsxs("p",{style:{margin:"0 0 8px",fontSize:13},children:["Frozen columns: ",e.jsx("strong",{children:r})," — drag the blue handle to change"]}),e.jsx(m,{columns:[{id:"id",header:[{text:"#"}],width:50},{id:"name",header:[{text:"Name"}],width:140},{id:"dept",header:[{text:"Department"}],width:140},{id:"role",header:[{text:"Role"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100},{id:"city",header:[{text:"City"}],width:120},{id:"start",header:[{text:"Start Date"}],width:120}],data:[{id:"1",name:"Alice",dept:"Engineering",role:"Lead",salary:12e4,city:"SF",start:"2020-01"},{id:"2",name:"Bob",dept:"Product",role:"PM",salary:11e4,city:"NYC",start:"2019-06"},{id:"3",name:"Carol",dept:"Design",role:"Senior",salary:95e3,city:"Austin",start:"2021-03"},{id:"4",name:"Dave",dept:"Engineering",role:"Mid",salary:9e4,city:"Seattle",start:"2022-01"}],leftSplit:r,freezable:!0,onFreeze:({left:n})=>a(n),style:{height:240,width:"100%"}})]})}},Ga=de(8);function Ha(){const r=[{id:"name",header:[{text:"Name"}],width:160},{id:"role",header:[{text:"Role (select)"}],width:180,editTemplate:(o,t,i,d)=>e.jsx("select",{ref:d.ref,style:{width:"100%",height:"100%",border:"none",background:"transparent"},value:String(o),onChange:c=>d.onChange(c.target.value),onBlur:()=>d.onCommit(),children:k.map(c=>e.jsx("option",{value:c,children:c},c))})},{id:"team",header:[{text:"Notes (textarea)"}],width:220,editTemplate:(o,t,i,d)=>e.jsx("textarea",{ref:d.ref,style:{width:"100%",height:"100%",resize:"none"},value:String(o),onChange:c=>d.onChange(c.target.value),onKeyDown:c=>{c.key==="Enter"&&c.stopPropagation()},onBlur:()=>d.onCommit()})}],{items:a,store:n}=S({data:Ga});return e.jsxs("div",{children:[e.jsxs("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:["Double-click a cell. ",e.jsx("strong",{children:"Role"}),": pick an option, then press Enter or click outside to commit. ",e.jsx("strong",{children:"Notes"})," keeps Enter for newlines — click outside to commit. Escape cancels either."]}),e.jsx(m,{columns:r,data:a,store:n,editable:!0,selection:"cell",style:{width:600,height:340},onAfterEditEnd:(o,t,i)=>console.log(`Edited [${o}][${t}] →`,i)})]})}const oe={render:()=>e.jsx(Ha,{})},ge=["1","5","10","25","50","100"],$a=g.map(r=>({...r,width:(r.width??100)+60,...r.id==="name"||r.id==="role"?{editorType:"input"}:{}}));function La(){const{items:r,store:a}=S({data:sa}),[n,o]=s.useState(["5"]),[t,i]=s.useState(["100"]),d=(u,y,_,x,w)=>{w(x.filter(f=>f!==u)),_(y.includes(u)?y.filter(f=>f!==u):[...y,u])},c=u=>({padding:"4px 10px",background:u?"#3b82f6":"#f3f4f6",color:u?"#fff":"#111",border:"1px solid #d1d5db",borderRadius:4,cursor:"pointer"});return e.jsxs("div",{children:[e.jsx("p",{style:{margin:"0 0 12px",color:"#666",fontSize:13},children:"Pin rows by ID to the top or bottom. Pinned rows leave the scrollable area, stay visible on vertical scroll, and scroll horizontally with the body. The first two columns are frozen; Name and Role are editable."}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6,marginBottom:12},children:[e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"},children:[e.jsx("span",{style:{width:60,fontSize:13},children:"Top:"}),ge.map(u=>e.jsxs("button",{type:"button",style:c(n.includes(u)),onClick:()=>d(u,n,o,t,i),children:["#",u]},u))]}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"},children:[e.jsx("span",{style:{width:60,fontSize:13},children:"Bottom:"}),ge.map(u=>e.jsxs("button",{type:"button",style:c(t.includes(u)),onClick:()=>d(u,t,i,n,o),children:["#",u]},u))]})]}),e.jsx(m,{columns:$a,data:r,store:a,pinnedTopRows:n,pinnedBottomRows:t,leftSplit:2,editable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:h}})]})}const ie={name:"Pinned Rows",render:()=>e.jsx(La,{})};var xe,ye,fe;D.parameters={...D.parameters,docs:{...(xe=D.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  name: 'Basic Usage',
  args: {
    columns: baseColumns,
    data: data50.slice(0, 15),
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(fe=(ye=D.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var Se,we,ve;R.parameters={...R.parameters,docs:{...(Se=R.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Virtual Scroll',
  args: {
    columns: baseColumns,
    data: data5000,
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ve=(we=R.parameters)==null?void 0:we.docs)==null?void 0:ve.source}}};var _e,be,Ce;E.parameters={...E.parameters,docs:{...(_e=E.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  name: 'Frozen Columns & Rows',
  render: () => <FrozenSplitsDemo />
}`,...(Ce=(be=E.parameters)==null?void 0:be.docs)==null?void 0:Ce.source}}};var ke,je,Ae;T.parameters={...T.parameters,docs:{...(ke=T.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(Ae=(je=T.parameters)==null?void 0:je.docs)==null?void 0:Ae.source}}};var De,Re,Ee;M.parameters={...M.parameters,docs:{...(De=M.parameters)==null?void 0:De.docs,source:{originalSource:`{
  name: 'Sorting',
  render: () => <SortingDemo />
}`,...(Ee=(Re=M.parameters)==null?void 0:Re.docs)==null?void 0:Ee.source}}};var Te,Me,Pe;P.parameters={...P.parameters,docs:{...(Te=P.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'Multi-Column Sorting',
  render: () => <AnimalMultiSortDemo />
}`,...(Pe=(Me=P.parameters)==null?void 0:Me.docs)==null?void 0:Pe.source}}};var ze,Fe,Be;z.parameters={...z.parameters,docs:{...(ze=z.parameters)==null?void 0:ze.docs,source:{originalSource:`{
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
}`,...(Be=(Fe=z.parameters)==null?void 0:Fe.docs)==null?void 0:Be.source}}};var Ie,Ne,Ge;F.parameters={...F.parameters,docs:{...(Ie=F.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  name: 'Styling',
  render: () => <StylingDemo />
}`,...(Ge=(Ne=F.parameters)==null?void 0:Ne.docs)==null?void 0:Ge.source}}};var He,$e,Le;B.parameters={...B.parameters,docs:{...(He=B.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...(Le=($e=B.parameters)==null?void 0:$e.docs)==null?void 0:Le.source}}};var We,Oe,Ve;I.parameters={...I.parameters,docs:{...(We=I.parameters)==null?void 0:We.docs,source:{originalSource:`{
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
}`,...(Ve=(Oe=I.parameters)==null?void 0:Oe.docs)==null?void 0:Ve.source}}};var Ke,Je,Ue;N.parameters={...N.parameters,docs:{...(Ke=N.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
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
}`,...(Ue=(Je=N.parameters)==null?void 0:Je.docs)==null?void 0:Ue.source}}};var Ye,Qe,Xe;G.parameters={...G.parameters,docs:{...(Ye=G.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  name: 'Inline Editing',
  render: () => <EditingDemo />
}`,...(Xe=(Qe=G.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source}}};var qe,Ze,et;H.parameters={...H.parameters,docs:{...(qe=H.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  name: 'Header Filters',
  render: () => <HeaderFiltersDemo />
}`,...(et=(Ze=H.parameters)==null?void 0:Ze.docs)==null?void 0:et.source}}};var tt,at,rt;$.parameters={...$.parameters,docs:{...(tt=$.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  name: 'Footer Summaries',
  render: () => <FooterSummariesDemo />
}`,...(rt=(at=$.parameters)==null?void 0:at.docs)==null?void 0:rt.source}}};var nt,ot,it;L.parameters={...L.parameters,docs:{...(nt=L.parameters)==null?void 0:nt.docs,source:{originalSource:`{
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
}`,...(it=(ot=L.parameters)==null?void 0:ot.docs)==null?void 0:it.source}}};var st,lt,dt;W.parameters={...W.parameters,docs:{...(st=W.parameters)==null?void 0:st.docs,source:{originalSource:`{
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
}`,...(dt=(lt=W.parameters)==null?void 0:lt.docs)==null?void 0:dt.source}}};var ct,mt,ht;O.parameters={...O.parameters,docs:{...(ct=O.parameters)==null?void 0:ct.docs,source:{originalSource:`{
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
}`,...(ht=(mt=O.parameters)==null?void 0:mt.docs)==null?void 0:ht.source}}};var ut,pt,gt;V.parameters={...V.parameters,docs:{...(ut=V.parameters)==null?void 0:ut.docs,source:{originalSource:`{
  name: 'Export',
  render: () => <ExportDemo />
}`,...(gt=(pt=V.parameters)==null?void 0:pt.docs)==null?void 0:gt.source}}};var xt,yt,ft;K.parameters={...K.parameters,docs:{...(xt=K.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  name: 'Kitchen Sink (all features)',
  render: () => <KitchenSinkDemo />
}`,...(ft=(yt=K.parameters)==null?void 0:yt.docs)==null?void 0:ft.source}}};var St,wt,vt;J.parameters={...J.parameters,docs:{...(St=J.parameters)==null?void 0:St.docs,source:{originalSource:`{
  name: 'Keyboard Navigation (arrow/tab/enter)',
  render: () => <KeyboardNavDemo />
}`,...(vt=(wt=J.parameters)==null?void 0:wt.docs)==null?void 0:vt.source}}};var _t,bt,Ct;U.parameters={...U.parameters,docs:{...(_t=U.parameters)==null?void 0:_t.docs,source:{originalSource:`{
  name: 'Adjust columns (auto-fit to content)',
  render: () => <AdjustAutoWidthDemo />
}`,...(Ct=(bt=U.parameters)==null?void 0:bt.docs)==null?void 0:Ct.source}}};var kt,jt,At;Y.parameters={...Y.parameters,docs:{...(kt=Y.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  name: 'Auto width (fill container by gravity)',
  render: () => <AutoWidthDemo />
}`,...(At=(jt=Y.parameters)==null?void 0:jt.docs)==null?void 0:At.source}}};var Dt,Rt,Et;Q.parameters={...Q.parameters,docs:{...(Dt=Q.parameters)==null?void 0:Dt.docs,source:{originalSource:`{
  name: 'Auto height (wrap cell content)',
  render: () => <AutoHeightDemo />
}`,...(Et=(Rt=Q.parameters)==null?void 0:Rt.docs)==null?void 0:Et.source}}};var Tt,Mt,Pt;X.parameters={...X.parameters,docs:{...(Tt=X.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  name: 'Tooltip (cell hover)',
  render: () => <TooltipDemo />
}`,...(Pt=(Mt=X.parameters)==null?void 0:Mt.docs)==null?void 0:Pt.source}}};var zt,Ft,Bt;q.parameters={...q.parameters,docs:{...(zt=q.parameters)==null?void 0:zt.docs,source:{originalSource:`{
  name: 'Row drag & drop',
  render: () => <RowDragDemo />
}`,...(Bt=(Ft=q.parameters)==null?void 0:Ft.docs)==null?void 0:Bt.source}}};var It,Nt,Gt;Z.parameters={...Z.parameters,docs:{...(It=Z.parameters)==null?void 0:It.docs,source:{originalSource:`{
  name: 'CSS API + marks',
  render: () => <CssApiAndMarksDemo />
}`,...(Gt=(Nt=Z.parameters)==null?void 0:Nt.docs)==null?void 0:Gt.source}}};var Ht,$t,Lt;ee.parameters={...ee.parameters,docs:{...(Ht=ee.parameters)==null?void 0:Ht.docs,source:{originalSource:`{
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
}`,...(Lt=($t=ee.parameters)==null?void 0:$t.docs)==null?void 0:Lt.source}}};var Wt,Ot,Vt;te.parameters={...te.parameters,docs:{...(Wt=te.parameters)==null?void 0:Wt.docs,source:{originalSource:`{
  name: 'DataProxy — Remote Sort & Filter',
  render: () => <ThemeProvider>
      <Grid columns={remoteFilterColumns} data={[]} dataProxy={{
      url: 'https://api.test/employees',
      pageSize: 50,
      fetchFn: makeMockFetch(ALL_EMPLOYEES)
    }} paginationMode="append" remoteSort remoteFilter sortable style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Vt=(Ot=te.parameters)==null?void 0:Ot.docs)==null?void 0:Vt.source}}};var Kt,Jt,Ut;ae.parameters={...ae.parameters,docs:{...(Kt=ae.parameters)==null?void 0:Kt.docs,source:{originalSource:`{
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
}`,...(Ut=(Jt=ae.parameters)==null?void 0:Jt.docs)==null?void 0:Ut.source}}};var Yt,Qt,Xt;re.parameters={...re.parameters,docs:{...(Yt=re.parameters)==null?void 0:Yt.docs,source:{originalSource:`{
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
}`,...(Xt=(Qt=re.parameters)==null?void 0:Qt.docs)==null?void 0:Xt.source}}};var qt,Zt,ea;ne.parameters={...ne.parameters,docs:{...(qt=ne.parameters)==null?void 0:qt.docs,source:{originalSource:`{
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
}`,...(ea=(Zt=ne.parameters)==null?void 0:Zt.docs)==null?void 0:ea.source}}};var ta,aa,ra;oe.parameters={...oe.parameters,docs:{...(ta=oe.parameters)==null?void 0:ta.docs,source:{originalSource:`{
  render: () => <CustomEditorsDemo />
}`,...(ra=(aa=oe.parameters)==null?void 0:aa.docs)==null?void 0:ra.source}}};var na,oa,ia;ie.parameters={...ie.parameters,docs:{...(na=ie.parameters)==null?void 0:na.docs,source:{originalSource:`{
  name: 'Pinned Rows',
  render: () => <PinnedRowsDemo />
}`,...(ia=(oa=ie.parameters)==null?void 0:oa.docs)==null?void 0:ia.source}}};const qa=["Default","VirtualScroll","FrozenSplits","ColumnResize","Sorting","AnimalMultiSort","Grouping","Styling","RowSelection","CellSelection","ComplexSelection","InlineEditing","HeaderFilters","FooterSummaries","CellSpans","ColumnReorder","ColumnReorderWithSplits","Export","KitchenSink","KeyboardNavigation","AdjustColumns","AutoWidth","AutoHeight","TooltipStory","RowDrag","CssApiAndMarks","RemotePagination","RemoteSortFilter","Polling","FormulaEngine","FreezePanes","CustomCellEditors","PinnedRows"];export{U as AdjustColumns,P as AnimalMultiSort,Q as AutoHeight,Y as AutoWidth,I as CellSelection,L as CellSpans,W as ColumnReorder,O as ColumnReorderWithSplits,T as ColumnResize,N as ComplexSelection,Z as CssApiAndMarks,oe as CustomCellEditors,D as Default,V as Export,$ as FooterSummaries,re as FormulaEngine,ne as FreezePanes,E as FrozenSplits,z as Grouping,H as HeaderFilters,G as InlineEditing,J as KeyboardNavigation,K as KitchenSink,ie as PinnedRows,ae as Polling,ee as RemotePagination,te as RemoteSortFilter,q as RowDrag,B as RowSelection,M as Sorting,F as Styling,X as TooltipStory,R as VirtualScroll,qa as __namedExportsOrder,Xa as default};
