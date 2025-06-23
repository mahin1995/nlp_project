"use client";

import { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";

// Extended types
type BlockFormat =
  | "paragraph"
  | "block-quote"
  | "bulleted-list"
  | "numbered-list"
  | "list-item";
type MarkFormat = "bold" | "italic" | "underline";

type CustomElement = {
  type: BlockFormat;
  children: CustomText[];
};
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: "left" | "center" | "right" | "justify";
};

import type { BaseEditor } from "slate";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES: BlockFormat[] = ["numbered-list", "bulleted-list"];
// const TEXT_ALIGN_TYPES: BlockFormat[] = ["left", "center", "right", "justify"];

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Write something here..." }],
  },
];

// Toolbar components
function ToolbarButton({ format, icon }: { format: MarkFormat; icon: string }) {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className={`px-2 py-1 border rounded mr-2 ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );
}

function BlockButton({ format, icon }: { format: BlockFormat; icon: string }) {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);

  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      className={`px-2 py-1 border rounded mr-2 ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );
}

// Helper functions
function isMarkActive(editor: Editor, format: MarkFormat) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleMark(editor: Editor, format: MarkFormat) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function isBlockActive(editor: Editor, format: BlockFormat) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
}

function toggleBlock(editor: Editor, format: BlockFormat) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  // Unwrap lists if changing to non-list block
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        (!Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type) as BlockFormat
      ),
    split: true,
  });

  // Set new block type
  let newProperties: Partial<SlateElement>;
  if (isActive) {
    newProperties = { type: "paragraph" };
  } else if (isList) {
    newProperties = { type: "list-item" };
  } else {
    newProperties = { type: format };
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  // Wrap in list container if needed
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export default function CustomEditor({
  value = initialValue,
  setValue,
}: {
  value: Descendant[];
  setValue: (value: Descendant[]) => void;
}) {
  //   const [value, setValue] = useState<Descendant[]>(initialValue);
  const editor = useMemo(() => withReact(createEditor()), []);

  console.log("My Log slateToHtml(value): ", slateToHtml(value));
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    let styledChildren = children;
    if (element.type === "block-quote") {
      styledChildren = (
        <p className="bg-red-400" {...attributes}>
          {children}
        </p>
      );
    } else if (element.type === "numbered-list") {
      styledChildren = (
        <ol className="list-decimal" {...attributes}>
          {children}
        </ol>
      );
    } else if (element.type === "bulleted-list") {
      styledChildren = (
        <ul className="list-disc" {...attributes}>
          {children}
        </ul>
      );
    } else if (element.type === "list-item") {
      styledChildren = <li {...attributes}>{children}</li>;
    } else {
      styledChildren = <p {...attributes}>{children}</p>;
    }
    return <span {...attributes}>{styledChildren}</span>;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, children, leaf } = props;

    let styled = children;
    if (leaf.bold) styled = <strong>{styled}</strong>;
    if (leaf.italic) styled = <em>{styled}</em>;
    if (leaf.underline) styled = <u>{styled}</u>;
    if (leaf.textAlign) {
      styled = <span style={{ textAlign: leaf.textAlign }}>{styled}</span>;
    }
    return <span {...attributes}>{styled}</span>;
  }, []);

  return (
    <div className="border p-4 rounded space-y-4">
      <Slate editor={editor} initialValue={value} onChange={setValue}>
        <div className="flex flex-wrap gap-2">
          {/* Mark buttons */}
          <ToolbarButton format="bold" icon="B" />
          <ToolbarButton format="italic" icon="I" />
          <ToolbarButton format="underline" icon="U" />

          {/* Block buttons */}
          <BlockButton format="block-quote" icon="❝" />
          <BlockButton format="numbered-list" icon="1." />
          <BlockButton format="bulleted-list" icon="•" />
        </div>
        <Editable
          className="min-h-[150px] outline-none border-t mt-2 pt-2"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
        />
      </Slate>
    </div>
  );
}

export function slateToHtml(nodes: Descendant[]): string {
  const serialize = (node: Descendant): string => {
    if ("text" in node) {
      let text = escapeHtml(node.text);
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      return text;
    }

    const children = node?.children?.map(serialize).join("");

    switch (node.type) {
      case "paragraph":
        return `<p>${children}</p>`;
      case "block-quote":
        return `<blockquote>${children}</blockquote>`;
      case "bulleted-list":
        return `<ul>${children}</ul>`;
      case "numbered-list":
        return `<ol>${children}</ol>`;
      case "list-item":
        return `<li>${children}</li>`;
      default:
        return children;
    }
  };

  return nodes?.map(serialize).join("");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
