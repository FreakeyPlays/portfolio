export function enableNavBarLogic() {
  const sections = document.getElementById('main_container').childNodes
  const navItems = document.getElementById('nav_li_container').childNodes

  window.onscroll = () => {
    var current = ''

    for (let section of sections) {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      console.log(sectionHeight)
      if (window.pageYOffset >= sectionTop - (1 / 3) * sectionHeight) {
        current = section.getAttribute('id')
      }
    }

    for (let item of navItems) {
      item.firstChild.classList.remove('active')

      if (item.dataset.section === current) {
        item.firstChild.classList.add('active')
      }
    }
  }
}
