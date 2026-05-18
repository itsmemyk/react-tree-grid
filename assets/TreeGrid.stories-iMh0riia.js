import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-CXOcBcs0.js";import{a as Qe,G as Xe,g as Ye}from"./Grid-6wElfC8b.js";import{u as Ze}from"./useTreeStore-c2-g6S6Q.js";import{T as J}from"./DragManager-4zvg7VQl.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";const et="_treeCell_20bgo_1",tt="_toggle_20bgo_9",rt="_cellValue_20bgo_20",L={treeCell:et,toggle:tt,cellValue:rt};function at(e){return JSON.parse(JSON.stringify(e))}function st(e,s){let n=0,o=e.getParent(s);for(;o&&o!==e.getRoot();)n+=1,o=e.getParent(o);return n}function q(e,s=new Set){var n;for(const o of e)(n=o.items)!=null&&n.length&&(s.add(o.id),q(o.items,s));return s}function Pe(e,s){return e.map(n=>({...n,$opened:s?!1:n.$opened,items:n.items?Pe(n.items,s):void 0}))}const u=l.forwardRef(function(s,n){var V;const{data:o,columns:y,treeColumnId:g,collapsed:x=!1,rootParent:c,dropBehaviour:v="sibling",dragExpand:D=!0,groupBy:m,groupAggregate:K,onCellClick:B,onDragRowIn:E,onAfterRowDrop:M,...N}=s,O=l.useRef(null),z=l.useMemo(()=>{let t=at(o);if(m&&!N.dataProxy){const d=Array.isArray(m)?m:[m];t=Qe(t,d,K)}return Pe(t,x)},[x,o,m,K,N.dataProxy]),Ee=Ze({data:z,config:c?{rootId:c}:void 0}),{store:a,items:Me}=Ee,k=a.getRoot(),U=g??((V=y[0])==null?void 0:V.id);l.useEffect(()=>{const t=new Map;for(const i of a._order)i.$opened!==void 0&&t.set(i.id,!!i.$opened);const d=[...a._sortingStates];a.parse(z);for(const[i,p]of t)a.exists(i)&&a.update(i,{$opened:p},!0);d.length>0&&a.sort(d)},[z,a]);const Ne=l.useMemo(()=>a.flatten(a.getItems(k)),[Me,k,a]),Oe=l.useMemo(()=>y.map(t=>{if(t.id!==U)return t;const d=t.template;return{...t,template:(p,h,Ke)=>{var Q;const Ue=st(a,h.id),Ve=a.haveItems(h.id),W=!!((Q=a.getItem(h.id))!=null&&Q.$opened);return r.jsxs("div",{className:L.treeCell,style:{paddingInlineStart:`${Ue*18}px`},children:[r.jsx("button",{type:"button",className:L.toggle,"data-rgs-tree-toggle":h.id,"aria-label":W?"Collapse row":"Expand row",onDoubleClick:We=>We.stopPropagation(),children:Ve?W?"▾":"▸":""}),r.jsx("span",{className:L.cellValue,children:d?d(p,h,Ke):String(p??"")})]})}}}),[U,y,a]);l.useImperativeHandle(n,()=>({open:t=>{a.exists(t)&&a.update(t,{$opened:!0})},close:t=>{a.exists(t)&&a.update(t,{$opened:!1})},openAll:()=>{for(const t of Array.from(q(a.serialize())))a.exists(t)&&a.update(t,{$opened:!0},!0);a.events.fire("change",[void 0,"update"])},closeAll:()=>{for(const t of Array.from(q(a.serialize())))a.exists(t)&&a.update(t,{$opened:!1},!0);a.events.fire("change",[void 0,"update"])}}),[a]);const ze=(t,d,i)=>{if(i.target.closest(`[data-rgs-tree-toggle="${t}"]`)){const h=a.getItem(t);h&&a.haveItems(t)&&a.update(t,{$opened:!h.$opened})}B==null||B(t,d,i)},Le=t=>{if(!(t.ctrlKey||t.metaKey)||t.key!=="Enter")return;const d=t.currentTarget.querySelector(`.${Ye.rowSelected}[data-rgs-id]`),i=d==null?void 0:d.getAttribute("data-rgs-id");if(!i)return;const p=a.getItem(i);p&&a.haveItems(i)&&(a.update(i,{$opened:!p.$opened}),t.preventDefault())},qe=(t,d)=>{if(D&&t.target){const i=a.getItem(t.target);i&&a.haveItems(t.target)&&!i.$opened&&(O.current!==null&&window.clearTimeout(O.current),O.current=window.setTimeout(()=>{a.update(t.target,{$opened:!0})},200))}E==null||E(t,d)},Je=(t,d)=>{if(t.target&&t.position)if(v==="child")a.move(t.start,-1,void 0,t.target);else{const i=a.getParent(t.target)??k,p=a.getIndex(t.target),h=t.position==="bottom"?p+1:p;a.move(t.start,h,void 0,i)}M==null||M(t,d)};return r.jsx("div",{onKeyDown:Le,children:r.jsx(Xe,{...N,rootParent:k,columns:Oe,data:Ne,store:a,onCellClick:ze,onDragRowIn:qe,onAfterRowDrop:Je})})});u.__docgenInfo={description:"",methods:[{name:"open",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"close",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"openAll",docblock:null,modifiers:[],params:[],returns:null},{name:"closeAll",docblock:null,modifiers:[],params:[],returns:null}],displayName:"TreeGrid",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn",elements:[{name:"T"}],raw:"GridColumn<T>"}],raw:"GridColumn<T>[]"},description:""},treeColumnId:{required:!1,tsType:{name:"string"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:""},rootParent:{required:!1,tsType:{name:"string"},description:""},dropBehaviour:{required:!1,tsType:{name:"union",raw:"'child' | 'sibling' | 'complex'",elements:[{name:"literal",value:"'child'"},{name:"literal",value:"'sibling'"},{name:"literal",value:"'complex'"}]},description:""},dragExpand:{required:!1,tsType:{name:"boolean"},description:""},groupBy:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},groupAggregate:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:"'sum' | 'avg' | 'count' | 'min' | 'max'",elements:[{name:"literal",value:"'sum'"},{name:"literal",value:"'avg'"},{name:"literal",value:"'count'"},{name:"literal",value:"'min'"},{name:"literal",value:"'max'"}]}],raw:"Record<string, AggregateType>"},description:""}},composes:["Omit"]};const b=360,Tt={title:"Tree Grid",component:u,decorators:[e=>r.jsx(J,{children:r.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:r.jsx(e,{})})})],parameters:{layout:"fullscreen"}},S=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],nt=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0,editorType:"input"},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0,editorType:"input"}],ot=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"},{content:"selectFilter"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],it=[{id:"program-alpha",name:"Program Alpha",owner:"Nina",status:"Active",hours:240,$opened:!0,items:[{id:"alpha-discovery",name:"Discovery",owner:"Kai",status:"Done",hours:48,$opened:!0,items:[{id:"alpha-research",name:"Research",owner:"Kai",status:"Done",hours:20},{id:"alpha-interviews",name:"Interviews",owner:"Mira",status:"Done",hours:28}]},{id:"alpha-build",name:"Build",owner:"Mira",status:"Active",hours:132},{id:"alpha-qa",name:"QA",owner:"Rae",status:"Queued",hours:60}]},{id:"program-beta",name:"Program Beta",owner:"Jules",status:"Planned",hours:180,items:[{id:"beta-outline",name:"Outline",owner:"Rae",status:"Queued",hours:24},{id:"beta-implementation",name:"Implementation",owner:"Noah",status:"Planned",hours:156}]},{id:"ops",name:"Operations",owner:"Lina",status:"Active",hours:96}];function f(){return JSON.parse(JSON.stringify(it))}function w({children:e,note:s}){return r.jsxs("div",{children:[s?r.jsx("p",{style:{margin:"0 0 12px",color:"#667085",fontSize:13},children:s}):null,e]})}const I={name:"Basic Usage",args:{columns:S,data:f(),sortable:!0,selection:"row",style:{width:"100%",height:b}}},T={name:"Collapsed by Default",args:{columns:S,data:f().map(e=>({...e,$opened:!1})),selection:"row",style:{width:"100%",height:b}}},j={name:"Deep Hierarchy",render:()=>{const e=l.useMemo(()=>f(),[]);return r.jsx(w,{note:"Expanded multi-level hierarchy with nested tasks in the first column.",children:r.jsx(u,{columns:S,data:e,selection:"row",sortable:!0,style:{width:"100%",height:b}})})}},C={name:"Header Filters",render:()=>{const e=l.useMemo(()=>f(),[]);return r.jsx(w,{note:"Header filters reuse the existing Grid filter controls on top of hierarchical rows.",children:r.jsx(u,{columns:ot,data:e,selection:"row",sortable:!0,style:{width:"100%",height:b}})})}},_={name:"Sorting & Selection",render:()=>{const e=l.useMemo(()=>f(),[]);return r.jsx(w,{note:"Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.",children:r.jsx(u,{columns:S,data:e,sortable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:b}})})}},G={name:"Editable Rows",render:()=>{const e=l.useMemo(()=>f(),[]);return r.jsx(w,{note:"Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.",children:r.jsx(u,{columns:nt,data:e,editable:!0,selection:"complex",style:{width:"100%",height:b}})})}},R={name:"Row Drag",render:()=>{const e=l.useMemo(()=>f(),[]);return r.jsx(w,{note:"Drag rows to reorder within the flattened tree view.",children:r.jsx(u,{columns:S,data:e,dragItem:"row",selection:"row",style:{width:"100%",height:b}})})}},A={name:"Imperative API",render:()=>{const e=l.useRef(null),s=l.useMemo(()=>f().map(n=>({...n,$opened:!1})),[]);return r.jsxs(w,{note:"Imperative ref API: open(id), close(id), openAll(), closeAll().",children:[r.jsx(u,{ref:e,columns:S,data:s,selection:"row",style:{width:"100%",height:b}}),r.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12},children:[r.jsx("button",{type:"button",onClick:()=>{var n;return(n=e.current)==null?void 0:n.openAll()},children:"Open All"}),r.jsx("button",{type:"button",onClick:()=>{var n;return(n=e.current)==null?void 0:n.closeAll()},children:"Close All"}),r.jsx("button",{type:"button",onClick:()=>{var n;return(n=e.current)==null?void 0:n.open("program-beta")},children:"Open Beta"}),r.jsx("button",{type:"button",onClick:()=>{var n;return(n=e.current)==null?void 0:n.close("program-alpha")},children:"Close Alpha"})]})]})}},lt=[{id:"name",header:[{text:"Book Name"}],width:300,sortable:!0,resizable:!0},{id:"checked",header:[{text:""}],width:52,align:"center",template:e=>r.jsx("input",{type:"checkbox",checked:!!e,readOnly:!0,style:{width:18,height:18,accentColor:"#1d9bf0"}})},{id:"price",header:[{text:"Price"}],width:100,align:"right"},{id:"shipsIn",header:[{text:"Ships in"}],width:110},{id:"status",header:[{text:"Status"}],width:150,template:e=>{const s=String(e??"").toLowerCase(),n=s==="available"?"#1fb26b":s==="reserved"?"#1d9bf0":"#ff4d4f";return s?r.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[r.jsx("span",{"aria-hidden":"true",style:{width:14,height:14,borderRadius:"999px",background:n,display:"inline-block"}}),r.jsx("span",{style:{color:"#5f6b7a"},children:String(e??"")})]}):null}},{id:"publishingDate",header:[{text:"Publishing date"}],width:160,align:"right"},{id:"cover",header:[{text:"Cover"}],width:120}],dt=[{id:"bestsellers",name:"Bestsellers",$opened:!0,items:[{id:"john-grisham",name:"John Grisham",$opened:!0,items:[{id:"time-to-kill",name:"A Time to Kill",checked:!0,price:"$12.25",shipsIn:"12 hours",status:"available",publishingDate:"05/10/2019 12:00",cover:"Hardcover"},{id:"rainmaker",name:"The Rainmaker",checked:!0,price:"$5.5",shipsIn:"1 hour",status:"reserved",publishingDate:"13/12/2005 12:00",cover:"Paperback"},{id:"partner",name:"The Partner",checked:!1,price:"$11.7",shipsIn:"1 week",publishingDate:"25/11/2017 12:00",cover:"Hardcover"},{id:"firm",name:"The Firm",checked:!0,price:"$6",shipsIn:"24 hours",status:"available",publishingDate:"15/02/2020 12:00",cover:"Paperback"}]},{id:"stephen-king",name:"Stephen King",status:"missing",$opened:!0,items:[{id:"misery",name:"Misery",checked:!1,price:"$5.25",shipsIn:"1 week",status:"missing",publishingDate:"26/10/2014 12:00",cover:"Paperback"},{id:"it",name:"It",checked:!0,price:"$15.75",shipsIn:"1 hour",status:"available",publishingDate:"05/04/2020 12:00",cover:"Hardcover"},{id:"dark-tower",name:"The Dark Tower",checked:!0,price:"$5.33",shipsIn:"2 days",status:"reserved",publishingDate:"08/05/2018 12:00",cover:"Paperback"}]}]},{id:"classics",name:"Classics",$opened:!0,items:[{id:"pushkin",name:"Pushkin",status:"missing",$opened:!0,items:[{id:"onegin",name:"Eugene Onegin",checked:!0,price:"$14.4",shipsIn:"24 hours",status:"available",publishingDate:"05/03/2020 12:00",cover:"Hardcover"},{id:"boris-godunov",name:"Boris Godunov",checked:!1,price:"$8.1",shipsIn:"24 hours",status:"missing",publishingDate:"18/09/2019 12:00",cover:"Paperback"}]},{id:"balzac",name:"Honore De Balzac",status:"missing"}]}],H={name:"Book Library",render:()=>{const e=l.useMemo(()=>JSON.parse(JSON.stringify(dt)),[]);return r.jsx(w,{note:"Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.",children:r.jsx(u,{columns:lt,data:e,selection:"row",style:{width:"100%",height:680}})})}},ct="./img/avatars/",$e=[{id:"1",name:"Gary Ortiz",ava:"avatar_01.jpg"},{id:"2",name:"Albert Williamson",ava:"avatar_02.jpg"},{id:"3",name:"Mildred Fuller",ava:"avatar_03.jpg"},{id:"4",name:"Russell Robinson",ava:"avatar_04.jpg"},{id:"5",name:"Phyllis Webb",color:"#61C874"},{id:"6",name:"Louise Fisher",color:"#61C504"},{id:"7",name:"Daniel Peterson",color:"#61C456"}],ut=[{name:"Real Estate",owner:"Louise Fisher",start_date:"02/02/2024",end_date:"05/06/2024",status:"Done",hours:92,cost:3588,budget:11768,balance:8180,paid:!0,renewals:"1-2 times",access:"4, 5, 7",project_id:"ISS-124.5"},{name:"HR System",owner:"Daniel Peterson",start_date:"03/03/2024",end_date:"07/02/2024",status:"Done",hours:340,cost:15980,budget:18856,balance:2876,paid:!0,renewals:"1 time",access:"2, 4",project_id:"ISS-900.9"},{name:"Inventory",owner:"Fred Duncan",start_date:"01/01/2024",end_date:"09/01/2024",status:"Done",hours:484,cost:21296,budget:14907,balance:-6389,paid:!1,renewals:"1 time",access:"3, 1, 2",project_id:"ISS-777.4"},{name:"Trip Planner",owner:"Michael Rice",start_date:"01/01/2024",end_date:"11/06/2024",status:"Done",hours:345,cost:14835,budget:70911,balance:56076,paid:!1,renewals:"1-2 times",access:"5, 3, 6",project_id:"ISS-642.2"},{name:"HR System",owner:"Andrew Stewart",start_date:"01/01/2024",end_date:"09/02/2024",status:"Done",hours:57,cost:2052,budget:5068,balance:3016,paid:!0,renewals:"1-2 times",access:"4, 2, 1, 7",project_id:"ISS-256.2"},{name:"HR System",owner:"Martin Thompson",start_date:"02/06/2024",end_date:"06/01/2024",status:"Done",hours:211,cost:8229,budget:16540,balance:8311,paid:!1,renewals:"more than 5 times",access:"3, 5, 2, 6",project_id:"ISS-263.2"},{name:"Ticket System",owner:"Martin Thompson",start_date:"05/06/2025",end_date:"07/03/2025",status:"In Progress",hours:3,cost:144,budget:122,balance:-22,paid:!0,renewals:"1 time",access:"2, 3",project_id:"ISS-634.3"},{name:"Education System",owner:"Mark Harper",start_date:"04/02/2025",end_date:"08/03/2025",status:"In Progress",hours:76,cost:3496,budget:12515,balance:9019,paid:!0,renewals:"more than 5 times",access:"1, 5, 4",project_id:"ISS-256.7"}];function pt(){return $e.map(e=>({id:e.id,name:e.name,$opened:!0,items:ut.filter(s=>s.access.split(", ").includes(e.id)).map((s,n)=>({id:`${e.id}_${n}`,...s}))}))}function mt(e){if(!e)return null;const s=String(e).split(", ");return r.jsx("div",{style:{display:"flex",alignItems:"center"},children:s.map(n=>{const o=$e.find(y=>y.id===n);return o?o.ava?r.jsx("img",{src:`${ct}${o.ava}`,alt:o.name,width:24,height:24,style:{borderRadius:"50%",border:"1px solid #fff",marginRight:-3,objectFit:"cover",display:"block"}},n):r.jsx("div",{style:{width:24,height:24,borderRadius:"50%",background:o.color??"#999",border:"1px solid #fff",marginRight:-3,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:600,flexShrink:0},children:o.name[0]},n):null})})}function ht(e){if(!e)return null;const s=String(e),n=s==="Done"?"#1fb26b":s==="In Progress"?"#1d9bf0":"#ff4d4f";return r.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[r.jsx("span",{style:{width:12,height:12,borderRadius:"50%",background:n,flexShrink:0,display:"inline-block"}}),r.jsx("span",{children:s})]})}function gt(e,s){if(e==null||e==="")return null;const n=s.balance;if(n===void 0)return null;const o=n>0;return r.jsxs("span",{style:{color:o?"#16a34a":"#dc2626",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx("span",{children:o?"⬆":"⬇"}),r.jsxs("span",{children:["$",Number(e).toLocaleString()]})]})}const bt=[{id:"name",header:[{text:"Project"},{content:"inputFilter"}],footer:[{text:"Total"}],minWidth:200,resizable:!0,sortable:!0,editorType:"input"},{id:"paid",header:[{text:"Paid"}],width:60,align:"center"},{id:"access",header:[{text:"Access"},{content:"inputFilter"}],width:160,template:mt},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,editorType:"input",template:ht},{id:"owner",header:[{text:"Owner"},{content:"inputFilter"}],width:150,sortable:!0,editorType:"input"},{id:"balance",header:[{text:"Balance"}],footer:[{content:"sum"}],width:130,template:gt},{id:"hours",header:[{text:"Number of Hours"},{content:"inputFilter"}],footer:[{content:"sum"}],width:150,align:"right",sortable:!0},{id:"renewals",header:[{text:"Number of Renewals"},{content:"inputFilter"}],width:160,editorType:"input"},{id:"start_date",header:[{text:"Start Date"}],width:115,align:"center"},{id:"end_date",header:[{text:"End Date"}],width:115,align:"center"},{id:"cost",header:[{text:"Cost"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"budget",header:[{text:"Budget"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"project_id",header:[{text:"Project ID"},{content:"inputFilter"}],width:115,align:"center"}];function ft({dragDrop:e}){const[s,n]=l.useState(()=>pt()),o=l.useCallback(g=>{n(x=>x.map(c=>{if(c.id===g)return{...c,paid:!c.paid};const v=c.items;if(!v)return c;const D=v.map(m=>m.id===g?{...m,paid:!m.paid}:m);return D===v?c:{...c,items:D}}))},[]),y=l.useMemo(()=>bt.map(g=>g.id==="paid"?{...g,template:(x,c)=>r.jsx("input",{type:"checkbox",checked:!!x,onChange:()=>o(c.id),style:{width:16,height:16,accentColor:"#1d9bf0",cursor:"pointer"}})}:g),[o]);return r.jsx(w,{note:"Users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.",children:r.jsx(u,{columns:y,data:s,dragItem:e?"row":void 0,selection:"row",editable:!0,keyNavigation:!0,multiselection:!0,sortable:!0,style:{width:"100%",height:640}})})}const P={name:"Showcase",args:{dragDrop:!1},argTypes:{dragDrop:{name:"Drag & Drop rows",description:"Enable drag-and-drop row reordering",control:"boolean",table:{defaultValue:{summary:"false"}}}},render:e=>{const{dragDrop:s}=e;return r.jsx(ft,{dragDrop:s})},parameters:{docs:{description:{story:"Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection."}}}},X=["Alice","Bob","Cara","Dan","Eva","Frank","Grace","Hans"],Fe=Array.from({length:24},(e,s)=>({id:`e${s}`,name:X[s%X.length],dept:["Engineering","HR","Finance"][s%3],status:s%2===0?"active":"inactive",salary:5e4+s*1e3})),Be=[{id:"dept",header:[{text:"Department"}],width:160},{id:"status",header:[{text:"Status"}],width:100},{id:"name",header:[{text:"Name"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100}],$={name:"Group By Department",render:()=>r.jsx(J,{children:r.jsx(u,{data:Fe,columns:Be,groupBy:"dept",groupAggregate:{salary:"avg"},style:{height:360,width:"100%"}})})},F={name:"Group By Department & Status",render:()=>r.jsx(J,{children:r.jsx(u,{data:Fe,columns:Be,groupBy:["dept","status"],groupAggregate:{salary:"sum"},style:{height:400,width:"100%"}})})};var Y,Z,ee;I.parameters={...I.parameters,docs:{...(Y=I.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(ee=(Z=I.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,re,ae;T.parameters={...T.parameters,docs:{...(te=T.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ae=(re=T.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,ne,oe;j.parameters={...j.parameters,docs:{...(se=j.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(oe=(ne=j.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ie,le,de;C.parameters={...C.parameters,docs:{...(ie=C.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
}`,...(de=(le=C.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var ce,ue,pe;_.parameters={..._.parameters,docs:{...(ce=_.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(pe=(ue=_.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var me,he,ge;G.parameters={...G.parameters,docs:{...(me=G.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(ge=(he=G.parameters)==null?void 0:he.docs)==null?void 0:ge.source}}};var be,fe,we;R.parameters={...R.parameters,docs:{...(be=R.parameters)==null?void 0:be.docs,source:{originalSource:`{
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
}`,...(we=(fe=R.parameters)==null?void 0:fe.docs)==null?void 0:we.source}}};var ye,xe,Se;A.parameters={...A.parameters,docs:{...(ye=A.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(Se=(xe=A.parameters)==null?void 0:xe.docs)==null?void 0:Se.source}}};var ve,De,ke;H.parameters={...H.parameters,docs:{...(ve=H.parameters)==null?void 0:ve.docs,source:{originalSource:`{
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
}`,...(ke=(De=H.parameters)==null?void 0:De.docs)==null?void 0:ke.source}}};var Ie,Te,je;P.parameters={...P.parameters,docs:{...(Ie=P.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
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
}`,...(je=(Te=P.parameters)==null?void 0:Te.docs)==null?void 0:je.source}}};var Ce,_e,Ge;$.parameters={...$.parameters,docs:{...(Ce=$.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'Group By Department',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy="dept" groupAggregate={{
      salary: 'avg'
    }} style={{
      height: 360,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Ge=(_e=$.parameters)==null?void 0:_e.docs)==null?void 0:Ge.source}}};var Re,Ae,He;F.parameters={...F.parameters,docs:{...(Re=F.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  name: 'Group By Department & Status',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy={['dept', 'status']} groupAggregate={{
      salary: 'sum'
    }} style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(He=(Ae=F.parameters)==null?void 0:Ae.docs)==null?void 0:He.source}}};const jt=["Default","CollapsedStart","DeepHierarchy","WithHeaderFilters","SortingAndSelection","EditableRows","RowDrag","ImperativeApi","BookLibraryExample","DHtmlxShowcase","GroupByDepartment","MultiLevelGroupBy"];export{H as BookLibraryExample,T as CollapsedStart,P as DHtmlxShowcase,j as DeepHierarchy,I as Default,G as EditableRows,$ as GroupByDepartment,A as ImperativeApi,F as MultiLevelGroupBy,R as RowDrag,_ as SortingAndSelection,C as WithHeaderFilters,jt as __namedExportsOrder,Tt as default};
