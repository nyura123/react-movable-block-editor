import * as React from 'react';
import { BlockNode } from '../../data';
import { onDragStart } from '../../utils/dragHelpers';

export interface MarkdownBlockProps {
  node: BlockNode;
  undoRedoVersion: number;
  update: (nodeId: string, props: Partial<BlockNode>) => any;
}

export interface MarkdownBlockState {
  initialVal: string; // for contenteditable
}

export class MarkdownBlock extends React.Component<MarkdownBlockProps> {
  selfRef: HTMLElement | null = null;
  inputListener: any = null;

  state = {
    initialVal: this.props.node.value || 'CONTENT',
  };

  componentDidMount() {
    this.setupContentEditableListener(this.props);
  }

  componentDidUpdate(prevProps: MarkdownBlockProps) {
    if (prevProps.node.id !== this.props.node.id) {
      this.setupContentEditableListener(this.props);
    }

    // Update contenteditable value on undo/redo
    if (this.props.undoRedoVersion !== prevProps.undoRedoVersion) {
      this.setState({ initialVal: this.props.node.value });
    }
  }

  componentWillUnmount() {
    if (this.inputListener && this.selfRef) {
      this.selfRef.removeEventListener('input', this.inputListener);
    }
  }

  setupContentEditableListener = (props: MarkdownBlockProps) => {
    if (this.inputListener && this.selfRef) {
      this.selfRef.removeEventListener('input', this.inputListener);
    }

    if (this.selfRef) {
      this.inputListener = (e: any) => {
        this.props.update(props.node.id, { value: e.target.innerText });
      };
      this.selfRef.addEventListener('input', this.inputListener);
    }
  };

  getBoundingRect = () => {
    return this.selfRef && this.selfRef.getBoundingClientRect
      ? this.selfRef.getBoundingClientRect()
      : null;
  };

  render() {
    return (
      <div
        ref={el => (this.selfRef = el)}
        draggable
        contentEditable={true}
        suppressContentEditableWarning={true}
        onDragStart={e => onDragStart(e, this.props.node, this.getBoundingRect)}
        style={{
          width: '100%',
          height: '100%',
          color: this.props.node.color || undefined,
          backgroundColor: this.props.node.backgroundColor || undefined,
        }}
      >
        {this.state.initialVal}
      </div>
    );
  }
}
