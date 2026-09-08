/* ==========================================================================
   Udaan Jobs - Master JavaScript Engine
   Handles interactive UI, dynamic job rendering, filtering, scroll reveal,
   stat counter animations, bookmark state, testimonial slider & validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ANNOUNCEMENT BAR DISMISSAL
  const announcementBar = document.getElementById('announcementBar');
  const dismissBtn = document.getElementById('dismissAnnouncement');
  if (dismissBtn && announcementBar) {
    if (sessionStorage.getItem('udaanAnnouncementDismissed') === 'true') {
      announcementBar.style.display = 'none';
    }
    dismissBtn.addEventListener('click', () => {
      announcementBar.style.display = 'none';
      sessionStorage.setItem('udaanAnnouncementDismissed', 'true');
    });
  }

  // 2. STICKY NAVBAR ON SCROLL
  const navbar = document.querySelector('.navbar-leap');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. ANIMATED STAT COUNTERS
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    let counted = false;
    const statsSection = document.querySelector('.dark-stats-band');

    const animateCounters = () => {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = Math.ceil(target / 50);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.innerHTML = `${prefix}${current.toLocaleString()}${suffix}`;
        }, 30);
      });
    };

    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          animateCounters();
        }
      }, { threshold: 0.3 });
      statsObserver.observe(statsSection);
    }
  }

  // 5. TESTIMONIAL CAROUSEL CONTROLLER
  const testimonialItems = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonialDots');
  if (testimonialItems.length > 0 && dotsContainer) {
    let currentIndex = 0;

    // Create dots
    dotsContainer.innerHTML = '';
    testimonialItems.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `testimonial-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    const goToSlide = (index) => {
      testimonialItems.forEach((slide, idx) => {
        slide.style.display = idx === index ? 'block' : 'none';
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
      currentIndex = index;
    };

    setInterval(() => {
      let nextIndex = (currentIndex + 1) % testimonialItems.length;
      goToSlide(nextIndex);
    }, 5000);

    goToSlide(0);
  }

  // 6. BOOKMARK TOGGLE & LOCAL STORAGE
  window.toggleBookmark = function(jobId, btnElement) {
    let bookmarks = JSON.parse(localStorage.getItem('udaanjobs_bookmarks') || '[]');
    const idStr = String(jobId);
    
    if (bookmarks.includes(idStr)) {
      bookmarks = bookmarks.filter(id => id !== idStr);
      btnElement.classList.remove('active');
      btnElement.querySelector('i').className = 'bi bi-bookmark';
    } else {
      bookmarks.push(idStr);
      btnElement.classList.add('active');
      btnElement.querySelector('i').className = 'bi bi-bookmark-fill';
    }
    localStorage.setItem('udaanjobs_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkBadge();
  };

  function updateBookmarkBadge() {
    const badge = document.getElementById('savedJobsCount');
    if (badge) {
      const bookmarks = JSON.parse(localStorage.getItem('udaanjobs_bookmarks') || '[]');
      badge.textContent = bookmarks.length;
    }
  }
  updateBookmarkBadge();

  // 7. FORM VALIDATION LOGIC
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('contactSuccess');
      if (contactForm.checkValidity()) {
        if (successMsg) {
          successMsg.style.display = 'block';
          contactForm.reset();
          setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }
      } else {
        contactForm.reportValidity();
      }
    });
  }

  const applyForm = document.getElementById('quickApplyForm');
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modalEl = document.getElementById('applyModal');
      const alertSuccess = document.getElementById('applySuccessAlert');
      if (applyForm.checkValidity()) {
        if (alertSuccess) {
          alertSuccess.style.display = 'block';
          applyForm.reset();
          setTimeout(() => {
            alertSuccess.style.display = 'none';
            if (modalEl && window.bootstrap) {
              const modal = bootstrap.Modal.getInstance(modalEl);
              if (modal) modal.hide();
            }
          }, 2500);
        }
      } else {
        applyForm.reportValidity();
      }
    });
  }
});

/* ==========================================================================
   AUTHENTIC UDAAN JOBS DATA ARRAY (Delivery, Sales, Telecalling, Operations, Tech)
   ========================================================================== */
