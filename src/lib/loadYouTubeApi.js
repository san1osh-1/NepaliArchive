// Loads the YouTube IFrame Player API exactly once, no matter how many
// components ask for it. Returns a promise that resolves with `window.YT`.

let youTubeApiPromise = null

export function loadYouTubeApi() {
  if (youTubeApiPromise) return youTubeApiPromise

  youTubeApiPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("YouTube API can only load in a browser."))
      return
    }

    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }

    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === "function") previousCallback()
      resolve(window.YT)
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    )
    if (!existingScript) {
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      script.async = true
      script.onerror = () => reject(new Error("Failed to load YouTube IFrame API."))
      document.head.appendChild(script)
    }
  })

  return youTubeApiPromise
}
