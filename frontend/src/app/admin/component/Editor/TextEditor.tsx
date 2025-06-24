// "use client";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// const ReactQuill = dynamic(() => import("react-quill-new"), {
//   ssr: false, // This is crucial for preventing the "document is not defined" error
// });

function TextEditor({
  value = "",
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <>
      Editor
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </>
  );
}

export default TextEditor;
