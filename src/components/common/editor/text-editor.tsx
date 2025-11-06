"use client";

import "./editor-style.scss";

import { Button, ButtonGroup } from "@heroui/react";
import {
  Bold as IconBold,
  Italic as IconItalic,
  Strikethrough as IconStrike,
  Code2 as IconCode,
  Eraser as IconClearMarks,
  Square as IconClearNodes,
  Pilcrow as IconParagraph,
  Heading1 as IconH1,
  Heading2 as IconH2,
  Heading3 as IconH3,
  Heading4 as IconH4,
  Heading5 as IconH5,
  Heading6 as IconH6,
  List as IconBulletList,
  ListOrdered as IconOrderedList,
  Quote as IconBlockquote,
  Minus as IconHr,
  CornerDownLeft as IconHardBreak,
  Undo2 as IconUndo,
  Redo2 as IconRedo,
} from "lucide-react";

import { TextStyleKit } from "@tiptap/extension-text-style";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

const extensions = [TextStyleKit, StarterKit];

function inlineStylesForContent(html: string): string {
  if (typeof window === "undefined") return html;
  const container = document.createElement("div");
  container.innerHTML = html;

  const setIfMissing = (el: HTMLElement, styles: Record<string, string>) => {
    const style = el.style;
    Object.entries(styles).forEach(([prop, val]) => {
      if (!style.getPropertyValue(prop)) {
        style.setProperty(prop, val);
      }
    });
  };

  container.querySelectorAll("p").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      margin: "0.6rem 0",
      "font-size": "0.95rem",
      "line-height": "1.6",
    }),
  );

  const headingBase = {
    "line-height": "1.25",
    "font-weight": "700",
    margin: "1rem 0 0.6rem",
  };
  container.querySelectorAll("h1").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      ...headingBase,
      "font-size": "1.8rem",
    }),
  );
  container.querySelectorAll("h2").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      ...headingBase,
      "font-size": "1.6rem",
    }),
  );
  container.querySelectorAll("h3").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      ...headingBase,
      "font-size": "1.4rem",
    }),
  );
  container.querySelectorAll("h4").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      ...headingBase,
      "font-size": "1.2rem",
    }),
  );
  container.querySelectorAll("h5").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      ...headingBase,
      "font-size": "1.05rem",
    }),
  );
  container.querySelectorAll("h6").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      ...headingBase,
      "font-size": "0.95rem",
    }),
  );

  container.querySelectorAll("ul, ol").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      "padding-left": "1.4rem",
      margin: "0.6rem 0",
    }),
  );

  container.querySelectorAll("blockquote").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      margin: "0.8rem 0",
      padding: "0.6rem 0.8rem",
      background: "#fafcff",
      "border-left": "3px solid #9ab7ff",
      color: "#334155",
    }),
  );

  container.querySelectorAll("pre").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      background: "#0b1020",
      color: "#e8eaf6",
      padding: "0.9rem 1rem",
      "border-radius": "8px",
      overflow: "auto",
    }),
  );

  container.querySelectorAll("code").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      "background-color": "var(--purple-light)",
      "border-radius": "0.4rem",
      color: "var(--black)",
      "font-size": "0.85rem",
      padding: "0.25em 0.3em",
    }),
  );

  container.querySelectorAll("hr").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      border: "none",
      "border-top": "1px solid rgba(0, 0, 0, 0.08)",
      margin: "1rem 0",
    }),
  );

  container.querySelectorAll("a").forEach((el) =>
    setIfMissing(el as HTMLElement, {
      color: "#1a5cff",
      "text-decoration": "underline",
    }),
  );

  return container.innerHTML;
}

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        immediatelyRender: false,
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="control-group">
      <div className="button-group editor-toolbar">
        <ButtonGroup aria-label="Панель редактора">
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconBold size={16} />}
            onPress={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            className={editorState.isBold ? "is-active" : ""}
          >
            Жирный
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconItalic size={16} />}
            onPress={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            className={editorState.isItalic ? "is-active" : ""}
          >
            Курсив
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconStrike size={16} />}
            onPress={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            className={editorState.isStrike ? "is-active" : ""}
          >
            Зачеркнутый
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconClearMarks size={16} />}
            onPress={() => editor.chain().focus().unsetAllMarks().run()}
          >
            Очистить стили
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconClearNodes size={16} />}
            onPress={() => editor.chain().focus().clearNodes().run()}
          >
            Очистить блоки
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconParagraph size={16} />}
            onPress={() => editor.chain().focus().setParagraph().run()}
            className={editorState.isParagraph ? "is-active" : ""}
          >
            Абзац
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconH2 size={16} />}
            onPress={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={editorState.isHeading2 ? "is-active" : ""}
          ></Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconH3 size={16} />}
            onPress={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={editorState.isHeading3 ? "is-active" : ""}
          ></Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconH4 size={16} />}
            onPress={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={editorState.isHeading4 ? "is-active" : ""}
          ></Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconH5 size={16} />}
            onPress={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={editorState.isHeading5 ? "is-active" : ""}
          ></Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconH6 size={16} />}
            onPress={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={editorState.isHeading6 ? "is-active" : ""}
          ></Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconBulletList size={16} />}
            onPress={() => editor.chain().focus().toggleBulletList().run()}
            className={editorState.isBulletList ? "is-active" : ""}
          >
            Маркированный список
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconOrderedList size={16} />}
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
            className={editorState.isOrderedList ? "is-active" : ""}
          >
            Нумерованный список
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconBlockquote size={16} />}
            onPress={() => editor.chain().focus().toggleBlockquote().run()}
            className={editorState.isBlockquote ? "is-active" : ""}
          >
            Цитата
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconHr size={16} />}
            onPress={() => editor.chain().focus().setHorizontalRule().run()}
          >
            Горизонтальная линия
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconHardBreak size={16} />}
            onPress={() => editor.chain().focus().setHardBreak().run()}
          >
            Разрыв строки
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconUndo size={16} />}
            onPress={() => editor.chain().focus().undo().run()}
            disabled={!editorState.canUndo}
          >
            Отменить
          </Button>
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<IconRedo size={16} />}
            onPress={() => editor.chain().focus().redo().run()}
            disabled={!editorState.canRedo}
          >
            Повторить
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default ({
  value,
  onChange,
}: {
  value: string;
  onChange?: (html: string) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        onChange(inlineStylesForContent(html));
      }
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="text-editor">
      {editor && <MenuBar editor={editor} />}
      {editor && (
        <div className="editor-content">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
};
