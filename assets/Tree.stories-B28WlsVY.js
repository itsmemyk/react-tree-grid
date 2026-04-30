import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CXOcBcs0.js";import{d as b,e as I}from"./DragManager-Cl1AKh51.js";import{u as Me}from"./useTreeStore-BEOdTLmG.js";import"./_commonjsHelpers-CqkleIqs.js";function Le(a){const e=s.useRef(a),t=s.useRef({});return e.current=a,s.useEffect(()=>{const o=(x,u)=>{var l,p;const g=u;g.start===e.current.id&&g.componentId===e.current.componentId&&((p=(l=e.current).onDragStart)==null||p.call(l,g))},m=x=>{var g,l;const u=x;u.start===e.current.id&&((l=(g=e.current).onAfterDrag)==null||l.call(g,u))},f=x=>{var g,l;const u=x;u.start===e.current.id&&((l=(g=e.current).onCancelDrop)==null||l.call(g,u))};return b.events.on(I.dragStart,o,t.current),b.events.on(I.afterDrag,m,t.current),b.events.on(I.cancelDrop,f,t.current),()=>{b.events.detach(I.dragStart,t.current),b.events.detach(I.afterDrag,t.current),b.events.detach(I.cancelDrop,t.current)}},[]),{draggableProps:{onPointerDown:o=>{var l,p;if(e.current.disabled)return;const m=typeof e.current.ghost=="function"?e.current.ghost():e.current.ghost??null,f=((p=(l=e.current).getInitialOffset)==null?void 0:p.call(l,o))??{x:0,y:0};if(!b.dragStart(o.nativeEvent,{id:e.current.id,source:e.current.source,type:e.current.type,ghost:m,initXOffset:f.x,initYOffset:f.y},{componentId:e.current.componentId}))return;const u=S=>{b.drag(S)},g=S=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",g),b.drop(S)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",g,{once:!0})}}}}function $e(a){const e=s.useRef(null),t=s.useRef(a),o=s.useRef({});return t.current=a,s.useEffect(()=>{const m=e.current;if(!m||t.current.disabled)return;const f={id:t.current.id,componentId:t.current.componentId,element:m,mode:t.current.mode,type:t.current.type,accepts:t.current.accepts,getDropPosition:t.current.getDropPosition,canDrop:t.current.canDrop},x=b.registerTarget(f),u=g=>{var p,S;const l=g;l.target===t.current.id&&((S=(p=t.current).onDrop)==null||S.call(p,l))};return b.events.on(I.afterDrop,u,o.current),()=>{x(),b.events.detach(I.afterDrop,o.current)}},[a.disabled]),{targetRef:e}}const Ve="_tree_9j8qk_1",He="_rowWrap_9j8qk_12",Oe="_row_9j8qk_12",Ye="_rowSelected_9j8qk_27",Ge="_rowDisabled_9j8qk_31",Fe="_toggle_9j8qk_36",Ue="_icon_9j8qk_46",Xe="_label_9j8qk_51",Je="_editInput_9j8qk_56",Ke="_dropTop_9j8qk_65",Qe="_dropBottom_9j8qk_66",Ze="_dropIn_9j8qk_67",et="_dragGhost_9j8qk_93",w={tree:Ve,rowWrap:He,row:Oe,rowSelected:Ye,rowDisabled:Ge,toggle:Fe,icon:Ue,label:Xe,editInput:Je,dropTop:Ke,dropBottom:Qe,dropIn:Ze,dragGhost:et};function Ie(a){return a.map(e=>({...e,items:e.items?Ie(e.items):void 0}))}function De(a,e=new Set){var t;for(const o of a)o.$opened&&e.add(o.id),(t=o.items)!=null&&t.length&&De(o.items,e);return e}function Ee(a,e=new Set){var t;for(const o of a)(t=o.items)!=null&&t.length&&(e.add(o.id),Ee(o.items,e));return e}const H=s.forwardRef(function(e,t){const{data:o,checkbox:m=!1,editable:f=!1,dragItem:x,expanded:u,defaultExpanded:g,selected:l,checked:p,css:S,onSelect:_,onCheck:k,onExpand:T,onCollapse:A,onEdit:q,onDrop:R}=e,K=s.useId(),B=s.useMemo(()=>Ie(o),[o]),D=Me({data:B}),{store:c}=D,P=c.getRoot(),[j,O]=s.useState(()=>new Set(g??Array.from(De(o)))),[V,i]=s.useState(()=>new Set(l??[])),[W,v]=s.useState(()=>new Set(p??[])),[h,N]=s.useState(null),[z,re]=s.useState(""),[_e,ae]=s.useState(null),Q=u!==void 0,Z=l!==void 0,ee=p!==void 0;s.useEffect(()=>{c.parse(B)},[B,c]),s.useEffect(()=>{u!==void 0&&O(new Set(u))},[u]),s.useEffect(()=>{l!==void 0&&i(new Set(l))},[l]),s.useEffect(()=>{p!==void 0&&v(new Set(p))},[p]);const Te=s.useMemo(()=>D.flatten(D.getItems(P)),[P,D,D.items]),E=s.useCallback((r,d,y)=>{c.forEach(C=>{c.update(C.id,{$opened:r.has(C.id)},!0)}),Q||O(new Set(r)),d!==void 0&&(y?T==null||T(d):A==null||A(d))},[Q,T,A,c]),Ae=s.useCallback(r=>{const d=new Set(j),y=!d.has(r);y?d.add(r):d.delete(r),E(d,r,y)},[E,j]),te=s.useCallback(r=>{Z||i(new Set([r])),_==null||_(r)},[Z,_]),ne=s.useCallback(r=>{ee||v(new Set(r)),k==null||k(r)},[ee,k]),qe=s.useCallback(r=>{const d=c.getItem(r);!f||!d||(N(r),re(String(d.value??"")))},[f,c]),Re=s.useCallback(()=>{h&&(c.update(h,{value:z}),q==null||q(h,z),N(null))},[z,h,q,c]),Be=s.useCallback((r,d,y)=>{if(r!==d){if(y==="in")c.move(r,-1,void 0,d);else{const C=c.getParent(d)??P,se=c.getIndex(d),ze=y==="top"?se:se+1;c.move(r,ze,void 0,C)}R==null||R(r,d,y==="top"?"before":y==="bottom"?"after":"inside"),ae(null)}},[R,P,c]);s.useImperativeHandle(t,()=>({expand:r=>{const d=new Set(j);d.add(r),E(d,r,!0)},collapse:r=>{const d=new Set(j);d.delete(r),E(d,r,!1)},expandAll:()=>E(Ee(c.serialize())),collapseAll:()=>E(new Set),select:r=>{r[0]&&te(r[0])},check:r=>ne(r)}),[ne,E,te,j,c]);const Pe=!!x,We=Q?new Set(u):j,Ne=Z?new Set(l):V,oe=ee?new Set(p):W;return n.jsx("div",{className:[w.tree,S].filter(Boolean).join(" "),role:"tree",children:Te.map(r=>{const d=tt(c,r.id),y=c.getItems(r.id);return n.jsx(nt,{componentId:K,item:r,level:d,hasChildren:y.length>0,expanded:We.has(r.id),selected:Ne.has(r.id),checked:oe.has(r.id),checkbox:m,editable:f,draggable:Pe,editing:h===r.id,draftValue:z,dropIndicator:_e,onToggle:()=>Ae(r.id),onSelect:()=>te(r.id),onCheck:()=>{const C=new Set(oe);C.has(r.id)?C.delete(r.id):C.add(r.id),ne(Array.from(C))},onBeginEdit:()=>qe(r.id),onDraftChange:re,onCommitEdit:Re,onCancelEdit:()=>N(null),onDropIndicatorChange:ae,onDrop:Be},r.id)})})});function tt(a,e){let t=0,o=a.getParent(e);for(;o&&o!==a.getRoot();)t+=1,o=a.getParent(o);return t}function nt(a){const{componentId:e,item:t,level:o,hasChildren:m,expanded:f,selected:x,checked:u,checkbox:g,editable:l,draggable:p,editing:S,draftValue:_,dropIndicator:k,onToggle:T,onSelect:A,onCheck:q,onBeginEdit:R,onDraftChange:K,onCommitEdit:B,onCancelEdit:D,onDropIndicatorChange:c,onDrop:P}=a,j=s.useRef(null),{draggableProps:O}=Le({id:t.id,componentId:e,type:"group",disabled:!p||t.disabled,ghost:()=>{const i=document.createElement("div");return i.className=w.dragGhost,i.textContent=t.value,i}}),{targetRef:V}=$e({id:t.id,componentId:e,accepts:["group"],disabled:!p||t.disabled,getDropPosition:(i,W)=>{const v=W.getBoundingClientRect(),h=i.clientY-v.top;return h<v.height*.25?"top":h>v.height*.75?"bottom":"in"},onDrop:i=>{i.target&&i.dropPosition&&P(i.start,i.target,i.dropPosition)}});return s.useEffect(()=>{const i=V.current;j.current=i},[V]),s.useEffect(()=>{const i=j.current;if(!i||!p)return;const W=v=>{const h=i.getBoundingClientRect();if(v.clientX<h.left||v.clientX>h.right||v.clientY<h.top||v.clientY>h.bottom)return;const N=v.clientY-h.top,z=N<h.height*.25?"top":N>h.height*.75?"bottom":"in";c({target:t.id,position:z})};return i.addEventListener("pointermove",W),()=>i.removeEventListener("pointermove",W)},[p,t.id,c]),n.jsx("div",{ref:V,className:[w.rowWrap,(k==null?void 0:k.target)===t.id?w[`drop${rt(k.position)}`]:""].filter(Boolean).join(" "),"data-rgs-tree-id":t.id,role:"treeitem","aria-expanded":m?f:void 0,"aria-selected":x,style:{paddingInlineStart:`${o*18}px`},children:n.jsxs("div",{className:[w.row,x?w.rowSelected:"",t.disabled?w.rowDisabled:""].filter(Boolean).join(" "),onClick:A,onDoubleClick:l?R:void 0,...p?O:{},children:[n.jsx("button",{type:"button",className:w.toggle,onClick:i=>{i.stopPropagation(),m&&T()},"aria-label":f?"Collapse node":"Expand node",children:m?f?"▾":"▸":""}),g?n.jsx("input",{type:"checkbox",checked:u,onChange:i=>{i.stopPropagation(),q()},onClick:i=>i.stopPropagation()}):null,t.icon?n.jsx("span",{className:w.icon,children:t.icon}):null,S?n.jsx("input",{autoFocus:!0,className:w.editInput,value:_,onChange:i=>K(i.target.value),onBlur:B,onKeyDown:i=>{i.key==="Enter"&&B(),i.key==="Escape"&&D()}}):n.jsx("span",{className:w.label,children:t.value})]})})}function rt(a){return a.charAt(0).toUpperCase()+a.slice(1)}H.__docgenInfo={description:"",methods:[{name:"expand",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"collapse",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"expandAll",docblock:null,modifiers:[],params:[],returns:null},{name:"collapseAll",docblock:null,modifiers:[],params:[],returns:null},{name:"select",docblock:null,modifiers:[],params:[{name:"ids",optional:!1,type:{name:"Array",elements:[{name:"string"}],raw:"string[]"}}],returns:null},{name:"check",docblock:null,modifiers:[],params:[{name:"ids",optional:!1,type:{name:"Array",elements:[{name:"string"}],raw:"string[]"}}],returns:null}],displayName:"Tree",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"TreeNode"}],raw:"TreeNode[]"},description:""},checkbox:{required:!1,tsType:{name:"boolean"},description:""},editable:{required:!1,tsType:{name:"boolean"},description:""},dragItem:{required:!1,tsType:{name:"union",raw:"'item' | 'both'",elements:[{name:"literal",value:"'item'"},{name:"literal",value:"'both'"}]},description:"'item' = item is drag source; 'both' = item is source and drop target"},virtual:{required:!1,tsType:{name:"boolean"},description:""},expanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},defaultExpanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},selected:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},checked:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},css:{required:!1,tsType:{name:"string"},description:""},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onCheck:{required:!1,tsType:{name:"signature",type:"function",raw:"(ids: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"ids"}],return:{name:"void"}}},description:""},onExpand:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onCollapse:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onEdit:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string, newValue: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"},{type:{name:"string"},name:"newValue"}],return:{name:"void"}}},description:""},onDrop:{required:!1,tsType:{name:"signature",type:"function",raw:"(dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => void",signature:{arguments:[{type:{name:"string"},name:"dragId"},{type:{name:"string"},name:"targetId"},{type:{name:"union",raw:"'before' | 'after' | 'inside'",elements:[{name:"literal",value:"'before'"},{name:"literal",value:"'after'"},{name:"literal",value:"'inside'"}]},name:"position"}],return:{name:"void"}}},description:""}}};const ct={title:"Components/Tree",component:H,parameters:{layout:"centered"}};function M({open:a}){return n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:a?"#f59e0b":"#94a3b8",children:a?n.jsx("path",{d:"M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"}):n.jsx("path",{d:"M3 7a2 2 0 012-2h3.586l2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"})})}function L(){return n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"#64748b",children:n.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z"})})}function ie(){return n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"#64748b",children:n.jsx("path",{d:"M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"})})}const $=[{id:"mail",value:"Mail",icon:n.jsx(M,{open:!0}),$opened:!0,items:[{id:"inbox",value:"Inbox",icon:n.jsx(L,{})},{id:"sent",value:"Sent",icon:n.jsx(L,{})},{id:"drafts",value:"Drafts",icon:n.jsx(L,{})},{id:"spam",value:"Spam",icon:n.jsx(L,{}),disabled:!0}]},{id:"team",value:"Team",icon:n.jsx(M,{}),items:[{id:"alice",value:"Alice",icon:n.jsx(ie,{})},{id:"bob",value:"Bob",icon:n.jsx(ie,{})},{id:"projects",value:"Projects",icon:n.jsx(M,{}),items:[{id:"proj-alpha",value:"Alpha",icon:n.jsx(L,{})},{id:"proj-beta",value:"Beta",icon:n.jsx(L,{})}]}]},{id:"archive",value:"Archive",icon:n.jsx(M,{}),items:[{id:"archive-2023",value:"2023",icon:n.jsx(M,{})},{id:"archive-2024",value:"2024",icon:n.jsx(M,{})}]}];function at(){return JSON.parse(JSON.stringify($))}const Y={args:{data:$,style:{width:280,minHeight:300}},parameters:{docs:{description:{story:"Basic tree with icons, nested items, and one disabled leaf."}}}},G={args:{data:$,checkbox:!0,style:{width:280}}},F={args:{data:$,editable:!0,checkbox:!0,style:{width:280}},parameters:{docs:{description:{story:"Double-click a label to edit it inline. Press Enter to commit, Escape to cancel."}}}},U={render:()=>{const[a,e]=s.useState([]),t=at();return n.jsxs("div",{style:{display:"flex",gap:24,alignItems:"flex-start"},children:[n.jsx(H,{data:t,dragItem:"both",style:{width:280},onDrop:(o,m,f)=>{e(x=>[`drop "${o}" ${f} "${m}"`,...x.slice(0,4)])}}),n.jsxs("div",{style:{fontSize:12,color:"#64748b",minWidth:200},children:[n.jsx("div",{style:{marginBottom:6,fontWeight:600},children:"Drop log"}),a.length===0?n.jsx("div",{style:{fontStyle:"italic"},children:"Drag a node to see events"}):a.map((o,m)=>n.jsx("div",{children:o},m))]})]})},parameters:{docs:{description:{story:'dragItem="both" — nodes are draggable sources and drop targets.'}}}},X={render:()=>{const[a,e]=s.useState(["mail"]);return n.jsxs("div",{style:{display:"flex",gap:24,alignItems:"flex-start"},children:[n.jsx(H,{data:$,expanded:a,onExpand:t=>e(o=>[...o,t]),onCollapse:t=>e(o=>o.filter(m=>m!==t)),style:{width:280}}),n.jsxs("div",{style:{fontSize:12,color:"#64748b",minWidth:140},children:[n.jsx("div",{style:{marginBottom:6,fontWeight:600},children:"expanded"}),a.length===0?n.jsx("div",{style:{fontStyle:"italic"},children:"none"}):a.map(t=>n.jsx("div",{children:t},t))]})]})},parameters:{docs:{description:{story:"Controlled mode — the parent owns expanded state. onExpand/onCollapse fire with the single toggled id."}}}},J={render:()=>{const a=s.useRef(null);return n.jsxs("div",{style:{width:280},children:[n.jsx(H,{ref:a,data:$,checkbox:!0,editable:!0}),n.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12,flexWrap:"wrap"},children:[n.jsx("button",{type:"button",onClick:()=>{var e;return(e=a.current)==null?void 0:e.expandAll()},children:"Expand all"}),n.jsx("button",{type:"button",onClick:()=>{var e;return(e=a.current)==null?void 0:e.collapseAll()},children:"Collapse all"}),n.jsx("button",{type:"button",onClick:()=>{var e;return(e=a.current)==null?void 0:e.expand("team")},children:"Expand Team"}),n.jsx("button",{type:"button",onClick:()=>{var e;return(e=a.current)==null?void 0:e.collapse("mail")},children:"Collapse Mail"}),n.jsx("button",{type:"button",onClick:()=>{var e;return(e=a.current)==null?void 0:e.select(["inbox"])},children:"Select Inbox"}),n.jsx("button",{type:"button",onClick:()=>{var e;return(e=a.current)==null?void 0:e.check(["inbox","sent"])},children:"Check Inbox+Sent"})]})]})},parameters:{docs:{description:{story:"Imperative ref API: expand, collapse, expandAll, collapseAll, select, check."}}}};var de,le,ce;Y.parameters={...Y.parameters,docs:{...(de=Y.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    data: mailData,
    style: {
      width: 280,
      minHeight: 300
    }
  } as Story['args'] & {
    style?: React.CSSProperties;
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic tree with icons, nested items, and one disabled leaf.'
      }
    }
  }
}`,...(ce=(le=Y.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var pe,ue,me;G.parameters={...G.parameters,docs:{...(pe=G.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    data: mailData,
    checkbox: true,
    style: {
      width: 280
    }
  } as Story['args'] & {
    style?: React.CSSProperties;
  }
}`,...(me=(ue=G.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var ge,fe,he;F.parameters={...F.parameters,docs:{...(ge=F.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    data: mailData,
    editable: true,
    checkbox: true,
    style: {
      width: 280
    }
  } as Story['args'] & {
    style?: React.CSSProperties;
  },
  parameters: {
    docs: {
      description: {
        story: 'Double-click a label to edit it inline. Press Enter to commit, Escape to cancel.'
      }
    }
  }
}`,...(he=(fe=F.parameters)==null?void 0:fe.docs)==null?void 0:he.source}}};var xe,ve,be;U.parameters={...U.parameters,docs:{...(xe=U.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    const data = cloneData();
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
}`,...(be=(ve=U.parameters)==null?void 0:ve.docs)==null?void 0:be.source}}};var ye,we,Se;X.parameters={...X.parameters,docs:{...(ye=X.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(Se=(we=X.parameters)==null?void 0:we.docs)==null?void 0:Se.source}}};var ke,je,Ce;J.parameters={...J.parameters,docs:{...(ke=J.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(Ce=(je=J.parameters)==null?void 0:je.docs)==null?void 0:Ce.source}}};const pt=["Default","WithCheckboxes","Editable","Draggable","ControlledExpansion","ImperativeApi"];export{X as ControlledExpansion,Y as Default,U as Draggable,F as Editable,J as ImperativeApi,G as WithCheckboxes,pt as __namedExportsOrder,ct as default};
