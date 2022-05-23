export function toggleMobileSidebar() {
  const mobileSidebar = document.querySelector('.backdrop');
  if (mobileSidebar.classList.contains('hidden')) {
    mobileSidebar.classList.remove('hidden');
  } else {
    mobileSidebar.classList.add('hidden');
  }
}

export function checkIsMobile() {
  return window.innerWidth <= 678;
}
