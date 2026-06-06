import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  VBar,
  VBars,
  VBox,
  VButton,
  VFrame,
  VIconBox,
  VSheetHeader,
  VSpark,
  VTabs,
} from '@/components/ui'

describe('VBar', () => {
  it('applique la largeur et les variantes', () => {
    const wrapper = mount(VBar, { props: { w: '50%', sm: true, variant: 'ac' } })
    expect(wrapper.attributes('style')).toContain('width: 50%')
    expect(wrapper.classes()).toContain('sm')
    expect(wrapper.classes()).toContain('ac')
  })
})

describe('VBars', () => {
  it('rend une barre par largeur fournie', () => {
    const wrapper = mount(VBars, { props: { widths: ['100%', '50%', '25%'] } })
    expect(wrapper.findAll('.bar')).toHaveLength(3)
  })
})

describe('VBox', () => {
  it('affiche le label et émet le clic', async () => {
    const wrapper = mount(VBox, { props: { label: 'zone', clickable: true } })
    expect(wrapper.find('.wlabel').text()).toBe('zone')
    expect(wrapper.classes()).toContain('clickable')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})

describe('VButton', () => {
  it('rend un bouton primaire et émet le clic', async () => {
    const wrapper = mount(VButton, { props: { primary: true }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('pri')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})

describe('VFrame', () => {
  it('affiche la légende, le tag et le chrome', () => {
    const wrapper = mount(VFrame, {
      props: { cap: 'Titre', tag: 'live', chrome: true, title: 'app/x' },
      slots: { default: 'contenu' },
    })
    expect(wrapper.find('.frame-cap').text()).toContain('Titre')
    expect(wrapper.find('.tag').text()).toBe('live')
    expect(wrapper.find('.frame-bar').exists()).toBe(true)
    expect(wrapper.find('.frame-body').text()).toContain('contenu')
  })
})

describe('VIconBox', () => {
  it('dimensionne via la prop size', () => {
    const wrapper = mount(VIconBox, { props: { size: 26 }, slots: { default: '⌬' } })
    expect(wrapper.attributes('style')).toContain('width: 26px')
    expect(wrapper.text()).toBe('⌬')
  })
})

describe('VSheetHeader', () => {
  it('affiche le badge, le titre et la description', () => {
    const wrapper = mount(VSheetHeader, {
      props: { badge: 'B', title: 'Titre', desc: 'Desc' },
    })
    expect(wrapper.find('.badge').text()).toBe('B')
    expect(wrapper.find('h1').text()).toBe('Titre')
    expect(wrapper.find('.desc').text()).toBe('Desc')
  })
})

describe('VSpark', () => {
  it('génère le nombre de barres demandé (déterministe)', () => {
    const a = mount(VSpark, { props: { bars: 10, seed: 3 } })
    const b = mount(VSpark, { props: { bars: 10, seed: 3 } })
    expect(a.findAll('i')).toHaveLength(10)
    expect(a.html()).toBe(b.html())
  })
})

describe('VTabs', () => {
  it("met en surbrillance l'onglet actif et émet la sélection", async () => {
    const items = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ]
    const wrapper = mount(VTabs, { props: { items, modelValue: 'a' } })
    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('on')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })
})
