const INTRO_DELAY = 3

export const fadeInIntroContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 3,
      delayChildren: INTRO_DELAY + 0.3,
      staggerChildren: 0.2
    }
  }
}

export const fadeInIntroItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export const fadeInToggle = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { delay: INTRO_DELAY + 0.3 } }
}

export const fadeInGradient = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.6, transition: { duration: 0.8, delay: INTRO_DELAY } }
}

export const fadeInNavbar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, delay: INTRO_DELAY } }
}

export const fadeIn = {
  hidden: { opacity: 0, scale: 1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
}

export const gridContainerWork = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

export const gridItemWork = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export const gridContainerSectionMenu = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.2
    }
  }
}

export const gridItemSectionMenu = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export const fadeInSectionMenu = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } }
}
