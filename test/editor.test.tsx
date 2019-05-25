import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BlockEditor } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <BlockEditor
        value={{
          copiedNode: null,
          focusedNodeId: 'row1',
          byId: {
            container1: {
              id: 'container1',
              type: 'col',
              name: 'container1',
              parentId: null, // root
              width: 500,
              height: 300,
              childrenIds: ['row1'],
            },
            row1: {
              id: 'row1',
              type: 'row',
              name: 'row1',
              parentId: 'container1',
              width: 500,
              height: 150,
              childrenIds: [],
            },
          },
          rootNodeId: 'container1',
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
