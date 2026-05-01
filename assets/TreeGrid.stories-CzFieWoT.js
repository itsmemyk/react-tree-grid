import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CXOcBcs0.js";import{c as Ue,G as Qe,g as Ye,T as K}from"./Grid-BN09OcAy.js";import{u as Ze}from"./useTreeStore-BEOdTLmG.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";import"./DragManager-Cl1AKh51.js";function $e(e,s,a,o=""){if(s.length===0)return e;const[g,...b]=s,w=[],l=new Map;for(const m of e){const c=String(m[g]??"");l.has(c)||(w.push(c),l.set(c,[])),l.get(c).push(m)}return w.map(m=>{const c=l.get(m),u=`${o}__group__${g}__${m}`,C=b.length>0?$e(c,b,a,u):c,D={id:u,$group:!0,$editable:!1,$selectable:!1,[g]:m,items:C};if(a)for(const[T,j]of Object.entries(a)){const k=Ue(c,T,j);k!==void 0&&(D[T]=k)}return D})}const et="_treeCell_20bgo_1",tt="_toggle_20bgo_9",rt="_cellValue_20bgo_20",q={treeCell:et,toggle:tt,cellValue:rt};function at(e){return JSON.parse(JSON.stringify(e))}function st(e,s){let a=0,o=e.getParent(s);for(;o&&o!==e.getRoot();)a+=1,o=e.getParent(o);return a}function J(e,s=new Set){var a;for(const o of e)(a=o.items)!=null&&a.length&&(s.add(o.id),J(o.items,s));return s}function Pe(e,s){return e.map(a=>({...a,$opened:s?!1:a.$opened,items:a.items?Pe(a.items,s):void 0}))}const h=i.forwardRef(function(s,a){var W;const{data:o,columns:g,treeColumnId:b,collapsed:w=!1,rootParent:l,dropBehaviour:m="sibling",dragExpand:c=!0,groupBy:u,groupAggregate:C,onCellClick:D,onDragRowIn:T,onAfterRowDrop:j,...k}=s,z=i.useRef(null),L=i.useMemo(()=>{let r=at(o);if(u&&!k.dataProxy){const d=Array.isArray(u)?u:[u];r=$e(r,d,C)}return Pe(r,w)},[w,o,u,C,k.dataProxy]),Be=Ze({data:L,config:l?{rootId:l}:void 0}),{store:n,items:Oe}=Be,G=n.getRoot(),V=b??((W=g[0])==null?void 0:W.id);i.useEffect(()=>{n.parse(L)},[L,n]);const Ne=i.useMemo(()=>n.flatten(n.getItems(G)),[Oe,G,n]),ze=i.useMemo(()=>g.map(r=>{if(r.id!==V)return r;const d=r.template;return{...r,template:(y,f,Ve)=>{var U;const We=st(n,f.id),Xe=n.haveItems(f.id),X=!!((U=n.getItem(f.id))!=null&&U.$opened);return t.jsxs("div",{className:q.treeCell,style:{paddingInlineStart:`${We*18}px`},children:[t.jsx("button",{type:"button",className:q.toggle,"data-rgs-tree-toggle":f.id,"aria-label":X?"Collapse row":"Expand row",children:Xe?X?"▾":"▸":""}),t.jsx("span",{className:q.cellValue,children:d?d(y,f,Ve):String(y??"")})]})}}}),[V,g,n]);i.useImperativeHandle(a,()=>({open:r=>{n.exists(r)&&n.update(r,{$opened:!0})},close:r=>{n.exists(r)&&n.update(r,{$opened:!1})},openAll:()=>{for(const r of Array.from(J(n.serialize())))n.exists(r)&&n.update(r,{$opened:!0},!0);n.events.fire("change",[void 0,"update"])},closeAll:()=>{for(const r of Array.from(J(n.serialize())))n.exists(r)&&n.update(r,{$opened:!1},!0);n.events.fire("change",[void 0,"update"])}}),[n]);const Le=(r,d,p)=>{if(p.target.closest(`[data-rgs-tree-toggle="${r}"]`)){const f=n.getItem(r);f&&n.haveItems(r)&&n.update(r,{$opened:!f.$opened})}D==null||D(r,d,p)},qe=r=>{if(!(r.ctrlKey||r.metaKey)||r.key!=="Enter")return;const d=r.currentTarget.querySelector(`.${Ye.rowSelected}[data-rgs-id]`),p=d==null?void 0:d.getAttribute("data-rgs-id");if(!p)return;const y=n.getItem(p);y&&n.haveItems(p)&&(n.update(p,{$opened:!y.$opened}),r.preventDefault())},Je=(r,d)=>{if(c&&r.target){const p=n.getItem(r.target);p&&n.haveItems(r.target)&&!p.$opened&&(z.current!==null&&window.clearTimeout(z.current),z.current=window.setTimeout(()=>{n.update(r.target,{$opened:!0})},200))}T==null||T(r,d)},Ke=(r,d)=>{if(r.target&&r.position)if(m==="child")n.move(r.start,-1,void 0,r.target);else{const p=n.getParent(r.target)??G,y=n.getIndex(r.target),f=r.position==="bottom"?y+1:y;n.move(r.start,f,void 0,p)}j==null||j(r,d)};return t.jsx("div",{onKeyDown:qe,children:t.jsx(Qe,{...k,rootParent:G,columns:ze,data:Ne,store:n,onCellClick:Le,onDragRowIn:Je,onAfterRowDrop:Ke})})});h.__docgenInfo={description:"",methods:[{name:"open",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"close",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"openAll",docblock:null,modifiers:[],params:[],returns:null},{name:"closeAll",docblock:null,modifiers:[],params:[],returns:null}],displayName:"TreeGrid",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn",elements:[{name:"T"}],raw:"GridColumn<T>"}],raw:"GridColumn<T>[]"},description:""},treeColumnId:{required:!1,tsType:{name:"string"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:""},rootParent:{required:!1,tsType:{name:"string"},description:""},dropBehaviour:{required:!1,tsType:{name:"union",raw:"'child' | 'sibling' | 'complex'",elements:[{name:"literal",value:"'child'"},{name:"literal",value:"'sibling'"},{name:"literal",value:"'complex'"}]},description:""},dragExpand:{required:!1,tsType:{name:"boolean"},description:""},groupBy:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},groupAggregate:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:"'sum' | 'avg' | 'count' | 'min' | 'max'",elements:[{name:"literal",value:"'sum'"},{name:"literal",value:"'avg'"},{name:"literal",value:"'count'"},{name:"literal",value:"'min'"},{name:"literal",value:"'max'"}]}],raw:"Record<string, AggregateType>"},description:""}},composes:["Omit"]};const x=360,It={title:"Components/TreeGrid",component:h,decorators:[e=>t.jsx(K,{children:t.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:t.jsx(e,{})})})],parameters:{layout:"fullscreen"}},I=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],nt=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0,editorType:"input"},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0,editorType:"input"}],ot=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"},{content:"selectFilter"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],it=[{id:"program-alpha",name:"Program Alpha",owner:"Nina",status:"Active",hours:240,$opened:!0,items:[{id:"alpha-discovery",name:"Discovery",owner:"Kai",status:"Done",hours:48,$opened:!0,items:[{id:"alpha-research",name:"Research",owner:"Kai",status:"Done",hours:20},{id:"alpha-interviews",name:"Interviews",owner:"Mira",status:"Done",hours:28}]},{id:"alpha-build",name:"Build",owner:"Mira",status:"Active",hours:132},{id:"alpha-qa",name:"QA",owner:"Rae",status:"Queued",hours:60}]},{id:"program-beta",name:"Program Beta",owner:"Jules",status:"Planned",hours:180,items:[{id:"beta-outline",name:"Outline",owner:"Rae",status:"Queued",hours:24},{id:"beta-implementation",name:"Implementation",owner:"Noah",status:"Planned",hours:156}]},{id:"ops",name:"Operations",owner:"Lina",status:"Active",hours:96}];function v(){return JSON.parse(JSON.stringify(it))}function S({children:e,note:s}){return t.jsxs("div",{children:[s?t.jsx("p",{style:{margin:"0 0 12px",color:"#667085",fontSize:13},children:s}):null,e]})}const _={args:{columns:I,data:v(),sortable:!0,selection:"row",style:{width:"100%",height:x}}},R={args:{columns:I,data:v().map(e=>({...e,$opened:!1})),selection:"row",style:{width:"100%",height:x}}},A={render:()=>{const e=i.useMemo(()=>v(),[]);return t.jsx(S,{note:"Expanded multi-level hierarchy with nested tasks in the first column.",children:t.jsx(h,{columns:I,data:e,selection:"row",sortable:!0,style:{width:"100%",height:x}})})}},H={render:()=>{const e=i.useMemo(()=>v(),[]);return t.jsx(S,{note:"Header filters reuse the existing Grid filter controls on top of hierarchical rows.",children:t.jsx(h,{columns:ot,data:e,selection:"row",sortable:!0,style:{width:"100%",height:x}})})}},$={render:()=>{const e=i.useMemo(()=>v(),[]);return t.jsx(S,{note:"Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.",children:t.jsx(h,{columns:I,data:e,sortable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:x}})})}},P={render:()=>{const e=i.useMemo(()=>v(),[]);return t.jsx(S,{note:"Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.",children:t.jsx(h,{columns:nt,data:e,editable:!0,selection:"complex",style:{width:"100%",height:x}})})}},F={render:()=>{const e=i.useMemo(()=>v(),[]);return t.jsx(S,{note:"Drag rows to reorder within the flattened tree view.",children:t.jsx(h,{columns:I,data:e,dragItem:"row",selection:"row",style:{width:"100%",height:x}})})}},E={render:()=>{const e=i.useRef(null),s=i.useMemo(()=>v().map(a=>({...a,$opened:!1})),[]);return t.jsxs(S,{note:"Imperative ref mirrors DHTMLX TreeGrid API: open(id), close(id), openAll(), closeAll().",children:[t.jsx(h,{ref:e,columns:I,data:s,selection:"row",style:{width:"100%",height:x}}),t.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12},children:[t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.openAll()},children:"Open All"}),t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.closeAll()},children:"Close All"}),t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.open("program-beta")},children:"Open Beta"}),t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.close("program-alpha")},children:"Close Alpha"})]})]})}},lt=[{id:"name",header:[{text:"Book Name"}],width:300,sortable:!0,resizable:!0},{id:"checked",header:[{text:""}],width:52,align:"center",template:e=>t.jsx("input",{type:"checkbox",checked:!!e,readOnly:!0,style:{width:18,height:18,accentColor:"#1d9bf0"}})},{id:"price",header:[{text:"Price"}],width:100,align:"right"},{id:"shipsIn",header:[{text:"Ships in"}],width:110},{id:"status",header:[{text:"Status"}],width:150,template:e=>{const s=String(e??"").toLowerCase(),a=s==="available"?"#1fb26b":s==="reserved"?"#1d9bf0":"#ff4d4f";return s?t.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[t.jsx("span",{"aria-hidden":"true",style:{width:14,height:14,borderRadius:"999px",background:a,display:"inline-block"}}),t.jsx("span",{style:{color:"#5f6b7a"},children:String(e??"")})]}):null}},{id:"publishingDate",header:[{text:"Publishing date"}],width:160,align:"right"},{id:"cover",header:[{text:"Cover"}],width:120}],dt=[{id:"bestsellers",name:"Bestsellers",$opened:!0,items:[{id:"john-grisham",name:"John Grisham",$opened:!0,items:[{id:"time-to-kill",name:"A Time to Kill",checked:!0,price:"$12.25",shipsIn:"12 hours",status:"available",publishingDate:"05/10/2019 12:00",cover:"Hardcover"},{id:"rainmaker",name:"The Rainmaker",checked:!0,price:"$5.5",shipsIn:"1 hour",status:"reserved",publishingDate:"13/12/2005 12:00",cover:"Paperback"},{id:"partner",name:"The Partner",checked:!1,price:"$11.7",shipsIn:"1 week",publishingDate:"25/11/2017 12:00",cover:"Hardcover"},{id:"firm",name:"The Firm",checked:!0,price:"$6",shipsIn:"24 hours",status:"available",publishingDate:"15/02/2020 12:00",cover:"Paperback"}]},{id:"stephen-king",name:"Stephen King",status:"missing",$opened:!0,items:[{id:"misery",name:"Misery",checked:!1,price:"$5.25",shipsIn:"1 week",status:"missing",publishingDate:"26/10/2014 12:00",cover:"Paperback"},{id:"it",name:"It",checked:!0,price:"$15.75",shipsIn:"1 hour",status:"available",publishingDate:"05/04/2020 12:00",cover:"Hardcover"},{id:"dark-tower",name:"The Dark Tower",checked:!0,price:"$5.33",shipsIn:"2 days",status:"reserved",publishingDate:"08/05/2018 12:00",cover:"Paperback"}]}]},{id:"classics",name:"Classics",$opened:!0,items:[{id:"pushkin",name:"Pushkin",status:"missing",$opened:!0,items:[{id:"onegin",name:"Eugene Onegin",checked:!0,price:"$14.4",shipsIn:"24 hours",status:"available",publishingDate:"05/03/2020 12:00",cover:"Hardcover"},{id:"boris-godunov",name:"Boris Godunov",checked:!1,price:"$8.1",shipsIn:"24 hours",status:"missing",publishingDate:"18/09/2019 12:00",cover:"Paperback"}]},{id:"balzac",name:"Honore De Balzac",status:"missing"}]}],M={render:()=>{const e=i.useMemo(()=>JSON.parse(JSON.stringify(dt)),[]);return t.jsx(S,{note:"Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.",children:t.jsx(h,{columns:lt,data:e,selection:"row",style:{width:"100%",height:680}})})}},ct="https://snippet.dhtmlx.com/codebase/data/common/img/02/",Fe=[{id:"1",name:"Gary Ortiz",ava:"avatar_01.jpg"},{id:"2",name:"Albert Williamson",ava:"avatar_02.jpg"},{id:"3",name:"Mildred Fuller",ava:"avatar_03.jpg"},{id:"4",name:"Russell Robinson",ava:"avatar_04.jpg"},{id:"5",name:"Phyllis Webb",color:"#61C874"},{id:"6",name:"Louise Fisher",color:"#61C504"},{id:"7",name:"Daniel Peterson",color:"#61C456"}],ut=[{name:"Real Estate",owner:"Louise Fisher",start_date:"02/02/2024",end_date:"05/06/2024",status:"Done",hours:92,cost:3588,budget:11768,balance:8180,paid:!0,renewals:"1-2 times",access:"4, 5, 7",project_id:"ISS-124.5"},{name:"HR System",owner:"Daniel Peterson",start_date:"03/03/2024",end_date:"07/02/2024",status:"Done",hours:340,cost:15980,budget:18856,balance:2876,paid:!0,renewals:"1 time",access:"2, 4",project_id:"ISS-900.9"},{name:"Inventory",owner:"Fred Duncan",start_date:"01/01/2024",end_date:"09/01/2024",status:"Done",hours:484,cost:21296,budget:14907,balance:-6389,paid:!1,renewals:"1 time",access:"3, 1, 2",project_id:"ISS-777.4"},{name:"Trip Planner",owner:"Michael Rice",start_date:"01/01/2024",end_date:"11/06/2024",status:"Done",hours:345,cost:14835,budget:70911,balance:56076,paid:!1,renewals:"1-2 times",access:"5, 3, 6",project_id:"ISS-642.2"},{name:"HR System",owner:"Andrew Stewart",start_date:"01/01/2024",end_date:"09/02/2024",status:"Done",hours:57,cost:2052,budget:5068,balance:3016,paid:!0,renewals:"1-2 times",access:"4, 2, 1, 7",project_id:"ISS-256.2"},{name:"HR System",owner:"Martin Thompson",start_date:"02/06/2024",end_date:"06/01/2024",status:"Done",hours:211,cost:8229,budget:16540,balance:8311,paid:!1,renewals:"more than 5 times",access:"3, 5, 2, 6",project_id:"ISS-263.2"},{name:"Ticket System",owner:"Martin Thompson",start_date:"05/06/2025",end_date:"07/03/2025",status:"In Progress",hours:3,cost:144,budget:122,balance:-22,paid:!0,renewals:"1 time",access:"2, 3",project_id:"ISS-634.3"},{name:"Education System",owner:"Mark Harper",start_date:"04/02/2025",end_date:"08/03/2025",status:"In Progress",hours:76,cost:3496,budget:12515,balance:9019,paid:!0,renewals:"more than 5 times",access:"1, 5, 4",project_id:"ISS-256.7"}];function pt(){return Fe.map(e=>({id:e.id,name:e.name,$opened:!0,items:ut.filter(s=>s.access.split(", ").includes(e.id)).map((s,a)=>({id:`${e.id}_${a}`,...s}))}))}function mt(e){if(!e)return null;const s=String(e).split(", ");return t.jsx("div",{style:{display:"flex",alignItems:"center"},children:s.map(a=>{const o=Fe.find(g=>g.id===a);return o?o.ava?t.jsx("img",{src:`${ct}${o.ava}`,alt:o.name,width:24,height:24,style:{borderRadius:"50%",border:"1px solid #fff",marginRight:-3,objectFit:"cover",display:"block"}},a):t.jsx("div",{style:{width:24,height:24,borderRadius:"50%",background:o.color??"#999",border:"1px solid #fff",marginRight:-3,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:600,flexShrink:0},children:o.name[0]},a):null})})}function ht(e){if(!e)return null;const s=String(e),a=s==="Done"?"#1fb26b":s==="In Progress"?"#1d9bf0":"#ff4d4f";return t.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[t.jsx("span",{style:{width:12,height:12,borderRadius:"50%",background:a,flexShrink:0,display:"inline-block"}}),t.jsx("span",{children:s})]})}function gt(e,s){if(e==null||e==="")return null;const a=s.balance;if(a===void 0)return null;const o=a>0;return t.jsxs("span",{style:{color:o?"#16a34a":"#dc2626",display:"inline-flex",alignItems:"center",gap:4},children:[t.jsx("span",{children:o?"⬆":"⬇"}),t.jsxs("span",{children:["$",Number(e).toLocaleString()]})]})}const bt=[{id:"name",header:[{text:"Project"},{content:"inputFilter"}],footer:[{text:"Total"}],minWidth:200,resizable:!0,sortable:!0,editorType:"input"},{id:"paid",header:[{text:"Paid"}],width:60,align:"center"},{id:"access",header:[{text:"Access"},{content:"inputFilter"}],width:160,template:mt},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,editorType:"input",template:ht},{id:"owner",header:[{text:"Owner"},{content:"inputFilter"}],width:150,sortable:!0,editorType:"input"},{id:"balance",header:[{text:"Balance"}],footer:[{content:"sum"}],width:130,template:gt},{id:"hours",header:[{text:"Number of Hours"},{content:"inputFilter"}],footer:[{content:"sum"}],width:150,align:"right",sortable:!0},{id:"renewals",header:[{text:"Number of Renewals"},{content:"inputFilter"}],width:160,editorType:"input"},{id:"start_date",header:[{text:"Start Date"}],width:115,align:"center"},{id:"end_date",header:[{text:"End Date"}],width:115,align:"center"},{id:"cost",header:[{text:"Cost"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"budget",header:[{text:"Budget"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"project_id",header:[{text:"Project ID"},{content:"inputFilter"}],width:115,align:"center"}];function ft({dragDrop:e}){const[s,a]=i.useState(()=>pt()),o=i.useCallback(b=>{a(w=>w.map(l=>{if(l.id===b)return{...l,paid:!l.paid};const m=l.items;if(!m)return l;const c=m.map(u=>u.id===b?{...u,paid:!u.paid}:u);return c===m?l:{...l,items:c}}))},[]),g=i.useMemo(()=>bt.map(b=>b.id==="paid"?{...b,template:(w,l)=>t.jsx("input",{type:"checkbox",checked:!!w,onChange:()=>o(l.id),style:{width:16,height:16,accentColor:"#1d9bf0",cursor:"pointer"}})}:b),[o]);return t.jsx(S,{note:"Faithful recreation of the DHTMLX TreeGrid snippet: users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.",children:t.jsx(h,{columns:g,data:s,dragItem:e?"row":void 0,selection:"row",editable:!0,keyNavigation:!0,multiselection:!0,sortable:!0,style:{width:"100%",height:640}})})}const B={args:{dragDrop:!1},argTypes:{dragDrop:{name:"Drag & Drop rows",description:"Enable drag-and-drop row reordering",control:"boolean",table:{defaultValue:{summary:"false"}}}},render:e=>{const{dragDrop:s}=e;return t.jsx(ft,{dragDrop:s})},parameters:{docs:{description:{story:"Recreation of the DHTMLX TreeGrid showcase (snippet.dhtmlx.com/0gd4dn8p). Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection."}}}},Q=["Alice","Bob","Cara","Dan","Eva","Frank","Grace","Hans"],Ee=Array.from({length:24},(e,s)=>({id:`e${s}`,name:Q[s%Q.length],dept:["Engineering","HR","Finance"][s%3],status:s%2===0?"active":"inactive",salary:5e4+s*1e3})),Me=[{id:"dept",header:[{text:"Department"}],width:160},{id:"status",header:[{text:"Status"}],width:100},{id:"name",header:[{text:"Name"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100}],O={name:"GroupBy — Department (avg salary)",render:()=>t.jsx(K,{children:t.jsx(h,{data:Ee,columns:Me,groupBy:"dept",groupAggregate:{salary:"avg"},style:{height:360,width:"100%"}})})},N={name:"GroupBy — Department > Status (sum salary)",render:()=>t.jsx(K,{children:t.jsx(h,{data:Ee,columns:Me,groupBy:["dept","status"],groupAggregate:{salary:"sum"},style:{height:400,width:"100%"}})})};var Y,Z,ee;_.parameters={..._.parameters,docs:{...(Y=_.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(ee=(Z=_.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,re,ae;R.parameters={...R.parameters,docs:{...(te=R.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Expanded multi-level hierarchy with nested tasks in the first column.">
        <TreeGrid columns={baseColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(oe=(ne=A.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ie,le,de;H.parameters={...H.parameters,docs:{...(ie=H.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Header filters reuse the existing Grid filter controls on top of hierarchical rows.">
        <TreeGrid columns={filterColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(de=(le=H.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var ce,ue,pe;$.parameters={...$.parameters,docs:{...(ce=$.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.">
        <TreeGrid columns={baseColumns} data={data} sortable selection="row" multiselection style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(pe=(ue=$.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var me,he,ge;P.parameters={...P.parameters,docs:{...(me=P.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Drag rows to reorder within the flattened tree view.">
        <TreeGrid columns={baseColumns} data={data} dragItem="row" selection="row" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(we=(fe=F.parameters)==null?void 0:fe.docs)==null?void 0:we.source}}};var ye,xe,ve;E.parameters={...E.parameters,docs:{...(ye=E.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<TreeGridRef>(null);
    const data = useMemo(() => cloneData().map(row => ({
      ...row,
      $opened: false
    })), []);
    return <StoryFrame note="Imperative ref mirrors DHTMLX TreeGrid API: open(id), close(id), openAll(), closeAll().">
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
}`,...(ve=(xe=E.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var Se,De,Te;M.parameters={...M.parameters,docs:{...(Se=M.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => JSON.parse(JSON.stringify(bookData)) as BookRow[], []);
    return <StoryFrame note="Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.">
        <TreeGrid columns={bookColumns} data={data} selection="row" style={{
        width: '100%',
        height: 680
      }} />
      </StoryFrame>;
  }
}`,...(Te=(De=M.parameters)==null?void 0:De.docs)==null?void 0:Te.source}}};var ke,Ie,je;B.parameters={...B.parameters,docs:{...(ke=B.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
        story: 'Recreation of the DHTMLX TreeGrid showcase (snippet.dhtmlx.com/0gd4dn8p). Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection.'
      }
    }
  }
}`,...(je=(Ie=B.parameters)==null?void 0:Ie.docs)==null?void 0:je.source}}};var Ce,Ge,_e;O.parameters={...O.parameters,docs:{...(Ce=O.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'GroupBy — Department (avg salary)',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy="dept" groupAggregate={{
      salary: 'avg'
    }} style={{
      height: 360,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(_e=(Ge=O.parameters)==null?void 0:Ge.docs)==null?void 0:_e.source}}};var Re,Ae,He;N.parameters={...N.parameters,docs:{...(Re=N.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  name: 'GroupBy — Department > Status (sum salary)',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy={['dept', 'status']} groupAggregate={{
      salary: 'sum'
    }} style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(He=(Ae=N.parameters)==null?void 0:Ae.docs)==null?void 0:He.source}}};const jt=["Default","CollapsedStart","DeepHierarchy","WithHeaderFilters","SortingAndSelection","EditableRows","RowDrag","ImperativeApi","BookLibraryExample","DHtmlxShowcase","GroupByDepartment","MultiLevelGroupBy"];export{M as BookLibraryExample,R as CollapsedStart,B as DHtmlxShowcase,A as DeepHierarchy,_ as Default,P as EditableRows,O as GroupByDepartment,E as ImperativeApi,N as MultiLevelGroupBy,F as RowDrag,$ as SortingAndSelection,H as WithHeaderFilters,jt as __namedExportsOrder,It as default};
