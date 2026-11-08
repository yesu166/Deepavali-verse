export type FestivalSound = 'rocket'|'burst'|'anar'|'chakri'|'phooljhadi'|'ladi'|'diya'|'lantern'|'catch'|'rangoli'|'ui'

class DeepavaliSoundEngine {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private effects: GainNode | null = null
  private ambience: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private enabled = false
  private masterLevel = 0.72
  private ambienceLevel = 0.2
  private ambientNodes: AudioNode[] = []
  private ambientTimer = 0
  private noteIndex = 0
  private readonly ragaNotes = [392, 440, 494, 587, 523, 440, 392, 330]

  private ensure() {
    if (this.context && this.master && this.effects && this.ambience) return
    const Ctx = window.AudioContext
    this.context = new Ctx()
    const ctx = this.context
    this.master = ctx.createGain()
    this.effects = ctx.createGain()
    this.ambience = ctx.createGain()
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -18
    compressor.knee.value = 18
    compressor.ratio.value = 3.5
    compressor.attack.value = .006
    compressor.release.value = .24
    this.master.gain.value = this.masterLevel
    this.effects.gain.value = 1
    this.ambience.gain.value = this.ambienceLevel
    this.effects.connect(this.master)
    this.ambience.connect(this.master)
    this.master.connect(compressor)
    compressor.connect(ctx.destination)
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      last = (last + .018 * (Math.random() * 2 - 1)) / 1.018
      data[i] = last * 3.2
    }
    this.noiseBuffer = buffer
  }

  async enable() {
    this.ensure()
    if (!this.context || !this.master) return
    this.enabled = true
    await this.context.resume()
    this.master.gain.setTargetAtTime(this.masterLevel, this.context.currentTime, .05)
    if (!this.ambientNodes.length) this.startAmbience()
    this.play('ui')
  }

  disable() {
    this.enabled = false
    if (this.context && this.master) this.master.gain.setTargetAtTime(0, this.context.currentTime, .045)
    this.stopAmbience()
  }

  toggle() {
    if (this.enabled) {
      this.disable()
      return false
    }
    void this.enable()
    return true
  }

  get isEnabled() { return this.enabled }
  get volume() { return this.masterLevel }
  get ambienceVolume() { return this.ambienceLevel }

  setVolume(value: number) {
    this.masterLevel = Math.max(0, Math.min(1, value))
    if (this.context && this.master && this.enabled) this.master.gain.setTargetAtTime(this.masterLevel, this.context.currentTime, .04)
  }

  setAmbienceVolume(value: number) {
    this.ambienceLevel = Math.max(0, Math.min(1, value))
    if (this.context && this.ambience) this.ambience.gain.setTargetAtTime(this.ambienceLevel, this.context.currentTime, .05)
  }

  private osc(freq: number, start: number, duration: number, peak: number, type: OscillatorType = 'sine', endFreq?: number, destination?: AudioNode) {
    const ctx = this.context!, oscillator = ctx.createOscillator(), gain = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(freq, start)
    if (endFreq) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), start + duration)
    gain.gain.setValueAtTime(.0001, start)
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, peak), start + Math.min(.018, duration * .18))
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(destination ?? this.effects!)
    oscillator.start(start)
    oscillator.stop(start + duration + .035)
    return { oscillator, gain }
  }

  private noise(start: number, duration: number, peak: number, filterType: BiquadFilterType, low: number, high?: number, destination?: AudioNode) {
    const ctx = this.context!, source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain()
    source.buffer = this.noiseBuffer
    filter.type = filterType
    filter.frequency.setValueAtTime(low, start)
    if (high) filter.frequency.exponentialRampToValueAtTime(Math.max(30, high), start + duration)
    filter.Q.value = filterType === 'bandpass' ? .65 : .4
    gain.gain.setValueAtTime(.0001, start)
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, peak), start + Math.min(.025, duration * .2))
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(destination ?? this.effects!)
    source.start(start)
    source.stop(start + duration + .04)
  }

  private tick(at: number, brightness = 1) {
    this.noise(at, .032, .035 * brightness, 'highpass', 2400 + Math.random() * 2600)
    this.osc(1800 + Math.random() * 1800, at, .045, .012 * brightness, 'sine', 700)
  }

  private bell(at: number, frequency = 880, volume = .055) {
    const ctx = this.context!
    const out = ctx.createGain()
    out.gain.value = 1
    out.connect(this.effects!)
    this.osc(frequency, at, 1.45, volume, 'sine', frequency * .992, out)
    this.osc(frequency * 2.01, at + .003, .92, volume * .34, 'sine', frequency * 2, out)
    this.osc(frequency * 3.92, at + .006, .62, volume * .13, 'sine', frequency * 3.9, out)
  }

  private startAmbience() {
    const ctx = this.context!, destination = this.ambience!
    const drone = [110, 164.81, 220]
    drone.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter()
      oscillator.type = index === 0 ? 'sine' : 'triangle'
      oscillator.frequency.value = frequency
      filter.type = 'lowpass'
      filter.frequency.value = index === 0 ? 260 : 520
      gain.gain.value = [.042, .013, .008][index]
      oscillator.connect(filter)
      filter.connect(gain)
      gain.connect(destination)
      oscillator.start()
      this.ambientNodes.push(oscillator, gain, filter)
    })
    this.noiseBuffer && (() => {
      const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain()
      source.buffer = this.noiseBuffer
      source.loop = true
      filter.type = 'lowpass'
      filter.frequency.value = 520
      gain.gain.value = .045
      source.connect(filter)
      filter.connect(gain)
      gain.connect(destination)
      source.start()
      this.ambientNodes.push(source, filter, gain)
    })()
    this.ambientTimer = window.setInterval(() => {
      if (!this.enabled || !this.context) return
      const note = this.ragaNotes[this.noteIndex++ % this.ragaNotes.length]
      const now = ctx.currentTime
      const voice = ctx.createOscillator(), envelope = ctx.createGain(), filter = ctx.createBiquadFilter()
      voice.type = 'sine'
      voice.frequency.value = note
      filter.type = 'lowpass'
      filter.frequency.value = 1700
      envelope.gain.setValueAtTime(.0001, now)
      envelope.gain.exponentialRampToValueAtTime(.018, now + .12)
      envelope.gain.exponentialRampToValueAtTime(.0001, now + 1.35)
      voice.connect(filter)
      filter.connect(envelope)
      envelope.connect(destination)
      voice.start(now)
      voice.stop(now + 1.4)
      this.ambientNodes.push(voice, filter, envelope)
      if (this.ambientNodes.length > 48) this.ambientNodes.splice(0, 12)
    }, 3700)
  }

  private stopAmbience() {
    window.clearInterval(this.ambientTimer)
    this.ambientTimer = 0
    this.ambientNodes.forEach(node => {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) node.stop()
        node.disconnect()
      } catch { /* node may already have ended */ }
    })
    this.ambientNodes = []
  }

  play(kind: FestivalSound) {
    if (!this.enabled || !this.context || this.context.state !== 'running') return
    const ctx = this.context
    const now = ctx.currentTime
    switch (kind) {
      case 'rocket':
        this.noise(now, .56, .13, 'bandpass', 650, 2300)
        this.osc(110, now, .62, .028, 'triangle', 460)
        this.osc(72, now + .18, .3, .012, 'sine', 145)
        break
      case 'burst':
        this.osc(82, now, .42, .21, 'sine', 36)
        this.noise(now, .16, .18, 'lowpass', 1600, 540)
        this.noise(now + .035, .58, .095, 'highpass', 1700)
        for (let i = 0; i < 24; i++) this.tick(now + .045 + Math.random() * .52, .75 + Math.random() * .55)
        break
      case 'anar':
        this.noise(now, 2.4, .11, 'highpass', 1500, 3700)
        this.noise(now + .04, 1.9, .045, 'bandpass', 3300, 2100)
        for (let i = 0; i < 38; i++) this.tick(now + .04 + i * .055 + Math.random() * .025, .55 + Math.random() * .65)
        this.osc(190, now, .34, .045, 'sawtooth', 310)
        break
      case 'chakri':
        this.noise(now, 1.35, .12, 'bandpass', 2100, 3900)
        this.osc(150, now, 1.15, .045, 'sawtooth', 520)
        this.osc(230, now, 1.05, .022, 'sine', 90)
        for (let i = 0; i < 22; i++) this.tick(now + i * .05, .45 + Math.random() * .55)
        break
      case 'phooljhadi':
        this.noise(now, 1.5, .09, 'highpass', 3100)
        this.osc(2400, now, .55, .009, 'sine', 1100)
        for (let i = 0; i < 34; i++) this.tick(now + Math.random() * 1.1, .5 + Math.random() * .8)
        break
      case 'ladi':
        for (let i = 0; i < 15; i++) {
          const at = now + i * (.075 + Math.random() * .025)
          this.noise(at, .075, .055 + Math.random() * .045, 'highpass', 900 + Math.random() * 900)
          this.osc(120 + Math.random() * 45, at, .11, .045, 'sine', 65)
        }
        break
      case 'diya':
        this.bell(now, 1046.5, .045)
        this.bell(now + .12, 1318.5, .026)
        break
      case 'lantern':
        this.noise(now, .8, .035, 'bandpass', 450, 1400)
        this.bell(now + .15, 783.99, .035)
        this.bell(now + .26, 1174.66, .018)
        break
      case 'catch':
        this.osc(659.25, now, .2, .05, 'sine', 659.25)
        this.osc(783.99, now + .07, .22, .04, 'sine', 783.99)
        break
      case 'rangoli':
        this.bell(now, 1567.98, .017)
        break
      case 'ui':
        this.noise(now, .022, .015, 'highpass', 1800)
        break
    }
  }
}

export const soundEngine = new DeepavaliSoundEngine()
