import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as p}from"./index-CXOcBcs0.js";import{a as ht,G as gt,g as A}from"./Grid-DlZBTzRI.js";import{u as ft}from"./useTreeStore-BCe7Hr5K.js";import{T as ie}from"./DragManager-Dby8_QFd.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";const bt="_treeCell_1dcwz_1",wt="_toggle_1dcwz_9",yt="_cellValue_1dcwz_20",xt="_treeEditor_1dcwz_27",j={treeCell:bt,toggle:wt,cellValue:yt,treeEditor:xt};function St(r){return JSON.parse(JSON.stringify(r))}function ne(r,n){let s=0,l=r.getParent(n);for(;l&&l!==r.getRoot();)s+=1,l=r.getParent(l);return s}function oe(r,n=new Set){var s;for(const l of r)(s=l.items)!=null&&s.length&&(n.add(l.id),oe(l.items,n));return n}function Xe(r,n){return r.map(s=>({...s,$opened:n?!1:s.$opened,items:s.items?Xe(s.items,n):void 0}))}const f=p.forwardRef(function(n,s){var ue;const{data:l,columns:g,treeColumnId:S,collapsed:h=!1,rootParent:x,dropBehaviour:b="sibling",dragExpand:w=!0,groupBy:k,groupAggregate:le,onCellClick:V,onAfterSelect:W,onDragRowIn:Q,onDragRowOut:X,canRowDrop:Y,onAfterRowDrag:Z,onAfterRowDrop:ee,...te}=n,$=p.useRef(null),re=p.useRef(null),ae=p.useMemo(()=>{let e=St(l);if(k&&!te.dataProxy){const i=Array.isArray(k)?k:[k];e=ht(e,i,le)}return Xe(e,h)},[h,l,k,le,te.dataProxy]),tt=ft({data:ae,config:x?{rootId:x}:void 0}),{store:t,items:rt}=tt,G=t.getRoot(),se=S??((ue=g[0])==null?void 0:ue.id);p.useEffect(()=>{const e=new Map;for(const o of t._order)o.$opened!==void 0&&e.set(o.id,!!o.$opened);const i=[...t._sortingStates];t.parse(ae);for(const[o,m]of e)t.exists(o)&&t.update(o,{$opened:m},!0);i.length>0&&t.sort(i)},[ae,t]),p.useEffect(()=>{const e={},i=new Set;return t.events.on("filter",()=>{if(t._initChilds){const o=m=>{var c;for(const d of t._childs[m]??[])(c=t._childs[d.id])!=null&&c.length&&(d.$opened||(t.update(d.id,{$opened:!0},!0),i.add(d.id)),o(d.id))};o(t.getRoot())}else{for(const o of i)t.exists(o)&&t.update(o,{$opened:!1},!0);i.clear()}},e),()=>t.events.detach("filter",e)},[t]);const at=p.useMemo(()=>t.flatten(t.getItems(G)),[rt,G,t]),st=p.useMemo(()=>g.map(e=>{if(e.id!==se)return e;const i=e.template,o=e.editTemplate,m=!!(e.editorType||e.editTemplate);return{...e,editTemplate:m?(d,u,T,y)=>{var E;const I=ne(t,u.id),_=t.haveItems(u.id),P=!!((E=t.getItem(u.id))!=null&&E.$opened);return a.jsxs("div",{className:j.treeCell,style:{paddingInlineStart:`${I*18}px`},children:[a.jsx("span",{className:j.toggle,"aria-hidden":"true",children:_?P?"▾":"▸":""}),a.jsx("div",{className:j.treeEditor,children:o?o(d,u,T,y):a.jsx("input",{ref:y.ref,className:A.cellEditor,value:d==null?"":String(d),onChange:mt=>y.onChange(mt.target.value)})})]})}:void 0,template:(d,u,T)=>{var P;const y=ne(t,u.id),I=t.haveItems(u.id),_=!!((P=t.getItem(u.id))!=null&&P.$opened);return a.jsxs("div",{className:j.treeCell,style:{paddingInlineStart:`${y*18}px`},children:[I?a.jsx("button",{type:"button",className:j.toggle,tabIndex:-1,"data-rgs-tree-toggle":u.id,"data-rgs-no-select":"","aria-label":_?"Collapse row":"Expand row","aria-expanded":_,onDoubleClick:E=>E.stopPropagation(),children:_?"▾":"▸"}):a.jsx("span",{className:j.toggle,"aria-hidden":"true"}),a.jsx("span",{className:j.cellValue,children:u.$group&&u.$groupValue!==void 0?`${String(u.$groupValue)} (${String(u.$groupCount??0)})`:i?i(d,u,T):String(d??"")})]})}}}),[se,g,t]);p.useImperativeHandle(s,()=>({open:e=>{t.exists(e)&&t.update(e,{$opened:!0})},close:e=>{t.exists(e)&&t.update(e,{$opened:!1})},openAll:()=>{for(const e of Array.from(oe(t.serialize())))t.exists(e)&&t.update(e,{$opened:!0},!0);t.events.fire("change",[void 0,"update"])},closeAll:()=>{for(const e of Array.from(oe(t.serialize())))t.exists(e)&&t.update(e,{$opened:!1},!0);t.events.fire("change",[void 0,"update"])}}),[t]);const nt=(e,i,o)=>{if(o.target.closest(`[data-rgs-tree-toggle="${e}"]`)){const c=t.getItem(e);c&&t.haveItems(e)&&t.update(e,{$opened:!c.$opened})}V==null||V(e,i,o)},de=(e,i)=>{const o=t.getItem(e);return!o||!t.haveItems(e)||!!o.$opened===i?!1:(t.update(e,{$opened:i}),!0)},ot=e=>{var o,m;if(e.target.closest('input, textarea, select, [contenteditable="true"]'))return;const i=e.ctrlKey||e.metaKey;if(i&&e.key==="Enter"){const c=e.currentTarget.querySelector(`.${A.rowSelected}[data-rgs-id]`),d=c==null?void 0:c.getAttribute("data-rgs-id"),u=d?t.getItem(d):null;d&&u&&de(d,!u.$opened)&&e.preventDefault();return}if((e.key==="ArrowRight"||e.key==="ArrowLeft")&&!i&&!e.shiftKey){const c=e.currentTarget.querySelector(`.${A.cellSelected}[data-rgs-col-id]`);let d;if(c){if(c.getAttribute("data-rgs-col-id")!==se)return;d=(o=c.closest("[data-rgs-id]"))==null?void 0:o.getAttribute("data-rgs-id")}else{const u=e.currentTarget;d=(y=>!!y&&!!u.querySelector(`.${A.rowSelected}[data-rgs-id="${CSS.escape(y)}"]`))(re.current)?re.current:(m=u.querySelector(`.${A.rowSelected}[data-rgs-id]`))==null?void 0:m.getAttribute("data-rgs-id")}d&&de(d,e.key==="ArrowRight")&&(e.preventDefault(),e.stopPropagation())}},it=(e,i)=>{if(w&&e.target){const o=t.getItem(e.target);o&&t.haveItems(e.target)&&!o.$opened&&($.current!==null&&window.clearTimeout($.current),$.current=window.setTimeout(()=>{t.update(e.target,{$opened:!0})},200))}Q==null||Q(e,i)},ce=()=>{$.current!==null&&(window.clearTimeout($.current),$.current=null)},lt=(e,i)=>{ce(),X==null||X(e,i)},dt=(e,i)=>{ce(),Z==null||Z(e,i)},ct=(e,i)=>{if(e.target){let o=!1;if(t.eachParent(e.target,m=>{m.id===e.start&&(o=!0)},!0),o)return!1}return Y==null?void 0:Y(e,i)},ut=(e,i)=>{var o;if(e.target&&e.position)if(b==="child")t.move(e.start,-1,void 0,e.target),(o=t.getItem(e.target))!=null&&o.$opened||t.update(e.target,{$opened:!0});else{const m=e.target,c=t.getItem(m);if(e.position==="bottom"&&(c!=null&&c.$opened)&&t.haveItems(m))t.move(e.start,0,void 0,m);else{const d=t.getParent(m)??G,T=t.getItems(d).filter(I=>I.id!==e.start).findIndex(I=>I.id===m),y=e.position==="bottom"?T+1:T;t.move(e.start,y,void 0,d)}}ee==null||ee(e,i)},pt=(e,i)=>{var c;if(!t.exists(e))return 0;const o=ne(t,e),m=i==="bottom"&&!!((c=t.getItem(e))!=null&&c.$opened)&&t.haveItems(e);return(b==="child"||m?o+1:o)*18};return a.jsx("div",{onKeyDownCapture:ot,children:a.jsx(gt,{...te,rootParent:G,columns:st,data:at,store:t,onCellClick:nt,onAfterSelect:(e,i)=>{re.current=e,W==null||W(e,i)},onDragRowIn:it,onDragRowOut:lt,canRowDrop:ct,getRowDropIndent:pt,onAfterRowDrag:dt,onAfterRowDrop:ut})})});f.__docgenInfo={description:"",methods:[{name:"open",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"close",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"openAll",docblock:null,modifiers:[],params:[],returns:null},{name:"closeAll",docblock:null,modifiers:[],params:[],returns:null}],displayName:"TreeGrid",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn",elements:[{name:"T"}],raw:"GridColumn<T>"}],raw:"GridColumn<T>[]"},description:""},treeColumnId:{required:!1,tsType:{name:"string"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:""},rootParent:{required:!1,tsType:{name:"string"},description:""},dropBehaviour:{required:!1,tsType:{name:"union",raw:"'child' | 'sibling' | 'complex'",elements:[{name:"literal",value:"'child'"},{name:"literal",value:"'sibling'"},{name:"literal",value:"'complex'"}]},description:""},dragExpand:{required:!1,tsType:{name:"boolean"},description:""},groupBy:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},groupAggregate:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:"'sum' | 'avg' | 'count' | 'min' | 'max'",elements:[{name:"literal",value:"'sum'"},{name:"literal",value:"'avg'"},{name:"literal",value:"'count'"},{name:"literal",value:"'min'"},{name:"literal",value:"'max'"}]}],raw:"Record<string, AggregateType>"},description:""}},composes:["Omit"]};const v=360,Lt={title:"Tree Grid",component:f,decorators:[r=>a.jsx(ie,{children:a.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:a.jsx(r,{})})})],parameters:{layout:"fullscreen"}},R=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],vt=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0,editorType:"input"},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0,editorType:"input"}],Dt=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"},{content:"selectFilter"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],kt=[{id:"program-alpha",name:"Program Alpha",owner:"Nina",status:"Active",hours:240,$opened:!0,items:[{id:"alpha-discovery",name:"Discovery",owner:"Kai",status:"Done",hours:48,$opened:!0,items:[{id:"alpha-research",name:"Research",owner:"Kai",status:"Done",hours:20},{id:"alpha-interviews",name:"Interviews",owner:"Mira",status:"Done",hours:28}]},{id:"alpha-build",name:"Build",owner:"Mira",status:"Active",hours:132},{id:"alpha-qa",name:"QA",owner:"Rae",status:"Queued",hours:60}]},{id:"program-beta",name:"Program Beta",owner:"Jules",status:"Planned",hours:180,items:[{id:"beta-outline",name:"Outline",owner:"Rae",status:"Queued",hours:24},{id:"beta-implementation",name:"Implementation",owner:"Noah",status:"Planned",hours:156}]},{id:"ops",name:"Operations",owner:"Lina",status:"Active",hours:96}];function C(){return JSON.parse(JSON.stringify(kt))}function D({children:r,note:n}){return a.jsxs("div",{children:[n?a.jsx("p",{style:{margin:"0 0 12px",color:"#667085",fontSize:13},children:n}):null,r]})}const H={name:"Basic Usage",args:{columns:R,data:C(),sortable:!0,selection:"row",style:{width:"100%",height:v}}},F={name:"Collapsed by Default",args:{columns:R,data:C(),collapsed:!0,selection:"row",style:{width:"100%",height:v}}},pe=["Nina","Kai","Mira","Rae","Jules","Noah","Lina"],me=["Active","Done","Queued","Planned"];function Tt(){let r=0;const n=(l,g,S,h=[])=>{r+=1;const x=h.length?h.reduce((b,w)=>b+Number(w.hours),0):2+r*7%14;return{id:S,name:l,owner:pe[r%pe.length],status:me[(r+g)%me.length],hours:x,...h.length?{items:h,$opened:g<2}:{}}},s=(l,g,S,h)=>Array.from({length:h[l]},(x,b)=>{const w=`${g}-${b+1}`,k=l+1<h.length?s(l+1,w,S,h):[];return n(`${S[l]} ${w.split("-").slice(1).join(".")}`,l,w,k)});return s(0,"n",["Program","Stream","Epic","Task","Subtask"],[3,3,3,4,3])}const B={name:"Deep Hierarchy",render:()=>{const r=p.useMemo(()=>Tt(),[]);return a.jsx(D,{note:"Five levels (program › stream › epic › task › subtask), 471 rows. The first two levels start open; parent hours sum their children.",children:a.jsx(f,{columns:R,data:r,selection:"row",sortable:!0,style:{width:"100%",height:v}})})}},N={name:"Header Filters",render:()=>{const r=p.useMemo(()=>C(),[]);return a.jsx(D,{note:"Header filters reuse the existing Grid filter controls on top of hierarchical rows.",children:a.jsx(f,{columns:Dt,data:r,selection:"row",sortable:!0,style:{width:"100%",height:v}})})}},M={name:"Sorting & Selection",render:()=>{const r=p.useMemo(()=>C(),[]);return a.jsx(D,{note:"Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.",children:a.jsx(f,{columns:R,data:r,sortable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:v}})})}},O={name:"Editable Rows",render:()=>{const r=p.useMemo(()=>C(),[]);return a.jsx(D,{note:"Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.",children:a.jsx(f,{columns:vt,data:r,editable:!0,selection:"complex",style:{width:"100%",height:v}})})}},z={name:"Row Drag",render:()=>{const r=p.useMemo(()=>C(),[]);return a.jsx(D,{note:"Drag rows to reorder within the flattened tree view.",children:a.jsx(f,{columns:R,data:r,dragItem:"row",selection:"row",style:{width:"100%",height:v}})})}},q={name:"Imperative API",render:()=>{const r=p.useRef(null),n=p.useMemo(()=>C().map(s=>({...s,$opened:!1})),[]);return a.jsxs(D,{note:"Imperative ref API: open(id), close(id), openAll(), closeAll().",children:[a.jsx(f,{ref:r,columns:R,data:n,selection:"row",style:{width:"100%",height:v}}),a.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12},children:[a.jsx("button",{type:"button",onClick:()=>{var s;return(s=r.current)==null?void 0:s.openAll()},children:"Open All"}),a.jsx("button",{type:"button",onClick:()=>{var s;return(s=r.current)==null?void 0:s.closeAll()},children:"Close All"}),a.jsx("button",{type:"button",onClick:()=>{var s;return(s=r.current)==null?void 0:s.open("program-beta")},children:"Open Beta"}),a.jsx("button",{type:"button",onClick:()=>{var s;return(s=r.current)==null?void 0:s.close("program-alpha")},children:"Close Alpha"})]})]})}},It=[{id:"name",header:[{text:"Book Name"}],width:300,sortable:!0,resizable:!0},{id:"checked",header:[{text:""}],width:52,align:"center",template:r=>a.jsx("input",{type:"checkbox",checked:!!r,readOnly:!0,style:{width:18,height:18,accentColor:"#1d9bf0"}})},{id:"price",header:[{text:"Price"}],width:100,align:"right"},{id:"shipsIn",header:[{text:"Ships in"}],width:110},{id:"status",header:[{text:"Status"}],width:150,template:r=>{const n=String(r??"").toLowerCase(),s=n==="available"?"#1fb26b":n==="reserved"?"#1d9bf0":"#ff4d4f";return n?a.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[a.jsx("span",{"aria-hidden":"true",style:{width:14,height:14,borderRadius:"999px",background:s,display:"inline-block"}}),a.jsx("span",{style:{color:"#5f6b7a"},children:String(r??"")})]}):null}},{id:"publishingDate",header:[{text:"Publishing date"}],width:160,align:"right"},{id:"cover",header:[{text:"Cover"}],width:120}],jt=[{id:"bestsellers",name:"Bestsellers",$opened:!0,items:[{id:"john-grisham",name:"John Grisham",$opened:!0,items:[{id:"time-to-kill",name:"A Time to Kill",checked:!0,price:"$12.25",shipsIn:"12 hours",status:"available",publishingDate:"05/10/2019 12:00",cover:"Hardcover"},{id:"rainmaker",name:"The Rainmaker",checked:!0,price:"$5.5",shipsIn:"1 hour",status:"reserved",publishingDate:"13/12/2005 12:00",cover:"Paperback"},{id:"partner",name:"The Partner",checked:!1,price:"$11.7",shipsIn:"1 week",publishingDate:"25/11/2017 12:00",cover:"Hardcover"},{id:"firm",name:"The Firm",checked:!0,price:"$6",shipsIn:"24 hours",status:"available",publishingDate:"15/02/2020 12:00",cover:"Paperback"}]},{id:"stephen-king",name:"Stephen King",status:"missing",$opened:!0,items:[{id:"misery",name:"Misery",checked:!1,price:"$5.25",shipsIn:"1 week",status:"missing",publishingDate:"26/10/2014 12:00",cover:"Paperback"},{id:"it",name:"It",checked:!0,price:"$15.75",shipsIn:"1 hour",status:"available",publishingDate:"05/04/2020 12:00",cover:"Hardcover"},{id:"dark-tower",name:"The Dark Tower",checked:!0,price:"$5.33",shipsIn:"2 days",status:"reserved",publishingDate:"08/05/2018 12:00",cover:"Paperback"}]}]},{id:"classics",name:"Classics",$opened:!0,items:[{id:"pushkin",name:"Pushkin",status:"missing",$opened:!0,items:[{id:"onegin",name:"Eugene Onegin",checked:!0,price:"$14.4",shipsIn:"24 hours",status:"available",publishingDate:"05/03/2020 12:00",cover:"Hardcover"},{id:"boris-godunov",name:"Boris Godunov",checked:!1,price:"$8.1",shipsIn:"24 hours",status:"missing",publishingDate:"18/09/2019 12:00",cover:"Paperback"}]},{id:"balzac",name:"Honore De Balzac",status:"missing"}]}],L={name:"Book Library",render:()=>{const r=p.useMemo(()=>JSON.parse(JSON.stringify(jt)),[]);return a.jsx(D,{note:"Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.",children:a.jsx(f,{columns:It,data:r,selection:"row",style:{width:"100%",height:680}})})}},Ct="./img/avatars/",Ye=[{id:"1",name:"Gary Ortiz",ava:"avatar_01.jpg"},{id:"2",name:"Albert Williamson",ava:"avatar_02.jpg"},{id:"3",name:"Mildred Fuller",ava:"avatar_03.jpg"},{id:"4",name:"Russell Robinson",ava:"avatar_04.jpg"},{id:"5",name:"Phyllis Webb",color:"#61C874"},{id:"6",name:"Louise Fisher",color:"#61C504"},{id:"7",name:"Daniel Peterson",color:"#61C456"}],$t=[{name:"Real Estate",owner:"Louise Fisher",start_date:"02/02/2024",end_date:"05/06/2024",status:"Done",hours:92,cost:3588,budget:11768,balance:8180,paid:!0,renewals:"1-2 times",access:"4, 5, 7",project_id:"ISS-124.5"},{name:"HR System",owner:"Daniel Peterson",start_date:"03/03/2024",end_date:"07/02/2024",status:"Done",hours:340,cost:15980,budget:18856,balance:2876,paid:!0,renewals:"1 time",access:"2, 4",project_id:"ISS-900.9"},{name:"Inventory",owner:"Fred Duncan",start_date:"01/01/2024",end_date:"09/01/2024",status:"Done",hours:484,cost:21296,budget:14907,balance:-6389,paid:!1,renewals:"1 time",access:"3, 1, 2",project_id:"ISS-777.4"},{name:"Trip Planner",owner:"Michael Rice",start_date:"01/01/2024",end_date:"11/06/2024",status:"Done",hours:345,cost:14835,budget:70911,balance:56076,paid:!1,renewals:"1-2 times",access:"5, 3, 6",project_id:"ISS-642.2"},{name:"HR System",owner:"Andrew Stewart",start_date:"01/01/2024",end_date:"09/02/2024",status:"Done",hours:57,cost:2052,budget:5068,balance:3016,paid:!0,renewals:"1-2 times",access:"4, 2, 1, 7",project_id:"ISS-256.2"},{name:"HR System",owner:"Martin Thompson",start_date:"02/06/2024",end_date:"06/01/2024",status:"Done",hours:211,cost:8229,budget:16540,balance:8311,paid:!1,renewals:"more than 5 times",access:"3, 5, 2, 6",project_id:"ISS-263.2"},{name:"Ticket System",owner:"Martin Thompson",start_date:"05/06/2025",end_date:"07/03/2025",status:"In Progress",hours:3,cost:144,budget:122,balance:-22,paid:!0,renewals:"1 time",access:"2, 3",project_id:"ISS-634.3"},{name:"Education System",owner:"Mark Harper",start_date:"04/02/2025",end_date:"08/03/2025",status:"In Progress",hours:76,cost:3496,budget:12515,balance:9019,paid:!0,renewals:"more than 5 times",access:"1, 5, 4",project_id:"ISS-256.7"}];function Rt(){return Ye.map(r=>({id:r.id,name:r.name,$opened:!0,items:$t.filter(n=>n.access.split(", ").includes(r.id)).map((n,s)=>({id:`${r.id}_${s}`,...n}))}))}function _t(r){if(!r)return null;const n=String(r).split(", ");return a.jsx("div",{style:{display:"flex",alignItems:"center"},children:n.map(s=>{const l=Ye.find(g=>g.id===s);return l?l.ava?a.jsx("img",{src:`${Ct}${l.ava}`,alt:l.name,width:24,height:24,style:{borderRadius:"50%",border:"1px solid #fff",marginRight:-3,objectFit:"cover",display:"block"}},s):a.jsx("div",{style:{width:24,height:24,borderRadius:"50%",background:l.color??"#999",border:"1px solid #fff",marginRight:-3,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:600,flexShrink:0},children:l.name[0]},s):null})})}function At(r){if(!r)return null;const n=String(r),s=n==="Done"?"#1fb26b":n==="In Progress"?"#1d9bf0":"#ff4d4f";return a.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[a.jsx("span",{style:{width:12,height:12,borderRadius:"50%",background:s,flexShrink:0,display:"inline-block"}}),a.jsx("span",{children:n})]})}function Gt(r,n){if(r==null||r==="")return null;const s=n.balance;if(s===void 0)return null;const l=s>0;return a.jsxs("span",{style:{color:l?"#16a34a":"#dc2626",display:"inline-flex",alignItems:"center",gap:4},children:[a.jsx("span",{children:l?"⬆":"⬇"}),a.jsxs("span",{children:["$",Number(r).toLocaleString()]})]})}const Pt=[{id:"name",header:[{text:"Project"},{content:"inputFilter"}],footer:[{text:"Total"}],minWidth:200,resizable:!0,sortable:!0,editorType:"input"},{id:"paid",header:[{text:"Paid"}],width:60,align:"center"},{id:"access",header:[{text:"Access"},{content:"inputFilter"}],width:160,template:_t},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,editorType:"input",template:At},{id:"owner",header:[{text:"Owner"},{content:"inputFilter"}],width:150,sortable:!0,editorType:"input"},{id:"balance",header:[{text:"Balance"}],footer:[{content:"sum"}],width:130,template:Gt},{id:"hours",header:[{text:"Number of Hours"},{content:"inputFilter"}],footer:[{content:"sum"}],width:150,align:"right",sortable:!0},{id:"renewals",header:[{text:"Number of Renewals"},{content:"inputFilter"}],width:160,editorType:"input"},{id:"start_date",header:[{text:"Start Date"}],width:115,align:"center"},{id:"end_date",header:[{text:"End Date"}],width:115,align:"center"},{id:"cost",header:[{text:"Cost"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"budget",header:[{text:"Budget"},{content:"inputFilter"}],footer:[{content:"sum"}],width:110,align:"right",sortable:!0},{id:"project_id",header:[{text:"Project ID"},{content:"inputFilter"}],width:115,align:"center"}];function Et({dragDrop:r}){const[n]=p.useState(()=>Rt()),[s,l]=p.useState({}),g=p.useCallback((h,x)=>{l(b=>({...b,[h]:!x}))},[]),S=p.useMemo(()=>Pt.map(h=>h.id==="paid"?{...h,template:(x,b)=>{const w=s[b.id]??!!x;return a.jsx("input",{type:"checkbox",checked:w,onChange:()=>g(b.id,w),style:{width:16,height:16,accentColor:"#1d9bf0",cursor:"pointer"}})}}:h),[s,g]);return a.jsx(D,{note:"Users as root rows, their assigned projects as children. Drag to reorder, multiselect, inline edit, header filters, footer sums, avatar access column, status badges, signed balance.",children:a.jsx(f,{columns:S,data:n,dragItem:r?"row":void 0,selection:"row",editable:!0,keyNavigation:!0,multiselection:!0,sortable:!0,style:{width:"100%",height:640}})})}const J={name:"Showcase",args:{dragDrop:!1},argTypes:{dragDrop:{name:"Drag & Drop rows",description:"Enable drag-and-drop row reordering",control:"boolean",table:{defaultValue:{summary:"false"}}}},render:r=>{const{dragDrop:n}=r;return a.jsx(Et,{dragDrop:n})},parameters:{docs:{description:{story:"Users as root rows; projects where each user has access are child rows. Features header filters, footer aggregation sums, custom templates for access avatars, colored status badges, signed balance, drag-row reorder, and multi-row selection."}}}},he=["Alice","Bob","Cara","Dan","Eva","Frank","Grace","Hans"],Ze=Array.from({length:24},(r,n)=>({id:`e${n}`,name:he[n%he.length],dept:["Engineering","HR","Finance"][n%3],status:n%2===0?"active":"inactive",salary:5e4+n*1e3})),et=[{id:"dept",header:[{text:"Department"}],width:160},{id:"status",header:[{text:"Status"}],width:100},{id:"name",header:[{text:"Name"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100}],K={name:"Group By Department",render:()=>a.jsx(ie,{children:a.jsx(f,{data:Ze,columns:et,groupBy:"dept",groupAggregate:{salary:"avg"},style:{height:360,width:"100%"}})})},U={name:"Group By Department & Status",render:()=>a.jsx(ie,{children:a.jsx(f,{data:Ze,columns:et,groupBy:["dept","status"],groupAggregate:{salary:"sum"},style:{height:400,width:"100%"}})})};var ge,fe,be;H.parameters={...H.parameters,docs:{...(ge=H.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
}`,...(be=(fe=H.parameters)==null?void 0:fe.docs)==null?void 0:be.source}}};var we,ye,xe;F.parameters={...F.parameters,docs:{...(we=F.parameters)==null?void 0:we.docs,source:{originalSource:`{
  name: 'Collapsed by Default',
  args: {
    columns: baseColumns,
    data: cloneData(),
    collapsed: true,
    selection: 'row',
    style: {
      width: '100%',
      height: GRID_HEIGHT
    }
  }
}`,...(xe=(ye=F.parameters)==null?void 0:ye.docs)==null?void 0:xe.source}}};var Se,ve,De;B.parameters={...B.parameters,docs:{...(Se=B.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Deep Hierarchy',
  render: () => {
    const data = useMemo(() => buildDeepData(), []);
    return <StoryFrame note="Five levels (program › stream › epic › task › subtask), 471 rows. The first two levels start open; parent hours sum their children.">
        <TreeGrid columns={baseColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(De=(ve=B.parameters)==null?void 0:ve.docs)==null?void 0:De.source}}};var ke,Te,Ie;N.parameters={...N.parameters,docs:{...(ke=N.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(Ie=(Te=N.parameters)==null?void 0:Te.docs)==null?void 0:Ie.source}}};var je,Ce,$e;M.parameters={...M.parameters,docs:{...(je=M.parameters)==null?void 0:je.docs,source:{originalSource:`{
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
}`,...($e=(Ce=M.parameters)==null?void 0:Ce.docs)==null?void 0:$e.source}}};var Re,_e,Ae;O.parameters={...O.parameters,docs:{...(Re=O.parameters)==null?void 0:Re.docs,source:{originalSource:`{
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
}`,...(Ae=(_e=O.parameters)==null?void 0:_e.docs)==null?void 0:Ae.source}}};var Ge,Pe,Ee;z.parameters={...z.parameters,docs:{...(Ge=z.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
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
}`,...(Ee=(Pe=z.parameters)==null?void 0:Pe.docs)==null?void 0:Ee.source}}};var He,Fe,Be;q.parameters={...q.parameters,docs:{...(He=q.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...(Be=(Fe=q.parameters)==null?void 0:Fe.docs)==null?void 0:Be.source}}};var Ne,Me,Oe;L.parameters={...L.parameters,docs:{...(Ne=L.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
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
}`,...(Oe=(Me=L.parameters)==null?void 0:Me.docs)==null?void 0:Oe.source}}};var ze,qe,Le;J.parameters={...J.parameters,docs:{...(ze=J.parameters)==null?void 0:ze.docs,source:{originalSource:`{
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
}`,...(Le=(qe=J.parameters)==null?void 0:qe.docs)==null?void 0:Le.source}}};var Je,Ke,Ue;K.parameters={...K.parameters,docs:{...(Je=K.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  name: 'Group By Department',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy="dept" groupAggregate={{
      salary: 'avg'
    }} style={{
      height: 360,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Ue=(Ke=K.parameters)==null?void 0:Ke.docs)==null?void 0:Ue.source}}};var Ve,We,Qe;U.parameters={...U.parameters,docs:{...(Ve=U.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  name: 'Group By Department & Status',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy={['dept', 'status']} groupAggregate={{
      salary: 'sum'
    }} style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Qe=(We=U.parameters)==null?void 0:We.docs)==null?void 0:Qe.source}}};const Jt=["Default","CollapsedStart","DeepHierarchy","WithHeaderFilters","SortingAndSelection","EditableRows","RowDrag","ImperativeApi","BookLibraryExample","DHtmlxShowcase","GroupByDepartment","MultiLevelGroupBy"];export{L as BookLibraryExample,F as CollapsedStart,J as DHtmlxShowcase,B as DeepHierarchy,H as Default,O as EditableRows,K as GroupByDepartment,q as ImperativeApi,U as MultiLevelGroupBy,z as RowDrag,M as SortingAndSelection,N as WithHeaderFilters,Jt as __namedExportsOrder,Lt as default};
