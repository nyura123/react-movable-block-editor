import * as React from 'react';
import { ResizableBox } from 'react-resizable';
import { DraggableColBlock } from './DraggableColBlock';
import { DraggableRowBlock } from './DraggableRowBlock';
import { AbsoluteLayerBlock } from './AbsoluteLayerBlock';
import { MarkdownBlock } from './MarkdownBlock';
import { ImageBlock } from './ImageBlock';

// import 'react-resizable/css/styles.css'
import { BlockProps } from './BlockProps';
import { focusNode, update } from '../editor/helpers';

export const ResizableBlock = (
  props: BlockProps & { width: number; height: number }
) => {
  const {
    node,
    renderEditBlock,
    getNode,
    sendOp,
    focusedNodeId,
    width,
    height,
  } = props;

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        sendOp(value => focusNode(value, node));
      }}
      style={
        node.id === focusedNodeId
          ? { borderStyle: 'dashed', borderWidth: 1, borderColor: 'orange' }
          : {}
      }
    >
      <ResizableBox
        className="box"
        width={width}
        height={height}
        onResizeStart={event => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onResize={(_event, { size }) => {
          const { width, height } = size;
          sendOp(value => update(value, node.id, { width, height }));
        }}
        // minConstraints={[20, 20]}
        // maxConstraints={[300, 300]}
      >
        {node.type === 'col' ? (
          <DraggableColBlock
            key={'col_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            sendOp={sendOp}
            focusedNodeId={focusedNodeId}
          />
        ) : node.type === 'row' ? (
          <DraggableRowBlock
            key={'row_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            sendOp={sendOp}
            focusedNodeId={focusedNodeId}
          />
        ) : node.type === 'markdown' ? (
          <MarkdownBlock
            node={node}
            update={(nodeId, props) =>
              sendOp(value => update(value, nodeId, props))
            }
          />
        ) : node.type === 'layer' ? (
          <AbsoluteLayerBlock
            key={'layer_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            sendOp={sendOp}
            focusedNodeId={focusedNodeId}
          />
        ) : (
          <ImageBlock
            key={'image_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            sendOp={sendOp}
            focusedNodeId={focusedNodeId}
          />
        )}
      </ResizableBox>
    </div>
  );
};

export const defaultRenderEditBlock = ({
  node,
  renderEditBlock,
  getNode,
  sendOp,
  focusedNodeId,
}: BlockProps) => (
  <ResizableBlock
    width={node.width}
    height={node.height}
    renderEditBlock={renderEditBlock}
    node={node}
    getNode={getNode}
    sendOp={sendOp}
    focusedNodeId={focusedNodeId}
  />
);
