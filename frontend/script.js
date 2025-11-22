document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  htmlElement.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateIcon(newTheme);
});

function updateIcon(theme) {
  themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
}

const portfolioGrid = document.getElementById("portfolioGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const imageIds = [
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
  "1487958449943-2429e8be8625",
];

let loadedCount = 0;
const batchSize = 6;

function loadItems() {
  const limit = Math.min(loadedCount + batchSize, imageIds.length);

  for (let i = loadedCount; i < limit; i++) {
    const imgId = imageIds[i];
    const stableImgUrl = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=600&q=80`;
    const largeImgUrl = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=1200&q=90`;

    const div = document.createElement("div");
    div.className = "project-item reveal";
    div.onclick = function () {
      openLightbox(largeImgUrl);
    };

    div.innerHTML = `
          <img src="${stableImgUrl}" alt="Project ${i + 1}" loading="lazy">
          <div class="project-overlay">
            <div class="project-ref">REF: 24-00${i + 1}</div>
            <div class="project-title">Industrial Steel Structure</div>
          </div>
        `;
    portfolioGrid.appendChild(div);
  }

  loadedCount = limit;
  if (loadedCount >= imageIds.length) {
    loadMoreBtn.style.display = "none";
  }

  checkReveal();
}

loadItems();
loadMoreBtn.addEventListener("click", loadItems);

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("active");
}
function closeLightbox() {
  lightbox.classList.remove("active");
  setTimeout(() => (lightboxImg.src = ""), 300);
}
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function checkReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;
  const elementVisible = 100;

  for (let i = 0; i < reveals.length; i++) {
    const elementTop = reveals[i].getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}
window.addEventListener("scroll", checkReveal);

checkReveal();

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameField = contactForm.querySelector('[name="name"]');
  const emailField = contactForm.querySelector('[name="email"]');
  const serviceField = contactForm.querySelector('[name="service"]');
  const detailsField = contactForm.querySelector('[name="details"]');

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const service = serviceField.value;
  const details = detailsField.value.trim();

  if (!name) {
    Swal.fire({
      icon: "warning",
      title: "Name Required",
      text: "Please enter your name or company name.",
      confirmButtonColor: "#06b6d4",
    });
    nameField.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Email",
      text: "Please enter a valid email address so we can reply to you.",
      confirmButtonColor: "#06b6d4",
    });
    emailField.focus();
    return;
  }

  if (!details || details.length < 10) {
    Swal.fire({
      icon: "warning",
      title: "More Details Needed",
      text: "Please provide a bit more information about your project (at least 10 characters).",
      confirmButtonColor: "#06b6d4",
    });
    detailsField.focus();
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;

  submitBtn.innerText = "Sending...";
  submitBtn.disabled = true;

  const formData = { name, email, service, details };

  try {
    const response = await fetch("https://thesteeldesignereu.onrender.comsend-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "We have received your details and will get back to you shortly.",
        confirmButtonColor: "#06b6d4",
      });
      contactForm.reset();
    } else {
      throw new Error("Server response was not ok");
    }
  } catch (error) {
    console.error("Error:", error);

    Swal.fire({
      icon: "error",
      title: "Sending Failed",
      text: "Something went wrong. Please try again later or contact us via WhatsApp.",
      confirmButtonColor: "#06b6d4",
    });
  } finally {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  }
});
