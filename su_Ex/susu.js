document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("mouseenter", () => {
    const subMenu = item.querySelector(".sub");
    subMenu.style.height = `${subMenu.scrollHeight}px`;
  });
  
  item.addEventListener("mouseleave", () => {
    const subMenu = item.querySelector(".sub");
    subMenu.style.height = "0";
  });
});
