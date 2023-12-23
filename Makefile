all: build

build: etc/style.min.css etc/script.min.js
	@.p/build

%.min.css: %.css
	deno run --quiet --allow-read npm:clean-css-cli "$<" > "$@"

%.min.js: %.js
	deno run --quiet --allow-read npm:uglify-js --compress passes=5 --mangle toplevel "$<" > "$@"

.PHONEY: all build
