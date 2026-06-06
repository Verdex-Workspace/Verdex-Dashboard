import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { router } from '@/router'
import LoginView from '@/views/LoginView.vue'
import { i18n } from '@/i18n'

describe('LoginView', () => {
  it('affiche le formulaire de connexion Verdex', () => {
    const wrapper = mount(LoginView, { global: { plugins: [createPinia(), router, i18n] } })
    expect(wrapper.text()).toContain('Connexion')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Se connecter')
    expect(wrapper.text()).toContain('GitHub')
  })
})
