(function() {
  const youtube = document.querySelectorAll(".youtube");
  
  for (let i = 0; i < youtube.length; i++) {
    youtube[i].addEventListener("click", function() {
      const embed = this.dataset.embed;
      const iframe = document.createElement('iframe');
      
      iframe.src = `https://www.youtube.com/embed/${embed}`;
      iframe.title = "Timeline video";
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      
      this.innerHTML = "";
      this.appendChild(iframe);
    });
  }
})(); 