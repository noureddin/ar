all: build

build: etc/style.min.css
	@.p/build

%.min.css: %.css
	deno run --quiet --allow-read npm:clean-css-cli "$<" > "$@"

.PHONEY: all build
