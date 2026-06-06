# Gramática formal de MuseScript

```ebnf
Program         = Statement* ;

Statement       = Tempo
                | Instrument
                | Channel
                | Clip
                | NamedPattern
                | Play
                | Loop
                | Note
                | Rest
                | ExplicitChord
                | NamedChord ;

Tempo           = "tempo" Number ;
Instrument      = "instrument" Identifier ;
Channel         = "channel" Identifier Block ;
Clip            = "clip" Identifier "{" ClipProperty* "}" ;
NamedPattern    = "pattern" Identifier Block ;
Play            = "play" Identifier ;
Loop            = "loop" Number Block ;

Note            = Pitch Duration ;
Rest            = "rest" Duration ;
ExplicitChord   = "[" Pitch+ "]" Duration ;
NamedChord      = "chord" Pitch Quality Duration ;

Block           = "{" Statement* "}" ;

ClipProperty    = "notes" NotesExpression
                | "pattern" ScribblePattern
                | "subdiv" Subdivision
                | AdvancedArp ;

NotesExpression = Pitch+
                | "scale" Pitch Identifier
                | "arp" ChordName+
                | "progression" Pitch Identifier RomanNumeral+ ;

AdvancedArp     = "arp" "{"
                    "chords" ChordName+
                    ("count" Number)?
                    ("order" Number)?
                  "}" ;

Duration        = "1" | "1/2" | "1/4" | "1/8" | "1/16" | "1/32" ;
Subdivision     = "1m" | "2m" | "3m" | "4m"
                | "1n" | "2n" | "4n" | "8n" | "16n" | "32n" ;
```

Los comentarios comienzan con `//` y terminan al final de la línea.

Cada nodo del AST registra:

```ts
interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}
```

El parser es tolerante a errores: intenta sincronizarse en la siguiente línea o
cierre de bloque para devolver tantos diagnósticos como sea posible.

