import { BlockEditorValue } from '../src';
import { deepCopy, paste } from '../src/components/editor/helpers';

describe('copy-paste', () => {
  it('works', () => {
    const value: BlockEditorValue = {
      copiedNode: null,
      rootNodeId: 'container1',
      focusedNodeId: 'layer1',
      undoStack: [],
      redoStack: [],
      byId: {
        container1: {
          id: 'container1',
          type: 'col',
          name: 'container1',
          parentId: null, // root
          width: 500,
          height: 300,
          childrenIds: ['layer1'],
        },
        layer1: {
          id: 'layer1',
          type: 'layer',
          name: 'layer1',
          parentId: 'container1',
          width: 510,
          height: 310,
          childrenIds: ['title', 'row1'],
        },
        title: {
          id: 'title',
          type: 'markdown',
          name: 'title',
          parentId: 'layer1',
          color: '#4A90E2',
          backgroundColor: '#E9E9E9',
          width: 450,
          height: 30,
          top: -10,
          left: 10,
          value: '## Title',
          childrenIds: [],
        },
        row1: {
          id: 'row1',
          type: 'row',
          name: 'row1',
          value: { one: 'one', two: [1, 2, 3] },
          parentId: 'layer1',
          width: 240,
          height: 40,
          top: 230,
          left: 220,
          childrenIds: [],
        },
      },
    };
    const copiedNode = deepCopy(value.byId, value.byId['layer1']);

    // make sure this doesn't impact the copy
    value.byId['row1'].value['one'] = 'one_changed';

    const pastedValue = paste({ ...value, copiedNode });

    expect(pastedValue).toEqual({
      rootNodeId: 'container1',
      focusedNodeId: 'layer1',
      undoStack: [],
      redoStack: [],
      copiedNode: {
        children: [
          {
            backgroundColor: '#E9E9E9',
            children: [],
            childrenIds: [],
            color: '#4A90E2',
            height: 30,
            id: 'title',
            left: 10,
            name: 'title',
            parentId: 'layer1',
            top: -10,
            type: 'markdown',
            value: '## Title',
            width: 450,
          },
          {
            children: [],
            childrenIds: [],
            height: 40,
            id: 'row1',
            value: { one: 'one', two: [1, 2, 3] },
            left: 220,
            name: 'row1',
            parentId: 'layer1',
            top: 230,
            type: 'row',
            width: 240,
          },
        ],
        childrenIds: ['title', 'row1'],
        height: 310,
        id: 'layer1',
        name: 'layer1',
        parentId: 'container1',
        type: 'layer',
        value: undefined,
        width: 510,
      },

      byId: {
        container1: {
          id: 'container1',
          type: 'col',
          name: 'container1',
          parentId: null, // root
          width: 500,
          height: 300,
          childrenIds: ['layer1', 'layer_4'],
        },

        layer1: {
          id: 'layer1',
          type: 'layer',
          name: 'layer1',
          parentId: 'container1',
          width: 510,
          height: 310,
          childrenIds: ['title', 'row1'],
        },
        title: {
          id: 'title',
          type: 'markdown',
          name: 'title',
          parentId: 'layer1',
          color: '#4A90E2',
          backgroundColor: '#E9E9E9',
          width: 450,
          height: 30,
          top: -10,
          left: 10,
          value: '## Title',
          childrenIds: [],
        },
        row1: {
          id: 'row1',
          type: 'row',
          name: 'row1',
          value: { one: 'one_changed', two: [1, 2, 3] },
          parentId: 'layer1',
          width: 240,
          height: 40,
          top: 230,
          left: 220,
          childrenIds: [],
        },

        // pasted
        layer_4: {
          children: undefined,
          childrenIds: ['markdown_5', 'row_6'],
          height: 310,
          id: 'layer_4',
          name: 'layer1',
          parentId: 'container1',
          type: 'layer',
          value: undefined,
          width: 510,
        },
        markdown_5: {
          backgroundColor: '#E9E9E9',
          children: undefined,
          childrenIds: [],
          color: '#4A90E2',
          height: 30,
          id: 'markdown_5',
          left: 10,
          name: 'title',
          parentId: 'layer_4',
          top: -10,
          type: 'markdown',
          value: '## Title',
          width: 450,
        },
        row_6: {
          children: undefined,
          childrenIds: [],
          height: 40,
          id: 'row_6',
          left: 220,
          name: 'row1',
          parentId: 'layer_4',
          top: 230,
          type: 'row',
          value: { one: 'one', two: [1, 2, 3] },
          width: 240,
        },
      },
    });
  });
});
