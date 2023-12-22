'use strict'

function article_match_tag (article_tags, tag_param) {
  // operations supported:
  //   union ('+'), intersection ('^').
  // '!' before a tag negates it.
  // to sidestep heavier parsing techniques with precedence and associativity,
  // operations use a prefix (lisp-inspired) syntax:
  // - the operation symbol starts the list of arguments (not a paren)
  // - tags are separated by commas
  // - the operation list is ended by semicolon
  // - the negation ('!') is a "special tag", not an operation
  // examples:
  // - #tag=a => matches every post tagged with #a
  // - #tag=+a,b => matches every post tagged with #a or #b (or both)
  // - #tag=+a,b,c => matches every post tagged with any of the three tags
  // - #tag=+a,b,!c => matches every post tagged with #a or #b or is not tagged with #c
  // - #tag=^a,b => matches every post tagged with both #a and #b
  // - #tag=^a,b,c => matches every post tagged with all three tags together
  // - #tag=^a,b,!c => matches every post tagged with both #a and #b but not with #c
  // - #tag=+a,^b,c => matches every post tagged with both #b and #c, or is tagged with #a.
  // - #tag=+^b,c;a => matches every post tagged with both #b and #c, or is tagged with #a.
  // current state of implementation:
  //   only one tag, possibly negated, but no other operation of any kind
  if (tag_param.match(/^[^^+,;]+$/)) {
    if (tag_param.charAt(0) === '!') {
      return !article_tags.includes(tag_param.slice(1))
    }
    else {
      return article_tags.includes(tag_param)
    }
  }
  return true
}

function tags_human (tag_param) {
  const start = 'لا تظهر إلا التدوينات التي '
  const end = '.&emsp;<a href="">ألغِ التصفية؟</a>'
  if (tag_param.match(/^[^^+,;]+$/)) {
    if (tag_param.charAt(0) === '!') {
      return start + '<b>لا</b> توافق الوسم #' + tag_param.slice(1) + end
    }
    else {
      return start + 'توافق الوسم #' + tag_param + end
    }
  }
  return true
}

onhashchange = onload = () => {
  // for now, the only valid hash parameter is '#tag=TAG'; with support for operations.
  const m = location.hash.match(/[#&]tag=([^&]+)/)
  if (m == null || m[1].length === 0) {
    document.querySelectorAll('section.card').forEach(el => {
      el.style.display = 'block'
    })
    document.querySelector('.tnote').hidden = true
    return
  }
  const tag = decodeURIComponent(m[1])
  document.querySelectorAll('section.card').forEach(el => {
    const tags = el.querySelector('.tags').innerText.split(/\s+/).map(t => t.slice(1))  // slice to remove the hash
    const matches = article_match_tag(tags, tag)
    el.style.display = matches ? 'block' : 'none'
  })
  document.querySelector('.tnote').innerHTML = tags_human(tag)
  document.querySelector('.tnote').hidden = false
}

