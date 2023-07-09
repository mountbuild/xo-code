import Kink from '@tunebond/kink'
import { haveMesh } from '@tunebond/have'
import kink from '../kink.js'
import {
  LeafForm,
  Leaf,
  LeafCallCast,
  LeafCallLink,
  LeafName,
  LeafSeed,
} from './form.js'

export const LINE_TEST_LIST: Array<LeafName> = [LeafName.RiseNick]

export const NICK_TEST_LIST: Array<LeafName> = [
  LeafName.FallNick,
  LeafName.SlotLine,
  LeafName.Size,
  LeafName.Comb,
  LeafName.Code,
  LeafName.Link,
  LeafName.RiseText,
  LeafName.RiseNick,
  LeafName.RiseCull,
  LeafName.Knit,
  LeafName.Slot,
]

export const TEXT_TEST_LIST: Array<LeafName> = [
  LeafName.RiseNick,
  LeafName.FallText,
  LeafName.Cord,
]

export const TERM_TEST_LIST: Array<LeafName> = [
  LeafName.RiseNick,
  LeafName.RiseCull,
  LeafName.Knit,
  LeafName.Line,
]

export const CULL_TEST_LIST: Array<LeafName> = [
  LeafName.Size,
  LeafName.Comb,
  LeafName.Code,
  LeafName.FallCull,
  LeafName.RiseNick,
  LeafName.RiseCull,
  LeafName.SlotLine,
  LeafName.Knit,
  LeafName.Slot,
]

export const NAME: Array<LeafName> = [
  LeafName.FallCull,
  LeafName.FallNick,
  LeafName.FallHold,
  LeafName.FallText,
  LeafName.Link,
  LeafName.Note,
  LeafName.Comb,
  LeafName.Code,
  LeafName.SlotLine,
  LeafName.RiseCull,
  LeafName.RiseNick,
  LeafName.RiseHold,
  LeafName.RiseText,
  LeafName.Cord,
  LeafName.Size,
  LeafName.Line,
  LeafName.Knit,
]

export const BASE_TEST_LIST: Array<LeafName> = [
  LeafName.FallCull,
  LeafName.FallNick,
  LeafName.FallHold,
  LeafName.FallText,
  LeafName.Link,
  LeafName.Note,
  LeafName.Comb,
  LeafName.Code,
  LeafName.SlotLine,
  LeafName.RiseCull,
  LeafName.RiseNick,
  LeafName.RiseHold,
  LeafName.RiseText,
  LeafName.Size,
  LeafName.Slot,
  LeafName.Knit,
  LeafName.Line,
]

export const FORM: Record<LeafForm, Array<LeafName>> = {
  [LeafForm.Line]: LINE_TEST_LIST,
  [LeafForm.Text]: TEXT_TEST_LIST,
  [LeafForm.Nick]: NICK_TEST_LIST,
  [LeafForm.Cull]: CULL_TEST_LIST,
  [LeafForm.Term]: TERM_TEST_LIST,
  [LeafForm.Base]: BASE_TEST_LIST,
}

/**
 * These are _flexible_ matchers, so that
 * you can get error handling that the thing
 * was incorrect, rather than it just not matching
 * at all.
 */

const TEST: Record<LeafName, LeafSeed> = {
  [LeafName.FallCull]: {
    test: /^\]/,
  },
  [LeafName.FallNick]: {
    test: /^\}+/,
  },
  [LeafName.FallHold]: {
    test: /^\)/,
  },
  [LeafName.FallText]: {
    test: /^>/,
  },
  [LeafName.Link]: {
    test: /^, */,
  },
  [LeafName.Note]: {
    test: /^# +[^\n]+/,
  },
  [LeafName.Comb]: {
    test: /^-?\d+\.\d+/,
  },
  [LeafName.Code]: {
    test: /^#\w+/,
  },
  [LeafName.SlotLine]: {
    test: /^\n/,
  },
  [LeafName.RiseCull]: {
    test: /^\[/,
  },
  [LeafName.RiseNick]: {
    test: /^\{+/,
  },
  [LeafName.RiseHold]: {
    test: /^\(/,
  },
  [LeafName.RiseText]: {
    test: /^</,
  },
  [LeafName.Slot]: {
    test: /^ +/,
  },
  [LeafName.Line]: {
    test: /^[@~$%^&\w:\-\*'"\/\.,_]+/,
  },
  [LeafName.Knit]: {
    test: /^[a-z0-0A-Z_\-\?]+/,
  },
  [LeafName.Size]: {
    test: /^-?\d+(?=\b)/,
  },
  [LeafName.Cord]: {
    test: /^(?:\\[<>\{\}])+|[^\{>\\]+/,
  },
}

/**
 * This module is ideally very lenient with what it accepts so it can throw
 * helpful error messages if you forget the proper case and such.
 */

export default function makeTextList(
  link: LeafCallLink,
): LeafCallCast | Array<Kink> {
  const cast: LeafCallCast = {
    ...link,
    lineText: link.text.split('\n'),
  }

  let formList = [LeafForm.Base]

  let line = 0
  let mark = 0

  let back: Leaf | undefined = undefined

  function save(hunk: Leaf) {
    if (!cast.head) {
      cast.head = hunk
    } else if (back) {
      hunk.back = back
      back.head = hunk
    }
  }

  for (let textLine of cast.lineText) {
    // append `\n` so test matching works as expected
    textLine = `${textLine}\n`

    while (textLine) {
      const textLeafForm: LeafForm =
        formList[formList.length - 1] || LeafForm.Base

      const testList = FORM[textLeafForm]

      let move = false

      walk: for (const form of testList) {
        const seed = TEST[form]

        haveMesh(seed, 'seed')

        let find = textLine.match(seed.test)

        // console.log(form, textLeafForm, find)

        if (!find) {
          continue
        }

        move = true

        const findSize = find[0].length
        const findText = textLine.slice(0, findSize)

        const stem: Leaf = {
          band: {
            head: {
              mark: mark + findSize,
              line,
            },
            base: {
              mark,
              line,
            },
          },
          text: findText,
          form: form as Leaf['form'],
        }
        save(stem)

        back = stem

        textLine = textLine.slice(findSize)
        mark += findSize

        switch (form) {
          case LeafName.SlotLine: {
            line++
            mark = 0
            break
          }
          case LeafName.RiseNick: {
            formList.push(LeafForm.Nick)
            break
          }
          case LeafName.FallNick: {
            formList.pop()
            break
          }
          case LeafName.RiseCull: {
            formList.push(LeafForm.Cull)
            break
          }
          case LeafName.FallCull: {
            formList.pop()
            break
          }
          case LeafName.RiseText: {
            formList.push(LeafForm.Text)
            break
          }
          case LeafName.FallText: {
            formList.pop()
            break
          }
          default:
            break
        }

        break walk
      }

      if (!move && back) {
        haveMesh(back, 'back')
        return [
          kink('syntax_error', {
            text: cast.lineText,
            band: back.band,
            file: link.file,
          }),
        ]
      }
    }

    if (textLine.length && back) {
      return [
        kink('syntax_error', {
          text: cast.lineText,
          band: back.band,
          file: link.file,
        }),
      ]
    }
  }

  return cast
}