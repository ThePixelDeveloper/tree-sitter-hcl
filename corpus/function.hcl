===
Function call
===

foo = foo()

---

(body
  (attribute (identifier) (expression (expressionTerm (functionCall (identifier))))))

===
Function call with arguments
===

foo = foo(true, false)

---

(body (attribute (identifier) (expression (expressionTerm
  (functionCall (identifier) (arguments
    (expression (expressionTerm (literalValue (true))))
    (expression (expressionTerm (literalValue (false))))))))))
