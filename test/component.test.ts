import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import TheNavbar from '../src/components/TheNavbar.vue'
import { toggleDark } from '../src/composables/dark'

// Mock toggleDark function
vi.mock('../src/composables/dark', () => ({
  toggleDark: vi.fn(),
}))

// Create a mock i18n instance
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      'button.toggle_dark': 'Toggle Dark Mode',
    },
  },
})

describe('component TheNavbar.vue', () => {
  it('should toggle dark mode', async () => {
    const wrapper = mount(TheNavbar, {
      global: {
        plugins: [i18n], // Install i18n plugin
        stubs: {
          RouterLink: true, // Stub RouterLink
        },
      },
    })

    const toggleDarkButton = wrapper.find('[data-test-id="toggle_dark"]')
    expect(toggleDarkButton.exists()).toBe(true)

    await toggleDarkButton.trigger('click')
    expect(toggleDark).toHaveBeenCalled()
  })

  it('should navigate to the about page', () => {
    const wrapper = mount(TheNavbar, {
      global: {
        plugins: [i18n], // Install i18n plugin
        stubs: {
          RouterLink: true, // Stub RouterLink
        },
      },
    })

    const aboutLink = wrapper.find('[data-test-id="about"]')
    expect(aboutLink.exists()).toBe(true)
    expect(aboutLink.attributes('to')).toBe('/about')
  })
})
