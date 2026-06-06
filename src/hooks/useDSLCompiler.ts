import { useMemo } from "react";
import { compile } from "../dsl/compiler";
import { parseDSL } from "../dsl/parser";
import { useDebounce } from "./useDebounce";

export function useDSLCompiler(source: string) {
  const debouncedSource = useDebounce(source, 500);
  return useMemo(() => {
    const parseResult = parseDSL(debouncedSource);
    const song = compile(parseResult.ast);
    const diagnostics = [...parseResult.diagnostics, ...song.diagnostics];
    return { source: debouncedSource, ast: parseResult.ast, song, diagnostics };
  }, [debouncedSource]);
}
