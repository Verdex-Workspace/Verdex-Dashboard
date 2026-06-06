import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VKpi from '@/components/ui/VKpi.vue'

describe('VKpi', () => {
  it('affiche le libellé et la valeur', () => {
    const wrapper = mount(VKpi, { props: { label: 'Uptime', value: '99.4%' } })
    expect(wrapper.text()).toContain('Uptime')
    expect(wrapper.text()).toContain('99.4%')
  })

  it('affiche un sparkline quand spark=true', () => {
    const wrapper = mount(VKpi, {
      props: { label: 'Logs', value: '12k', spark: true, kind: 'ok' },
    })
    expect(wrapper.find('.spark').exists()).toBe(true)
  })

  it("n'affiche pas de sparkline par défaut", () => {
    const wrapper = mount(VKpi, { props: { label: 'Logs', value: '12k' } })
    expect(wrapper.find('.spark').exists()).toBe(false)
  })
})
