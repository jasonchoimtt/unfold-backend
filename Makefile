# Hipsters use Makefiles!

BIN:=$(shell npm bin)

BABEL_ARGS=--out-dir lib/ src/
MAIN=node lib/index.js


# Production build
build:
	$(BIN)/babel $(BABEL_ARGS)

serve:
	NODE_ENV=production $(MAIN)


# Development build
dev-build:
	$(BIN)/babel --watch --source-maps $(BABEL_ARGS)

dev-serve:
	nodemon -d 0.5 -w lib/ --exec "$(MAIN)"

dev:
	$(MAKE) -j4 dev-spec dev-lint dev-serve dev-build


# Tests and linting
test: spec lint
dev-test:
	$(MAKE) -j2 dev-spec dev-lint

SPEC_CMD=JASMINE_CONFIG_PATH=jasmine.json $(BIN)/jasmine
spec:
	$(SPEC_CMD)
dev-spec:
	nodemon -d 0.5 -w lib/ --exec "$(SPEC_CMD)"

LINT_CMD=$(BIN)/eslint src/
lint:
	$(LINT_CMD)
dev-lint:
	nodemon -d 0.5 -w src/ --exec "$(LINT_CMD)"
