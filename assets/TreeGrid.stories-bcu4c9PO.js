import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CXOcBcs0.js";import{c as Ke,G as Le,g as Ve,T as K}from"./Grid-DXkzAUeY.js";import{u as Qe}from"./useTreeStore-BEOdTLmG.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DWcjTdiE.js";import"./index-DujEZ9g2.js";import"./DragManager-Cl1AKh51.js";function $e(t,o,a){if(o.length===0)return t;const[n,...x]=o,I=[],f=new Map;for(const p of t){const u=String(p[n]??"");f.has(u)||(I.push(u),f.set(u,[])),f.get(u).push(p)}return I.map(p=>{const u=f.get(p),M=x.length>0?$e(u,x,a):u,g={id:`__group__${n}__${p}`,$group:!0,$editable:!1,$selectable:!1,[n]:p,items:M};if(a)for(const[k,S]of Object.entries(a)){const v=Ke(u,k,S);v!==void 0&&(g[k]=v)}return g})}const We="_treeCell_20bgo_1",Xe="_toggle_20bgo_9",Ue="_cellValue_20bgo_20",q={treeCell:We,toggle:Xe,cellValue:Ue};function Ye(t){return JSON.parse(JSON.stringify(t))}function Ze(t,o){let a=0,n=t.getParent(o);for(;n&&n!==t.getRoot();)a+=1,n=t.getParent(n);return a}function J(t,o=new Set){var a;for(const n of t)(a=n.items)!=null&&a.length&&(o.add(n.id),J(n.items,o));return o}function je(t,o){return t.map(a=>({...a,$opened:o?!1:a.$opened,items:a.items?je(a.items,o):void 0}))}const c=i.forwardRef(function(o,a){var V;const{data:n,columns:x,treeColumnId:I,collapsed:f=!1,rootParent:p,dropBehaviour:u="sibling",dragExpand:M=!0,groupBy:g,groupAggregate:k,onCellClick:S,onDragRowIn:v,onAfterRowDrop:F,...O}=o,N=i.useRef(null),z=i.useMemo(()=>{let e=Ye(n);if(g&&!O.dataProxy){const l=Array.isArray(g)?g:[g];e=$e(e,l,k)}return je(e,f)},[f,n,g,k,O.dataProxy]),Ee=Qe({data:z,config:p?{rootId:p}:void 0}),{store:r,items:Pe}=Ee,C=r.getRoot(),L=I??((V=x[0])==null?void 0:V.id);i.useEffect(()=>{r.parse(z)},[z,r]);const _e=i.useMemo(()=>r.flatten(r.getItems(C)),[Pe,C,r]),Be=i.useMemo(()=>x.map(e=>{if(e.id!==L)return e;const l=e.template;return{...e,template:(h,m,ze)=>{var W;const qe=Ze(r,m.id),Je=r.haveItems(m.id),Q=!!((W=r.getItem(m.id))!=null&&W.$opened);return s.jsxs("div",{className:q.treeCell,style:{paddingInlineStart:`${qe*18}px`},children:[s.jsx("button",{type:"button",className:q.toggle,"data-rgs-tree-toggle":m.id,"aria-label":Q?"Collapse row":"Expand row",children:Je?Q?"▾":"▸":""}),s.jsx("span",{className:q.cellValue,children:l?l(h,m,ze):String(h??"")})]})}}}),[L,x,r]);i.useImperativeHandle(a,()=>({open:e=>{r.exists(e)&&r.update(e,{$opened:!0})},close:e=>{r.exists(e)&&r.update(e,{$opened:!1})},openAll:()=>{for(const e of Array.from(J(r.serialize())))r.exists(e)&&r.update(e,{$opened:!0},!0);r.events.fire("change",[void 0,"update"])},closeAll:()=>{for(const e of Array.from(J(r.serialize())))r.exists(e)&&r.update(e,{$opened:!1},!0);r.events.fire("change",[void 0,"update"])}}),[r]);const Me=(e,l,d)=>{if(d.target.closest(`[data-rgs-tree-toggle="${e}"]`)){const m=r.getItem(e);m&&r.haveItems(e)&&r.update(e,{$opened:!m.$opened})}S==null||S(e,l,d)},Fe=e=>{if(!(e.ctrlKey||e.metaKey)||e.key!=="Enter")return;const l=e.currentTarget.querySelector(`.${Ve.rowSelected}[data-rgs-id]`),d=l==null?void 0:l.getAttribute("data-rgs-id");if(!d)return;const h=r.getItem(d);h&&r.haveItems(d)&&(r.update(d,{$opened:!h.$opened}),e.preventDefault())},Oe=(e,l)=>{if(M&&e.target){const d=r.getItem(e.target);d&&r.haveItems(e.target)&&!d.$opened&&(N.current!==null&&window.clearTimeout(N.current),N.current=window.setTimeout(()=>{r.update(e.target,{$opened:!0})},200))}v==null||v(e,l)},Ne=(e,l)=>{if(e.target&&e.position)if(u==="child")r.move(e.start,-1,void 0,e.target);else{const d=r.getParent(e.target)??C,h=r.getIndex(e.target),m=e.position==="bottom"?h+1:h;r.move(e.start,m,void 0,d)}F==null||F(e,l)};return s.jsx("div",{onKeyDown:Fe,children:s.jsx(Le,{...O,rootParent:C,columns:Be,data:_e,store:r,onCellClick:Me,onDragRowIn:Oe,onAfterRowDrop:Ne})})});c.__docgenInfo={description:"",methods:[{name:"open",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"close",docblock:null,modifiers:[],params:[{name:"id",optional:!1,type:{name:"string"}}],returns:null},{name:"openAll",docblock:null,modifiers:[],params:[],returns:null},{name:"closeAll",docblock:null,modifiers:[],params:[],returns:null}],displayName:"TreeGrid",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn",elements:[{name:"T"}],raw:"GridColumn<T>"}],raw:"GridColumn<T>[]"},description:""},treeColumnId:{required:!1,tsType:{name:"string"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:""},rootParent:{required:!1,tsType:{name:"string"},description:""},dropBehaviour:{required:!1,tsType:{name:"union",raw:"'child' | 'sibling' | 'complex'",elements:[{name:"literal",value:"'child'"},{name:"literal",value:"'sibling'"},{name:"literal",value:"'complex'"}]},description:""},dragExpand:{required:!1,tsType:{name:"boolean"},description:""},groupBy:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},groupAggregate:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:"'sum' | 'avg' | 'count' | 'min' | 'max'",elements:[{name:"literal",value:"'sum'"},{name:"literal",value:"'avg'"},{name:"literal",value:"'count'"},{name:"literal",value:"'min'"},{name:"literal",value:"'max'"}]}],raw:"Record<string, AggregateType>"},description:""}},composes:["Omit"]};const y=360,pt={title:"Components/TreeGrid",component:c,decorators:[t=>s.jsx(K,{children:s.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",height:"100%"},children:s.jsx(t,{})})})],parameters:{layout:"fullscreen"}},T=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],et=[{id:"name",header:[{text:"Name"}],width:280,sortable:!0,resizable:!0,editorType:"input"},{id:"owner",header:[{text:"Owner"}],width:160,sortable:!0,resizable:!0,editorType:"input"},{id:"status",header:[{text:"Status"}],width:140,sortable:!0,resizable:!0,editorType:"input"},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0,editorType:"input"}],tt=[{id:"name",header:[{text:"Name"},{content:"inputFilter"}],width:280,sortable:!0,resizable:!0},{id:"owner",header:[{text:"Owner"},{content:"selectFilter"}],width:160,sortable:!0,resizable:!0},{id:"status",header:[{text:"Status"},{content:"selectFilter"}],width:140,sortable:!0,resizable:!0},{id:"hours",header:[{text:"Hours"}],width:110,align:"right",sortable:!0,resizable:!0}],rt=[{id:"program-alpha",name:"Program Alpha",owner:"Nina",status:"Active",hours:240,$opened:!0,items:[{id:"alpha-discovery",name:"Discovery",owner:"Kai",status:"Done",hours:48,$opened:!0,items:[{id:"alpha-research",name:"Research",owner:"Kai",status:"Done",hours:20},{id:"alpha-interviews",name:"Interviews",owner:"Mira",status:"Done",hours:28}]},{id:"alpha-build",name:"Build",owner:"Mira",status:"Active",hours:132},{id:"alpha-qa",name:"QA",owner:"Rae",status:"Queued",hours:60}]},{id:"program-beta",name:"Program Beta",owner:"Jules",status:"Planned",hours:180,items:[{id:"beta-outline",name:"Outline",owner:"Rae",status:"Queued",hours:24},{id:"beta-implementation",name:"Implementation",owner:"Noah",status:"Planned",hours:156}]},{id:"ops",name:"Operations",owner:"Lina",status:"Active",hours:96}];function b(){return JSON.parse(JSON.stringify(rt))}function w({children:t,note:o}){return s.jsxs("div",{children:[o?s.jsx("p",{style:{margin:"0 0 12px",color:"#667085",fontSize:13},children:o}):null,t]})}const G={args:{columns:T,data:b(),sortable:!0,selection:"row",style:{width:"100%",height:y}}},D={args:{columns:T,data:b().map(t=>({...t,$opened:!1})),selection:"row",style:{width:"100%",height:y}}},A={render:()=>{const t=i.useMemo(()=>b(),[]);return s.jsx(w,{note:"Expanded multi-level hierarchy with nested tasks in the first column.",children:s.jsx(c,{columns:T,data:t,selection:"row",sortable:!0,style:{width:"100%",height:y}})})}},$={render:()=>{const t=i.useMemo(()=>b(),[]);return s.jsx(w,{note:"Header filters reuse the existing Grid filter controls on top of hierarchical rows.",children:s.jsx(c,{columns:tt,data:t,selection:"row",sortable:!0,style:{width:"100%",height:y}})})}},j={render:()=>{const t=i.useMemo(()=>b(),[]);return s.jsx(w,{note:"Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.",children:s.jsx(c,{columns:T,data:t,sortable:!0,selection:"row",multiselection:!0,style:{width:"100%",height:y}})})}},R={render:()=>{const t=i.useMemo(()=>b(),[]);return s.jsx(w,{note:"Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.",children:s.jsx(c,{columns:et,data:t,editable:!0,selection:"complex",style:{width:"100%",height:y}})})}},H={render:()=>{const t=i.useMemo(()=>b(),[]);return s.jsx(w,{note:"Drag rows to reorder within the flattened tree view.",children:s.jsx(c,{columns:T,data:t,dragItem:"row",selection:"row",style:{width:"100%",height:y}})})}},E={render:()=>{const t=i.useRef(null),o=i.useMemo(()=>b().map(a=>({...a,$opened:!1})),[]);return s.jsxs(w,{note:"Imperative ref mirrors DHTMLX TreeGrid API: open(id), close(id), openAll(), closeAll().",children:[s.jsx(c,{ref:t,columns:T,data:o,selection:"row",style:{width:"100%",height:y}}),s.jsxs("div",{style:{display:"flex",gap:8,paddingTop:12},children:[s.jsx("button",{type:"button",onClick:()=>{var a;return(a=t.current)==null?void 0:a.openAll()},children:"Open All"}),s.jsx("button",{type:"button",onClick:()=>{var a;return(a=t.current)==null?void 0:a.closeAll()},children:"Close All"}),s.jsx("button",{type:"button",onClick:()=>{var a;return(a=t.current)==null?void 0:a.open("program-beta")},children:"Open Beta"}),s.jsx("button",{type:"button",onClick:()=>{var a;return(a=t.current)==null?void 0:a.close("program-alpha")},children:"Close Alpha"})]})]})}},st=[{id:"name",header:[{text:"Book Name"}],width:300,sortable:!0,resizable:!0},{id:"checked",header:[{text:""}],width:52,align:"center",template:t=>s.jsx("input",{type:"checkbox",checked:!!t,readOnly:!0,style:{width:18,height:18,accentColor:"#1d9bf0"}})},{id:"price",header:[{text:"Price"}],width:100,align:"right"},{id:"shipsIn",header:[{text:"Ships in"}],width:110},{id:"status",header:[{text:"Status"}],width:150,template:t=>{const o=String(t??"").toLowerCase(),a=o==="available"?"#1fb26b":o==="reserved"?"#1d9bf0":"#ff4d4f";return o?s.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[s.jsx("span",{"aria-hidden":"true",style:{width:14,height:14,borderRadius:"999px",background:a,display:"inline-block"}}),s.jsx("span",{style:{color:"#5f6b7a"},children:String(t??"")})]}):null}},{id:"publishingDate",header:[{text:"Publishing date"}],width:160,align:"right"},{id:"cover",header:[{text:"Cover"}],width:120}],at=[{id:"bestsellers",name:"Bestsellers",$opened:!0,items:[{id:"john-grisham",name:"John Grisham",$opened:!0,items:[{id:"time-to-kill",name:"A Time to Kill",checked:!0,price:"$12.25",shipsIn:"12 hours",status:"available",publishingDate:"05/10/2019 12:00",cover:"Hardcover"},{id:"rainmaker",name:"The Rainmaker",checked:!0,price:"$5.5",shipsIn:"1 hour",status:"reserved",publishingDate:"13/12/2005 12:00",cover:"Paperback"},{id:"partner",name:"The Partner",checked:!1,price:"$11.7",shipsIn:"1 week",publishingDate:"25/11/2017 12:00",cover:"Hardcover"},{id:"firm",name:"The Firm",checked:!0,price:"$6",shipsIn:"24 hours",status:"available",publishingDate:"15/02/2020 12:00",cover:"Paperback"}]},{id:"stephen-king",name:"Stephen King",status:"missing",$opened:!0,items:[{id:"misery",name:"Misery",checked:!1,price:"$5.25",shipsIn:"1 week",status:"missing",publishingDate:"26/10/2014 12:00",cover:"Paperback"},{id:"it",name:"It",checked:!0,price:"$15.75",shipsIn:"1 hour",status:"available",publishingDate:"05/04/2020 12:00",cover:"Hardcover"},{id:"dark-tower",name:"The Dark Tower",checked:!0,price:"$5.33",shipsIn:"2 days",status:"reserved",publishingDate:"08/05/2018 12:00",cover:"Paperback"}]}]},{id:"classics",name:"Classics",$opened:!0,items:[{id:"pushkin",name:"Pushkin",status:"missing",$opened:!0,items:[{id:"onegin",name:"Eugene Onegin",checked:!0,price:"$14.4",shipsIn:"24 hours",status:"available",publishingDate:"05/03/2020 12:00",cover:"Hardcover"},{id:"boris-godunov",name:"Boris Godunov",checked:!1,price:"$8.1",shipsIn:"24 hours",status:"missing",publishingDate:"18/09/2019 12:00",cover:"Paperback"}]},{id:"balzac",name:"Honore De Balzac",status:"missing"}]}],P={render:()=>{const t=i.useMemo(()=>JSON.parse(JSON.stringify(at)),[]);return s.jsx(w,{note:"Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.",children:s.jsx(c,{columns:st,data:t,selection:"row",style:{width:"100%",height:680}})})}},X=["Alice","Bob","Cara","Dan","Eva","Frank","Grace","Hans"],Re=Array.from({length:24},(t,o)=>({id:`e${o}`,name:X[o%X.length],dept:["Engineering","HR","Finance"][o%3],status:o%2===0?"active":"inactive",salary:5e4+o*1e3})),He=[{id:"dept",header:[{text:"Department"}],width:160},{id:"status",header:[{text:"Status"}],width:100},{id:"name",header:[{text:"Name"}],width:140},{id:"salary",header:[{text:"Salary"}],width:100}],_={name:"GroupBy — Department (avg salary)",render:()=>s.jsx(K,{children:s.jsx(c,{data:Re,columns:He,groupBy:"dept",groupAggregate:{salary:"avg"},style:{height:360,width:"100%"}})})},B={name:"GroupBy — Department > Status (sum salary)",render:()=>s.jsx(K,{children:s.jsx(c,{data:Re,columns:He,groupBy:["dept","status"],groupAggregate:{salary:"sum"},style:{height:400,width:"100%"}})})};var U,Y,Z;G.parameters={...G.parameters,docs:{...(U=G.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(Z=(Y=G.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,re;D.parameters={...D.parameters,docs:{...(ee=D.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(re=(te=D.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var se,ae,oe;A.parameters={...A.parameters,docs:{...(se=A.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Expanded multi-level hierarchy with nested tasks in the first column.">
        <TreeGrid columns={baseColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(oe=(ae=A.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var ne,ie,le;$.parameters={...$.parameters,docs:{...(ne=$.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Header filters reuse the existing Grid filter controls on top of hierarchical rows.">
        <TreeGrid columns={filterColumns} data={data} selection="row" sortable style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(le=(ie=$.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};var de,ce,ue;j.parameters={...j.parameters,docs:{...(de=j.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Click headers to sort; Shift+click for multi-select. Sorting flattens within each parent group, preserving tree structure.">
        <TreeGrid columns={baseColumns} data={data} sortable selection="row" multiselection style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(ue=(ce=j.parameters)==null?void 0:ce.docs)==null?void 0:ue.source}}};var me,pe,he;R.parameters={...R.parameters,docs:{...(me=R.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Double-click a cell to edit inline while keeping the tree column indentation and toggles intact.">
        <TreeGrid columns={editableColumns} data={data} editable selection="complex" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(he=(pe=R.parameters)==null?void 0:pe.docs)==null?void 0:he.source}}};var ge,ye,be;H.parameters={...H.parameters,docs:{...(ge=H.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => cloneData(), []);
    return <StoryFrame note="Drag rows to reorder within the flattened tree view.">
        <TreeGrid columns={baseColumns} data={data} dragItem="row" selection="row" style={{
        width: '100%',
        height: GRID_HEIGHT
      }} />
      </StoryFrame>;
  }
}`,...(be=(ye=H.parameters)==null?void 0:ye.docs)==null?void 0:be.source}}};var fe,we,xe;E.parameters={...E.parameters,docs:{...(fe=E.parameters)==null?void 0:fe.docs,source:{originalSource:`{
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
}`,...(xe=(we=E.parameters)==null?void 0:we.docs)==null?void 0:xe.source}}};var ve,Te,ke;P.parameters={...P.parameters,docs:{...(ve=P.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => {
    const data = useMemo(() => JSON.parse(JSON.stringify(bookData)) as BookRow[], []);
    return <StoryFrame note="Category → author → book hierarchy with checkboxes, status dots, pricing, and cover type.">
        <TreeGrid columns={bookColumns} data={data} selection="row" style={{
        width: '100%',
        height: 680
      }} />
      </StoryFrame>;
  }
}`,...(ke=(Te=P.parameters)==null?void 0:Te.docs)==null?void 0:ke.source}}};var Se,Ie,Ce;_.parameters={..._.parameters,docs:{...(Se=_.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'GroupBy — Department (avg salary)',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy="dept" groupAggregate={{
      salary: 'avg'
    }} style={{
      height: 360,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Ce=(Ie=_.parameters)==null?void 0:Ie.docs)==null?void 0:Ce.source}}};var Ge,De,Ae;B.parameters={...B.parameters,docs:{...(Ge=B.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  name: 'GroupBy — Department > Status (sum salary)',
  render: () => <ThemeProvider>
      <TreeGrid data={flatEmployees as TreeGridRow[]} columns={groupCols} groupBy={['dept', 'status']} groupAggregate={{
      salary: 'sum'
    }} style={{
      height: 400,
      width: '100%'
    }} />
    </ThemeProvider>
}`,...(Ae=(De=B.parameters)==null?void 0:De.docs)==null?void 0:Ae.source}}};const ht=["Default","CollapsedStart","DeepHierarchy","WithHeaderFilters","SortingAndSelection","EditableRows","RowDrag","ImperativeApi","BookLibraryExample","GroupByDepartment","MultiLevelGroupBy"];export{P as BookLibraryExample,D as CollapsedStart,A as DeepHierarchy,G as Default,R as EditableRows,_ as GroupByDepartment,E as ImperativeApi,B as MultiLevelGroupBy,H as RowDrag,j as SortingAndSelection,$ as WithHeaderFilters,ht as __namedExportsOrder,pt as default};
