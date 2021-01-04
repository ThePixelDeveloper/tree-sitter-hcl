module.exports = grammar({
  name: 'hcl',

  extras: $ => [
    $.comment,
    /\s/
  ],

  rules: {
    body: $ => repeat(choice(
      $.attribute,
    )),

    //
    // Identifier
    //
    identifier: $ => token(seq(
      /[a-zA-Zα-ωΑ-Ωµ]/,
      repeat(choice(
        /[a-zA-Zα-ωΑ-Ωµ]/,
        /[0-9]/,
        "-",
        "_",
      ))
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

    attribute: $ => seq(
      $.identifier,
      "=",
      $.expression,
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

    stringLiteral: $ => seq(
      '"',
      repeat(
        token.immediate(/[^"\\\n]+|\\\r?\n/),
      ),
      '"',
    ),

    //
    // Operators
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
    // Collections
    //
    collectionValue: $ => choice(
      $.tuple,
      $.object,
    ),

    tuple: $ => seq(
      "[",
      optional(
        seq($.expression,
          repeat(seq(",", $.expression)),
          optional(","))),
      "]",
    ),

    object: $ => seq(
      "{",
        optional(
          seq($.objectElement,
            repeat(seq(",", $.objectElement)),
            optional(","))),
      "}",
    ),

    objectElement: $ => seq(
      choice($.identifier, $.expression),
      choice("=", ":"),
      $.expression,
    ),

    //
    // Literals
    //
    literalValue: $ => choice(
      $.numericLiteral,
      $.true,
      $.false,
      $.null,
    ),

    true:  $ => "true",
    false: $ => "false",
    null:  $ => "null",

    //
    // Comments
    //
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
