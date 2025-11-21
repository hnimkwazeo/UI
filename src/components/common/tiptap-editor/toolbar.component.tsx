import { Button, Space, Divider, ColorPicker, Tooltip } from 'antd';
import {
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, CodeOutlined, UnorderedListOutlined,
    OrderedListOutlined, BlockOutlined, UndoOutlined, RedoOutlined, UnderlineOutlined,
    HighlightOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined
} from '@ant-design/icons';
import type { Editor } from '@tiptap/react';

interface ToolbarProps {
    editor: Editor | null;
}

const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) return null;

    return (
        <div style={{ marginBottom: 12, border: '1px solid #d9d9d9', padding: '8px', borderRadius: 6 }}>
            <Space wrap>
                <Tooltip title="Undo"><Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={<UndoOutlined />} /></Tooltip>
                <Tooltip title="Redo"><Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={<RedoOutlined />} /></Tooltip>

                <Divider type="vertical" />

                <Tooltip title="Bold"><Button onClick={() => editor.chain().focus().toggleBold().run()} type={editor.isActive('bold') ? 'primary' : 'default'} icon={<BoldOutlined />} /></Tooltip>
                <Tooltip title="Italic"><Button onClick={() => editor.chain().focus().toggleItalic().run()} type={editor.isActive('italic') ? 'primary' : 'default'} icon={<ItalicOutlined />} /></Tooltip>
                <Tooltip title="Underline"><Button onClick={() => editor.chain().focus().toggleUnderline().run()} type={editor.isActive('underline') ? 'primary' : 'default'} icon={<UnderlineOutlined />} /></Tooltip>
                <Tooltip title="Strike"><Button onClick={() => editor.chain().focus().toggleStrike().run()} type={editor.isActive('strike') ? 'primary' : 'default'} icon={<StrikethroughOutlined />} /></Tooltip>

                <Divider type="vertical" />

                <Tooltip title="Text Color">
                    <ColorPicker
                        value={editor.getAttributes('textStyle').color}
                        onChange={(color) => editor.chain().focus().setColor(color.toHexString()).run()}
                    />
                </Tooltip>
                <Tooltip title="Highlight"><Button onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFF176' }).run()} type={editor.isActive('highlight', { color: '#FFF176' }) ? 'primary' : 'default'} icon={<HighlightOutlined />} /></Tooltip>

                <Divider type="vertical" />

                <Tooltip title="Align Left"><Button onClick={() => editor.chain().focus().setTextAlign('left').run()} type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'} icon={<AlignLeftOutlined />} /></Tooltip>
                <Tooltip title="Align Center"><Button onClick={() => editor.chain().focus().setTextAlign('center').run()} type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'} icon={<AlignCenterOutlined />} /></Tooltip>
                <Tooltip title="Align Right"><Button onClick={() => editor.chain().focus().setTextAlign('right').run()} type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'} icon={<AlignRightOutlined />} /></Tooltip>

                <Divider type="vertical" />

                <Tooltip title="Heading 1"><Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} type={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}>H1</Button></Tooltip>
                <Tooltip title="Heading 2"><Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}>H2</Button></Tooltip>
                <Tooltip title="Heading 3"><Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}>H3</Button></Tooltip>

                <Divider type="vertical" />

                <Tooltip title="Bullet List"><Button onClick={() => editor.chain().focus().toggleBulletList().run()} type={editor.isActive('bulletList') ? 'primary' : 'default'} icon={<UnorderedListOutlined />} /></Tooltip>
                <Tooltip title="Ordered List"><Button onClick={() => editor.chain().focus().toggleOrderedList().run()} type={editor.isActive('orderedList') ? 'primary' : 'default'} icon={<OrderedListOutlined />} /></Tooltip>
                <Tooltip title="Blockquote"><Button onClick={() => editor.chain().focus().toggleBlockquote().run()} type={editor.isActive('blockquote') ? 'primary' : 'default'} icon={<BlockOutlined />} /></Tooltip>
                <Tooltip title="Code Block"><Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} type={editor.isActive('codeBlock') ? 'primary' : 'default'} icon={<CodeOutlined />} /></Tooltip>

            </Space>
        </div>
    );
};

export default Toolbar;