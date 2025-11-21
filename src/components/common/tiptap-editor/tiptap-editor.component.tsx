import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Toolbar from 'components/common/tiptap-editor/toolbar.component';
import styles from 'components/common/tiptap-editor/tiptap-editor.module.scss';

interface TiptapEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className={styles.container}>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;