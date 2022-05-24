export function toggleMobileSidebar(e) {
  if (
    e.target.classList.contains('backdrop') ||
    e.currentTarget.classList.contains('burger-button') ||
    e.currentTarget.classList.contains('close-sidebar-button')
  ) {
    const mobileSidebar = document.querySelector('.backdrop');
    if (mobileSidebar.classList.contains('hidden')) {
      mobileSidebar.classList.remove('hidden');
    } else {
      mobileSidebar.classList.add('hidden');
    }
  }
}

export function checkIsMobile() {
  return window.innerWidth <= 678;
}
