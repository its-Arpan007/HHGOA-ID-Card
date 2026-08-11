/**
 * HH GOA 2026 - BUILDER ID & PFP FRAME GENERATOR
 * Handles HEIC conversions, dual graphic format switching, title generator, framing, and X share flow.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Form Inputs
  const nameInput = document.getElementById('nameInput');
  const roleInput = document.getElementById('roleInput');
  const titleInput = document.getElementById('titleInput');
  const photoInput = document.getElementById('photoInput');
  const dropzone = document.getElementById('dropzone');
  const randomTitleBtn = document.getElementById('randomTitleBtn');

  // Format Switching Buttons
  const modeIdCardBtn = document.getElementById('modeIdCard');
  const modePfpBtn = document.getElementById('modePfp');

  // Image Framing Controls
  const imageControls = document.getElementById('imageControls');
  const zoomSlider = document.getElementById('zoomSlider');
  const posXSlider = document.getElementById('posXSlider');
  const posYSlider = document.getElementById('posYSlider');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');

  // Display Elements - ID Card (Format B)
  const idCard = document.getElementById('idCard');
  const cardName = document.getElementById('cardName');
  const cardRole = document.getElementById('cardRole');
  const cardTitleBadge = document.getElementById('cardTitleBadge');
  const profilePhoto = document.getElementById('profilePhoto');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const photoFrame = document.getElementById('photoFrame');

  // Display Elements - PFP Frame (Format A)
  const pfpFrame = document.getElementById('pfpFrame');
  const pfpProfilePhoto = document.getElementById('pfpProfilePhoto');
  const pfpPlaceholder = document.getElementById('pfpPlaceholder');

  // Action Buttons
  const exportBtn = document.getElementById('exportBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareXBtn = document.getElementById('shareXBtn');
  const shareXBtnTop = document.getElementById('shareXBtnTop');

  // Application State
  let activeMode = 'idcard'; // 'idcard' or 'pfp'
  let currentZoom = 1;
  let currentPosX = 0;
  let currentPosY = 0;
  let rawImageDataURL = '';

  // Fun Titles List
  const funTitles = [
    '🌴 GOA CODE CHAD',
    '⚡ SOLANA WIZARD',
    '🧠 AI ALCHEMIST',
    '🌊 WEB3 SURFER',
    '🚀 DEFI ARCHITECT',
    '🔥 RUST WRANGLER',
    '🏖️ BEACH BUILDER',
    '💎 CYBERPUNK HACKER',
    '👑 FULLSTACK CHIEFTAIN',
    '🛠️ BUIDL LEGEND',
    '💻 PROMPT MAGCIAN',
    '🔮 PROTOCOL SURF'
  ];

  // 1. Text Field Real-Time Binding
  nameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardName.textContent = val !== '' ? val.toUpperCase() : 'YOUR NAME';
  });

  roleInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardRole.textContent = val !== '' ? val.toUpperCase() : 'YOUR ROLE';
  });

  titleInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardTitleBadge.textContent = val !== '' ? val.toUpperCase() : 'BUILDER TITLE';
  });

  randomTitleBtn.addEventListener('click', () => {
    const randomTitle = funTitles[Math.floor(Math.random() * funTitles.length)];
    titleInput.value = randomTitle;
    cardTitleBadge.textContent = randomTitle;
  });

  // 2. Format Switcher (Format B: ID Card vs Format A: PFP)
  function switchMode(mode) {
    activeMode = mode;
    if (mode === 'idcard') {
      modeIdCardBtn.classList.add('active');
      modePfpBtn.classList.remove('active');
      idCard.classList.remove('hidden');
      pfpFrame.classList.add('hidden');
    } else {
      modePfpBtn.classList.add('active');
      modeIdCardBtn.classList.remove('active');
      pfpFrame.classList.remove('hidden');
      idCard.classList.add('hidden');
    }
  }

  modeIdCardBtn.addEventListener('click', () => switchMode('idcard'));
  modePfpBtn.addEventListener('click', () => switchMode('pfp'));

  // 3. Photo Upload Handler (supports JPG, PNG, WEBP, and iPhone HEIC)
  async function handleImageUpload(file) {
    if (!file) return;

    let processFile = file;

    // HEIC / HEIF Conversion for iPhone photos
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif') {
      try {
        const dropzoneText = dropzone.querySelector('.primary-text');
        if (dropzoneText) dropzoneText.textContent = 'Converting iPhone HEIC photo...';
        
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
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      rawImageDataURL = e.target.result;
      
      // Update ID Card Profile Photo
      profilePhoto.src = rawImageDataURL;
      profilePhoto.classList.remove('hidden');
      photoPlaceholder.classList.add('hidden');

      // Update PFP Profile Photo
      pfpProfilePhoto.src = rawImageDataURL;
      pfpProfilePhoto.classList.remove('hidden');
      pfpPlaceholder.classList.add('hidden');

      // Reveal Framing Controls
      imageControls.classList.remove('hidden');
      
      // Reset position/zoom
      resetImageTransform();

      // Reset dropzone label
      const dropzoneText = dropzone.querySelector('.primary-text');
      if (dropzoneText) dropzoneText.textContent = 'Click or drag & drop photo';
    };

    reader.readAsDataURL(processFile);
  }

  // Input change event
  photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  });

  // Click on placeholders directly to trigger file picker
  photoFrame.addEventListener('click', () => photoInput.click());
  pfpFrame.addEventListener('click', () => photoInput.click());

  // 4. Drag & Drop Support
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

  // 5. Image Scale (Zoom) & Pan Position Controls
  function updateImageTransform() {
    const transformStr = `scale(${currentZoom}) translate(${currentPosX}px, ${currentPosY}px)`;
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

  resetPhotoBtn.addEventListener('click', resetImageTransform);

  // 6. High-Resolution Image Export (PNG)
  async function generateCanvasImage() {
    const targetElement = activeMode === 'idcard' ? idCard : pfpFrame;
    return await html2canvas(targetElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });
  }

  async function downloadGraphic() {
    try {
      const activeBtn = downloadBtn;
      const originalText = activeBtn.innerHTML;
      activeBtn.innerHTML = `<i data-lucide="loader"></i> Generating PNG...`;
      if (window.lucide) lucide.createIcons();
      activeBtn.disabled = true;

      const canvas = await generateCanvasImage();
      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const nameSlug = (nameInput.value || 'builder').toLowerCase().replace(/\s+/g, '-');
      const modeTag = activeMode === 'idcard' ? 'id-card' : 'pfp-frame';
      
      link.download = `${nameSlug}-hhgoa2026-${modeTag}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      activeBtn.innerHTML = originalText;
      activeBtn.disabled = false;
      if (window.lucide) lucide.createIcons();
      return imageURI;
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate PNG image. Please try again.');
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = `<i data-lucide="download"></i> Download Graphic (PNG)`;
      if (window.lucide) lucide.createIcons();
      return null;
    }
  }

  exportBtn.addEventListener('click', downloadGraphic);
  downloadBtn.addEventListener('click', downloadGraphic);

  // 7. Share Flow to X (Twitter) with hashtag #FrameInGoa
  async function shareToX() {
    // Automatically trigger download so user has the graphic file ready to attach to tweet
    await downloadGraphic();

    // Prepare Tweet pre-filled caption with #FrameInGoa
    const titleVal = titleInput.value.trim() || 'Goa Builder';
    const tweetCaption = `Hyped for Hacker House Goa 2026! 🚀\n\nJust created my ${titleVal} badge using the HH Goa ID Studio! See you in Goa! 🌴\n\n#FrameInGoa`;
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetCaption)}`;
    
    // Open Twitter intent popup
    window.open(tweetUrl, '_blank', 'width=600,height=500');
  }

  shareXBtn.addEventListener('click', shareToX);
  shareXBtnTop.addEventListener('click', shareToX);
});
