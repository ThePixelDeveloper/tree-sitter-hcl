===
Empty tuple
===

foo = []

---

(body
  (attribute (identifier) (expression (expressionTerm (collectionValue (tuple))))))

===
Tuple with basic types
===

foo = [true, false]

---

(body
  (attribute (identifier) (expression (expressionTerm (collectionValue (tuple
    (expression (expressionTerm (literalValue (true))))
    (expression (expressionTerm (literalValue (false))))))))))
