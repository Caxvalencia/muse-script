import CodeMirror from "@uiw/react-codemirror";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function MusicCodeEditor({ value, onChange }: Props) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="dark"
      onChange={onChange}
      basicSetup={{ lineNumbers: true, foldGutter: true, bracketMatching: true, highlightActiveLine: true }}
      style={{ height: "100%", fontSize: 14 }}
    />
  );
}
