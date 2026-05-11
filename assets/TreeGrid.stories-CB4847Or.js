import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-CXOcBcs0.js";import{c as Xe,G as Ye,g as Ze}from"./Grid-Cl6PUJzz.js";import{u as et}from"./useTreeStore-iZ7foBDo.js";import{T as K}from"./DragManager-I0dlV2Nj.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";function He(e,s,a,o=""){if(s.length===0)return e;const[g,...b]=s,y=[],d=new Map;for(const m of e){const u=String(m[g]??"");d.has(u)||(y.push(u),d.set(u,[])),d.get(u).push(m)}return y.map(m=>{const u=d.get(m),p=`${o}__group__${g}__${m}`,C=b.length>0?He(u,b,a,p):u,D={id:p,$group:!0,$editable:!1,$selectable:!1,[g]:m,items:C};if(a)for(const[k,j]of Object.entries(a)){const I=Xe(u,k,j);I!==void 0&&(D[k]=I)}return D})}const tt="_treeCell_20bgo_1",rt="_toggle_20bgo_9",at="_cellValue_20bgo_20",q={treeCell:tt,toggle:rt,cellValue:at};function st(e){return JSON.parse(JSON.stringify(e))}function nt(e,s){let a=0,o=e.getParent(s);for(;o&&o!==e.getRoot();)a+=1,o=e.getParent(o);return a}function J(e,s=new Set){var a;for(const o of e)(a=o.items)!=null&&a.length&&(s.add(o.id),J(o.items,s));return s}function Pe(e,s){return e.map(a=>({...a,$opened:s?!1:a.$opened,items:a.items?Pe(a.items,s):void 0}))}const h=l.forwardRef(function(s,a){var V;const{data:o,columns:g,treeColumnId:b,collapsed:y=!1,rootParent:d,dropBehaviour:m="sibling",dragExpand:u=!0,groupBy:p,groupAggregate:C,onCellClick:D,onDragRowIn:k,onAfterRowDrop:j,...I}=s,z=l.useRef(null),L=l.useMemo(()=>{let t=st(o);if(p&&!I.dataProxy){const c=Array.isArray(p)?p:[p];t=He(t,c,C)}return Pe(t,y)},[y,o,p,C,I.dataProxy]),Me=et({data:L,config:d?{rootId:d}:void 0}),{store:n,items:Oe}=Me,_=n.getRoot(),U=b??((V=g[0])==null?void 0:V.id);l.useEffect(()=>{const t=new Map;for(const i of n._order)i.$opened!==void 0&&t.set(i.id,!!i.$opened);const c=[...n._sortingStates];n.parse(L);for(const[i,f]of t)n.exists(i)&&n.update(i,{$opened:f},!0);c.length>0&&n.sort(c)},[L,n]);const Ne=l.useMemo(()=>n.flatten(n.getItems(_)),[Oe,_,n]),ze=l.useMemo(()=>g.map(t=>{if(t.id!==U)return t;const c=t.template;return{...t,template:(f,w,Ue)=>{var Q;const Ve=nt(n,w.id),We=n.haveItems(w.id),W=!!((Q=n.getItem(w.id))!=null&&Q.$opened);return r.jsxs("div",{className:q.treeCell,style:{paddingInlineStart:`${Ve*18}px`},children:[r.jsx("button",{type:"button",className:q.toggle,"data-rgs-tree-toggle":w.id,"aria-label":W?"Collapse row":"Expand row",onDoubleClick:Qe=>Qe.stopPropagation(),children:We?W?"▾":"▸":""}),r.jsx("span",{className:q.cellValue,children:c?c(f,w,Ue):String(f??"")})]})}}}),[U,g,n]);l.useImperativeHandle(a,()=>({open:t=>{n.exists(t)&&n.update(t,{$opened:!0})},close:t=>{n.exists(t)&&n.update(t,{$opened:!1})},openAll:()=>{for(const t of Array.from(J(n.serialize())))n.exists(t)&&n.update(t,{$opened:!0},!0);n.events.fire("change",[void 0,"update"])},closeAll:()=>{for(const t of Array.from(J(n.serialize())))n.exists(t)&&n.update(t,{$opened:!1},!0);n.events.fire("change",[void 0,"update"])}}),[n]);const Le=(t,c,i)=>{if(i.target.closest(`[data-rgs-tree-toggle="${t}"]`)){const w=n.getItem(t);w&&n.haveItems(t)&&n.update(t,{$opened:!w.$opened})}D==null||D(t,c,i)},qe=t=>{if(!(t.ctrlKey||t.metaKey)||t.key!=="Enter")return;const c=t.currentTarget.querySelector(`.${Ze.rowSelected}[data-rgs-id]`),i=c==null?void 0:c.getAttribute("data-rgs-id");if(!i)return;const f=n.getItem(i);f&&n.haveItems(i)&&(n.update(i,{$opened:!f.$opened}),t.preventDefault())},Je=(t,c)=>{if(u&&t.target){const i=n.getItem(t.target);i&&n.haveItems(t.target)&&!i.$opened&&(z.current!==null&&window.clearTimeout(z.current),z.current=window.setTimeout(()=>{n.update(t.target,{$opened:!0})},200))}k==null||k(t,c)},Ke=(t,c)=>{if(t.target&&t.position)if(m==="child")n.move(t.start,-1,void 0,t.target);else{const i=n.getParent(t.target)??_,f=n.getIndex(t.target),w=t.position==="bottom"?f+1:f;n.move(t.start,w,void 0,i)}j==null||j(t,c)};return r.jsx("div",{onKeyDown:qe,children:r.jsx(Ye,{...I,rootParent:_,columns:ze,data:Ne,store:n,onCellClick:Le,onDragRowIn:Je,onAfterRowDrop:Ke})})});h.__docgenInfo={description:"",methods:[{name:"open",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"close",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"openAll",docblock:null,modifiers:[],params:[],returns:null},{name:"closeAll",docblock:null,modifiers:[],params:[],returns:null}],displayName:"TreeGrid",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn",elements:[{name:"T"}],raw:"GridColumn<T>"}],raw:"GridColumn<T>[]"},description:""},treeColumnId:{required:!1,tsType:{name:"string"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:""},rootParent:{required:!1,tsType:{name:"string"},description:""},dropBehaviour:{required:!1,tsType:{name:"union",raw:"'child' | 'sibling' | 'complex'",elements:[{name:"literal",value:"'child'"},{name:"literal",value:"'sibling'"},{name:"literal",value:"'complex'"}]},description:""},dragExpand:{required:!1,tsType:{name:"boolean"},description:""},groupBy:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},groupAggregate:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:"'sum' | 'avg' | 'count' | 'min' | 'max'",elements:[{name:"literal",value:"'sum'"},{name:"literal",value:"'avg'"},{name:"literal",value:"'count'"},{name:"literal",value:"'min'"},{name:"literal",value:"'max'"}]}],raw:"Record<string, AggregateType>"},description:""}},composes:["Omit"]};const x=360,jt={title:"Tree Grid",component:h,decorators:[e=>r.jsx(K,{children:r.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:r.jsx(e,{})})})],parameters:{layout:"fullscreen"}},T=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],ot=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0,editorType:"input"},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0,editorType:"input"}],it=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"},{content:"selectFilter"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],lt=[{id:"program-alpha",name:"Program Alpha",owner:"Nina",status:"Active",hours:240,$opened:!0,items:[{id:"alpha-discovery",name:"Discovery",owner:"Kai",status:"Done",hours:48,$opened:!0,items:[{id:"alpha-research",name:"Research",owner:"Kai",status:"Done",hours:20},{id:"alpha-interviews",name:"Interviews",owner:"Mira",status:"Done",hours:28}]},{id:"alpha-build",name:"Build",owner:"Mira",status:"Active",hours:132},{id:"alpha-qa",name:"QA",owner:"Rae",status:"Queued",hours:60}]},{id:"program-beta",name:"Program Beta",owner:"Jules",status:"Planned",hours:180,items:[{id:"beta-outline",name:"Outline",owner:"Rae",status:"Queued",hours:24},{id:"beta-implementation",name:"Implementation",owner:"Noah",status:"Planned",hours:156}]},{id:"ops",name:"Operations",owner:"Lina",status:"Active",hours:96}];function S(){return JSON.parse(JSON.stringify(lt))}function v({children:e,note:s}){return r.jsxs("div",{children:[s?r.jsx("p",{style:{margin:"0 0 12px",color:"#667085",fontSize:13},children:s}):null,e]})}const G={name:"Basic Usage",args:{columns:T,data:S(),sortable:!0,selection:"row",style:{width:"100%",height:x}}},R={name:"Collapsed by Default",args:{columns:T,data:S().map(e=>({...e,$opened:!1})),selection:"row",style:{width:"100%",height:x}}},A={name:"Deep Hierarchy",render:()=>{const e=l.useMemo(()=>S(),[]);return r.jsx(v,{note:"Expanded multi-level hierarchy with nested tasks in the first column.",children:r.jsx(h,{columns:T,data:e,selection:"row",sortable:!0,style:{width:"100%",height:x}})})}},$={name:"Header Filters",render:()=>{const e=l.useMemo(()=>S(),[]);return r.jsx(v,{note:"Header filters reuse the existing Grid filter controls on top of hierarchical rows.",children:r.jsx(h,{columns:it,data:e,selection:"row",sortable:!0,style:{width:"100%",height:x}})})}},H={name:"Sorting & Selection",render:()=>{const e=l.useMemo(()=>S(),[]);return r.jsx(v,{note:"Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.",children:r.jsx(h,{columns:T,data:e,sortable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:x}})})}},P={name:"Editable Rows",render:()=>{const e=l.useMemo(()=>S(),[]);return r.jsx(v,{note:"Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.",children:r.jsx(h,{columns:ot,data:e,editable:!0,selection:"complex",style:{width:"100%",height:x}})})}},F={name:"Row Drag",render:()=>{const e=l.useMemo(()=>S(),[]);return r.jsx(v,{note:"Drag rows to reorder within the flattened tree view.",children:r.jsx(h,{columns:T,data:e,dragItem:"row",selection:"row",style:{width:"100%",height:x}})})}},E={name:"Imperative API",render:()=>{const e=l.useRef(null),s=l.useMemo(()=>S().map(a=>({...a,$opened:!1})),[]);return r.jsxs(v,{note:"Imperative ref API: open(id), close(id), openAll(), closeAll().",children:[r.jsx(h,{ref:e,columns:T,data:s,selection:"row",style:{width:"100%",height:x}}),r.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12},children:[r.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.openAll()},children:"Open All"}),r.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.closeAll()},children:"Close All"}),r.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.open("program-beta")},children:"Open Beta"}),r.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.close("program-alpha")},children:"Close Alpha"})]})]})}},dt=[{id:"name",header:[{text:"Book Name"}],width:300,sortable:!0,resizable:!0},{id:"checked",header:[{text:""}],width:52,align:"center",template:e=>r.jsx("input",{type:"checkbox",checked:!!e,readOnly:!0,style:{width:18,height:18,accentColor:"#1d9bf0"}})},{id:"price",header:[{text:"Price"}],width:100,align:"right"},{id:"shipsIn",header:[{text:"Ships in"}],width:110},{id:"status",header:[{text:"Status"}],width:150,template:e=>{const s=String(e??"").toLowerCase(),a=s==="available"?"#1fb26b":s==="reserved"?"#1d9bf0":"#ff4d4f";return s?r.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[r.jsx("span",{"aria-hidden":"true",style:{width:14,height:14,borderRadius:"999px",background:a,display:"inline-block"}}),r.jsx("span",{style:{color:"#5f6b7a"},children:String(e??"")})]}):null}},{id:"publishingDate",header:[{text:"Publishing date"}],width:160,align:"right"},{id:"cover",header:[{text:"Cover"}],width:120}],ct=[{id:"bestsellers",name:"Bestsellers",$opened:!0,items:[{id:"john-grisham",name:"John Grisham",$opened:!0,items:[{id:"time-to-kill",name:"A Time to Kill",checked:!0,price:"$12.25",shipsIn:"12 hours",status:"available",publishingDate:"05/10/2019 12:00",cover:"Hardcover"},{id:"rainmaker",name:"The Rainmaker",checked:!0,price:"$5.5",shipsIn:"1 hour",status:"reserved",publishingDate:"13/12/2005 12:00",cover:"Paperback"},{id:"partner",name:"The Partner",checked:!1,price:"$11.7",shipsIn:"1 week",publishingDate:"25/11/2017 12:00",cover:"Hardcover"},{id:"firm",name:"The Firm",checked:!0,price:"$6",shipsIn:"24 hours",status:"available",publishingDate:"15/02/2020 12:00",cover:"Paperback"}]},{id:"stephen-king",name:"Stephen King",status:"missing",$opened:!0,items:[{id:"misery",name:"Misery",checked:!1,price:"$5.25",shipsIn:"1 week",status:"missing",publishingDate:"26/10/2014 12:00",cover:"Paperback"},{id:"it",name:"It",checked:!0,price:"$15.75",shipsIn:"1 hour",status:"available",publishingDate:"05/04/2020 12:00",cover:"Hardcover"},{id:"dark-tower",name:"The Dark Tower",checked:!0,price:"$5.33",shipsIn:"2 days",status:"reserved",publishingDate:"08/05/2018 12:00",cover:"Paperback"}]}]},{id:"classics",name:"Classics",$opened:!0,items:[{id:"pushkin",name:"Pushkin",status:"missing",$opened:!0,items:[{id:"onegin",name:"Eugene Onegin",checked:!0,price:"$14.4",shipsIn:"24 hours",status:"available",publishingDate:"05/03/2020 12:00",cover:"Hardcover"},{id:"boris-godunov",name:"Boris Godunov",checked:!1,price:"$8.1",shipsIn:"24 hours",status:"missing",publishingDate:"18/09/2019 12:00",cover:"Paperback"}]},{id:"balzac",name:"Honore De Balzac",status:"missing"}]}],B={name:"Book Library",render:()=>{const e=l.useMemo(()=>JSON.parse(JSON.stringify(ct)),[]);return r.jsx(v,{note:"Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.",children:r.jsx(h,{columns:dt,data:e,selection:"row",style:{width:"100%",height:680}})})}},ut="./img/avatars/",Fe=[{id:"1",name:"Gary Ortiz",ava:"avatar_01.jpg"},{id:"2",name:"Albert Williamson",ava:"avatar_02.jpg"},{id:"3",name:"Mildred Fuller",ava:"avatar_03.jpg"},{id:"4",name:"Russell Robinson",ava:"avatar_04.jpg"},{id:"5",name:"Phyllis Webb",color:"#61C874"},{id:"6",name:"Louise Fisher",color:"#61C504"},{id:"7",name:"Daniel Peterson",color:"#61C456"}],pt=[{name:"Real Estate",owner:"Louise Fisher",start_date:"02/02/2024",end_date:"05/06/2024",status:"Done",hours:92,cost:3588,budget:11768,balance:8180,paid:!0,renewals:"1-2 times",access:"4, 5, 7",project_id:"ISS-124.5"},{name:"HR System",owner:"Daniel Peterson",start_date:"03/03/2024",end_date:"07/02/2024",status:"Done",hours:340,cost:15980,budget:18856,balance:2876,paid:!0,renewals:"1 time",access:"2, 4",project_id:"ISS-900.9"},{name:"Inventory",owner:"Fred Duncan",start_date:"01/01/2024",end_date:"09/01/2024",status:"Done",hours:484,cost:21296,budget:14907,balance:-6389,paid:!1,renewals:"1 time",access:"3, 1, 2",project_id:"ISS-777.4"},{name:"Trip Planner",owner:"Michael Rice",start_date:"01/01/2024",end_date:"11/06/2024",status:"Done",hours:345,cost:14835,budget:70911,balance:56076,paid:!1,renewals:"1-2 times",access:"5, 3, 6",project_id:"ISS-642.2"},{name:"HR System",owner:"Andrew Stewart",start_date:"01/01/2024",end_date:"09/02/2024",status:"Done",hours:57,cost:2052,budget:5068,balance:3016,paid:!0,renewals:"1-2 times",access:"4, 2, 1, 7",project_id:"ISS-256.2"},{name:"HR System",owner:"Martin Thompson",start_date:"02/06/2024",end_date:"06/01/2024",status:"Done",hours:211,cost:8229,budget:16540,balance:8311,paid:!1,renewals:"more than 5 times",access:"3, 5, 2, 6",project_id:"ISS-263.2"},{name:"Ticket System",owner:"Martin Thompson",start_date:"05/06/2025",end_date:"07/03/2025",status:"In Progress",hours:3,cost:144,budget:122,balance:-22,paid:!0,renewals:"1 time",access:"2, 3",project_id:"ISS-634.3"},{name:"Education System",owner:"Mark Harper",start_date:"04/02/2025",end_date:"08/03/2025",status:"In Progress",hours:76,cost:3496,budget:12515,balance:9019,paid:!0,renewals:"more than 5 times",access:"1, 5, 4",project_id:"ISS-256.7"}];function mt(){return Fe.map(e=>({id:e.id,name:e.name,$opened:!0,items:pt.filter(s=>s.access.split(", ").includes(e.id)).map((s,a)=>({id:`${e.id}_${a}`,...s}))}))}function ht(e){if(!e)return null;const s=String(e).split(", ");return r.jsx("div",{style:{display:"flex",alignItems:"center"},children:s.map(a=>{const o=Fe.find(g=>g.id===a);return o?o.ava?r.jsx("img",{src:`${ut}${o.ava}`,alt:o.name,width:24,height:24,style:{borderRadius:"50%",border:"1px solid #fff",marginRight:-3,objectFit:"cover",display:"block"}},a):r.jsx("div",{style:{width:24,height:24,borderRadius:"50%",background:o.color??"#999",border:"1px solid #fff",marginRight:-3,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:600,flexShrink:0},children:o.name[0]},a):null})})}function gt(e){if(!e)return null;const s=String(e),a=s==="Done"?"#1fb26b":s==="In Progress"?"#1d9bf0":"#ff4d4f";return r.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[r.jsx("span",{style:{width:12,height:12,borderRadius:"50%",background:a,flexShrink:0,display:"inline-block"}}),r.jsx("span",{children:s})]})}function bt(e,s){if(e==null||e==="")return null;const a=s.balance;if(a===void 0)return null;const o=a>0;return r.jsxs("span",{style:{color:o?"#16a34a":"#dc2626",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx("span",{children:o?"⬆":"⬇"}),r.jsxs("span",{children:["$",Number(e).toLocaleString()]})]})}const ft=[{id:"name",header:[{text:"Project"},{content:"inputFilter"}],footer:[{text:"Total"}],minWidth:200,resizable:!0,sortable:!0,editorType:"input"},{id:"paid",header:[{text:"Paid"}],width:60,align:"center"},{id:"access",header:[{text:"Access"},{content:"inputFilter"}],width:160,template:ht},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,editorType:"input",template:gt},{id:"owner",header:[{text:"Owner"},{content:"inputFilter"}],width:150,sortable:!0,editorType:"input"},{id:"balance",header:[{text:"Balance"}],footer:[{content:"sum"}],width:130,template:bt},{id:"hours",header:[{text:"Number of Hours"},{content:"inputFilter"}],footer:[{content:"sum"}],width:150,align:"right",sortable:!0},{id:"renewals",header:[{text:"Number of Renewals"},{content:"inputFilter"}],width:160,editorType:"input"},{id:"start_date",header:[{text:"Start Date"}],width:115,align:"center"},{id:"end_date",header:[{text:"End Date"}],width:115,align:"center"},{id:"cost",header:[{text:"Cost"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"budget",header:[{text:"Budget"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"project_id",header:[{text:"Project ID"},{content:"inputFilter"}],width:115,align:"center"}];function wt({dragDrop:e}){const[s,a]=l.useState(()=>mt()),o=l.useCallback(b=>{a(y=>y.map(d=>{if(d.id===b)return{...d,paid:!d.paid};const m=d.items;if(!m)return d;const u=m.map(p=>p.id===b?{...p,paid:!p.paid}:p);return u===m?d:{...d,items:u}}))},[]),g=l.useMemo(()=>ft.map(b=>b.id==="paid"?{...b,template:(y,d)=>r.jsx("input",{type:"checkbox",checked:!!y,onChange:()=>o(d.id),style:{width:16,height:16,accentColor:"#1d9bf0",cursor:"pointer"}})}:b),[o]);return r.jsx(v,{note:"Users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.",children:r.jsx(h,{columns:g,data:s,dragItem:e?"row":void 0,selection:"row",editable:!0,keyNavigation:!0,multiselection:!0,sortable:!0,style:{width:"100%",height:640}})})}const M={name:"Showcase",args:{dragDrop:!1},argTypes:{dragDrop:{name:"Drag & Drop rows",description:"Enable drag-and-drop row reordering",control:"boolean",table:{defaultValue:{summary:"false"}}}},render:e=>{const{dragDrop:s}=e;return r.jsx(wt,{dragDrop:s})},parameters:{docs:{description:{story:"Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection."}}}},X=["Alice","Bob","Cara","Dan","Eva","Frank","Grace","Hans"],Ee=Array.from({length:24},(e,s)=>({id:`e${s}`,name:X[s%X.length],dept:["Engineering","HR","Finance"][s%3],status:s%2===0?"active":"inactive",salary:5e4+s*1e3})),Be=[{id:"dept",header:[{text:"Department"}],width:160},{id:"status",header:[{text:"Status"}],width:100},{id:"name",header:[{text:"Name"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100}],O={name:"Group By Department",render:()=>r.jsx(K,{children:r.jsx(h,{data:Ee,columns:Be,groupBy:"dept",groupAggregate:{salary:"avg"},style:{height:360,width:"100%"}})})},N={name:"Group By Department & Status",render:()=>r.jsx(K,{children:r.jsx(h,{data:Ee,columns:Be,groupBy:["dept","status"],groupAggregate:{salary:"sum"},style:{height:400,width:"100%"}})})};var Y,Z,ee;G.parameters={...G.parameters,docs:{...(Y=G.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  name: 'Basic Usage',
  args: {
    columns: baseColumns,
    data: cloneData(),
    sortable: true,
    selection: 'row',
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ee=(Z=G.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,re,ae;R.parameters={...R.parameters,docs:{...(te=R.parameters)==null?void 0:te.docs,source:{originalSource:`{
  name: 'Collapsed by Default',
  args: {
    columns: baseColumns,
    data: cloneData().map(row => ({
      ...row,
      $opened: false
    })),
    selection: 'row',
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(ae=(re=R.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,ne,oe;A.parameters={...A.parameters,docs:{...(se=A.parameters)==null?void 0:se.docs,source:{originalSource:`{
  name: 'Deep Hierarchy',
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Expanded multi-level hierarchy with nested tasks in the first column.">
        <TreeGrid columns={baseColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(oe=(ne=A.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ie,le,de;$.parameters={...$.parameters,docs:{...(ie=$.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  name: 'Header Filters',
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Header filters reuse the existing Grid filter controls on top of hierarchical rows.">
        <TreeGrid columns={filterColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(de=(le=$.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var ce,ue,pe;H.parameters={...H.parameters,docs:{...(ce=H.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'Sorting & Selection',
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.">
        <TreeGrid columns={baseColumns} data={data} sortable selection="row" multiselection style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(pe=(ue=H.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var me,he,ge;P.parameters={...P.parameters,docs:{...(me=P.parameters)==null?void 0:me.docs,source:{originalSource:`{
  name: 'Editable Rows',
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.">
        <TreeGrid columns={editableColumns} data={data} editable selection="complex" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(ge=(he=P.parameters)==null?void 0:he.docs)==null?void 0:ge.source}}};var be,fe,we;F.parameters={...F.parameters,docs:{...(be=F.parameters)==null?void 0:be.docs,source:{originalSource:`{
  name: 'Row Drag',
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Drag rows to reorder within the flattened tree view.">
        <TreeGrid columns={baseColumns} data={data} dragItem="row" selection="row" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(we=(fe=F.parameters)==null?void 0:fe.docs)==null?void 0:we.source}}};var ye,xe,Se;E.parameters={...E.parameters,docs:{...(ye=E.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  name: 'Imperative API',
  render: () => {
    const ref = useRef<TreeGridRef>(null);
    const data = useMemo(() => cloneData().map(row => ({
      ...row,
      $opened: false
    })), []);
    return <StoryFrame note="Imperative ref API: open(id), close(id), openAll(), closeAll().">
        <TreeGrid ref={ref} columns={baseColumns} data={data} selection="row" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
        <div style={{
        display: 'flex',
        gap: 8,
        paddingTop: 12
      }}>
          <button type="button" onClick={() => ref.current?.openAll()}>Open All</button>
          <button type="button" onClick={() => ref.current?.closeAll()}>Close All</button>
          <button type="button" onClick={() => ref.current?.open('program-beta')}>Open Beta</button>
          <button type="button" onClick={() => ref.current?.close('program-alpha')}>Close Alpha</button>
        </div>
      </StoryFrame>;
  }
}`,...(Se=(xe=E.parameters)==null?void 0:xe.docs)==null?void 0:Se.source}}};var ve,De,ke;B.parameters={...B.parameters,docs:{...(ve=B.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Book Library',
  render: () => {
    const data = useMemo(() => JSON.parse(JSON.stringify(bookData)) as BookRow[], []);
    return <StoryFrame note="Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.">
        <TreeGrid columns={bookColumns} data={data} selection="row" style={{
        width: '100%',
        height: 680
      }} />
      </StoryFrame>;
  }
}`,...(ke=(De=B.parameters)==null?void 0:De.docs)==null?void 0:ke.source}}};var Ie,Te,je;M.parameters={...M.parameters,docs:{...(Ie=M.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  name: 'Showcase',
  args: {
    dragDrop: false
  } as {
    dragDrop: boolean;
  },
  argTypes: {
    dragDrop: {
      name: 'Drag & Drop rows',
      description: 'Enable drag-and-drop row reordering',
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false'
        }
      }
    }
  } as Record<string, unknown>,
  render: args => {
    const {
      dragDrop
    } = args as unknown as {
      dragDrop: boolean;
    };
    return <DHtmlxShowcaseGrid dragDrop={dragDrop} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection.'
      }
    }
  }
}`,...(je=(Te=M.parameters)==null?void 0:Te.docs)==null?void 0:je.source}}};var Ce,_e,Ge;O.parameters={...O.parameters,docs:{...(Ce=O.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'Group By Department',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy="dept" groupAggregate={{
      salary: 'avg'
    }} style={{
      height: 360,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Ge=(_e=O.parameters)==null?void 0:_e.docs)==null?void 0:Ge.source}}};var Re,Ae,$e;N.parameters={...N.parameters,docs:{...(Re=N.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  name: 'Group By Department & Status',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy={['dept', 'status']} groupAggregate={{
      salary: 'sum'
    }} style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...($e=(Ae=N.parameters)==null?void 0:Ae.docs)==null?void 0:$e.source}}};const Ct=["Default","CollapsedStart","DeepHierarchy","WithHeaderFilters","SortingAndSelection","EditableRows","RowDrag","ImperativeApi","BookLibraryExample","DHtmlxShowcase","GroupByDepartment","MultiLevelGroupBy"];export{B as BookLibraryExample,R as CollapsedStart,M as DHtmlxShowcase,A as DeepHierarchy,G as Default,P as EditableRows,O as GroupByDepartment,E as ImperativeApi,N as MultiLevelGroupBy,F as RowDrag,H as SortingAndSelection,$ as WithHeaderFilters,Ct as __namedExportsOrder,jt as default};
