import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CXOcBcs0.js";import{c as Ve,G as Qe,g as Ye,T as K}from"./Grid-DXkzAUeY.js";import{u as Ze}from"./useTreeStore-BEOdTLmG.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";import"./DragManager-Cl1AKh51.js";function $e(e,s,a){if(s.length===0)return e;const[o,...g]=s,I=[],x=new Map;for(const p of e){const u=String(p[o]??"");x.has(u)||(I.push(u),x.set(u,[])),x.get(u).push(p)}return I.map(p=>{const u=x.get(p),B=g.length>0?$e(u,g,a):u,b={id:`__group__${o}__${p}`,$group:!0,$editable:!1,$selectable:!1,[o]:p,items:B};if(a)for(const[T,k]of Object.entries(a)){const v=Ve(u,T,k);v!==void 0&&(b[T]=v)}return b})}const et="_treeCell_20bgo_1",tt="_toggle_20bgo_9",rt="_cellValue_20bgo_20",q={treeCell:et,toggle:tt,cellValue:rt};function at(e){return JSON.parse(JSON.stringify(e))}function st(e,s){let a=0,o=e.getParent(s);for(;o&&o!==e.getRoot();)a+=1,o=e.getParent(o);return a}function J(e,s=new Set){var a;for(const o of e)(a=o.items)!=null&&a.length&&(s.add(o.id),J(o.items,s));return s}function Fe(e,s){return e.map(a=>({...a,$opened:s?!1:a.$opened,items:a.items?Fe(a.items,s):void 0}))}const c=i.forwardRef(function(s,a){var X;const{data:o,columns:g,treeColumnId:I,collapsed:x=!1,rootParent:p,dropBehaviour:u="sibling",dragExpand:B=!0,groupBy:b,groupAggregate:T,onCellClick:k,onDragRowIn:v,onAfterRowDrop:O,...N}=s,z=i.useRef(null),L=i.useMemo(()=>{let r=at(o);if(b&&!N.dataProxy){const l=Array.isArray(b)?b:[b];r=$e(r,l,T)}return Fe(r,x)},[x,o,b,T,N.dataProxy]),Be=Ze({data:L,config:p?{rootId:p}:void 0}),{store:n,items:Oe}=Be,j=n.getRoot(),W=I??((X=g[0])==null?void 0:X.id);i.useEffect(()=>{n.parse(L)},[L,n]);const Ne=i.useMemo(()=>n.flatten(n.getItems(j)),[Oe,j,n]),ze=i.useMemo(()=>g.map(r=>{if(r.id!==W)return r;const l=r.template;return{...r,template:(h,m,We)=>{var V;const Xe=st(n,m.id),Ue=n.haveItems(m.id),U=!!((V=n.getItem(m.id))!=null&&V.$opened);return t.jsxs("div",{className:q.treeCell,style:{paddingInlineStart:`${Xe*18}px`},children:[t.jsx("button",{type:"button",className:q.toggle,"data-rgs-tree-toggle":m.id,"aria-label":U?"Collapse row":"Expand row",children:Ue?U?"▾":"▸":""}),t.jsx("span",{className:q.cellValue,children:l?l(h,m,We):String(h??"")})]})}}}),[W,g,n]);i.useImperativeHandle(a,()=>({open:r=>{n.exists(r)&&n.update(r,{$opened:!0})},close:r=>{n.exists(r)&&n.update(r,{$opened:!1})},openAll:()=>{for(const r of Array.from(J(n.serialize())))n.exists(r)&&n.update(r,{$opened:!0},!0);n.events.fire("change",[void 0,"update"])},closeAll:()=>{for(const r of Array.from(J(n.serialize())))n.exists(r)&&n.update(r,{$opened:!1},!0);n.events.fire("change",[void 0,"update"])}}),[n]);const Le=(r,l,d)=>{if(d.target.closest(`[data-rgs-tree-toggle="${r}"]`)){const m=n.getItem(r);m&&n.haveItems(r)&&n.update(r,{$opened:!m.$opened})}k==null||k(r,l,d)},qe=r=>{if(!(r.ctrlKey||r.metaKey)||r.key!=="Enter")return;const l=r.currentTarget.querySelector(`.${Ye.rowSelected}[data-rgs-id]`),d=l==null?void 0:l.getAttribute("data-rgs-id");if(!d)return;const h=n.getItem(d);h&&n.haveItems(d)&&(n.update(d,{$opened:!h.$opened}),r.preventDefault())},Je=(r,l)=>{if(B&&r.target){const d=n.getItem(r.target);d&&n.haveItems(r.target)&&!d.$opened&&(z.current!==null&&window.clearTimeout(z.current),z.current=window.setTimeout(()=>{n.update(r.target,{$opened:!0})},200))}v==null||v(r,l)},Ke=(r,l)=>{if(r.target&&r.position)if(u==="child")n.move(r.start,-1,void 0,r.target);else{const d=n.getParent(r.target)??j,h=n.getIndex(r.target),m=r.position==="bottom"?h+1:h;n.move(r.start,m,void 0,d)}O==null||O(r,l)};return t.jsx("div",{onKeyDown:qe,children:t.jsx(Qe,{...N,rootParent:j,columns:ze,data:Ne,store:n,onCellClick:Le,onDragRowIn:Je,onAfterRowDrop:Ke})})});c.__docgenInfo={description:"",methods:[{name:"open",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"close",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"openAll",docblock:null,modifiers:[],params:[],returns:null},{name:"closeAll",docblock:null,modifiers:[],params:[],returns:null}],displayName:"TreeGrid",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn",elements:[{name:"T"}],raw:"GridColumn<T>"}],raw:"GridColumn<T>[]"},description:""},treeColumnId:{required:!1,tsType:{name:"string"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:""},rootParent:{required:!1,tsType:{name:"string"},description:""},dropBehaviour:{required:!1,tsType:{name:"union",raw:"'child' | 'sibling' | 'complex'",elements:[{name:"literal",value:"'child'"},{name:"literal",value:"'sibling'"},{name:"literal",value:"'complex'"}]},description:""},dragExpand:{required:!1,tsType:{name:"boolean"},description:""},groupBy:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},groupAggregate:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:"'sum' | 'avg' | 'count' | 'min' | 'max'",elements:[{name:"literal",value:"'sum'"},{name:"literal",value:"'avg'"},{name:"literal",value:"'count'"},{name:"literal",value:"'min'"},{name:"literal",value:"'max'"}]}],raw:"Record<string, AggregateType>"},description:""}},composes:["Omit"]};const f=360,It={title:"Components/TreeGrid",component:c,decorators:[e=>t.jsx(K,{children:t.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:t.jsx(e,{})})})],parameters:{layout:"fullscreen"}},S=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],nt=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0,editorType:"input"},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0,editorType:"input"}],ot=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"},{content:"selectFilter"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],it=[{id:"program-alpha",name:"Program Alpha",owner:"Nina",status:"Active",hours:240,$opened:!0,items:[{id:"alpha-discovery",name:"Discovery",owner:"Kai",status:"Done",hours:48,$opened:!0,items:[{id:"alpha-research",name:"Research",owner:"Kai",status:"Done",hours:20},{id:"alpha-interviews",name:"Interviews",owner:"Mira",status:"Done",hours:28}]},{id:"alpha-build",name:"Build",owner:"Mira",status:"Active",hours:132},{id:"alpha-qa",name:"QA",owner:"Rae",status:"Queued",hours:60}]},{id:"program-beta",name:"Program Beta",owner:"Jules",status:"Planned",hours:180,items:[{id:"beta-outline",name:"Outline",owner:"Rae",status:"Queued",hours:24},{id:"beta-implementation",name:"Implementation",owner:"Noah",status:"Planned",hours:156}]},{id:"ops",name:"Operations",owner:"Lina",status:"Active",hours:96}];function w(){return JSON.parse(JSON.stringify(it))}function y({children:e,note:s}){return t.jsxs("div",{children:[s?t.jsx("p",{style:{margin:"0 0 12px",color:"#667085",fontSize:13},children:s}):null,e]})}const D={args:{columns:S,data:w(),sortable:!0,selection:"row",style:{width:"100%",height:f}}},C={args:{columns:S,data:w().map(e=>({...e,$opened:!1})),selection:"row",style:{width:"100%",height:f}}},G={render:()=>{const e=i.useMemo(()=>w(),[]);return t.jsx(y,{note:"Expanded multi-level hierarchy with nested tasks in the first column.",children:t.jsx(c,{columns:S,data:e,selection:"row",sortable:!0,style:{width:"100%",height:f}})})}},_={render:()=>{const e=i.useMemo(()=>w(),[]);return t.jsx(y,{note:"Header filters reuse the existing Grid filter controls on top of hierarchical rows.",children:t.jsx(c,{columns:ot,data:e,selection:"row",sortable:!0,style:{width:"100%",height:f}})})}},A={render:()=>{const e=i.useMemo(()=>w(),[]);return t.jsx(y,{note:"Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.",children:t.jsx(c,{columns:S,data:e,sortable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:f}})})}},R={render:()=>{const e=i.useMemo(()=>w(),[]);return t.jsx(y,{note:"Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.",children:t.jsx(c,{columns:nt,data:e,editable:!0,selection:"complex",style:{width:"100%",height:f}})})}},H={render:()=>{const e=i.useMemo(()=>w(),[]);return t.jsx(y,{note:"Drag rows to reorder within the flattened tree view.",children:t.jsx(c,{columns:S,data:e,dragItem:"row",selection:"row",style:{width:"100%",height:f}})})}},$={render:()=>{const e=i.useRef(null),s=i.useMemo(()=>w().map(a=>({...a,$opened:!1})),[]);return t.jsxs(y,{note:"Imperative ref mirrors DHTMLX TreeGrid API: open(id), close(id), openAll(), closeAll().",children:[t.jsx(c,{ref:e,columns:S,data:s,selection:"row",style:{width:"100%",height:f}}),t.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12},children:[t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.openAll()},children:"Open All"}),t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.closeAll()},children:"Close All"}),t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.open("program-beta")},children:"Open Beta"}),t.jsx("button",{type:"button",onClick:()=>{var a;return(a=e.current)==null?void 0:a.close("program-alpha")},children:"Close Alpha"})]})]})}},lt=[{id:"name",header:[{text:"Book Name"}],width:300,sortable:!0,resizable:!0},{id:"checked",header:[{text:""}],width:52,align:"center",template:e=>t.jsx("input",{type:"checkbox",checked:!!e,readOnly:!0,style:{width:18,height:18,accentColor:"#1d9bf0"}})},{id:"price",header:[{text:"Price"}],width:100,align:"right"},{id:"shipsIn",header:[{text:"Ships in"}],width:110},{id:"status",header:[{text:"Status"}],width:150,template:e=>{const s=String(e??"").toLowerCase(),a=s==="available"?"#1fb26b":s==="reserved"?"#1d9bf0":"#ff4d4f";return s?t.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[t.jsx("span",{"aria-hidden":"true",style:{width:14,height:14,borderRadius:"999px",background:a,display:"inline-block"}}),t.jsx("span",{style:{color:"#5f6b7a"},children:String(e??"")})]}):null}},{id:"publishingDate",header:[{text:"Publishing date"}],width:160,align:"right"},{id:"cover",header:[{text:"Cover"}],width:120}],dt=[{id:"bestsellers",name:"Bestsellers",$opened:!0,items:[{id:"john-grisham",name:"John Grisham",$opened:!0,items:[{id:"time-to-kill",name:"A Time to Kill",checked:!0,price:"$12.25",shipsIn:"12 hours",status:"available",publishingDate:"05/10/2019 12:00",cover:"Hardcover"},{id:"rainmaker",name:"The Rainmaker",checked:!0,price:"$5.5",shipsIn:"1 hour",status:"reserved",publishingDate:"13/12/2005 12:00",cover:"Paperback"},{id:"partner",name:"The Partner",checked:!1,price:"$11.7",shipsIn:"1 week",publishingDate:"25/11/2017 12:00",cover:"Hardcover"},{id:"firm",name:"The Firm",checked:!0,price:"$6",shipsIn:"24 hours",status:"available",publishingDate:"15/02/2020 12:00",cover:"Paperback"}]},{id:"stephen-king",name:"Stephen King",status:"missing",$opened:!0,items:[{id:"misery",name:"Misery",checked:!1,price:"$5.25",shipsIn:"1 week",status:"missing",publishingDate:"26/10/2014 12:00",cover:"Paperback"},{id:"it",name:"It",checked:!0,price:"$15.75",shipsIn:"1 hour",status:"available",publishingDate:"05/04/2020 12:00",cover:"Hardcover"},{id:"dark-tower",name:"The Dark Tower",checked:!0,price:"$5.33",shipsIn:"2 days",status:"reserved",publishingDate:"08/05/2018 12:00",cover:"Paperback"}]}]},{id:"classics",name:"Classics",$opened:!0,items:[{id:"pushkin",name:"Pushkin",status:"missing",$opened:!0,items:[{id:"onegin",name:"Eugene Onegin",checked:!0,price:"$14.4",shipsIn:"24 hours",status:"available",publishingDate:"05/03/2020 12:00",cover:"Hardcover"},{id:"boris-godunov",name:"Boris Godunov",checked:!1,price:"$8.1",shipsIn:"24 hours",status:"missing",publishingDate:"18/09/2019 12:00",cover:"Paperback"}]},{id:"balzac",name:"Honore De Balzac",status:"missing"}]}],F={render:()=>{const e=i.useMemo(()=>JSON.parse(JSON.stringify(dt)),[]);return t.jsx(y,{note:"Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.",children:t.jsx(c,{columns:lt,data:e,selection:"row",style:{width:"100%",height:680}})})}},ct="https://snippet.dhtmlx.com/codebase/data/common/img/02/",Pe=[{id:"1",name:"Gary Ortiz",ava:"avatar_01.jpg"},{id:"2",name:"Albert Williamson",ava:"avatar_02.jpg"},{id:"3",name:"Mildred Fuller",ava:"avatar_03.jpg"},{id:"4",name:"Russell Robinson",ava:"avatar_04.jpg"},{id:"5",name:"Phyllis Webb",color:"#61C874"},{id:"6",name:"Louise Fisher",color:"#61C504"},{id:"7",name:"Daniel Peterson",color:"#61C456"}],ut=[{name:"Real Estate",owner:"Louise Fisher",start_date:"02/02/2024",end_date:"05/06/2024",status:"Done",hours:92,cost:3588,budget:11768,balance:8180,paid:!0,renewals:"1-2 times",access:"4, 5, 7",project_id:"ISS-124.5"},{name:"HR System",owner:"Daniel Peterson",start_date:"03/03/2024",end_date:"07/02/2024",status:"Done",hours:340,cost:15980,budget:18856,balance:2876,paid:!0,renewals:"1 time",access:"2, 4",project_id:"ISS-900.9"},{name:"Inventory",owner:"Fred Duncan",start_date:"01/01/2024",end_date:"09/01/2024",status:"Done",hours:484,cost:21296,budget:14907,balance:-6389,paid:!1,renewals:"1 time",access:"3, 1, 2",project_id:"ISS-777.4"},{name:"Trip Planner",owner:"Michael Rice",start_date:"01/01/2024",end_date:"11/06/2024",status:"Done",hours:345,cost:14835,budget:70911,balance:56076,paid:!1,renewals:"1-2 times",access:"5, 3, 6",project_id:"ISS-642.2"},{name:"HR System",owner:"Andrew Stewart",start_date:"01/01/2024",end_date:"09/02/2024",status:"Done",hours:57,cost:2052,budget:5068,balance:3016,paid:!0,renewals:"1-2 times",access:"4, 2, 1, 7",project_id:"ISS-256.2"},{name:"HR System",owner:"Martin Thompson",start_date:"02/06/2024",end_date:"06/01/2024",status:"Done",hours:211,cost:8229,budget:16540,balance:8311,paid:!1,renewals:"more than 5 times",access:"3, 5, 2, 6",project_id:"ISS-263.2"},{name:"Ticket System",owner:"Martin Thompson",start_date:"05/06/2025",end_date:"07/03/2025",status:"In Progress",hours:3,cost:144,budget:122,balance:-22,paid:!0,renewals:"1 time",access:"2, 3",project_id:"ISS-634.3"},{name:"Education System",owner:"Mark Harper",start_date:"04/02/2025",end_date:"08/03/2025",status:"In Progress",hours:76,cost:3496,budget:12515,balance:9019,paid:!0,renewals:"more than 5 times",access:"1, 5, 4",project_id:"ISS-256.7"}];function mt(){return Pe.map(e=>({id:e.id,name:e.name,$opened:!0,items:ut.filter(s=>s.access.split(", ").includes(e.id)).map((s,a)=>({id:`${e.id}_${a}`,...s}))}))}function pt(e){if(!e)return null;const s=String(e).split(", ");return t.jsx("div",{style:{display:"flex",alignItems:"center"},children:s.map(a=>{const o=Pe.find(g=>g.id===a);return o?o.ava?t.jsx("img",{src:`${ct}${o.ava}`,alt:o.name,width:24,height:24,style:{borderRadius:"50%",border:"1px solid #fff",marginRight:-3,objectFit:"cover",display:"block"}},a):t.jsx("div",{style:{width:24,height:24,borderRadius:"50%",background:o.color??"#999",border:"1px solid #fff",marginRight:-3,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:600,flexShrink:0},children:o.name[0]},a):null})})}function ht(e){if(!e)return null;const s=String(e),a=s==="Done"?"#1fb26b":s==="In Progress"?"#1d9bf0":"#ff4d4f";return t.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[t.jsx("span",{style:{width:12,height:12,borderRadius:"50%",background:a,flexShrink:0,display:"inline-block"}}),t.jsx("span",{children:s})]})}function gt(e,s){if(e==null||e==="")return null;const a=s.balance;if(a===void 0)return null;const o=a>0;return t.jsxs("span",{style:{color:o?"#16a34a":"#dc2626",display:"inline-flex",alignItems:"center",gap:4},children:[t.jsx("span",{children:o?"⬆":"⬇"}),t.jsxs("span",{children:["$",Number(e).toLocaleString()]})]})}const bt=[{id:"name",header:[{text:"Project"},{content:"inputFilter"}],footer:[{text:"Total"}],minWidth:200,resizable:!0,sortable:!0,editorType:"input"},{id:"paid",header:[{text:"Paid"}],width:60,align:"center",template:e=>t.jsx("input",{type:"checkbox",checked:!!e,readOnly:!0,style:{width:16,height:16,accentColor:"#1d9bf0"}})},{id:"access",header:[{text:"Access"},{content:"inputFilter"}],width:160,template:pt},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,editorType:"input",template:ht},{id:"owner",header:[{text:"Owner"},{content:"inputFilter"}],width:150,sortable:!0,editorType:"input"},{id:"balance",header:[{text:"Balance"}],footer:[{content:"sum"}],width:130,template:gt},{id:"hours",header:[{text:"Number of Hours"},{content:"inputFilter"}],footer:[{content:"sum"}],width:150,align:"right",sortable:!0},{id:"renewals",header:[{text:"Number of Renewals"},{content:"inputFilter"}],width:160,editorType:"input"},{id:"start_date",header:[{text:"Start Date"}],width:115,align:"center"},{id:"end_date",header:[{text:"End Date"}],width:115,align:"center"},{id:"cost",header:[{text:"Cost"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"budget",header:[{text:"Budget"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"project_id",header:[{text:"Project ID"},{content:"inputFilter"}],width:115,align:"center"}],P={render:()=>{const e=i.useMemo(()=>mt(),[]);return t.jsx(y,{note:"Faithful recreation of the DHTMLX TreeGrid snippet: users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.",children:t.jsx(c,{columns:bt,data:e,dragItem:"row",selection:"row",editable:!0,keyNavigation:!0,multiselection:!0,sortable:!0,style:{width:"100%",height:640}})})},parameters:{docs:{description:{story:"Recreation of the DHTMLX TreeGrid showcase (snippet.dhtmlx.com/0gd4dn8p). Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection."}}}},Q=["Alice","Bob","Cara","Dan","Eva","Frank","Grace","Hans"],Me=Array.from({length:24},(e,s)=>({id:`e${s}`,name:Q[s%Q.length],dept:["Engineering","HR","Finance"][s%3],status:s%2===0?"active":"inactive",salary:5e4+s*1e3})),Ee=[{id:"dept",header:[{text:"Department"}],width:160},{id:"status",header:[{text:"Status"}],width:100},{id:"name",header:[{text:"Name"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100}],M={name:"GroupBy — Department (avg salary)",render:()=>t.jsx(K,{children:t.jsx(c,{data:Me,columns:Ee,groupBy:"dept",groupAggregate:{salary:"avg"},style:{height:360,width:"100%"}})})},E={name:"GroupBy — Department > Status (sum salary)",render:()=>t.jsx(K,{children:t.jsx(c,{data:Me,columns:Ee,groupBy:["dept","status"],groupAggregate:{salary:"sum"},style:{height:400,width:"100%"}})})};var Y,Z,ee;D.parameters={...D.parameters,docs:{...(Y=D.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(ee=(Z=D.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,re,ae;C.parameters={...C.parameters,docs:{...(te=C.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ae=(re=C.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,ne,oe;G.parameters={...G.parameters,docs:{...(se=G.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Expanded multi-level hierarchy with nested tasks in the first column.">
        <TreeGrid columns={baseColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(oe=(ne=G.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ie,le,de;_.parameters={..._.parameters,docs:{...(ie=_.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Header filters reuse the existing Grid filter controls on top of hierarchical rows.">
        <TreeGrid columns={filterColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(de=(le=_.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var ce,ue,me;A.parameters={...A.parameters,docs:{...(ce=A.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.">
        <TreeGrid columns={baseColumns} data={data} sortable selection="row" multiselection style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(me=(ue=A.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var pe,he,ge;R.parameters={...R.parameters,docs:{...(pe=R.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.">
        <TreeGrid columns={editableColumns} data={data} editable selection="complex" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(ge=(he=R.parameters)==null?void 0:he.docs)==null?void 0:ge.source}}};var be,fe,we;H.parameters={...H.parameters,docs:{...(be=H.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Drag rows to reorder within the flattened tree view.">
        <TreeGrid columns={baseColumns} data={data} dragItem="row" selection="row" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(we=(fe=H.parameters)==null?void 0:fe.docs)==null?void 0:we.source}}};var ye,xe,ve;$.parameters={...$.parameters,docs:{...(ye=$.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(ve=(xe=$.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var Se,Te,ke;F.parameters={...F.parameters,docs:{...(Se=F.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => JSON.parse(JSON.stringify(bookData)) as BookRow[], []);
    return <StoryFrame note="Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.">
        <TreeGrid columns={bookColumns} data={data} selection="row" style={{
        width: '100%',
        height: 680
      }} />
      </StoryFrame>;
  }
}`,...(ke=(Te=F.parameters)==null?void 0:Te.docs)==null?void 0:ke.source}}};var Ie,je,De;P.parameters={...P.parameters,docs:{...(Ie=P.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => buildShowcaseData(), []);
    return <StoryFrame note="Faithful recreation of the DHTMLX TreeGrid snippet: users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.">
        <TreeGrid columns={showcaseColumns} data={data} dragItem="row" selection="row" editable keyNavigation multiselection sortable style={{
        width: '100%',
        height: 640
      }} />
      </StoryFrame>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Recreation of the DHTMLX TreeGrid showcase (snippet.dhtmlx.com/0gd4dn8p). Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection.'
      }
    }
  }
}`,...(De=(je=P.parameters)==null?void 0:je.docs)==null?void 0:De.source}}};var Ce,Ge,_e;M.parameters={...M.parameters,docs:{...(Ce=M.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'GroupBy — Department (avg salary)',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy="dept" groupAggregate={{
      salary: 'avg'
    }} style={{
      height: 360,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(_e=(Ge=M.parameters)==null?void 0:Ge.docs)==null?void 0:_e.source}}};var Ae,Re,He;E.parameters={...E.parameters,docs:{...(Ae=E.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  name: 'GroupBy — Department > Status (sum salary)',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy={['dept', 'status']} groupAggregate={{
      salary: 'sum'
    }} style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(He=(Re=E.parameters)==null?void 0:Re.docs)==null?void 0:He.source}}};const jt=["Default","CollapsedStart","DeepHierarchy","WithHeaderFilters","SortingAndSelection","EditableRows","RowDrag","ImperativeApi","BookLibraryExample","DHtmlxShowcase","GroupByDepartment","MultiLevelGroupBy"];export{F as BookLibraryExample,C as CollapsedStart,P as DHtmlxShowcase,G as DeepHierarchy,D as Default,R as EditableRows,M as GroupByDepartment,$ as ImperativeApi,E as MultiLevelGroupBy,H as RowDrag,A as SortingAndSelection,_ as WithHeaderFilters,jt as __namedExportsOrder,It as default};
