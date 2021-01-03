===
Negative
===

foo = -1

---

(body
  (attribute (identifier)  (expression (operation (unaryOp (expressionTerm (literalValue (numericLiteral (decimal)))))))))

===
Positive
===

foo = 1

---

(body
  (attribute (identifier) (expression (expressionTerm (literalValue (numericLiteral (decimal)))))))


===
Positive with decimal
===

foo = 1.2

---

(body
  (attribute (identifier) (expression (expressionTerm (literalValue (numericLiteral (decimal) (decimal)))))))


===
Negative with decimal
===

foo = -1.2

---

(body
  (attribute (identifier) (expression (operation (unaryOp (expressionTerm (literalValue (numericLiteral (decimal) (decimal)))))))))

===
Scientific notation
===

foo = 1.6E-35

---

(body
  (attribute (identifier) (expression (expressionTerm (literalValue (numericLiteral (decimal) (decimal) (exponentMark) (decimal)))))))
