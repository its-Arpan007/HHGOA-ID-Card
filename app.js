/**
 * HACKER HOUSE GOA 2026 - BUILDER IDENTITY & PFP STUDIO
 * Core Logic: Photo Upload, Camera Capture, HEIC Conversion, Dual Format Mode Switching,
 * Dynamic Title Generator, Image Framing, Toast System, PNG Export & X Sharing.
 * Includes Official Hacker House Goa 2026 Builder Pass Card Layout with Dynamic Text Auto-Scaling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs & Form Controls
  const nameInput = document.getElementById('nameInput');
  const roleInput = document.getElementById('roleInput');
  const titleInput = document.getElementById('titleInput');
  const photoInput = document.getElementById('photoInput');
  const dropzone = document.getElementById('dropzone');
  const dropzonePrimaryText = document.getElementById('dropzonePrimaryText');
  const randomTitleBtn = document.getElementById('randomTitleBtn');

  // Photo Action Buttons
  const openCameraBtn = document.getElementById('openCameraBtn');
  const triggerUploadBtn = document.getElementById('triggerUploadBtn');

  // Camera Modal Elements
  const cameraModal = document.getElementById('cameraModal');
  const cameraBackdrop = document.getElementById('cameraBackdrop');
  const closeCameraBtn = document.getElementById('closeCameraBtn');
  const cancelCameraBtn = document.getElementById('cancelCameraBtn');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraSnapshot = document.getElementById('cameraSnapshot');
  const faceGuide = document.getElementById('faceGuide');
  const cameraLiveControls = document.getElementById('cameraLiveControls');
  const cameraReviewControls = document.getElementById('cameraReviewControls');
  const capturePhotoBtn = document.getElementById('capturePhotoBtn');
  const retakePhotoBtn = document.getElementById('retakePhotoBtn');
  const usePhotoBtn = document.getElementById('usePhotoBtn');
  const switchCameraBtn = document.getElementById('switchCameraBtn');

  // Format Switching Buttons
  const modeIdCardBtn = document.getElementById('modeIdCard');
  const modePfpBtn = document.getElementById('modePfp');

  // Image Framing Controls
  const imageControls = document.getElementById('imageControls');
  const zoomSlider = document.getElementById('zoomSlider');
  const posXSlider = document.getElementById('posXSlider');
  const posYSlider = document.getElementById('posYSlider');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');

  // Display Elements - Builder ID Card
  const idCard = document.getElementById('idCard');
  const cardName = document.getElementById('cardName');
  const cardRole = document.getElementById('cardRole');
  const cardTitleBadge = document.getElementById('cardTitleBadge');
  const cardSerial = document.getElementById('cardSerial');
  const cardFooterSerial = document.getElementById('cardFooterSerial');
  const profilePhoto = document.getElementById('profilePhoto');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const photoFrame = document.getElementById('photoFrame');

  // Display Elements - PFP Frame
  const pfpFrame = document.getElementById('pfpFrame');
  const pfpProfilePhoto = document.getElementById('pfpProfilePhoto');
  const pfpPlaceholder = document.getElementById('pfpPlaceholder');

  // Action Buttons
  const exportBtn = document.getElementById('exportBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareXBtn = document.getElementById('shareXBtn');
  const shareXBtnTop = document.getElementById('shareXBtnTop');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // Application State
  let activeMode = 'idcard'; // 'idcard' or 'pfp'
  let currentZoom = 1;
  let currentPosX = 0;
  let currentPosY = 0;
  let rawImageDataURL = '';
  let lastTitleIndex = -1;

  // Camera State
  let currentStream = null;
  let facingMode = 'user';
  let capturedDataURL = '';

  // Generate Unique Dynamic Builder ID (e.g. HHG-2026-8499)
  function generateBuilderId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `HHG-2026-${randomNum}`;
  }

  const currentBuilderId = generateBuilderId();
  if (cardSerial) cardSerial.textContent = currentBuilderId;
  if (cardFooterSerial) cardFooterSerial.textContent = currentBuilderId;

  // Curated Hacker & Builder Titles (30 Titles)
  const funTitles = [
    '🌴 GOA CODE CHAD',
    '🧠 AI ARCHITECT',
    '⚡ SOLANA WIZARD',
    '🔥 RUST WRANGLER',
    '🔮 PROTOCOL SURFER',
    '🌊 WEB3 SURFER',
    '🚀 DEFI ARCHITECT',
    '💻 PROMPT MAGICIAN',
    '👑 FULLSTACK CHIEFTAIN',
    '🛠️ BUIDL LEGEND',
    '🏖️ BEACH BUILDER',
    '💎 CYBERPUNK HACKER',
    '👾 DEBUGGING DEMON',
    '⚡ 10X PROBLEM SOLVER',
    '🎯 SHIP IT ENGINEER',
    '🎨 PIXEL PUSHER',
    '🔌 API WIZARD',
    '🌙 NIGHT SHIFT BUILDER',
    '🏹 BUG HUNTER',
    '☁️ CLOUD ARCHITECT',
    '⚙️ SYSTEMS BEAST',
    '🚀 ZERO TO SHIPPED',
    '⚡ BUILD MODE: ON',
    '⚔️ SMART CONTRACT SAMURAI',
    '🌴 BEACH HACKER',
    '🧬 DECENTRALIZED ALCHEMIST',
    '🏗️ PRODUCT HACKER',
    '🌐 OPEN SOURCE HERO',
    '📦 PACKAGE MAESTRO',
    '🧠 DEEP LEARNING CHAD'
  ];

  // -------------------------------------------------------------------------
  // 1. Toast Notification System
  // -------------------------------------------------------------------------
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    if (toastContainer.children.length >= 3) {
      toastContainer.removeChild(toastContainer.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    const iconName = type === 'error' ? 'alert-circle' : 'check-circle';
    toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      toast.addEventListener('animationend', () => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      });
    }, 2800);
  }

  // -------------------------------------------------------------------------
  // 2. Camera Stream Lifecycle & Capture Controls
  // -------------------------------------------------------------------------
  function stopCameraStream() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
  }

  function closeCameraModal() {
    stopCameraStream();
    if (cameraModal) cameraModal.classList.add('hidden');
    capturedDataURL = '';
  }

  async function checkMultipleCameras() {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && switchCameraBtn) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        if (videoDevices.length > 1) {
          switchCameraBtn.classList.remove('hidden');
        } else {
          switchCameraBtn.classList.add('hidden');
        }
      } catch (e) {}
    }
  }

  async function startCamera() {
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Camera unavailable on this browser. You can upload a photo instead.', 'error');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      };

      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraVideo.srcObject = currentStream;

      cameraVideo.classList.remove('hidden');
      cameraSnapshot.classList.add('hidden');
      faceGuide.classList.remove('hidden');
      cameraLiveControls.classList.remove('hidden');
      cameraReviewControls.classList.add('hidden');
      cameraModal.classList.remove('hidden');

      checkMultipleCameras();
    } catch (err) {
      console.warn('Camera access error:', err);
      stopCameraStream();

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showToast('Camera access was denied. You can upload a photo instead.', 'error');
      } else {
        showToast('Camera unavailable. You can upload a photo instead.', 'error');
      }
    }
  }

  function capturePhoto() {
    if (!cameraVideo || !cameraVideo.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    capturedDataURL = canvas.toDataURL('image/jpeg', 0.92);

    cameraSnapshot.src = capturedDataURL;
    cameraSnapshot.classList.remove('hidden');
    cameraVideo.classList.add('hidden');
    faceGuide.classList.add('hidden');

    cameraLiveControls.classList.add('hidden');
    cameraReviewControls.classList.remove('hidden');
  }

  function retakePhoto() {
    capturedDataURL = '';
    cameraSnapshot.classList.add('hidden');
    cameraVideo.classList.remove('hidden');
    faceGuide.classList.remove('hidden');
    cameraReviewControls.classList.add('hidden');
    cameraLiveControls.classList.remove('hidden');
  }

  function useCapturedPhoto() {
    if (!capturedDataURL) return;

    rawImageDataURL = capturedDataURL;

    profilePhoto.src = rawImageDataURL;
    profilePhoto.classList.remove('hidden');
    photoPlaceholder.classList.add('hidden');

    pfpProfilePhoto.src = rawImageDataURL;
    pfpProfilePhoto.classList.remove('hidden');
    pfpPlaceholder.classList.add('hidden');

    imageControls.classList.remove('hidden');
    resetImageTransform();

    if (dropzonePrimaryText) {
      dropzonePrimaryText.textContent = '✓ Camera photo applied! Click to change';
    }

    closeCameraModal();
    showToast('✓ Photo captured successfully!');
  }

  // Camera Event Listeners
  if (openCameraBtn) openCameraBtn.addEventListener('click', startCamera);
  if (triggerUploadBtn) triggerUploadBtn.addEventListener('click', () => photoInput.click());

  if (closeCameraBtn) closeCameraBtn.addEventListener('click', closeCameraModal);
  if (cancelCameraBtn) cancelCameraBtn.addEventListener('click', closeCameraModal);
  if (cameraBackdrop) cameraBackdrop.addEventListener('click', closeCameraModal);

  if (capturePhotoBtn) capturePhotoBtn.addEventListener('click', capturePhoto);
  if (retakePhotoBtn) retakePhotoBtn.addEventListener('click', retakePhoto);
  if (usePhotoBtn) usePhotoBtn.addEventListener('click', useCapturedPhoto);

  if (switchCameraBtn) {
    switchCameraBtn.addEventListener('click', () => {
      facingMode = facingMode === 'user' ? 'environment' : 'user';
      startCamera();
    });
  }

  // -------------------------------------------------------------------------
  // 3. Text Real-Time Binding & Dynamic Auto-Scaling (Requirements #6 & #7)
  // -------------------------------------------------------------------------
  function adjustTextScaling() {
    if (!cardName) return;

    const nameText = (cardName.textContent || '').trim();
    const len = nameText.length;

    if (len > 34) {
      cardName.style.fontSize = '0.95rem';
      cardName.style.letterSpacing = '-0.02em';
    } else if (len > 25) {
      cardName.style.fontSize = '1.15rem';
      cardName.style.letterSpacing = '-0.01em';
    } else if (len > 18) {
      cardName.style.fontSize = '1.32rem';
      cardName.style.letterSpacing = '0em';
    } else if (len > 12) {
      cardName.style.fontSize = '1.5rem';
    } else {
      cardName.style.fontSize = '1.65rem';
    }

    if (cardRole) {
      const roleText = (cardRole.textContent || '').trim();
      const rLen = roleText.length;

      if (rLen > 38) {
        cardRole.style.fontSize = '0.72rem';
      } else if (rLen > 24) {
        cardRole.style.fontSize = '0.8rem';
      } else {
        cardRole.style.fontSize = '0.85rem';
      }
    }
  }

  nameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardName.textContent = val !== '' ? val.toUpperCase() : 'ARPAN KUMAR SINHA';
    adjustTextScaling();
  });

  roleInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardRole.textContent = val !== '' ? val.toUpperCase() : 'FULL STACK DEVELOPER / AI/ML ENTHUSIAST';
    adjustTextScaling();
  });

  titleInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardTitleBadge.textContent = val !== '' ? val.toUpperCase() : 'BUILDER TITLE';
  });

  // Stack Chip Buttons Quick Select
  document.querySelectorAll('.stack-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const stackVal = chip.getAttribute('data-stack');
      if (stackVal) {
        roleInput.value = stackVal;
        cardRole.textContent = stackVal;
        adjustTextScaling();
        showToast(`Role set to ${stackVal}`);
      }
    });
  });

  // Randomize Title Action with Non-Repetition & Fast Animation
  randomTitleBtn.addEventListener('click', () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * funTitles.length);
    } while (nextIndex === lastTitleIndex && funTitles.length > 1);
    
    lastTitleIndex = nextIndex;
    const randomTitle = funTitles[nextIndex];
    
    cardTitleBadge.style.transform = 'scale(1.08) rotate(-1deg)';
    cardTitleBadge.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      titleInput.value = randomTitle;
      cardTitleBadge.textContent = randomTitle;
      cardTitleBadge.style.transform = 'scale(1) rotate(0deg)';
    }, 100);

    showToast(`Title randomized: ${randomTitle}`);
  });

  // Initial scaling call
  adjustTextScaling();

  // -------------------------------------------------------------------------
  // 4. Format Switcher (Builder Pass ID Card vs PFP Frame)
  // -------------------------------------------------------------------------
  function switchMode(mode) {
    activeMode = mode;
    if (mode === 'idcard') {
      modeIdCardBtn.classList.add('active');
      modeIdCardBtn.setAttribute('aria-selected', 'true');
      modePfpBtn.classList.remove('active');
      modePfpBtn.setAttribute('aria-selected', 'false');

      idCard.classList.remove('hidden');
      pfpFrame.classList.add('hidden');
    } else {
      modePfpBtn.classList.add('active');
      modePfpBtn.setAttribute('aria-selected', 'true');
      modeIdCardBtn.classList.remove('active');
      modeIdCardBtn.setAttribute('aria-selected', 'false');

      pfpFrame.classList.remove('hidden');
      idCard.classList.add('hidden');
    }
  }

  modeIdCardBtn.addEventListener('click', () => switchMode('idcard'));
  modePfpBtn.addEventListener('click', () => switchMode('pfp'));

  // -------------------------------------------------------------------------
  // 5. Photo Upload & iPhone HEIC Support
  // -------------------------------------------------------------------------
  async function handleImageUpload(file) {
    if (!file) return;

    let processFile = file;
    const fileName = file.name.toLowerCase();

    // HEIC / HEIF Conversion for iPhone photos
    if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif') {
      try {
        if (dropzonePrimaryText) dropzonePrimaryText.textContent = 'Converting iPhone HEIC photo...';
        
        if (window.heic2any) {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9
          });
          processFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        }
      } catch (err) {
        console.warn('HEIC conversion fallback:', err);
        showToast('HEIC image issue, attempting direct load...', 'error');
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      rawImageDataURL = e.target.result;
      
      profilePhoto.src = rawImageDataURL;
      profilePhoto.classList.remove('hidden');
      photoPlaceholder.classList.add('hidden');

      pfpProfilePhoto.src = rawImageDataURL;
      pfpProfilePhoto.classList.remove('hidden');
      pfpPlaceholder.classList.add('hidden');

      imageControls.classList.remove('hidden');
      resetImageTransform();

      if (dropzonePrimaryText) {
        dropzonePrimaryText.textContent = '✓ Photo loaded! Click to change';
      }

      showToast('Photo loaded successfully!');
    };

    reader.onerror = () => {
      showToast('Error loading image file.', 'error');
    };

    reader.readAsDataURL(processFile);
  }

  // File Input Change
  photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  });

  photoFrame.addEventListener('click', () => photoInput.click());
  photoFrame.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') photoInput.click(); });
  
  pfpFrame.addEventListener('click', () => photoInput.click());
  dropzone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') photoInput.click(); });

  // Drag & Drop Handlers
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  });

  // -------------------------------------------------------------------------
  // 6. Image Scale (Zoom) & Pan Position Controls
  // -------------------------------------------------------------------------
  function updateImageTransform() {
    const transformStr = `translate(${currentPosX}px, ${currentPosY}px) scale(${currentZoom})`;
    profilePhoto.style.transform = transformStr;
    pfpProfilePhoto.style.transform = transformStr;
  }

  zoomSlider.addEventListener('input', (e) => {
    currentZoom = parseFloat(e.target.value);
    updateImageTransform();
  });

  posXSlider.addEventListener('input', (e) => {
    currentPosX = parseInt(e.target.value, 10);
    updateImageTransform();
  });

  posYSlider.addEventListener('input', (e) => {
    currentPosY = parseInt(e.target.value, 10);
    updateImageTransform();
  });

  function resetImageTransform() {
    currentZoom = 1;
    currentPosX = 0;
    currentPosY = 0;
    zoomSlider.value = 1;
    posXSlider.value = 0;
    posYSlider.value = 0;
    updateImageTransform();
  }

  resetPhotoBtn.addEventListener('click', () => {
    resetImageTransform();
    showToast('Framing reset to center');
  });

  // -------------------------------------------------------------------------
  // 7. High-Resolution PNG Export (html2canvas)
  // -------------------------------------------------------------------------
  async function generateCanvasImage() {
    const targetElement = activeMode === 'idcard' ? idCard : pfpFrame;
    
    targetElement.classList.add('exporting');
    
    try {
      const canvas = await html2canvas(targetElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });
      targetElement.classList.remove('exporting');
      return canvas;
    } catch (err) {
      targetElement.classList.remove('exporting');
      throw err;
    }
  }

  async function downloadGraphic() {
    try {
      const activeBtn = downloadBtn;
      const originalHTML = activeBtn.innerHTML;
      activeBtn.innerHTML = `<i data-lucide="loader"></i> Exporting...`;
      if (window.lucide) lucide.createIcons();
      activeBtn.disabled = true;

      const canvas = await generateCanvasImage();
      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      
      const rawName = nameInput.value.trim() || 'builder';
      const nameSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const modeTag = activeMode === 'idcard' ? 'builder-pass' : 'pfp-frame';
      
      link.download = `hhgoa2026-${nameSlug}-${modeTag}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      activeBtn.innerHTML = originalHTML;
      activeBtn.disabled = false;
      if (window.lucide) lucide.createIcons();

      showToast('✓ Identity exported as PNG');
      return imageURI;
    } catch (err) {
      console.error('Download failed:', err);
      showToast('Failed to export PNG. Please try again.', 'error');
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = `<i data-lucide="download"></i> Download PNG`;
      if (window.lucide) lucide.createIcons();
      return null;
    }
  }

  exportBtn.addEventListener('click', downloadGraphic);
  downloadBtn.addEventListener('click', downloadGraphic);

  // -------------------------------------------------------------------------
  // 8. Share Flow to X (Twitter) with hashtag #FrameInGoa
  // -------------------------------------------------------------------------
  async function shareToX() {
    await downloadGraphic();

    const titleVal = titleInput.value.trim() || 'Goa Builder';
    const tweetCaption = `Hyped for Hacker House Goa 2026! 🚀\n\nJust generated my ${titleVal} identity pass for HH Goa Studio! See you in Goa! 🌴\n\n#FrameInGoa`;
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetCaption)}`;
    window.open(tweetUrl, '_blank', 'width=600,height=500');
  }

  shareXBtn.addEventListener('click', shareToX);
  shareXBtnTop.addEventListener('click', shareToX);
});
