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
    // Identifier
    //
    identifier: $ => token(seq(
      /[a-zA-Zα-ωΑ-Ωµ]/,
      repeat(choice(
        /[a-zA-Zα-ωΑ-Ωµ]/,
        /[0-9]/,
      )),
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
      $.identifier,
      "=",
      $.expression,
    ),

    block: $ => seq(
      $.identifier,
      choice(
        $.identifier,
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
    // forIntro = "for" $.identifier ("," $.identifier)? "in" Expression ":";
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

    // forIntro = "for" $.identifier ("," $.identifier)? "in" Expression ":";
    forIntro: $ => seq(
      "for",
      $.identifier,
      optional(seq(",", $.identifier)),
      "in",
      $.expression,
      ":",
    ),

    forCondition: $ => seq("if", $.expression),

    //
    // Function calls
    //

    functionCall: $ => seq(
      $.identifier,
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
      choice($.identifier, $.expression),
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
