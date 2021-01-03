===
Boolean
===

foo = true
foo = false

---

(body
  (attribute (identifier) (expression (expressionTerm (literalValue (true)))))
  (attribute (identifier) (expression (expressionTerm (literalValue (false))))))
