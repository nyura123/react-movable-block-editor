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
  const { node, renderEditBlock, value, onChange, width, height } = props;
  const { focusedNodeId } = value;

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        onChange(focusNode(value, node));
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
          onChange(update(value, node.id, { width, height }));
        }}
        // minConstraints={[20, 20]}
        // maxConstraints={[300, 300]}
      >
        {node.type === 'col' ? (
          <DraggableColBlock
            key={'col_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            value={value}
            onChange={onChange}
          />
        ) : node.type === 'row' ? (
          <DraggableRowBlock
            key={'row_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            value={value}
            onChange={onChange}
          />
        ) : node.type === 'markdown' ? (
          <MarkdownBlock
            node={node}
            update={(nodeId, props) => onChange(update(value, nodeId, props))}
          />
        ) : node.type === 'layer' ? (
          <AbsoluteLayerBlock
            key={'layer_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            value={value}
            onChange={onChange}
          />
        ) : (
          <ImageBlock
            key={'image_' + node.id}
            node={node}
            renderEditBlock={renderEditBlock}
            value={value}
            onChange={onChange}
          />
        )}
      </ResizableBox>
    </div>
  );
};

export const defaultRenderEditBlock = ({
  node,
  renderEditBlock,
  value,
  onChange,
}: BlockProps) => (
  <ResizableBlock
    width={node.width}
    height={node.height}
    renderEditBlock={renderEditBlock}
    node={node}
    value={value}
    onChange={onChange}
  />
);
