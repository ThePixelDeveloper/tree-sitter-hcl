===
Empty object
===

foo = {}

---

(body
  (attribute (identifier) (expression (expressionTerm (collectionValue (object))))))

===
Object with basic types
===

foo = {foo: "abc123"}

---

(body
  (attribute (identifier) (expression (expressionTerm (collectionValue (object
    (objectElement (identifier) (expression (expressionTerm (stringLiteral))))))))))
