import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VChip from '@/components/ui/VChip.vue'

describe('VChip', () => {
  it('rend le contenu du slot', () => {
    const wrapper = mount(VChip, { slots: { default: 'prod' } })
    expect(wrapper.text()).toContain('prod')
  })

  it('applique la classe de statut', () => {
    const wrapper = mount(VChip, { props: { kind: 'err' } })
    expect(wrapper.classes()).toContain('err')
  })

  it("n'ajoute pas de classe pour le statut neutre", () => {
    const wrapper = mount(VChip, { props: { kind: 'neutral' } })
    expect(wrapper.classes()).not.toContain('neutral')
  })

  it('masque la pastille si dot=false', () => {
    const wrapper = mount(VChip, { props: { dot: false } })
    expect(wrapper.find('.d').exists()).toBe(false)
  })
})
