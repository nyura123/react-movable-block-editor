(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{170:function(e,t,n){e.exports=n(438)},175:function(e,t,n){},176:function(e,t,n){},425:function(e,t,n){},438:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(11),i=n.n(o),d=(n(175),n(82)),l=(n(176),n(439)),c=n(32),u=n(20),s=n(35),h=n(33),p=n(34),f=n(54),b=n(28),v=n(6),g=n(3),m=n(156),y=n(157),I=n.n(y),O=n(75);function w(e,t){return Object(v.a)({},e,Object(b.a)({},t.id,t))}function j(e,t){var n=e[t];if(!n)return e;if(n&&n.parentId){var r=e[n.parentId];if(r)if(r.childrenIds.findIndex(function(e){return e===n.id})>=0){var a=r.childrenIds.filter(function(e){return e!==n.id});e=w(e,Object(v.a)({},r,{childrenIds:a}))}}return Object(v.a)({},e,Object(b.a)({},t,void 0))}function C(e,t,n,r){if(!t)return e;if(function e(t,n,r){var a=t[n];if(!a)return!1;if(a.childrenIds.indexOf(r)>=0)return!0;var o=!0,i=!1,d=void 0;try{for(var l,c=a.childrenIds[Symbol.iterator]();!(o=(l=c.next()).done);o=!0)if(e(t,l.value,r))return!1}catch(u){i=!0,d=u}finally{try{o||null==c.return||c.return()}finally{if(i)throw d}}return!1}(e,t.id,n))return console.warn("node ",t.id," has ",n," as child, so cannot make it into",t.id,"'s parent"),e;if(t.id===n)return console.warn("Cannot place into self: ",{id:t.id,newParentId:n}),e;if(t&&t.parentId&&t.parentId!==n){var a=e[t.parentId];if(a){var o=a.childrenIds.filter(function(e){return e!==t.id});e=w(e,Object(v.a)({},a,{childrenIds:o}))}}var i=e[n];if(i){var d=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(t===n.beforeItemId||t===n.afterItemId)return console.warn("Cannot place relative to self: ",Object(v.a)({itemId:t},n)),e;e=e.filter(function(e){return e!==t});var r=n.beforeItemId,a=n.afterItemId,o=-1;if(r?o=e.findIndex(function(e){return e===r}):a&&(o=e.findIndex(function(e){return e===a})+1),o>=0){var i=Object(f.a)(e);return i.splice(o,0,t),i}return[t].concat(Object(f.a)(e))}(i.childrenIds,t.id,r);e=w(e,Object(v.a)({},i,{childrenIds:d}))}return w(e,Object(v.a)({},t,{parentId:n}))}function k(e,t){return t?Object(v.a)({},t,{value:"object"==typeof t.value?Object(v.a)({},t.value):t.value,childrenIds:Object(f.a)(t.childrenIds),children:t.childrenIds.map(function(t){return k(e,e[t])})}):t}function E(e){var t=e.byId,n=e.copiedNode;if(!n)return e;var r=function e(t,n){n.id=N(t,n.type);var r=n.children;if(n.children=void 0,t=Object(v.a)({},t,Object(b.a)({},n.id,n)),r){var a=0,o=!0,i=!1,d=void 0;try{for(var l,c=r[Symbol.iterator]();!(o=(l=c.next()).done);o=!0){var u=l.value;u.parentId=n.id;var s=e(t,u),h=s.byId,p=s.newId;n.childrenIds[a]=p,t=h,++a}}catch(f){i=!0,d=f}finally{try{o||null==c.return||c.return()}finally{if(i)throw d}}}return{byId:t,newId:n.id}}(t,n).byId;if(n.parentId){var a=t[n.parentId];if(a)return Object(v.a)({},e,{byId:C(r,n,n.parentId,{afterItemId:a.childrenIds[a.childrenIds.length-1]})})}return e}function N(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"node",n=Object.keys(e).length;e[n];)n++;return t+"_"+n}function x(e,t,n){var r=e.byId,a=Object(v.a)({},r[t],n);return Object(v.a)({},e,{byId:w(r,a)})}function D(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};if(!n)return e;var a=e.byId,o=a[t];return Object(v.a)({},e,{byId:C(a,Object(v.a)({},o,{isPlaceHolder:r.isPlaceHolder},r.absolutePos?{top:r.absolutePos.top,left:r.absolutePos.left}:{}),n,r)})}function P(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(!t)return e;var r=e.focusedNodeId;return Object(v.a)({},e,{focusedNodeId:n?t.id:r===t.id?null:r})}function B(e){var t=e.filter(function(e){return 0===e.indexOf("draggednodeid:")}),n=e.filter(function(e){return 0===e.indexOf("draggednodetype:")});return 1!==t.length||1!==n.length?{draggedNodeId:"notanode",draggedNodeType:"invalidnodetype"}:{draggedNodeId:t[0].slice("draggednodeid:".length),draggedNodeType:n[0].slice("draggednodetype:".length)}}function R(e,t){return t?{left:e.clientX-t.left,top:e.clientY-t.top,width:t.width,height:t.height}:null}function T(e,t,n){e.stopPropagation();var r=R(e,n());r&&e.dataTransfer.setData("text/plain",JSON.stringify({startLeft:r.left,startTop:r.top})),e.dataTransfer.setData("draggednodeid:".concat(t.id),""),e.dataTransfer.setData("draggednodetype:".concat(t.type),"")}function S(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return D(arguments.length>3?arguments[3]:void 0,B(e).draggedNodeId,t,n)}var W=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).selfRef=null,e.getBoundingRect=function(){return e.selfRef&&e.selfRef.getBoundingClientRect?e.selfRef.getBoundingClientRect():null},e.canDrop=function(e){var t=B(e).draggedNodeType;return"row"===t||"col"===t||"markdown"===t||"image"===t||"layer"===t},e.onDrop=function(t){arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.canDrop(t.dataTransfer.types)&&(t.stopPropagation(),B(t.dataTransfer.types).draggedNodeId)){var n=R(t,e.getBoundingRect()),r=e.props.node.childrenIds.length?e.props.node.childrenIds[e.props.node.childrenIds.length-1]:void 0,a=JSON.parse(t.dataTransfer.getData("text/plain"));e.props.onChange(S(t.dataTransfer.types,e.props.node.id,n?{afterItemId:r,absolutePos:{top:n.top-a.startTop,left:n.left-a.startLeft}}:void 0,e.props.value))}},e.onDragEnter=function(e){e.preventDefault()},e.onDragOver=function(t){e.canDrop(t.dataTransfer.types)&&(t.preventDefault(),t.stopPropagation())},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"renderChild",value:function(e){var t=this.props,n=t.value,r=t.onChange,a=t.renderEditBlock;return a({node:n.byId[e],renderEditBlock:a,value:n,onChange:r})}},{key:"render",value:function(){var e=this,t=this.props,n=t.node,r=t.value.byId,a=n.childrenIds;return Object(g.createElement)("div",{ref:function(t){return e.selfRef=t},onDragOver:this.onDragOver,onDrop:this.onDrop,draggable:!0,onDragStart:function(t){return T(t,e.props.node,e.getBoundingRect)},style:{position:"relative",width:n.width,height:n.height,backgroundColor:n.backgroundColor||"#f5f5f5a3",padding:5,borderRadius:3}},a.map(function(t){var n=r[t];return Object(g.createElement)("div",{key:"node_"+t,style:{position:"absolute",width:n.width,height:n.height,top:n.top,left:n.left}},e.renderChild(t))}))}}]),t}(g.Component),M=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).selfRef=null,e.state={wantToPlaceNext:null},e.getBoundingRect=function(){return e.selfRef&&e.selfRef.getBoundingClientRect?e.selfRef.getBoundingClientRect():null},e.canDrop=function(e){var t=B(e).draggedNodeType;return"col"===t||"row"===t||"markdown"===t||"image"===t||"layer"===t},e.shouldPlaceBefore=function(t,n){var r=R(t,e.getBoundingRect());return r&&("y"===n?r.top/r.height<.45:r.left/r.width<.45)},e.onDrop=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.canDrop(t.dataTransfer.types)){t.stopPropagation(),n||null===e.state.wantToPlaceNext||e.setState({wantToPlaceNext:null});var r=B(t.dataTransfer.types),a=r.draggedNodeId,o=r.draggedNodeType;if(a)if("col"===o){var i=e.shouldPlaceBefore(t,"x")?{beforeItemId:e.props.node.id}:{afterItemId:e.props.node.id};e.props.onChange(S(t.dataTransfer.types,e.props.node.parentId||"",Object(v.a)({},i,{isPlaceHolder:n}),e.props.value))}else{var d=e.shouldPlaceBefore(t,"y"),l=e.props.node.childrenIds,c=l.length,u=c?d?{beforeItemId:l[0]}:{afterItemId:l[c-1]}:null;e.props.onChange(S(t.dataTransfer.types,e.props.node.id,Object(v.a)({isPlaceHolder:n},u),e.props.value))}}},e.onDragEnter=function(e){e.preventDefault()},e.onDragOver=function(t){if(e.canDrop(t.dataTransfer.types)&&(t.preventDefault(),t.stopPropagation()),"col"===B(t.dataTransfer.types).draggedNodeType){var n=e.shouldPlaceBefore(t,"x");n&&"left"!==e.state.wantToPlaceNext?e.setState({wantToPlaceNext:"left"}):n||"right"===e.state.wantToPlaceNext||e.setState({wantToPlaceNext:"right"})}else{var r=e.shouldPlaceBefore(t,"y");e.setState({wantToPlaceNext:r?"firstChild":"lastChild"})}},e.onDragLeave=function(t){null!==e.state.wantToPlaceNext&&e.setState({wantToPlaceNext:null})},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"renderChild",value:function(e){var t=this.props,n=t.value,r=t.onChange,a=t.renderEditBlock;return a({node:n.byId[e],renderEditBlock:a,value:n,onChange:r})}},{key:"render",value:function(){var e=this,t=this.props,n=t.node,r=t.value.byId,a=this.state.wantToPlaceNext,o=n.childrenIds,i="firstChild"===a?3:0;return Object(g.createElement)("div",{key:"col_"+n.id,style:{display:"flex",flexDirection:"row",width:"100%",height:"100%"}},"left"===a&&Object(g.createElement)("div",{style:{height:"100%",width:3,backgroundColor:"white"}}),Object(g.createElement)("div",{ref:function(t){return e.selfRef=t},onDragOver:this.onDragOver,onDragLeave:this.onDragLeave,onDrop:this.onDrop,onDragEnter:this.onDragEnter,draggable:!0,onDragStart:function(t){return T(t,e.props.node,e.getBoundingRect)},style:{width:"100%",height:"100%",borderRadius:3,backgroundColor:this.props.node.isPlaceHolder?"grey":this.props.node.backgroundColor||"#ffffffa8",borderStyle:"solid",borderWidth:1}},"firstChild"===a&&Object(g.createElement)("div",{style:{height:10,width:"100%",backgroundColor:"blue"}}),o.map(function(t){var n=r[t],a=Object(g.createElement)("div",{className:"drag-node",key:"node_"+t,style:{position:"absolute",width:n.width,height:n.height,top:i,left:0}},e.renderChild(t));return i+=n.height,a}),"lastChild"===a&&Object(g.createElement)("div",{style:{top:i,position:"absolute",height:10,width:"100%",backgroundColor:"orange"}})),"right"===a&&Object(g.createElement)("div",{style:{height:"100%",width:3,backgroundColor:"white"}}))}}]),t}(g.Component),L=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).state={wantToPlaceNext:null},e.selfRef=null,e.getBoundingRect=function(){return e.selfRef&&e.selfRef.getBoundingClientRect?e.selfRef.getBoundingClientRect():null},e.canDrop=function(e){var t=B(e).draggedNodeType;return"col"===t||"row"===t||"markdown"===t||"image"===t||"layer"===t},e.shouldPlaceBefore=function(t,n){var r=R(t,e.getBoundingRect());return r&&("y"===n?r.top/r.height<.3:r.left/r.width<.3)},e.onDrop=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.canDrop(t.dataTransfer.types)){t.stopPropagation(),n||null===e.state.wantToPlaceNext||e.setState({wantToPlaceNext:null});var r=B(t.dataTransfer.types),a=r.draggedNodeId,o=r.draggedNodeType;if(a){var i=e.shouldPlaceBefore(t,"y");if("row"===o){var d=i?{beforeItemId:e.props.node.id}:{afterItemId:e.props.node.id};e.props.onChange(S(t.dataTransfer.types,e.props.node.parentId||"",Object(v.a)({},d,{isPlaceHolder:n}),e.props.value))}else{var l=e.shouldPlaceBefore(t,"x"),c=e.props.node.childrenIds,u=c.length,s=u?l?{beforeItemId:c[0]}:{afterItemId:c[u-1]}:null;e.props.onChange(S(t.dataTransfer.types,e.props.node.id,Object(v.a)({isPlaceHolder:n},s),e.props.value))}}}},e.onDragEnter=function(e){e.preventDefault()},e.onDragOver=function(t){var n=B(t.dataTransfer.types).draggedNodeType;if(e.canDrop(t.dataTransfer.types)&&(t.preventDefault(),t.stopPropagation()),"row"===n){var r=e.shouldPlaceBefore(t,"y");r&&"top"!==e.state.wantToPlaceNext?e.setState({wantToPlaceNext:"top"}):r||"bottom"===e.state.wantToPlaceNext||e.setState({wantToPlaceNext:"bottom"})}else{var a=e.shouldPlaceBefore(t,"x");e.setState({wantToPlaceNext:a?"firstChild":"lastChild"})}},e.onDragLeave=function(t){null!==e.state.wantToPlaceNext&&e.setState({wantToPlaceNext:null})},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.node,r=t.value,a=t.onChange,o=t.renderEditBlock,i=this.state.wantToPlaceNext,d="firstChild"===i?3:0;return Object(g.createElement)("div",{key:"row_"+n.id},"top"===i&&Object(g.createElement)("div",{style:{height:3,width:"100%",backgroundColor:"black"}}),Object(g.createElement)("div",{ref:function(t){return e.selfRef=t},onDragOver:this.onDragOver,onDragLeave:this.onDragLeave,onDragEnter:this.onDragEnter,onDrop:this.onDrop,draggable:!0,onDragStart:function(t){return T(t,e.props.node,e.getBoundingRect)},style:{position:"relative",height:n.height,width:n.width,borderStyle:"dashed",borderWidth:0,borderBottomWidth:1,backgroundColor:n.isPlaceHolder?"darkgrey":n.backgroundColor||"#b5bbb9b0"}},"firstChild"===i&&Object(g.createElement)("div",{style:{height:"100%",width:3,backgroundColor:"blue"}}),n.childrenIds.map(function(e){var t=r.byId[e],n=Object(g.createElement)("div",{className:"drag-node",key:"node_"+t.id,style:{position:"absolute",width:t.width,height:t.height,top:0,left:d}},o({node:t,renderEditBlock:o,value:r,onChange:a}));return d+=t.width,n}),"lastChild"===i&&Object(g.createElement)("div",{style:{position:"absolute",left:d,height:"100%",width:3,backgroundColor:"orange"}})),"bottom"===i&&Object(g.createElement)("div",{style:{height:3,width:"100%",backgroundColor:"green"}}))}}]),t}(g.Component),A=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).selfRef=null,e.getBoundingRect=function(){return e.selfRef&&e.selfRef.getBoundingClientRect?e.selfRef.getBoundingClientRect():null},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.props.node;return Object(g.createElement)("div",{ref:function(t){return e.selfRef=t},draggable:!0,onDragStart:function(t){return T(t,e.props.node,e.getBoundingRect)},style:{width:"100%",height:"100%",backgroundColor:"violet",padding:5,borderRadius:3}},Object(g.createElement)("img",{style:{width:"100%",height:"100%"},src:t.value}))}}]),t}(g.Component),F=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).selfRef=null,e.getBoundingRect=function(){return e.selfRef&&e.selfRef.getBoundingClientRect?e.selfRef.getBoundingClientRect():null},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.node,r=t.update,a=n.value;return Object(g.createElement)("div",{ref:function(t){return e.selfRef=t},draggable:!0,onDragStart:function(t){return T(t,e.props.node,e.getBoundingRect)},style:{width:"100%",height:"100%",backgroundColor:"#ffc0cb75",padding:5,borderRadius:3}},Object(g.createElement)("textarea",{className:"form-control",name:"value",placeholder:"Type here...",value:a,onChange:function(e){return r(n.id,{value:e.target.value})}}))}}]),t}(g.Component),_=function(e){var t=e.node,n=e.renderEditBlock,r=e.value,a=e.onChange,o=e.width,i=e.height,d=r.focusedNodeId;return Object(g.createElement)("div",{onClick:function(e){e.stopPropagation(),a(P(r,t))},style:t.id===d?{borderStyle:"dashed",borderWidth:1,borderColor:"orange"}:{}},Object(g.createElement)(m.ResizableBox,{className:"box",width:o,height:i,onResizeStart:function(e){e.preventDefault(),e.stopPropagation()},onResize:function(e,n){var o=n.size,i=o.width,d=o.height;a(x(r,t.id,{width:i,height:d}))}},"col"===t.type?Object(g.createElement)(M,{key:"col_"+t.id,node:t,renderEditBlock:n,value:r,onChange:a}):"row"===t.type?Object(g.createElement)(L,{key:"row_"+t.id,node:t,renderEditBlock:n,value:r,onChange:a}):"markdown"===t.type?Object(g.createElement)(F,{node:t,update:function(e,t){return a(x(r,e,t))}}):"layer"===t.type?Object(g.createElement)(W,{key:"layer_"+t.id,node:t,renderEditBlock:n,value:r,onChange:a}):Object(g.createElement)(A,{key:"image_"+t.id,node:t,renderEditBlock:n,value:r,onChange:a})))},H=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).state={value:e.props.value},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){if(this.props.onChange){var e=this.state.value;this.props.onChange(e)}}},{key:"componentDidUpdate",value:function(e,t){if(this.props.onChange&&this.state.value!==t.value){var n=this.state.value;this.props.onChange(n)}else this.props.value&&e.value!==this.props.value&&this.props.value!==this.state.value&&this.setState({value:this.props.value})}},{key:"render",value:function(){var e=this,t=this.props.renderEditBlock,n=this.state.value,r=n.byId[n.rootNodeId];return Object(g.createElement)("div",{style:{position:"relative",width:r.width,height:r.height}},Object(g.createElement)(M,{key:"col_"+r.id,node:r,renderEditBlock:t,value:this.state.value,onChange:function(t){return e.setState({value:t})}}))}}]),t}(g.Component);function z(e){return!!e.borderWidth&&e.borderWidth>0||!!e.borderTopWidth&&e.borderTopWidth>0||!!e.borderBottomWidth&&e.borderBottomWidth>0||!!e.borderLeftWidth&&e.borderLeftWidth>0||!!e.borderRightWidth&&e.borderRightWidth>0}H.defaultProps={renderEditBlock:function(e){var t=e.node,n=e.renderEditBlock,r=e.value,a=e.onChange;return Object(g.createElement)(_,{width:t.width,height:t.height,renderEditBlock:n,node:t,value:r,onChange:a})},onChange:function(e){}};var U=function(e){return{color:e.color||void 0,display:e.display||void 0,flexDirection:e.flexDirection||void 0,justifyContent:e.justifyContent||void 0,alignItems:e.alignItems||void 0,backgroundColor:e.backgroundColor||void 0,borderWidth:void 0!==e.borderWidth?e.borderWidth:0,borderTopWidth:void 0!==e.borderTopWidth?e.borderTopWidth:void 0,borderBottomWidth:void 0!==e.borderBottomWidth?e.borderBottomWidth:void 0,borderLeftWidth:void 0!==e.borderLeftWidth?e.borderLeftWidth:void 0,borderRightWidth:void 0!==e.borderRightWidth?e.borderRightWidth:void 0,borderStyle:e.borderStyle?e.borderStyle||void 0:z(e)?"solid":void 0}},J=function e(t){var n=t.node,r=t.byId;if(!n)return null;switch(n.type){case"markdown":return Object(g.createElement)("div",{key:n.id,style:Object(v.a)({},U(n),{height:n.height,width:n.width})},Object(g.createElement)(I.a,{source:n.value}));case"layer":return Object(g.createElement)("div",{key:n.id,style:Object(v.a)({position:"relative"},U(n),{height:n.height,width:n.width})},n.childrenIds.map(function(t){var n=r[t];return Object(g.createElement)("div",{key:n.id,style:{position:"absolute",top:n.top||0,left:n.left||0}},Object(g.createElement)(e,{byId:r,node:r[t]}))}));case"image":return Object(g.createElement)("div",{key:n.id,style:{height:"100%",width:"100%"}},Object(g.createElement)("img",{src:n.value}));case"col":return Object(g.createElement)("div",{key:n.id,style:Object(v.a)({},U(n),{width:n.width,height:n.height,display:"flex",flexDirection:"column"})},n.childrenIds.map(function(t){return Object(g.createElement)(e,{key:"prev_"+t,byId:r,node:r[t]})}));case"row":return Object(g.createElement)("div",{key:n.id,style:Object(v.a)({},U(n),{width:n.width,height:n.height,display:"flex",flexDirection:"row"})},n.childrenIds.map(function(t){return Object(g.createElement)(e,{key:"prev_"+t,byId:r,node:r[t]})}))}},V=function(e){var t=e.byId,n=e.node,r=e.onSelect,a=e.navClassName,o=void 0===a?"breadcrumb":a,i=e.itemClassName,d=void 0===i?"breadcrumb-item btn btn-link active":i;if(!n)return null;for(var l=[],c=n.id;c;){var u=t[c];if(!u)break;l.unshift({label:"".concat(u.type,"-").concat(u.id),id:u.id}),c=u.parentId}return Object(g.createElement)("nav",{"aria-label":"breadcrumb"},Object(g.createElement)("ol",{className:o},l.map(function(e){return Object(g.createElement)("li",{onClick:function(){return r(e.id)},key:"crumb_"+e.id,className:d,"aria-current":"page"},e.label)})))};function X(e,t){var n=e.byId,r=e.rootNodeId,a=e.focusedNodeId,o=(t?t.parentId:a)||r,i=n[o],d=["col","layer"];if((!i||d.indexOf(i.type)<0)&&(!(i=(o=i?i.parentId:null)?n[o]:i)||d.indexOf(i.type)<0))return{error:"Can only add a row inside "+d.join(", ")+", please select a column by clicking on it",value:e};var l=N(n,"row"),c=Object(v.a)({type:"row",height:100,width:i&&i.width?i.width:500},t,{id:l,name:l,childrenIds:[]}),u={};if("col"===(i=(n=C(n,c,i.id))[o]).type&&i&&i.childrenIds.length>=1){var s=i.height/i.childrenIds.length,h=!0,p=!1,f=void 0;try{for(var b,g=i.childrenIds[Symbol.iterator]();!(h=(b=g.next()).done);h=!0){var m=b.value;u[m]=Object(v.a)({},n[m],{height:s})}}catch(y){p=!0,f=y}finally{try{h||null==g.return||g.return()}finally{if(p)throw f}}}return{createdBlock:c,value:Object(v.a)({},e,{byId:Object(v.a)({},n,u),focusedNodeId:a||c.id})}}function Y(e,t){var n=e.byId,r=e.rootNodeId,a=e.focusedNodeId,o=(t?t.parentId:a)||r,i=n[o],d=["row","layer"];if((!i||d.indexOf(i.type)<0)&&(!(i=(o=i?i.parentId:null)?n[o]:i)||d.indexOf(i.type)<0))return{error:"Can only add a column inside "+d.join(", ")+", please select a column by clicking on it",value:e};var l=N(n,"col"),c=Object(v.a)({type:"col",width:100,height:i.height?i.height:100},t,{id:l,name:l,childrenIds:[]}),u={};if("row"===(i=(n=C(n,c,o))[o]).type&&i&&i.childrenIds.length>=1){var s=i.width/i.childrenIds.length,h=!0,p=!1,f=void 0;try{for(var b,g=i.childrenIds[Symbol.iterator]();!(h=(b=g.next()).done);h=!0){var m=b.value;u[m]=Object(v.a)({},n[m],{width:s})}}catch(y){p=!0,f=y}finally{try{h||null==g.return||g.return()}finally{if(p)throw f}}}return{createdBlock:c,value:Object(v.a)({},e,{byId:Object(v.a)({},n,u),focusedNodeId:a||c.id})}}var $=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).state={selectedMenu:null},e.renderColorMenuItem=function(t,n){var r=e.props.value,a=r.byId,o=r.focusedNodeId,i=e.state.selectedMenu;if(o){var d=o?a[o]:null;return Object(g.createElement)(g.Fragment,null,Object(g.createElement)("div",{style:{borderStyle:"solid",borderWidth:1,backgroundColor:d[t]||"transparent"},onClick:function(n){return e.toggleMenu(t)}},n),i===t&&Object(g.createElement)("div",{style:{position:"absolute",zIndex:100}},Object(g.createElement)(O.SketchPicker,{color:d[t]||void 0,onChange:function(n){var r=n.hex;e.props.updateBlock(o,Object(b.a)({},t,r)),e.toggleMenu(t)}})))}},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"toggleMenu",value:function(e){this.setState({selectedMenu:this.state.selectedMenu===e?null:e})}},{key:"render",value:function(){var e=this,t=this.props,n=t.buttonClassName,r=t.breadCrumbsProps,a=t.value,o=a.byId,i=a.rootNodeId,d=a.focusedNodeId,l=d?o[d]:i||null,c=this.props.focusNode;return Object(g.createElement)("div",null,Object(g.createElement)("div",null,Object(g.createElement)("button",{className:n,onClick:function(){return e.props.addRow()}},"Add Row"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.addCol()}},"Add Col"),Object(g.createElement)("button",{className:n,onClick:this.props.removeFocused},"Remove Selected"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.addMarkDown()}},"Add Markdown"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.addImage()}},"Add Image"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.addLayer()}},"Add Layer")),Object(g.createElement)("div",null,Object(g.createElement)("button",{className:n,onClick:function(){return e.props.copyFocused()}},"Copy"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.paste()}},"Paste")),l&&Object(g.createElement)("div",null,this.renderColorMenuItem("color","Text"),this.renderColorMenuItem("backgroundColor","Background"),Object(g.createElement)(V,Object.assign({onSelect:function(e){return c(e,!0)},byId:o,node:l},r)),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.moveInDirection(l.id,"up")}},"Move Up"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.moveInDirection(l.id,"down")}},"Move Down"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.moveInDirection(l.id,"left")}},"Move Left"),Object(g.createElement)("button",{className:n,onClick:function(){return e.props.moveInDirection(l.id,"right")}},"Move Right")))}}]),t}(g.Component);$.defaultProps={buttonClassName:"btn btn default"};var q=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(h.a)(t).apply(this,arguments))).addRow=function(t){var n=X(e.props.value,t),r=n.error,a=n.value;r?alert(r):e.props.onChange(a)},e.addCol=function(t){var n=Y(e.props.value,t),r=n.error,a=n.value;r?alert(r):e.props.onChange(a)},e.addMarkDown=function(t){var n=function(e,t){var n=e.byId,r=e.rootNodeId,a=e.focusedNodeId,o=(t?t.parentId:a)||r,i=n[o],d=["row","col","layer"];if(!i||d.indexOf(i.type)<0)return{error:"Can only add markdown text inside "+d.join(", "),value:e};var l=N(n,"markdown"),c=Object(v.a)({type:"markdown",width:Math.max(1,i.width-20),height:Math.max(1,i.height-20)},t,{id:l,name:l,childrenIds:[]});return{createdBlock:c,value:Object(v.a)({},e,{byId:C(n,c,o),focusedNodeId:c.id})}}(e.props.value,t),r=n.error,a=n.value;r?alert(r):e.props.onChange(a)},e.addImage=function(t){var n=function(e,t){var n=t&&t.value?t.value:window.prompt("Please enter image url","http://lorempixel.com/200/200/");if(null===n)return{error:"no image selected",value:e};var r=e.byId,a=e.rootNodeId,o=e.focusedNodeId,i=(t?t.parentId:o)||a,d=r[i],l=["row","col","layer"];if(!d||l.indexOf(d.type)<0)return{error:"Can only add an image inside "+l.join(", "),value:e};var c=N(r,"image"),u=Object(v.a)({type:"image",value:n,width:Math.max(1,d.width-20),height:Math.max(1,d.height-20)},t,{id:c,name:c,childrenIds:[]});return{createdBlock:u,value:Object(v.a)({},e,{byId:C(r,u,i),focusedNodeId:u.id})}}(e.props.value,t),r=n.error,a=n.value;r?alert(r):e.props.onChange(a)},e.addLayer=function(t){var n=function(e,t){var n=e.byId,r=e.rootNodeId,a=e.focusedNodeId,o=(t?t.parentId:a)||r,i=n[o],d=["row","col","layer"];if(!i||d.indexOf(i.type)<0)return{error:"Can only add a layer inside "+d.join(", "),value:e};var l=N(n,"layer"),c=Object(v.a)({type:"layer",width:Math.max(1,i.width-20),height:Math.max(1,i.height-20)},t,{id:l,name:l,childrenIds:[]});return{createdBlock:c,value:Object(v.a)({},e,{byId:C(n,c,o),focusedNodeId:c.id})}}(e.props.value,t),r=n.error,a=n.value;r?alert(r):e.props.onChange(a)},e.removeFocused=function(){var t=e.props.value.focusedNodeId;t&&e.destroy(t)},e.focusNode=function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r=e.props.value;e.props.onChange(P(r,t,n))},e.create=function(t){e.props.onChange(function(e,t){var n=e.byId,r=N(n),a=Object(v.a)({},n[r],t);return Object(v.a)({},e,{byId:w(n,a)})}(e.props.value,t))},e.updateBlock=function(t,n){e.props.onChange(x(e.props.value,t,n))},e.destroy=function(t){e.props.onChange(function(e,t){var n=e.byId,r=e.rootNodeId,a=e.focusedNodeId;return r===t?(alert("Cannot destroy root node"),Object(v.a)({},e,{byId:n,focusedNodeId:a})):Object(v.a)({},e,{byId:j(n,t),focusedNodeId:a===t?null:a})}(e.props.value,t))},e.move=function(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.props.onChange(D(e.props.value,t,n,r))},e.moveInDirection=function(t,n){e.props.onChange(function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=e.byId,a=r[t];if(!a)return e;var o=a.parentId;if(!o)return e;var i=r[o];if(!i)return e;var d=r[i.parentId],l=i.childrenIds.indexOf(t);if(l<0)return e;var c={};if("row"===i.type)if("left"===n.direction){if(0===l)return e;c={beforeItemId:i.childrenIds[l-1]}}else{if("right"!==n.direction){if(d&&"col"===d.type){var u=d.childrenIds.indexOf(i.id);return u>0&&"up"===n.direction?D(e,t,d.childrenIds[u-1]):u<d.childrenIds.length-1&&"down"===n.direction?D(e,t,d.childrenIds[u+1]):e}return e}if(l>=i.childrenIds.length-1)return e;c={afterItemId:i.childrenIds[l+1]}}else if("col"===i.type)if("up"===n.direction){if(0===l)return e;c={beforeItemId:i.childrenIds[l-1]}}else{if("down"!==n.direction){if(d&&"row"===d.type){var s=d.childrenIds.indexOf(i.id);return s>0&&"left"===n.direction?D(e,t,d.childrenIds[s-1]):s<d.childrenIds.length-1&&"right"===n.direction?D(e,t,d.childrenIds[s+1]):e}return e}if(l>=i.childrenIds.length-1)return e;c={afterItemId:i.childrenIds[l+1]}}else if("layer"===i.type){var h=("up"===n.direction?-1:"down"===n.direction?1:0)*(n.stepPx||1),p=("left"===n.direction?-1:"right"===n.direction?1:0)*(n.stepPx||1);c={absolutePos:{top:(a.top||0)+h,left:(a.left||0)+p}}}return Object(v.a)({},e,{byId:C(r,Object(v.a)({},a,{isPlaceHolder:c.isPlaceHolder},c.absolutePos?{top:c.absolutePos.top,left:c.absolutePos.left}:{}),o,c)})}(e.props.value,t,{direction:n}))},e.copyFocused=function(){var t=e.props.value,n=t.byId,r=t.focusedNodeId;if(r){var a=n[r];e.props.onChange(Object(v.a)({},e.props.value,{copiedNode:k(n,a)}))}},e.paste=function(){e.props.onChange(E(e.props.value))},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.UiComponent,r=t.onChange,a=t.value,o=t.controlUiProps;return Object(g.createElement)(n,Object.assign({value:a,onChange:r,addRow:this.addRow,addCol:this.addCol,addImage:this.addImage,addLayer:this.addLayer,addMarkDown:this.addMarkDown,moveInDirection:this.moveInDirection,copyFocused:this.copyFocused,paste:this.paste,focusNode:function(t,n){return e.focusNode(a.byId[t],n)},removeFocused:this.removeFocused,updateBlock:this.updateBlock},o))}}]),t}(g.Component);q.defaultProps={UiComponent:$};n(425),n(426);var G=n(467),K=n(473),Q=n(165),Z=n.n(Q),ee=n(160),te=n.n(ee),ne=n(164),re=n.n(ne),ae=n(161),oe=n.n(ae),ie=n(162),de=n.n(ie),le=n(163),ce=n.n(le),ue=n(475),se=n(472),he=Object(G.a)(function(e){return{button:{margin:e.spacing(1)},fab:{margin:e.spacing(1)},textField:{marginLeft:e.spacing(1),marginRight:e.spacing(1),width:60},input:{display:"none"}}}),pe=function(e){var t=Object(r.useState)(null),n=Object(d.a)(t,2),o=n[0],i=n[1],l=he(),c=function(e){i(o===e?null:e)},u=function(t){var n=e.value,r=n.byId,i=n.focusedNodeId;if(i){var d=i?r[i]:null;return a.a.createElement(a.a.Fragment,null,a.a.createElement(fe,{onClick:function(){return c(t)},color:d[t]}),o===t&&a.a.createElement("div",{style:{position:"absolute",zIndex:100}},a.a.createElement(O.SketchPicker,{color:d[t]||void 0,onChange:function(n){var r=n.hex;e.updateBlock(i,Object(b.a)({},t,r)),c(t)}})))}},s=e.breadCrumbsProps,h=e.value,p=h.byId,f=(h.rootNodeId,h.focusedNodeId),v=f?p[f]:null,g=e.focusNode,m=l.button;return a.a.createElement("div",null,a.a.createElement("div",null,a.a.createElement(ue.a,{title:"Add Row (position children horizontally)","aria-label":"Add"},a.a.createElement(K.a,{"aria-label":"add row",className:m,onClick:function(){return e.addRow()}},"+ Row")),a.a.createElement(ue.a,{title:"Add Col (position children vertically)","aria-label":"Add"},a.a.createElement(K.a,{"aria-label":"add column",className:m,onClick:function(){return e.addCol()}},"+ Col")),a.a.createElement(ue.a,{title:"Add Layer (position children absolutely)","aria-label":"Add"},a.a.createElement(K.a,{"aria-label":"add layer",className:m,onClick:function(){return e.addLayer()}},"+ Layer")),a.a.createElement(ue.a,{title:"Add Text (markdown)","aria-label":"Add"},a.a.createElement(K.a,{"aria-label":"add markdown",className:m,onClick:function(){return e.addMarkDown()}},"+ Text")),a.a.createElement(K.a,{"aria-label":"add image",className:m,onClick:function(){return e.addImage()}},"+ Image"),a.a.createElement(K.a,{"aria-label":"add image",className:m,onClick:function(){e.onChange(function(e,t){if(!t)return alert("Please select node to add table to"),e;var n=window.prompt("Enter number or rows (max 10)","5");if(null===n)return e;var r=window.prompt("Enter number or columns (max 10)","5");if(null===r)return e;var a=window.prompt("Enter table width (max 400)","300");if(null===a)return e;var o=window.prompt("Enter table height (max 400)","300");if(null===o)return e;var i=Math.min(parseInt(a,10),400),d=Math.min(parseInt(o,10),400),l=Y(e,{width:i,height:d,parentId:t}),c=l.value,u=l.createdBlock;if(!u)return e;e=c;for(var s=u.id,h=Math.max(1,Math.min(parseInt(n,10),10)),p=Math.max(1,Math.min(parseInt(r,10),10)),f=0;f<h;++f){var b=X(e,{height:d/h,parentId:s}),v=b.value,g=b.createdBlock;if(!g)break;e=v;for(var m=0;m<p;++m){var y=Y(e,{parentId:g.id,height:g.height,width:g.width/p}),I=y.value,O=y.createdBlock;if(!O)break;e=I}}return e}(e.value,e.value.focusedNodeId))}},"+ Table")),v&&a.a.createElement("div",{style:{paddingLeft:15}},u("color"),u("backgroundColor"),a.a.createElement(K.a,{className:m,onClick:function(){return e.moveInDirection(v.id,"left")}},a.a.createElement(te.a,null)),a.a.createElement(K.a,{className:m,onClick:function(){return e.moveInDirection(v.id,"right")}},a.a.createElement(oe.a,null)),a.a.createElement(K.a,{className:m,onClick:function(){return e.moveInDirection(v.id,"up")}},a.a.createElement(de.a,null)),a.a.createElement(K.a,{className:m,onClick:function(){return e.moveInDirection(v.id,"down")}},a.a.createElement(ce.a,null)),a.a.createElement(ue.a,{title:"Flip to front","aria-label":"Add"},a.a.createElement(K.a,{className:m,onClick:function(){return e.onChange(function(e,t){if(!t)return e;var n=e.byId,r=n[t];if(!r)return e;var a=r.parentId,o=n[a];return o?D(e,t,a,{afterItemId:o.childrenIds[o.childrenIds.length-1]}):e}(e.value,e.value.focusedNodeId))}},a.a.createElement(re.a,null))),a.a.createElement(K.a,{"aria-label":"copy",className:m,onClick:function(){return e.copyFocused()}},"Copy"),a.a.createElement(K.a,{"aria-label":"paste",className:m,onClick:function(){return e.paste()}},"Paste"),a.a.createElement(K.a,{"aria-label":"delete",className:l.fab,onClick:e.removeFocused},a.a.createElement(Z.a,null)),a.a.createElement(ue.a,{title:"Click breadcrumb to change focused block","aria-label":"Add"},a.a.createElement(K.a,null,a.a.createElement(V,Object.assign({onSelect:function(e){return g(e,!0)},byId:p,node:v},s)))),a.a.createElement("div",null,[{prop:"width",numeric:!0},{prop:"height",numeric:!0},{prop:"top",numeric:!0},{prop:"left",numeric:!0},{prop:"borderWidth",numeric:!0},{prop:"borderTopWidth",numeric:!0},{prop:"borderBottomWidth",numeric:!0},{prop:"borderLeftWidth",numeric:!0},{prop:"borderRightWidth",numeric:!0},{prop:"borderStyle",numeric:!1}].map(function(t){return a.a.createElement(se.a,{key:"prop_"+t.prop,label:t.prop,value:void 0===v[t.prop]?"":v[t.prop],onChange:(n=v.id,r=t.prop,o=t.numeric,function(t){e.updateBlock(n,Object(b.a)({},r,o?t.target.value?parseInt(t.target.value,10):void 0:t.target.value))}),type:t.numeric?"number":void 0,className:l.textField,InputLabelProps:{shrink:!0},margin:"normal"});var n,r,o}))))},fe=function(e){return a.a.createElement(K.a,{size:"small",style:{borderWidth:1,fontSize:11,borderStyle:"solid",justifyContent:"flex-start"},onClick:e.onClick},a.a.createElement("div",{style:{display:"flex"}},a.a.createElement("div",{style:{borderWidth:1,borderRadius:3,borderStyle:"solid",width:20,height:20,backgroundColor:e.color||void 0}}),"\xa0",e.color?"":"none"))};var be=Object(l.a)({breadcrumbNav:{display:"flex",listStyleType:"none",backgroundColor:"#f5f5f5",padding:10,flexDirection:"row"},breadcrumbItem:{cursor:"pointer","&::before":{content:'"  /  "'},marginRight:5}}),ve=function(){var e=be(),t=Object(r.useState)({copiedNode:null,focusedNodeId:"layer1",byId:{container1:{id:"container1",type:"col",name:"container1",parentId:null,width:500,height:300,childrenIds:["layer1"]},layer1:{id:"layer1",type:"layer",name:"layer1",parentId:"container1",width:510,height:310,childrenIds:["title","subheading","content","image1","row1"]},title:{id:"title",type:"markdown",name:"title",parentId:"layer1",color:"#4A90E2",backgroundColor:"#E9E9E9",width:450,height:30,top:-10,left:10,value:"## Title",childrenIds:[]},subheading:{id:"subheading",type:"markdown",name:"subheading",parentId:"layer1",width:450,height:40,top:30,left:10,value:"#### Subheading",childrenIds:[]},image1:{id:"image1",type:"image",name:"image1",parentId:"layer1",width:200,height:200,top:90,left:10,value:"http://lorempixel.com/200/200/",childrenIds:[]},content:{id:"content",type:"markdown",name:"content",parentId:"layer1",width:240,height:40,top:90,left:220,value:"### Content",childrenIds:[]},row1:{id:"row1",type:"row",name:"row1",parentId:"layer1",width:240,height:40,top:230,left:220,childrenIds:[]}},rootNodeId:"container1"}),n=Object(d.a)(t,2),o=n[0],i=n[1];return a.a.createElement("div",null,a.a.createElement(q,{value:o,onChange:function(e){return console.log("VAL",e)||i(e)},UiComponent:pe,controlUiProps:{breadCrumbsProps:{navClassName:e.breadcrumbNav,itemClassName:e.breadcrumbItem}}}),a.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",flexDirection:"row"}},a.a.createElement(H,{value:o,onChange:i}),a.a.createElement("div",{style:{marginLeft:30,borderWidth:1,borderStyle:"dashed"}},a.a.createElement(J,{byId:o.byId,node:o.byId[o.rootNodeId]}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(a.a.createElement(ve,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[170,1,2]]]);
//# sourceMappingURL=main.0fe97ad8.chunk.js.map