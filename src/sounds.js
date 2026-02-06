// Archival sound effects using Web Audio API
// Subtle, tactile sounds that feel like old machinery and paper

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

// Soft typewriter click - for list item hovers
export function playHoverSound() {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.03)
  
  gainNode.gain.setValueAtTime(0.03, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.05)
}

// Mechanical click - for button/item clicks
export function playClickSound() {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.08)
  
  gainNode.gain.setValueAtTime(0.06, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.1)
}

// Paper/fabric rustle - for input focus
export function playFocusSound() {
  const bufferSize = audioContext.sampleRate * 0.08
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
  const output = buffer.getChannelData(0)
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
  }
  
  const whiteNoise = audioContext.createBufferSource()
  const gainNode = audioContext.createGain()
  const filter = audioContext.createBiquadFilter()
  
  whiteNoise.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = 1000
  filter.Q.value = 0.5
  
  whiteNoise.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  gainNode.gain.setValueAtTime(0.04, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08)
  
  whiteNoise.start(audioContext.currentTime)
}

// Soft confirmation tone - for form submit
export function playSubmitSound() {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
  oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1)
  
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.2)
}

// Resume audio context on first interaction (browser requirement)
export function initAudio() {
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
}
