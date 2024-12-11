function initializeChatToast() {
  setTimeout(showToast, 5000);
}

function showToast() {
  const toast = document.getElementById('chatToast');
  if (toast && !localStorage.getItem('chatToastShown')) {
    toast.style.display = 'block';
    startToastProgress();
  }
}

function hideToast() {
  const toast = document.getElementById('chatToast');
  if (toast) {
    toast.style.display = 'none';
    localStorage.setItem('chatToastShown', 'true');
  }
}

function closeToast() {
  hideToast();
}

function startToastProgress() {
  const progress = document.querySelector('.toast-progress');
  if (progress) {
    progress.style.width = '100%';
    progress.style.transition = 'width 5s linear';
    setTimeout(() => {
      progress.style.width = '0';
    }, 100);
    setTimeout(hideToast, 5000);
  }
}

export {
  initializeChatToast,
  showToast,
  hideToast,
  closeToast,
  startToastProgress
};
