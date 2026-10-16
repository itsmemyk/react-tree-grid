import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CXOcBcs0.js";import{e as k,f as M,T as dt}from"./DragManager-Dby8_QFd.js";import{u as lt}from"./useTreeStore-BCe7Hr5K.js";import"./_commonjsHelpers-CqkleIqs.js";const Ae=4;function ct(d){const t=s.useRef(d),n=s.useRef({});return t.current=d,s.useEffect(()=>{const c=(f,v)=>{var p,y;const x=v;x.start===t.current.id&&x.componentId===t.current.componentId&&((y=(p=t.current).onDragStart)==null||y.call(p,x))},b=f=>{var x,p;const v=f;v.start===t.current.id&&((p=(x=t.current).onAfterDrag)==null||p.call(x,v))},C=f=>{var x,p;const v=f;v.start===t.current.id&&((p=(x=t.current).onCancelDrop)==null||p.call(x,v))};return k.events.on(M.dragStart,c,n.current),k.events.on(M.afterDrag,b,n.current),k.events.on(M.cancelDrop,C,n.current),()=>{k.events.detach(M.dragStart,n.current),k.events.detach(M.afterDrag,n.current),k.events.detach(M.cancelDrop,n.current)}},[]),{draggableProps:{onPointerDown:c=>{var R,_;if(t.current.disabled||c.button!==0)return;const b=c.nativeEvent,C=((_=(R=t.current).getInitialOffset)==null?void 0:_.call(R,c))??{x:0,y:0};let f=!1;const v=()=>{const w=typeof t.current.ghost=="function"?t.current.ghost():t.current.ghost??null;return f=k.dragStart(b,{id:t.current.id,source:t.current.source,type:t.current.type,ghost:w,initXOffset:C.x,initYOffset:C.y},{componentId:t.current.componentId})!==null,f},x=()=>{window.removeEventListener("pointermove",p),window.removeEventListener("pointerup",y),window.removeEventListener("pointercancel",B),window.removeEventListener("keydown",N,!0)},p=w=>{if(!f){const D=w.clientX-b.clientX,I=w.clientY-b.clientY;if(D*D+I*I<Ae*Ae)return;if(!v()){x();return}}k.drag(w)},y=w=>{if(x(),!f)return;k.drop(w);const D=I=>{I.stopPropagation(),I.preventDefault()};window.addEventListener("click",D,{capture:!0,once:!0}),setTimeout(()=>window.removeEventListener("click",D,!0),0)},B=()=>{x(),f&&k.cancelDrop()},N=w=>{w.key==="Escape"&&(f&&(w.preventDefault(),w.stopPropagation(),k.cancelDrop()),x())};window.addEventListener("pointermove",p),window.addEventListener("pointerup",y),window.addEventListener("pointercancel",B),window.addEventListener("keydown",N,!0)}}}}function ut(d){const t=s.useRef(null),n=s.useRef(d),c=s.useRef({});return n.current=d,s.useEffect(()=>{const b=t.current;if(!b||n.current.disabled)return;const C={id:n.current.id,componentId:n.current.componentId,element:b,mode:n.current.mode,type:n.current.type,accepts:n.current.accepts,getDropPosition:n.current.getDropPosition,canDrop:n.current.canDrop},f=k.registerTarget(C),v=x=>{var y,B;const p=x;p.target===n.current.id&&((B=(y=n.current).onDrop)==null||B.call(y,p))};return k.events.on(M.afterDrop,v,c.current),()=>{f(),k.events.detach(M.afterDrop,c.current)}},[d.disabled]),{targetRef:t}}const pt="_tree_eopdd_1",mt="_rowWrap_eopdd_12",ft="_row_eopdd_12",gt="_rowSelected_eopdd_36",ht="_rowDraggable_eopdd_41",bt="_rowDisabled_eopdd_46",xt="_toggle_eopdd_51",vt="_icon_eopdd_61",yt="_label_eopdd_66",wt="_editInput_eopdd_71",kt="_dropTop_eopdd_80",Dt="_dropBottom_eopdd_81",Ct="_dropIn_eopdd_82",It="_dragGhost_eopdd_108",T={tree:pt,rowWrap:mt,row:ft,rowSelected:gt,rowDraggable:ht,rowDisabled:bt,toggle:xt,icon:vt,label:yt,editInput:wt,dropTop:kt,dropBottom:Dt,dropIn:Ct,dragGhost:It},St=700;function Qe(d){return d.map(t=>({...t,items:t.items?Qe(t.items):void 0}))}function Ze(d,t=new Set){var n;for(const c of d)c.$opened&&t.add(c.id),(n=c.items)!=null&&n.length&&Ze(c.items,t);return t}function Pe(d,t){const n=t.getBoundingClientRect(),c=d-n.top;return c<n.height*.25?"top":c>n.height*.75?"bottom":"in"}const oe=s.forwardRef(function(t,n){var _e;const{data:c,checkbox:b=!1,editable:C=!1,dragItem:f,expanded:v,defaultExpanded:x,selected:p,checked:y,css:B,style:N,onSelect:R,onCheck:_,onExpand:w,onCollapse:D,onEdit:I,onDrop:U}=t,O=s.useId(),Y=s.useMemo(()=>Qe(c),[c]),se=lt({data:Y}),{store:i}=se,S=i.getRoot(),[ie,de]=s.useState(()=>new Set(x??Array.from(Ze(c)))),[le,ee]=s.useState(()=>new Set(p??[])),[ce,L]=s.useState(()=>new Set(y??[])),[G,we]=s.useState(null),$=s.useRef(null),z=s.useCallback(e=>{$.current=e,we(e)},[]),[te,K]=s.useState(""),[F,o]=s.useState(null),[A,W]=s.useState(null),ke=s.useRef(new Map),ue=v!==void 0,pe=p!==void 0,me=y!==void 0,Ie=s.useRef(!0);s.useEffect(()=>{if(Ie.current){Ie.current=!1;return}i.parse(Y)},[Y,i]),s.useEffect(()=>{p!==void 0&&ee(new Set(p))},[p]),s.useEffect(()=>{y!==void 0&&L(new Set(y))},[y]);const E=s.useMemo(()=>ue?new Set(v):ie,[v,ie,ue]),et=s.useMemo(()=>pe?new Set(p):le,[pe,p,le]),ne=s.useMemo(()=>me?new Set(y):ce,[y,ce,me]),Se=se.items,j=s.useMemo(()=>{const e=[],r=(l,u)=>{const h=i.getItems(l);h.forEach((g,m)=>{const q=i.haveItems(g.id);e.push({item:g,level:u,hasChildren:q,posInSet:m+1,setSize:h.length}),q&&E.has(g.id)&&r(g.id,u+1)})};return r(S,0),e},[E,S,i,Se]),De=s.useMemo(()=>{const e=new Map;if(!b)return e;const r=l=>{const u=i.getItems(l).filter(m=>!m.disabled);if(!u.length){const m=ne.has(l);return e.set(l,m),m}const h=u.map(m=>r(m.id));let g;return h.every(m=>m===!0)?g=!0:h.some(m=>m!==!1)?g="mixed":g=!1,e.set(l,g),g};for(const l of i.getItems(S))r(l.id);return i.forEach(l=>{e.has(l.id)||e.set(l.id,ne.has(l.id))}),e},[b,ne,S,i,Se]),V=s.useCallback((e,r,l)=>{ue||de(new Set(e)),r!==void 0&&(l?w==null||w(r):D==null||D(r))},[ue,w,D]),P=s.useCallback((e,r)=>{if(E.has(e)===r||!i.haveItems(e))return;const l=new Set(E);r?l.add(e):l.delete(e),V(l,e,r)},[V,E,i]),tt=s.useCallback(e=>{P(e,!E.has(e))},[E,P]),re=s.useCallback(e=>{var r;(r=i.getItem(e))!=null&&r.disabled||(pe||ee(new Set([e])),R==null||R(e))},[pe,R,i]),fe=s.useCallback(e=>{me||L(new Set(e)),_==null||_(e)},[me,_]),Ee=s.useCallback(e=>{const r=i.getItem(e);if(!r||r.disabled)return;const l=De.get(e)!==!0,u=new Set(ne),h=q=>{l?u.add(q):u.delete(q)},g=q=>{h(q);for(const X of i.getItems(q))X.disabled||g(X.id)};g(e);let m=i.getParent(e);for(;m&&m!==S;)i.getItems(m).filter(X=>!X.disabled).every(X=>u.has(X.id))?u.add(m):u.delete(m),m=i.getParent(m);fe(Array.from(u))},[fe,De,ne,S,i]),H=s.useCallback(e=>{var r;W(e),(r=ke.current.get(e))==null||r.focus()},[]),je=s.useCallback(e=>{const r=i.getItem(e);!C||!r||r.disabled||(z(e),K(String(r.value??"")))},[C,z,i]),nt=s.useCallback(()=>{var l;const e=$.current;if(!e)return;const r=te.trim();r&&r!==((l=i.getItem(e))==null?void 0:l.value)&&(i.update(e,{value:r}),I==null||I(e,r)),z(null)},[te,I,z,i]),Ce=s.useCallback((e,r)=>!e||e.componentId!==O?!1:i.exists(e.start)&&i.canCopy(e.start,r),[O,i]),rt=s.useCallback((e,r,l)=>{if(!Ce(k.transfer??{start:e,componentId:O},r))return;let u;if(l==="in")u=i.move(e,-1,void 0,r),P(r,!0);else{const h=i.getParent(r)??S;let g=i.getIndex(r)+(l==="bottom"?1:0);i.getParent(e)===h&&i.getIndex(e)<g&&(g-=1),u=i.move(e,g,void 0,h)}o(null),u!==null&&(U==null||U(e,r,l==="top"?"before":l==="bottom"?"after":"inside"))},[Ce,O,U,S,P,i]);s.useEffect(()=>{const e={};return k.events.on(M.afterDrag,()=>o(null),e),()=>k.events.detach(M.afterDrag,e)},[]);const ae=(F==null?void 0:F.position)==="in"?F.target:null;s.useEffect(()=>{if(!ae||E.has(ae)||!i.haveItems(ae))return;const e=window.setTimeout(()=>P(ae,!0),St);return()=>window.clearTimeout(e)},[ae,E,P,i]);const Te=s.useCallback(e=>{const r=new Set(E);let l=!1;for(const u of e){let h=i.exists(u)?i.getParent(u):null;for(;h&&h!==S;)r.has(h)||(r.add(h),l=!0),h=i.getParent(h)}l&&V(r)},[V,E,S,i]);s.useImperativeHandle(n,()=>({expand:e=>P(e,!0),collapse:e=>P(e,!1),expandAll:()=>{const e=new Set;i.forEach(r=>{i.haveItems(r.id)&&e.add(r.id)}),V(e)},collapseAll:()=>V(new Set),select:e=>{e[0]&&(Te([e[0]]),re(e[0]),W(e[0]))},check:e=>fe(e)}),[fe,V,re,Te,P,i]);const at=e=>{if(G!==null||!j.length)return;const r=Math.max(0,j.findIndex(m=>m.item.id===A)),l=j[r],u=l.item.id,h=E.has(u);let g=!0;switch(e.key){case"ArrowDown":H(j[Math.min(r+1,j.length-1)].item.id);break;case"ArrowUp":H(j[Math.max(r-1,0)].item.id);break;case"Home":H(j[0].item.id);break;case"End":H(j[j.length-1].item.id);break;case"ArrowRight":l.hasChildren&&!h?P(u,!0):l.hasChildren&&H(j[r+1].item.id);break;case"ArrowLeft":{if(l.hasChildren&&h)P(u,!1);else{const m=i.getParent(u);m&&m!==S&&H(m)}break}case"Enter":re(u);break;case" ":b?Ee(u):re(u);break;case"F2":je(u);break;default:g=!1}g&&e.preventDefault()},ot=j.some(e=>e.item.id===A)?A:((_e=j[0])==null?void 0:_e.item.id)??null,st=!!f,it=f==="both";return a.jsx("div",{className:[T.tree,B].filter(Boolean).join(" "),style:N,role:"tree",onKeyDown:at,children:j.map(({item:e,level:r,hasChildren:l,posInSet:u,setSize:h})=>a.jsx(Et,{componentId:O,item:e,level:r,posInSet:u,setSize:h,hasChildren:l,expanded:E.has(e.id),selected:et.has(e.id),checkState:b?De.get(e.id)??!1:void 0,tabbable:ot===e.id,editable:C,draggable:st,dropTarget:it,editing:G===e.id,draftValue:te,dropIndicator:F,canDropOn:Ce,rowRef:g=>{g?ke.current.set(e.id,g):ke.current.delete(e.id)},onFocus:()=>W(e.id),onToggle:()=>tt(e.id),onSelect:()=>re(e.id),onCheck:()=>Ee(e.id),onBeginEdit:()=>je(e.id),onDraftChange:K,onCommitEdit:g=>{nt(),g&&H(e.id)},onCancelEdit:()=>{z(null),H(e.id)},onDropIndicatorChange:o,onDrop:rt},e.id))})});function Et(d){const{componentId:t,item:n,level:c,posInSet:b,setSize:C,hasChildren:f,expanded:v,selected:x,checkState:p,tabbable:y,editable:B,draggable:N,dropTarget:R,editing:_,draftValue:w,dropIndicator:D,canDropOn:I,rowRef:U,onFocus:O,onToggle:Y,onSelect:se,onCheck:i,onBeginEdit:S,onDraftChange:ie,onCommitEdit:de,onCancelEdit:le,onDropIndicatorChange:ee,onDrop:ce}=d,L=!!n.disabled,G=s.useRef(null),{draggableProps:we}=ct({id:n.id,componentId:t,type:"group",disabled:!N||L||_,ghost:()=>{const o=document.createElement("div");return o.className=T.dragGhost,o.textContent=n.value,o}}),{targetRef:$}=ut({id:n.id,componentId:t,accepts:["group"],disabled:!R||L,getDropPosition:(o,A)=>Pe(o.clientY,A),canDrop:o=>I(o,n.id),onDrop:o=>{o.target&&o.dropPosition&&ce(o.start,o.target,o.dropPosition)}});s.useEffect(()=>{G.current&&(G.current.indeterminate=p==="mixed")},[p]);const z=()=>{ee(o=>(o==null?void 0:o.target)===n.id?null:o)},te=o=>{if(!R||L||!$.current)return;if(!I(k.transfer,n.id)){z();return}const A=Pe(o.clientY,$.current);ee(W=>(W==null?void 0:W.target)===n.id&&W.position===A?W:{target:n.id,position:A})},K=o=>o.stopPropagation(),F=o=>{var A;o.preventDefault(),(A=$.current)==null||A.focus()};return a.jsx("div",{ref:o=>{$.current=o,U(o)},className:[T.rowWrap,(D==null?void 0:D.target)===n.id?T[`drop${jt(D.position)}`]:""].filter(Boolean).join(" "),"data-rgs-tree-id":n.id,role:"treeitem",tabIndex:y?0:-1,"aria-level":c+1,"aria-posinset":b,"aria-setsize":C,"aria-expanded":f?v:void 0,"aria-selected":x,"aria-checked":p===void 0?void 0:p,"aria-disabled":L||void 0,style:{paddingInlineStart:`${c*18}px`},onFocus:o=>{o.target===o.currentTarget&&O()},onPointerMove:te,onPointerLeave:z,children:a.jsxs("div",{className:[T.row,N?T.rowDraggable:"",x?T.rowSelected:"",L?T.rowDisabled:""].filter(Boolean).join(" "),onClick:se,onDoubleClick:()=>{B?S():f&&Y()},onPointerDown:o=>{!N||_||o.target.closest("button, input")||we.onPointerDown(o)},children:[a.jsx("button",{type:"button",className:T.toggle,tabIndex:-1,"aria-hidden":f?void 0:!0,onClick:o=>{o.stopPropagation(),f&&Y()},onDoubleClick:K,onMouseDown:F,"aria-label":f?v?"Collapse node":"Expand node":void 0,children:f?v?"▾":"▸":""}),p!==void 0?a.jsx("input",{ref:G,type:"checkbox",tabIndex:-1,checked:p===!0,disabled:L,"aria-label":n.value,onChange:o=>{o.stopPropagation(),i()},onClick:o=>o.stopPropagation(),onDoubleClick:K,onMouseDown:F}):null,n.icon?a.jsx("span",{className:T.icon,children:n.icon}):null,_?a.jsx("input",{autoFocus:!0,className:T.editInput,value:w,"aria-label":"Edit node label",onChange:o=>ie(o.target.value),onBlur:()=>de(!1),onClick:o=>o.stopPropagation(),onDoubleClick:K,onKeyDown:o=>{o.stopPropagation(),(o.key==="Enter"||o.key==="Tab")&&(o.preventDefault(),de(!0)),o.key==="Escape"&&le()}}):a.jsx("span",{className:T.label,children:n.value})]})})}function jt(d){return d.charAt(0).toUpperCase()+d.slice(1)}oe.__docgenInfo={description:"",methods:[{name:"expand",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"collapse",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"expandAll",docblock:null,modifiers:[],params:[],returns:null},{name:"collapseAll",docblock:null,modifiers:[],params:[],returns:null},{name:"select",docblock:null,modifiers:[],params:[{name:"ids",optional:!1,type:{name:"Array",elements:[{name:"string"}],raw:"string[]"}}],returns:null},{name:"check",docblock:null,modifiers:[],params:[{name:"ids",optional:!1,type:{name:"Array",elements:[{name:"string"}],raw:"string[]"}}],returns:null}],displayName:"Tree",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"TreeNode"}],raw:"TreeNode[]"},description:""},checkbox:{required:!1,tsType:{name:"boolean"},description:""},editable:{required:!1,tsType:{name:"boolean"},description:""},dragItem:{required:!1,tsType:{name:"union",raw:"'item' | 'both'",elements:[{name:"literal",value:"'item'"},{name:"literal",value:"'both'"}]},description:"'item' = item is drag source only; 'both' = item is source and drop target"},virtual:{required:!1,tsType:{name:"boolean"},description:""},expanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},defaultExpanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},selected:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},checked:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},css:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"CSSProperties"},description:""},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onCheck:{required:!1,tsType:{name:"signature",type:"function",raw:"(ids: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"ids"}],return:{name:"void"}}},description:"Fires with every checked id; checking a node also checks its enabled descendants"},onExpand:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onCollapse:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onEdit:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string, newValue: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"},{type:{name:"string"},name:"newValue"}],return:{name:"void"}}},description:""},onDrop:{required:!1,tsType:{name:"signature",type:"function",raw:"(dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => void",signature:{arguments:[{type:{name:"string"},name:"dragId"},{type:{name:"string"},name:"targetId"},{type:{name:"union",raw:"'before' | 'after' | 'inside'",elements:[{name:"literal",value:"'before'"},{name:"literal",value:"'after'"},{name:"literal",value:"'inside'"}]},name:"position"}],return:{name:"void"}}},description:""}}};const Bt={title:"Tree",component:oe,decorators:[d=>a.jsx(dt,{children:a.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif"},children:a.jsx(d,{})})})],parameters:{layout:"fullscreen"}};function J({open:d}){return a.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:d?"#f59e0b":"#94a3b8",children:d?a.jsx("path",{d:"M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"}):a.jsx("path",{d:"M3 7a2 2 0 012-2h3.586l2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"})})}function Q(){return a.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"#64748b",children:a.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z"})})}function Re(){return a.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"#64748b",children:a.jsx("path",{d:"M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"})})}const Z=[{id:"mail",value:"Mail",icon:a.jsx(J,{open:!0}),$opened:!0,items:[{id:"inbox",value:"Inbox",icon:a.jsx(Q,{})},{id:"sent",value:"Sent",icon:a.jsx(Q,{})},{id:"drafts",value:"Drafts",icon:a.jsx(Q,{})},{id:"spam",value:"Spam",icon:a.jsx(Q,{}),disabled:!0}]},{id:"team",value:"Team",icon:a.jsx(J,{}),items:[{id:"alice",value:"Alice",icon:a.jsx(Re,{})},{id:"bob",value:"Bob",icon:a.jsx(Re,{})},{id:"projects",value:"Projects",icon:a.jsx(J,{}),items:[{id:"proj-alpha",value:"Alpha",icon:a.jsx(Q,{})},{id:"proj-beta",value:"Beta",icon:a.jsx(Q,{})}]}]},{id:"archive",value:"Archive",icon:a.jsx(J,{}),items:[{id:"archive-2023",value:"2023",icon:a.jsx(J,{})},{id:"archive-2024",value:"2024",icon:a.jsx(J,{})}]}];function Tt(){function d(t){const{items:n,...c}=t;return n?{...c,items:n.map(d)}:{...c}}return Z.map(d)}const ge={name:"Basic Usage",args:{data:Z,style:{width:280,minHeight:300}},parameters:{docs:{description:{story:"Basic tree with icons, nested items, and one disabled leaf."}}}},he={name:"With Checkboxes",args:{data:Z,checkbox:!0,style:{width:280}}},be={name:"Editable",args:{data:Z,editable:!0,checkbox:!0,style:{width:280}},parameters:{docs:{description:{story:"Double-click a label to edit it inline. Press Enter to commit, Escape to cancel."}}}},xe={name:"Draggable",render:()=>{const[d,t]=s.useState([]),[n]=s.useState(Tt);return a.jsxs("div",{style:{display:"flex",gap:24,alignItems:"flex-start"},children:[a.jsx(oe,{data:n,dragItem:"both",style:{width:280},onDrop:(c,b,C)=>{t(f=>[`drop "${c}" ${C} "${b}"`,...f.slice(0,4)])}}),a.jsxs("div",{style:{fontSize:12,color:"#64748b",minWidth:200},children:[a.jsx("div",{style:{marginBottom:6,fontWeight:600},children:"Drop log"}),d.length===0?a.jsx("div",{style:{fontStyle:"italic"},children:"Drag a node to see events"}):d.map((c,b)=>a.jsx("div",{children:c},b))]})]})},parameters:{docs:{description:{story:'dragItem="both" — nodes are draggable sources and drop targets.'}}}},ve={name:"Controlled Expansion",render:()=>{const[d,t]=s.useState(["mail"]);return a.jsxs("div",{style:{display:"flex",gap:24,alignItems:"flex-start"},children:[a.jsx(oe,{data:Z,expanded:d,onExpand:n=>t(c=>[...c,n]),onCollapse:n=>t(c=>c.filter(b=>b!==n)),style:{width:280}}),a.jsxs("div",{style:{fontSize:12,color:"#64748b",minWidth:140},children:[a.jsx("div",{style:{marginBottom:6,fontWeight:600},children:"expanded"}),d.length===0?a.jsx("div",{style:{fontStyle:"italic"},children:"none"}):d.map(n=>a.jsx("div",{children:n},n))]})]})},parameters:{docs:{description:{story:"Controlled mode — the parent owns expanded state. onExpand/onCollapse fire with the single toggled id."}}}},ye={name:"Imperative API",render:()=>{const d=s.useRef(null);return a.jsxs("div",{style:{width:280},children:[a.jsx(oe,{ref:d,data:Z,checkbox:!0,editable:!0}),a.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12,flexWrap:"wrap"},children:[a.jsx("button",{type:"button",onClick:()=>{var t;return(t=d.current)==null?void 0:t.expandAll()},children:"Expand all"}),a.jsx("button",{type:"button",onClick:()=>{var t;return(t=d.current)==null?void 0:t.collapseAll()},children:"Collapse all"}),a.jsx("button",{type:"button",onClick:()=>{var t;return(t=d.current)==null?void 0:t.expand("team")},children:"Expand Team"}),a.jsx("button",{type:"button",onClick:()=>{var t;return(t=d.current)==null?void 0:t.collapse("mail")},children:"Collapse Mail"}),a.jsx("button",{type:"button",onClick:()=>{var t;return(t=d.current)==null?void 0:t.select(["inbox"])},children:"Select Inbox"}),a.jsx("button",{type:"button",onClick:()=>{var t;return(t=d.current)==null?void 0:t.check(["inbox","sent"])},children:"Check Inbox+Sent"})]})]})},parameters:{docs:{description:{story:"Imperative ref API: expand, collapse, expandAll, collapseAll, select, check."}}}};var Me,Be,Le;ge.parameters={...ge.parameters,docs:{...(Me=ge.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  name: 'Basic Usage',
  args: {
    data: mailData,
    style: {
      width: 280,
      minHeight: 300
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic tree with icons, nested items, and one disabled leaf.'
      }
    }
  }
}`,...(Le=(Be=ge.parameters)==null?void 0:Be.docs)==null?void 0:Le.source}}};var We,qe,Ne;he.parameters={...he.parameters,docs:{...(We=he.parameters)==null?void 0:We.docs,source:{originalSource:`{
  name: 'With Checkboxes',
  args: {
    data: mailData,
    checkbox: true,
    style: {
      width: 280
    }
  }
}`,...(Ne=(qe=he.parameters)==null?void 0:qe.docs)==null?void 0:Ne.source}}};var ze,Fe,He;be.parameters={...be.parameters,docs:{...(ze=be.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  name: 'Editable',
  args: {
    data: mailData,
    editable: true,
    checkbox: true,
    style: {
      width: 280
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Double-click a label to edit it inline. Press Enter to commit, Escape to cancel.'
      }
    }
  }
}`,...(He=(Fe=be.parameters)==null?void 0:Fe.docs)==null?void 0:He.source}}};var Oe,$e,Ve;xe.parameters={...xe.parameters,docs:{...(Oe=xe.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  name: 'Draggable',
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    // Keep one copy: a new array each render would reload the tree and undo the drop
    const [data] = useState(cloneData);
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <Tree data={data} dragItem="both" style={{
        width: 280
      }} onDrop={(dragId, targetId, position) => {
        setLog(prev => [\`drop "\${dragId}" \${position} "\${targetId}"\`, ...prev.slice(0, 4)]);
      }} />
        <div style={{
        fontSize: 12,
        color: '#64748b',
        minWidth: 200
      }}>
          <div style={{
          marginBottom: 6,
          fontWeight: 600
        }}>Drop log</div>
          {log.length === 0 ? <div style={{
          fontStyle: 'italic'
        }}>Drag a node to see events</div> : log.map((entry, i) => <div key={i}>{entry}</div>)}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'dragItem="both" — nodes are draggable sources and drop targets.'
      }
    }
  }
}`,...(Ve=($e=xe.parameters)==null?void 0:$e.docs)==null?void 0:Ve.source}}};var Ue,Ye,Ge;ve.parameters={...ve.parameters,docs:{...(Ue=ve.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  name: 'Controlled Expansion',
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['mail']);
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <Tree data={mailData} expanded={expanded} onExpand={id => setExpanded(prev => [...prev, id])} onCollapse={id => setExpanded(prev => prev.filter(x => x !== id))} style={{
        width: 280
      }} />
        <div style={{
        fontSize: 12,
        color: '#64748b',
        minWidth: 140
      }}>
          <div style={{
          marginBottom: 6,
          fontWeight: 600
        }}>expanded</div>
          {expanded.length === 0 ? <div style={{
          fontStyle: 'italic'
        }}>none</div> : expanded.map(id => <div key={id}>{id}</div>)}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode — the parent owns expanded state. onExpand/onCollapse fire with the single toggled id.'
      }
    }
  }
}`,...(Ge=(Ye=ve.parameters)==null?void 0:Ye.docs)==null?void 0:Ge.source}}};var Ke,Xe,Je;ye.parameters={...ye.parameters,docs:{...(Ke=ye.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  name: 'Imperative API',
  render: () => {
    const ref = useRef<TreeRef>(null);
    return <div style={{
      width: 280
    }}>
        <Tree ref={ref} data={mailData} checkbox editable />
        <div style={{
        display: 'flex',
        gap: 8,
        paddingTop: 12,
        flexWrap: 'wrap'
      }}>
          <button type="button" onClick={() => ref.current?.expandAll()}>Expand all</button>
          <button type="button" onClick={() => ref.current?.collapseAll()}>Collapse all</button>
          <button type="button" onClick={() => ref.current?.expand('team')}>Expand Team</button>
          <button type="button" onClick={() => ref.current?.collapse('mail')}>Collapse Mail</button>
          <button type="button" onClick={() => ref.current?.select(['inbox'])}>Select Inbox</button>
          <button type="button" onClick={() => ref.current?.check(['inbox', 'sent'])}>Check Inbox+Sent</button>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Imperative ref API: expand, collapse, expandAll, collapseAll, select, check.'
      }
    }
  }
}`,...(Je=(Xe=ye.parameters)==null?void 0:Xe.docs)==null?void 0:Je.source}}};const Lt=["Default","WithCheckboxes","Editable","Draggable","ControlledExpansion","ImperativeApi"];export{ve as ControlledExpansion,ge as Default,xe as Draggable,be as Editable,ye as ImperativeApi,he as WithCheckboxes,Lt as __namedExportsOrder,Bt as default};
