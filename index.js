const notifications = document.querySelector(".notifications");
const notIcon = document.querySelector(".widgets__icon");

function showNotifications() {
  notifications.classList.toggle("open");
}

notIcon.addEventListener("click", showNotifications);
