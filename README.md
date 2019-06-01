# React Movable Block Editor

React component for creating layouts and content via drag-and-drop blocks.

The output is an object that can be serialized to json, React, html.

### Installation:

`npm install react-movable-block-editor react-color react-resizable react-markdown lodash-es --save`



### Demos:

- [Editor demo](https://nyura123.github.io/react-movable-block-editor/)

- [Grid demo](https://nyura123.github.io/react-movable-block-grid-example/)


### Remix on Glitch:

- [Editor demo](https://react-movable-block-editor.glitch.me/)

- [Grid demo](https://react-movable-block-editor-grid.glitch.me/)

### Usage:

```js

import {
  BlockEditor,
  Preview,
  BlockEditorControl,
  BlockEditorValue,
} from 'react-movable-block-editor';
import 'react-movable-block-editor/css/drag.css';
import 'react-resizable/css/styles.css';

const App: React.FC = () => {
  const [editorState, setEditorState] = useState<BlockEditorValue>({
    copiedNode: null,
    focusedNodeId: null,
    undoStack: [],
    redoStack: [],
    byId: {
      container1: {
        id: 'container1',
        type: 'layer',
        name: 'container1',
        parentId: null, // root
        width: 500,
        height: 300,
        childrenIds: [],
      },
    },
    rootNodeId: 'container1',
  });

  return (
    <div>
      <BlockEditorControl
        value={editorState}
        onChange={v => (console.log('VAL', v) as any) || setEditorState(v)}
      />
      <div>
        <BlockEditor value={editorState} onChange={setEditorState} />
      </div>
      <div style={{ borderWidth: 1, borderStyle: 'dashed' }}>
        <Preview
          byId={editorState.byId}
          node={editorState.byId[editorState.rootNodeId]}
        />
      </div>
    </div>
  );
};
```

### Examples

- [editor](https://github.com/nyura123/react-movable-block-editor/tree/master/examples/editor-example)

- [grid](https://github.com/nyura123/react-movable-block-editor/tree/master/examples/grid-example)

### Running an example

`cd example/editor-example`

`npm install`

`npm start`

![grid-blocks](grid-blocks.gif)

## Bootstrapped with [TSDX](https://github.com/palmerhq/tsdx)
