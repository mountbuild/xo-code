import type { Leaf } from '../leaf/form.js'
import haveHalt from '@tunebond/have/halt.js'

export enum LinkHint {
  // Code = 'code',
  // nick == interpolated == dynamic
  NickKnit = 'nick-line',
  NickText = 'nick-text',
  Void = 'void',
  // Size = 'size',
  // SideSize = 'side-size',
  Knit = 'line',
  Text = 'text',
}

export enum LinkName {
  Comb = 'link-comb',
  Code = 'link-code',
  Cull = 'link-cull',
  Knit = 'link-knit',
  Nick = 'link-nick',
  Text = 'link-text',
  Cord = 'link-cord',
  Fork = 'link-fork',
  Size = 'link-size',
  Tree = 'link-tree',
}

export type LinkHash = {
  'link-comb': LinkComb
  'link-code': LinkCode
  'link-cull': LinkCull
  'link-knit': LinkKnit
  'link-nick': LinkNick
  'link-cord': LinkCord
  'link-text': LinkText
  'link-fork': LinkFork
  'link-size': LinkSize
  'link-tree': LinkTree
}

export const LINK_TYPE = [
  LinkName.Comb,
  LinkName.Code,
  LinkName.Cull,
  LinkName.Knit,
  LinkName.Nick,
  LinkName.Text,
  LinkName.Cord,
  LinkName.Fork,
  LinkName.Size,
  LinkName.Tree,
]

export type LinkCallCast = {
  tree: LinkTree
}

export type LinkLeaf = {
  base?: Leaf
  head?: Leaf
}

export type LinkTree = {
  nest: LinkFork
  form: LinkName.Tree
}

export type LinkFork = {
  leaf?: LinkLeaf
  nest: Array<
    | LinkText
    | LinkFork
    | LinkSize
    | LinkText
    | LinkCord
    | LinkNick
    | LinkCull
    | LinkComb
    | LinkCode
    | LinkKnit
  >
  base?: LinkFork | LinkNick | LinkCull
  form: LinkName.Fork
}

export type LinkComb = {
  form: LinkName.Comb
  bond: number
  base?: LinkCull | LinkFork
  leaf: Leaf
}

export type LinkCode = {
  bond: number
  mold: string
  base?: LinkCull | LinkFork
  form: LinkName.Code
  leaf: Leaf
}

export type LinkCull = {
  nest?: LinkFork | LinkBond | LinkKnit
  base?: LinkKnit
  form: LinkName.Cull
  leaf?: LinkLeaf
}

export type LinkKnit = {
  base?: LinkFork
  nest: Array<LinkCull | LinkNick | LinkCord>
  form: LinkName.Knit
  leaf?: LinkLeaf
}

export type LinkNick = {
  nest?: LinkFork
  base?: LinkKnit | LinkText
  size: number
  form: LinkName.Nick
  leaf?: LinkLeaf
}

export type LinkCord = {
  form: LinkName.Cord
  base?: LinkText
  leaf: Leaf
}

/**
 * This gets a base and head leaf,
 * so we know where it starts and ends easily.
 */

export type LinkText = {
  nest: Array<LinkCord | LinkNick>
  form: LinkName.Text
  base?: LinkCull | LinkFork
  leaf?: LinkLeaf
}

export type LinkSize = {
  form: LinkName.Size
  bond: number
  base?: LinkCull | LinkFork
  leaf: Leaf
}

export type LinkBond =
  | LinkSize
  | LinkText
  | LinkCode
  | LinkComb
  | LinkCord

export type Link =
  | LinkComb
  | LinkCode
  | LinkCull
  | LinkKnit
  | LinkNick
  | LinkCord
  | LinkText
  | LinkFork
  | LinkSize
  | LinkTree

export function testLinkForm<N extends LinkName>(
  lead: unknown,
  name: N,
): lead is LinkHash[N] {
  return (lead as Link).form === name
}

export function haveLinkForm<N extends LinkName>(
  lead: unknown,
  name: N,
): asserts lead is LinkHash[N] {
  if (!testLinkForm(lead, name)) {
    throw haveHalt('form_miss', { call: name, need: 'link' })
  }
}

export function testLink(lead: unknown): lead is Link {
  return LINK_TYPE.includes((lead as Link).form)
}

export function haveLink(
  lead: unknown,
  call: string,
): asserts lead is Link {
  if (!testLink(lead)) {
    throw haveHalt('form_miss', { call, need: 'link' })
  }
}