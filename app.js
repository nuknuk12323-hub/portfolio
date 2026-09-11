document.querySelectorAll('details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false})}));

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  let observer;
  function reveal(element, delay = 0) {
    if (reduced.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(
      [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 680, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
    );
    active.add(animation);
    animation.finished.then(() => active.delete(animation)).catch(() => active.delete(animation));
  }
  if (!reduced.matches) {
    document.querySelectorAll('.hero-top, .hero h1, .hero-bottom, .hero-foot').forEach((el, i) => reveal(el, i * 110));
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          if (entry.target.matches('.featured')) entry.target.classList.add('flow-animate');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.about-main, .facts, .section-title, .project, .career, .skill-list > div, .contact .wrap')
        .forEach(el => observer.observe(el));
    }
  }
  document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open && !reduced.matches) {
        const paragraph = detail.querySelector('p');
        if (paragraph) reveal(paragraph);
      }
    });
  });
  reduced.addEventListener('change', event => {
    if (event.matches) {
      observer?.disconnect();
      active.forEach(animation => animation.cancel());
      active.clear();
      document.querySelectorAll('.flow-animate').forEach(el => el.classList.remove('flow-animate'));
    }
  });
})();

