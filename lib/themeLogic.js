const STORAGE_KEY = 'theme-preference'
const PREFERRED_LOCAL_THEME = localStorage.getItem(STORAGE_KEY)
const PREFERRED_OS_THEME = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches
const CONTAINER = document.body
const TOGGLE = document.getElementById('theme-toggle')

const DARK_MODE_STRING = 'dark'
const LIGHT_MODE_STRING = 'light'

export function check() {
  if (PREFERRED_LOCAL_THEME !== null) {
    if (PREFERRED_LOCAL_THEME === DARK_MODE_STRING) {
      CONTAINER.classList.add(DARK_MODE_STRING)
    }
  } else {
    if (PREFERRED_OS_THEME) {
      CONTAINER.classList.add(DARK_MODE_STRING)
    }
  }

  TOGGLE.addEventListener('click', () => {
    CONTAINER.toggleAttribute(DARK_MODE_STRING)
  })

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: isDark }) => {
      setLocalStorage(isDark)
    })
}

function setLocalStorage(isDark) {
  isDark
    ? localStorage.setItem(STORAGE_KEY, DARK_MODE_STRING)
    : localStorage.setItem(STORAGE_KEY, LIGHT_MODE_STRING)
}
