===
Function call
===

foo = foo()

---

(body
  (attribute (expression (expressionTerm (functionCall)))))

===
Function call with arguments
===

foo = foo(true, false)

---

(body (attribute (expression (expressionTerm
  (functionCall (arguments
    (expression (expressionTerm (literalValue (true))))
    (expression (expressionTerm (literalValue (false))))))))))