const JOBS_DATA = [
  {
    id: 1,
    title: "Field Sales Executive - B2B Onboarding",
    company: "Udaan Express & Logistics",
    logoText: "UJ",
    logoBg: "var(--ch-violet-dark)",
    location: "Bengaluru, Karnataka",
    salary: "₹22,000 - ₹35,000 / mo + Incentives",
    type: "Full-time",
    category: "Sales & BD",
    postedDate: "1 day ago",
    experience: "0-2 Yrs (Freshers Welcome)",
    tags: ["On-site", "Daily Allowance", "Direct HR Call"],
    featured: true,
    description: "Join Udaan Express as a Field Sales Executive in Bengaluru! You will onboard local kirana stores, wholesalers, and retail merchants onto the Udaan B2B commerce network.",
    responsibilities: [
      "Visit local retail merchants and demonstrate product order app.",
      "Achieve daily onboarding targets with weekly performance bonuses.",
      "Collect basic merchant KYC documentation.",
      "Build strong relationships with regional Kirana store owners."
    ]
  },
  {
    id: 2,
    title: "Senior Delivery Fleet Associate",
    company: "Brightline Logistics",
    logoText: "BL",
    logoBg: "var(--ch-magenta)",
    location: "Mumbai, Maharashtra",
    salary: "₹18,000 - ₹28,000 / mo",
    type: "Full-time",
    category: "Delivery & Logistics",
    postedDate: "Just now",
    experience: "0-1 Yrs",
    tags: ["Bike Required", "Fuel Allowance", "Immediate Joiner"],
    featured: true,
    description: "Brightline Logistics is hiring Delivery Fleet Associates across Andheri, Thane, and Navi Mumbai hubs. Earn high per-packet payouts plus fuel reimbursement.",
    responsibilities: [
      "Deliver B2B e-commerce orders to retail stores within assigned pin codes.",
      "Ensure 98%+ on-time delivery SLA.",
      "Handle cash-on-delivery (COD) collection and reconciliation."
    ]
  },
  {
    id: 3,
    title: "Outbound Telecalling Executive (Voice)",
    company: "Astra Financial Services",
    logoText: "AF",
    logoBg: "var(--ch-violet)",
    location: "Gurugram, Haryana",
    salary: "₹16,000 - ₹24,000 / mo + Bonus",
    type: "Full-time",
    category: "Telecalling & BPO",
    postedDate: "2 days ago",
    experience: "0-3 Yrs",
    tags: ["Hindi & English", "Inside Sales", "Day Shift"],
    featured: true,
    description: "Call pre-qualified merchant leads regarding business micro-loans and working capital options. Friendly work environment and high monthly incentives.",
    responsibilities: [
      "Make 80-100 outbound customer calls daily.",
      "Explain loan features and eligibility to interested shopkeepers.",
      "Follow up on pending document collection."
    ]
  },
  {
    id: 4,
    title: "Senior Full Stack Engineer (Node + React)",
    company: "Zennith Tech",
    logoText: "ZT",
    logoBg: "#1F0238",
    location: "Bengaluru (Hybrid / Remote)",
    salary: "₹18.0L - ₹26.0L / yr",
    type: "Full-time",
    category: "IT & Software",
    postedDate: "3 days ago",
    experience: "3-5 Yrs",
    tags: ["Remote", "Node.js", "React", "TypeScript"],
    featured: true,
    description: "Architect high-concurrency microservices powering order processing, inventory sync, and seller payout modules for over 20,000 merchants.",
    responsibilities: [
      "Deploy scalable Node.js microservices on AWS.",
      "Build intuitive React 18 admin dashboards.",
      "Optimize MongoDB and SQL queries for instant order dispatch."
    ]
  },
  {
    id: 5,
    title: "Warehouse Operations Supervisor",
    company: "Kaveri Logistics",
    logoText: "KL",
    logoBg: "var(--ch-magenta-dark)",
    location: "Hyderabad, Telangana",
    salary: "₹20,000 - ₹30,000 / mo",
    type: "Full-time",
    category: "Delivery & Logistics",
    postedDate: "4 days ago",
    experience: "1-3 Yrs",
    tags: ["Hub Operations", "Inbound/Outbound", "Shift Lead"],
    featured: true,
    description: "Manage sorting hub inventory, inbound truck unloading, and outbound last-mile dispatch schedules at Kaveri Express Hyderabad hub.",
    responsibilities: [
      "Supervise daily sorting associates and rider dispatch logs.",
      "Maintain zero stock discrepancy across warehouse inventory.",
      "Enforce safety and hygiene guidelines in the hub."
    ]
  },
  {
    id: 6,
    title: "Performance Marketing Executive",
    company: "Nova Retail Brand",
    logoText: "NR",
    logoBg: "#8CA9FF",
    location: "Gurugram, Haryana",
    salary: "₹35,000 - ₹50,000 / mo",
    type: "Full-time",
    category: "Marketing",
    postedDate: "1 day ago",
    experience: "1-3 Yrs",
    tags: ["Meta Ads", "Google Ads", "ROAS"],
    featured: true,
    description: "Drive online customer acquisition across Facebook, Instagram, Google Search, and PMax ads for Nova Retail.",
    responsibilities: [
      "Manage monthly paid ad budgets with target CAC goals.",
      "Run continuous ad creative and copy testing.",
      "Analyze analytics dashboards to improve conversion rates."
    ]
  },
  {
    id: 7,
    title: "Counter Sales & Billing Executive",
    company: "Vanguard Hypermarket",
    logoText: "VH",
    logoBg: "var(--ch-violet)",
    location: "Pune, Maharashtra",
    salary: "₹15,000 - ₹22,000 / mo",
    type: "Full-time",
    category: "Retail Sales",
    postedDate: "5 days ago",
    experience: "0-2 Yrs",
    tags: ["Retail Store", "POS Billing", "Immediate Hiring"],
    featured: false,
    description: "Manage customer checkout counters, POS barcode scanning, billing invoices, and store display maintenance.",
    responsibilities: [
      "Scan items accurately at checkout counters using POS software.",
      "Assist walk-in retail shoppers with product queries.",
      "Maintain daily cash counter balance logs."
    ]
  },
  {
    id: 8,
    title: "Recruitment Coordinator (High-Volume Hiring)",
    company: "Udaan Talent Services",
    logoText: "UT",
    logoBg: "var(--ch-violet-dark)",
    location: "Bengaluru, Karnataka",
    salary: "₹25,000 - ₹38,000 / mo",
    type: "Full-time",
    category: "HR & Admin",
    postedDate: "3 days ago",
    experience: "1-3 Yrs",
    tags: ["Recruitment", "Bulk Sourcing", "Screening"],
    featured: false,
    description: "Coordinate walk-in drives and candidate screening for delivery associates, sales leads, and warehouse operators.",
    responsibilities: [
      "Conduct initial candidate phone screening and document verification.",
      "Organize weekly hiring drives across city centers.",
      "Issue offer letters and complete onboarding formalities."
    ]
  }
];

