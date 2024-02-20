#!/bin/bash

input="$1"
if ! [ -f "$input" ]; then
   >&2 echo "the given argument is not a file"
   exit 1
fi

# https://stackoverflow.com/a/27269260
for f in {0..5}; do
   for l in {0..9}; do
      for s in {0..4}; do
         outfile="out_${f}_${l}_${s}.png"
         convert "$1" -define png:compression-filter=$f -define png:compression-level=$l -define png:compression-strategy=$s "$outfile"
         size=$(du -sh "$outfile")
         echo filter:$f, level:$l, strategy:$s, size:$size
      done
   done
done
