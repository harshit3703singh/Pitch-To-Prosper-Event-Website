// Init Lenis smoothly
let lenis;
try {
  lenis = new Lenis({ duration: 1.2, smooth: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
} catch (e) {
  console.log("Lenis initialization error:", e);
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const dropdownParent = link.closest('.nav-dropdown');
      if (dropdownParent && link === dropdownParent.querySelector('a')) {
        // It's the toggle link, don't close the menu, just open the dropdown
        e.preventDefault();
        dropdownParent.classList.toggle('mobile-open');
      } else {
        // It's a regular link or an inner dropdown link, close everything
        navLinks.classList.remove('active');
        document.querySelectorAll('.nav-dropdown.mobile-open').forEach(d => d.classList.remove('mobile-open'));
      }
    });
  });
}

// GSAP Register
gsap.registerPlugin(ScrollTrigger);



// Pre-Loader Sequence
const preLoader = document.getElementById('pre-loader');
const loaderBar = document.querySelector('.hack-loader-bar');
const loaderPct = document.querySelector('.loader-percentage');

if(preLoader && loaderBar) {
  const plTl = gsap.timeline({
    onComplete: () => {
      gsap.to(preLoader, { opacity: 0, duration: 0.5, onComplete: () => {
        preLoader.style.display = 'none';
        initScrollAnimations();
      }});
    }
  });
  
  let pctObj = { val: 0 };
  plTl.to(loaderBar, { width: '100%', duration: 1.5, ease: 'power1.inOut' }, 0);
  plTl.to(pctObj, { 
    val: 100, duration: 1.5, ease: 'power1.inOut',
    onUpdate: () => {
      let num = Math.floor(pctObj.val);
      if(loaderPct) loaderPct.innerHTML = num + ' %';
    }
  }, 0);
} else {
  initScrollAnimations();
}

// Scroll Animations Setup
function initScrollAnimations() {
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.8, delay: 0.5, ease: "power2.out",
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Timeline Trail & Active Items
  const timelineTrail = document.querySelector('.st-timeline-trail');
  if(timelineTrail) {
    gsap.to(timelineTrail, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '.st-timeline', start: 'top center', end: 'bottom center', scrub: true }
    });

    gsap.utils.toArray('.st-timeline-item').forEach(item => {
      ScrollTrigger.create({
        trigger: item, start: 'top center',
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active')
      });
    });
  }

  // Criteria Percentage Bars
  gsap.utils.toArray('.bar-fill').forEach(bar => {
    const targetWidth = bar.closest('.bar-group').querySelector('.bar-pct').innerText.replace('%', '');
    gsap.to(bar, {
      width: targetWidth + '%', duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: bar.closest('.bar-group'), start: 'top 85%' }
    });
  });
}

// Countdown Timer Logic
const targetDate = new Date('August 6, 2026 00:00:00').getTime();
const countdownInterval = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(countdownInterval);
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) countdownEl.innerHTML = '<div class="countdown-title" style="margin: 0; font-size: 1.5rem; color: var(--primary-blue);">EVENT IS LIVE NOW</div>';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const elDays = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');

  if(elDays) elDays.innerText = days < 10 ? '0' + days : days;
  if(elHours) elHours.innerText = hours < 10 ? '0' + hours : hours;
  if(elMinutes) elMinutes.innerText = minutes < 10 ? '0' + minutes : minutes;
  if(elSeconds) elSeconds.innerText = seconds < 10 ? '0' + seconds : seconds;
}, 1000);