/* ==========================================================================
   RENDERER FOR JOBS PAGE & HOME FEATURED LISTINGS
   ========================================================================== */
function renderJobCardHTML(job) {
  const bookmarks = JSON.parse(localStorage.getItem('udaanjobs_bookmarks') || '[]');
  const isBookmarked = bookmarks.includes(String(job.id));

  return `
    <div class="col-lg-4 col-md-6 mb-4 reveal-on-scroll is-visible">
      <div class="job-card">
        <div class="job-card-header">
          <div class="company-logo-badge" style="background-color: ${job.logoBg}; color: #ffffff;">
            ${job.logoText}
          </div>
          <button class="btn-bookmark ${isBookmarked ? 'active' : ''}" 
                  onclick="toggleBookmark(${job.id}, this)" 
                  aria-label="Save job bookmark">
            <i class="bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}"></i>
          </button>
        </div>
        
        <a href="job-details.html?id=${job.id}">
          <h3 class="job-title">${job.title}</h3>
        </a>
        <div class="job-company">${job.company} • <span class="text-muted">${job.category}</span></div>
        
        <div class="job-meta-row">
          <span class="job-meta-item"><i class="bi bi-geo-alt-fill text-danger"></i> ${job.location}</span>
          <span class="job-meta-item"><i class="bi bi-briefcase-fill text-primary"></i> ${job.experience}</span>
        </div>

        <div class="mb-3 d-flex flex-wrap gap-1">
          ${job.tags.map(tag => `<span class="badge-leap badge-leap-blue">${tag}</span>`).join('')}
        </div>

        <div class="job-card-footer">
          <div class="job-salary">${job.salary}</div>
          <a href="job-details.html?id=${job.id}" class="btn btn-sm btn-leap-outline">Apply Now</a>
        </div>
      </div>
    </div>
  `;
}

// Populate Home Featured Jobs
document.addEventListener('DOMContentLoaded', () => {
  const homeJobsContainer = document.getElementById('featuredJobsContainer');
  if (homeJobsContainer) {
    const featuredListings = JOBS_DATA.slice(0, 6);
    homeJobsContainer.innerHTML = featuredListings.map(renderJobCardHTML).join('');
  }
});
