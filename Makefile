.PHONY: test build
test:
	tree-sitter test

build:
	tree-sitter generate
