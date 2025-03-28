(function() {
  // Fonction pour redimensionner l'iframe
  function resizeIframe() {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    // Obtenir la hauteur du contenu
    const height = iframe.contentWindow.document.documentElement.scrollHeight;
    
    // Appliquer la hauteur avec une marge de sécurité
    iframe.style.height = (height + 20) + 'px';
  }

  // Redimensionner au chargement
  window.addEventListener('load', resizeIframe);

  // Redimensionner quand la fenêtre change de taille
  window.addEventListener('resize', resizeIframe);

  // Redimensionner quand le contenu change
  const observer = new MutationObserver(resizeIframe);
  const iframe = document.querySelector('iframe');
  if (iframe) {
    observer.observe(iframe.contentWindow.document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
})(); 