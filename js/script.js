document.addEventListener("DOMContentLoaded", () => {

  // ===== Scroll Reveal Sections =====
  function revealSections() {
    document.querySelectorAll(".reveal").forEach(section => {
      const top = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (top < windowHeight - 100) {
        section.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", revealSections);
  revealSections();

  // ===== Smooth Scroll (Lenis) =====
const lenis = new Lenis({
  duration: 1.2,
  smooth: true,
  smoothTouch: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

  // ===== Form Elements =====
  const form = document.getElementById("registrationForm");
  const fullNameInput = document.getElementById("fullName");
  const mobileInput = document.getElementById("mobileNumber");
  const citySelect = document.getElementById("city");
  const neetSelect = document.getElementById("neetStatus");
  const collegeSelect = document.getElementById("collegePreference");
  const loanSelect = document.getElementById("loanRequirement");
  const popup = document.getElementById("successPopup");
  const spinner = document.getElementById("loadingSpinner");
  const submitBtn = form.querySelector("button[type='submit']");

  // ===== Helper Functions =====
  function sanitizeInput(input) {
    return input.replace(/<[^>]*>?/gm, '');
  }

  function isValidName(name) {
    return /^[a-zA-Z\s]{2,50}$/.test(name);
  }

  function isValidMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile) && !/^(\d)\1{9}$/.test(mobile);
  }

  function addError(el) {
    el.classList.add("input-error");
  }

  function removeError(el) {
    el.classList.remove("input-error");
  }

  // ===== Name Field Validation (Real-time Red Border) =====
  fullNameInput.addEventListener("input", function () {
    const value = this.value;

    if (/[^a-zA-Z\s]/.test(value)) {
      addError(this);
    } else {
      removeError(this);
    }
  });

  // ===== Phone Field Validation =====

  // Only allow numbers while typing
  mobileInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');

    if (/^\d{10}$/.test(this.value.trim())) {
      removeError(this);
    }
  });

  // Validate when leaving field
  mobileInput.addEventListener("blur", function () {
    const value = this.value.trim();

    if (!/^\d{10}$/.test(value)) {
      addError(this);
    } else {
      removeError(this);
    }
  });

  // ===== Select Field Validation (Optional Red Border) =====
  [citySelect, neetSelect, collegeSelect, loanSelect].forEach(select => {
    select.addEventListener("change", () => {
      if (!select.value) {
        addError(select);
      } else {
        removeError(select);
      }
    });
  });

  // ===== Form Submission =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let fullName = sanitizeInput(fullNameInput.value.trim());
    let mobile = mobileInput.value.trim();
    let city = citySelect.value;
    let neet = neetSelect.value;
    let college = collegeSelect.value;
    let loan = loanSelect.value;

    // Required fields check
    if (!fullName || !mobile || !city || !neet || !college || !loan) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidName(fullName)) {
      addError(fullNameInput);
      alert("Enter a valid name (letters only)");
      return;
    }

    if (!isValidMobile(mobile)) {
      addError(mobileInput);
      alert("Enter a valid 10-digit Indian mobile number");
      return;
    }

    // ===== Prevent double submit =====
    submitBtn.disabled = true;
    spinner.style.display = "block";

    setTimeout(() => {
      spinner.style.display = "none";
      popup.style.display = "flex";
      form.reset();
      submitBtn.disabled = false;

      // Remove all error borders after reset
      document.querySelectorAll(".input-error").forEach(el => {
        el.classList.remove("input-error");
      });

    }, 1500);
  });

  // Close popup
  document.getElementById("closePopup").onclick = () => popup.style.display = "none";

  // ===== Animated Counters =====
  function animateCounter(el, target) {
    let count = 0;
    const increment = Math.ceil(target / 100);
    const interval = setInterval(() => {
      count += increment;
      if (count > target) count = target;
      el.textContent = count;
      if (count >= target) clearInterval(interval);
    }, 20);
  }

  const counterElements = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, +entry.target.dataset.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 1 });

  counterElements.forEach(el => counterObserver.observe(el));

  // ===== Testimonial Slider =====
  let testimonialIndex = 0;
  const testimonialCards = document.querySelectorAll(".testimonial-slider .testimonial-card");
  if (testimonialCards.length > 0) {
    setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
      testimonialCards.forEach((card) => {
        card.style.transform = `translateX(-${testimonialIndex * 100}%)`;
      });
    }, 3000);
  }

});
