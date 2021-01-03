===
Empty object
===

foo = {}

---

(body
  (attribute (expression (expressionTerm (collectionValue (object))))))

===
Object with basic types
===

foo = {foo: "abc123"}

---

(body
  (attribute (expression (expressionTerm (collectionValue (object
    (objectElement (expression (expressionTerm (stringLiteral))))))))))
