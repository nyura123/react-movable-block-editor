import * as React from 'react';
import MarkDown from 'react-markdown';
import { ById, BlockNode } from '../../data';

function hasBorder(node: BlockNode) {
  return (
    (!!node.borderWidth && node.borderWidth > 0) ||
    (!!node.borderTopWidth && node.borderTopWidth > 0) ||
    (!!node.borderBottomWidth && node.borderBottomWidth > 0) ||
    (!!node.borderLeftWidth && node.borderLeftWidth > 0) ||
    (!!node.borderRightWidth && node.borderRightWidth > 0)
  );
}
const copyBasicProps = (node: BlockNode) => ({
  color: node.color || undefined,
  backgroundColor: node.backgroundColor || undefined,
  borderWidth: node.borderWidth !== undefined ? node.borderWidth : undefined,
  borderTopWidth:
    node.borderTopWidth !== undefined ? node.borderTopWidth : undefined,
  borderBottomWidth:
    node.borderBottomWidth !== undefined ? node.borderBottomWidth : undefined,
  borderLeftWidth:
    node.borderLeftWidth !== undefined ? node.borderLeftWidth : undefined,
  borderRightWidth:
    node.borderRightWidth !== undefined ? node.borderRightWidth : undefined,
  borderStyle: !node.borderStyle
    ? hasBorder(node)
      ? 'solid'
      : undefined
    : node.borderStyle || undefined,
});

export const Preview = (props: { byId: ById; node: BlockNode }) => {
  const { node, byId } = props;
  if (!node) return null;

  switch (node.type) {
    case 'markdown':
      return (
        <div
          key={node.id}
          style={{
            ...copyBasicProps(node),
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
            ...copyBasicProps(node),
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
            ...copyBasicProps(node),
            width: node.width,
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
            ...copyBasicProps(node),
            width: node.width,
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
