
const fork = (list) => {
  const stem = [ {} ]
  list.forEach(({ i, x, o }) => {
    let link = stem
    for (let k = 0, n = i.length; k < n; k++) {
      let note = i[k]
      link = link[0][note] = link[0][note] || [ {}, null ]
    }
    link[1] = { i, x, o }
  })
  return stem
}

const norm = (text) => text

const list = (text, tree) => {
  if (!text) return []
  const blob = []
  const stack = []

  let stem = tree

  let i = 0
  let n = text.length

  function loop() {
    while (i < n) {
      let note = text[i]

      if (!stem) {
        throw new Error(text)
      }

      if (stem[0][note]) {
        stem = stem[0][note]
        stack.push({ i, stem })
        i++
      } else {
        resolveStack()
      }
    }
  }

  function resolveStack() {
    let stackI = stack.length - 1

    while (stackI >= 0) {
      let data = stack[stackI--]
      if (!data) {
        throw new Error(`${text} => ${i}`)
      }

      if (data.stem[1]) {
        blob.push(data.stem[1])
        i = data.i + 1
        stack.length = 0
        stem = tree
        return
      }
    }

    throw new Error(text)
  }

  while (i < n) {
    loop()
    resolveStack()
  }

  return blob
}

const form = (text, tree) => {
  if (!text) return ''
  const blob = list(text, tree)

  return blob.map(x => x.o).join('')
}

module.exports = {
  fork,
  norm,
  list,
  form
}
