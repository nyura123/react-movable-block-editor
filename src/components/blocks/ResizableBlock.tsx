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
    undoRedoVersion,
    changeBlocks,
    focusedNodeId,
    width,
    height,
  } = props;

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        changeBlocks(value => focusNode(value, node));
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
          changeBlocks(value => update(value, node.id, { width, height }));
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
            changeBlocks={changeBlocks}
            focusedNodeId={focusedNodeId}
            undoRedoVersion={undoRedoVersion}
          />
        ) : node.type === 'row' ? (
          <DraggableRowBlock
            key={'row_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            changeBlocks={changeBlocks}
            focusedNodeId={focusedNodeId}
            undoRedoVersion={undoRedoVersion}
          />
        ) : node.type === 'markdown' ? (
          <MarkdownBlock
            node={node}
            update={(nodeId, props) =>
              changeBlocks(value => update(value, nodeId, props))
            }
          />
        ) : node.type === 'layer' ? (
          <AbsoluteLayerBlock
            key={'layer_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            changeBlocks={changeBlocks}
            focusedNodeId={focusedNodeId}
            undoRedoVersion={undoRedoVersion}
          />
        ) : (
          <ImageBlock
            key={'image_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            getNode={getNode}
            changeBlocks={changeBlocks}
            focusedNodeId={focusedNodeId}
            undoRedoVersion={undoRedoVersion}
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
  changeBlocks,
  undoRedoVersion,
  focusedNodeId,
}: BlockProps) => (
  <ResizableBlock
    width={node.width}
    height={node.height}
    renderEditBlock={renderEditBlock}
    node={node}
    getNode={getNode}
    changeBlocks={changeBlocks}
    focusedNodeId={focusedNodeId}
    undoRedoVersion={undoRedoVersion}
  />
);
