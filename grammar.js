const IDENTIFIER = "foo"

module.exports = grammar({
  name: 'hcl',

  extras: $ => [
    $.comment,
    /\s/
  ],

  rules: {
    body: $ => repeat(choice(
      $.attribute,
      $.block,
    )),

    //
    // Numeric literals
    //
    numericLiteral: $ => seq(
      repeat1($.decimal),
      optional(
        seq(".", repeat1($.decimal))
      ),
      optional(
        seq($.exponentMark, repeat1($.decimal))
      ),
    ),

    decimal: $ => token(/[0-9]+/),

    exponentMark: $ => seq(
      choice("e", "E"),
      optional(choice("+", "-")),
    ),

    //
    // Operations
    //
    operation: $ => choice(
      $.unaryOp,
      $.binaryOp,
    ),

    unaryOp: $ => seq(
      choice("-", "!"),
      $.expressionTerm
    ),

    binaryOp: $ => seq(
      $.expressionTerm,
      $.binaryOperator,
      $.expressionTerm,
    ),

    binaryOperator: $ => choice(
      $.compareOperator,
      $.arithmeticOperator,
      $.logicOperator,
    ),

    arithmeticOperator: $ => choice(
      "+", "-", "*", "/", "%",
    ),

    compareOperator: $ => choice(
      "==", "!=", "<", ">", "<=", ">=",
    ),

    logicOperator: $ => choice(
      "||", "&&", "!"
    ),

    //
    //
    //

    attribute: $ => seq(
      IDENTIFIER,
      "=",
      $.expression,
    ),

    block: $ => seq(
      IDENTIFIER,
      choice(

        IDENTIFIER,
      ),
    ),

    expression: $ => choice(
      $.expressionTerm,
      $.operation,
    ),

    expressionTerm: $ => choice(
      $.literalValue,
      $.stringLiteral,
      $.collectionValue,
      $.functionCall,
      $.forExpression,

      seq(
        "(",
        $.expression,
        ")",
      ),
    ),

    //
    // For expressions
    //
    // ForExpr = forTupleExpr | forObjectExpr;
    // forTupleExpr = "[" forIntro Expression forCond? "]";
    // forObjectExpr = "{" forIntro Expression "=>" Expression "..."? forCond? "}";
    // forIntro = "for" Identifier ("," Identifier)? "in" Expression ":";
    // forCond = "if" Expression;
    forExpression: $ => choice(
      $.forTupleExpression,
    ),

    forTupleExpression: $ => seq(
      "[",
      $.forIntro,
      $.expression,
      optional($.forCondition),
      "]",
    ),

    // forIntro = "for" Identifier ("," Identifier)? "in" Expression ":";
    forIntro: $ => seq(
      "for",
      IDENTIFIER,
      optional(seq(",", IDENTIFIER)),
      "in",
      $.expression,
      ":",
    ),

    forCondition: $ => seq("if", $.expression),

    //
    // Function calls
    //

    functionCall: $ => seq(
      IDENTIFIER,
      "(",
      optional($.arguments),
      ")",
    ),

    arguments: $ => seq(
      $.expression,
      repeat(seq(",", $.expression)),
      optional(choice(",", "...")),
    ),

    collectionValue: $ => choice(
      $.tuple,
      $.object,
    ),

    tuple: $ => seq(
      "[",
      optional(seq($.expression, repeat(seq(",", $.expression)), optional(","))),
      "]",
    ),

    object: $ => seq(
      "{",
      optional(seq($.objectElement, repeat(seq(",", $.objectElement)), optional(","))),
      "}",
    ),

    objectElement: $ => seq(
      choice(IDENTIFIER, $.expression),
      choice("=", ":"),
      $.expression,
    ),

    stringLiteral: $ => seq(
      '"',
      repeat(
        token.immediate(/[^"\\\n]+|\\\r?\n/),
      ),
      '"',
    ),

    literalValue: $ => choice(
      $.numericLiteral,
      $.true,
      $.false,
      $.null,
    ),

    true: $ => "true",
    false: $ => "false",
    null: $ => "null",

    comment: $ => token(choice(
      seq('//', /.*/),
      seq('#', /.*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    ))
  }
});
