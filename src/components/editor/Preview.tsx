import * as React from 'react';
import MarkDown from 'react-markdown';
import { ById, BlockNode } from '../../data';

export const Preview = (props: { byId: ById; node: BlockNode }) => {
  const { node, byId } = props;

  switch (node.type) {
    case 'markdown':
      return (
        <div
          key={node.id}
          style={{
            color: node.color || undefined,
            backgroundColor: node.backgroundColor || undefined,
            height: node.height,
            width: node.width,
          }}
        >
          <MarkDown source={node.value} />
        </div>
      );

    case 'layer':
      return (
        <div
          key={node.id}
          style={{
            // flex: 1,
            position: 'relative',
            color: node.color || undefined,
            backgroundColor: node.backgroundColor || undefined,
            height: node.height,
            width: node.width,
          }}
        >
          {node.childrenIds.map(id => {
            const childNode = byId[id];
            return (
              <div
                key={childNode.id}
                style={{
                  position: 'absolute',
                  top: childNode.top || 0,
                  left: childNode.left || 0,
                }}
              >
                <Preview byId={byId} node={byId[id]} />
              </div>
            );
          })}
        </div>
      );
    case 'image':
      return (
        <div key={node.id} style={{ height: '100%', width: '100%' }}>
          <img src={node.value} />
        </div>
      );
    case 'col':
      return (
        <div
          key={node.id}
          style={{
            // flex: 1,
            width: node.width,
            backgroundColor: node.backgroundColor || undefined,
            color: node.color || undefined,
            height: node.height,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* <div>{node.name}</div> */}
          {node.childrenIds.map(id => (
            <Preview key={'prev_' + id} byId={byId} node={byId[id]} />
          ))}
        </div>
      );
    case 'row':
      return (
        <div
          key={node.id}
          style={{
            // flex: 1,
            width: node.width,
            backgroundColor: node.backgroundColor || undefined,
            color: node.color || undefined,
            height: node.height,
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {node.childrenIds.map(id => (
            <Preview key={'prev_' + id} byId={byId} node={byId[id]} />
          ))}
        </div>
      );
  }
};
