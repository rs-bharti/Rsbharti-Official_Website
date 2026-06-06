document.addEventListener("DOMContentLoaded", () => {
  // Carousel data
  const data = [
    {
      img: "images/britannia.png",
      title: "BRITANNIA",
      text: "For over 130 years, Britannia has been a cherished part of life for millions of families across India and the world. Since our humble beginnings in 1892, we've grown into one of India's leading and most trusted food companies, committed to the promise of 'Eat Healthy, Think Better.' Our journey is one built on a legacy of quality, innovation, and an unwavering commitment to bringing delicious and wholesome food to your table. From the iconic crunch of Marie Gold to the melt-in-your-mouth goodness of Good Day cookies and our trusted range of breads and dairy products, we craft every product with care, ensuring that every bite is a moment of delight and nutrition."
    },
    {
      img: "images/pynk.png",
      title: "PYNK",
      text: "Pynk is the dynamic women's wear brand from the trusted house of Lux Industries, crafted for the modern Indian woman. Drawing on a legacy of quality and comfort, Pynk is not just clothing; it is a mindset of fluid femininity that celebrates a woman's journey, resilience, and pride. Our collection seamlessly blends comfort, contemporary design, and confidence across a wide range of apparel. We are committed to making fashionable and high-quality women's wear accessible across the country, ensuring that every woman can move freely and express herself unapologetically, feeling both comfortable and confident, every single day."
    },
    {
      img: "images/onn.png",
      title: "ONN",
      text: "ONN is a consumer electronics brand focused on delivering thoughtfully designed tech and accessories that offer great value. Primarily known for its availability through a major US retailer, ONN's mission is to make modern technology accessible for everyday life. Their product line includes a wide array of items, such as 4K streaming devices with Google TV, high-quality HDMI cables, TV wall mounts, and affordable tablets for both adults and kids. ONN provides essential tech solutions that are simple to use and easy on the wallet, ensuring you stay connected and entertained."
    }
  ];

  let currentIndex = 0;
  let autoSlideInterval;

  const imgDiv = document.getElementById("carouselImage");
  const titleEl = document.getElementById("carouselTitle");
  const textEl = document.getElementById("carouselText");

  function showSlide(index, withTransition = true) {
    if (!imgDiv) return;
    if (withTransition) {
      imgDiv.classList.add("fade-out");
      setTimeout(() => {
        updateContent(index);
        imgDiv.classList.remove("fade-out");
        imgDiv.classList.add("fade-in");
        setTimeout(() => imgDiv.classList.remove("fade-in"), 600);
      }, 600);
    } else {
      updateContent(index);
    }
  }

  function updateContent(index) {
    imgDiv.style.backgroundImage = `url("${data[index].img}")`;
    titleEl.textContent = data[index].title;
    textEl.textContent = data[index].text;
  }

  function changeSlide(step) {
    currentIndex = (currentIndex + step + data.length) % data.length;
    showSlide(currentIndex);
    resetAutoSlide();
  }

  function autoSlide() {
    currentIndex = (currentIndex + 1) % data.length;
    showSlide(currentIndex);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 5000);
  }

  // expose to HTML buttons
  window.changeSlide = changeSlide;

  // init
  showSlide(0, false);
  resetAutoSlide();

  // optional: particle canvas check (won’t break if missing)
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
