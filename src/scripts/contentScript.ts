import { getPrediction, isRelatedToTvShow } from "../services/aiService";

const style = document.createElement("style");
style.innerHTML = "img { filter: blur(10px); }";
document.head.appendChild(style);

function debounce(func: Function, wait: number, immediate = false) {
  let timeout: unknown;
  return function (this: any) {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout as number);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Cambiar imágenes a gatitos con debounce

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // Verificar si alguno de los nodos añadidos es una imagen
      mutation.addedNodes.forEach(async (node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).tagName === "YTD-RICH-ITEM-RENDERER"
        ) {
          const title = (node as HTMLElement).querySelector("#video-title");
          if (title) {
            const isRelatedSerie = await isRelatedToTvShow(title.textContent!);
            if (isRelatedSerie.probability > 0.5) {
              getPrediction(title.textContent!).then((result) => {
                if (result.probability > 0.5) {
                  console.log(
                    "Potential spoiler detected: " +
                      title.textContent +
                      " - " +
                      result.probability
                  );
                } else {
                  displayVideo(node as HTMLElement);
                }
              });
            } else {
              displayVideo(node as HTMLElement);
            }
          }
        }
      });
    }
  });
});

const displayVideo = async (node: HTMLElement) => {
  const images = node.getElementsByTagName("img");
  for (let i = 0; i < images.length; i++) {
    images[i].style.filter = "none";
  }
};

// Configurar el observador para monitorear la adición de nuevos nodos
const config = { childList: true, subtree: true };

// Iniciar la observación en un contenedor específico si es posible, en lugar de todo el body
let targetNode: HTMLElement;
if (document.URL.includes("/watch") || document.URL.includes("/watch?")) {
  targetNode = document.getElementById(".related") || document.body;
} else {
  targetNode = document.getElementById("contents") || document.body;
}
observer.observe(targetNode, config);
