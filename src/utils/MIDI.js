/**128种标准midi乐器映射为mc中的16种乐器*/
const midi_mcMap = {
  "acoustic grand piano": "harp",
  "bright acoustic piano": "harp",
  "electric grand piano": "pling",
  "honky-tonk piano": "pling",
  "electric piano 1": "pling",
  "electric piano 2": "pling",
  "harpsichord": "harp",
  "clavi": "pling",
  "celesta": "bell",
  "glockenspiel": "bell",
  "music box": "bell",
  "vibraphone": "iron_xylophone",
  "marimba": "xylophone",
  "xylophone": "xylophone",
  "tubular bells": "chime",
  "dulcimer": "harp",
  "drawbar organ": "pling",
  "percussive organ": "pling",
  "rock organ": "pling",
  "church organ": "pling",
  "reed organ": "flute",
  "accordion": "flute",
  "harmonica": "flute",
  "tango accordion": "flute",
  "acoustic guitar (nylon)": "guitar",
  "acoustic guitar (steel)": "guitar",
  "electric guitar (jazz)": "guitar",
  "electric guitar (clean)": "guitar",
  "electric guitar (muted)": "guitar",
  "overdriven guitar": "guitar",
  "distortion guitar": "guitar",
  "guitar harmonics": "guitar",
  "acoustic bass": "bass",
  "electric bass (finger)": "bass",
  "electric bass (pick)": "bass",
  "fretless bass": "bass",
  "slap bass 1": "bass",
  "slap bass 2": "bass",
  "synth bass 1": "didgeridoo",
  "synth bass 2": "didgeridoo",
  "violin": "harp",
  "viola": "harp",
  "cello": "harp",
  "contrabass": "bass",
  "tremolo strings": "harp",
  "pizzicato strings": "harp",
  "orchestral harp": "harp",
  "timpani": "basedrum",
  "string ensemble 1": "harp",
  "string ensemble 2": "harp",
  "synthstrings 1": "harp",
  "synthstrings 2": "harp",
  "choir aahs": "flute",
  "voice oohs": "flute",
  "synth voice": "bit",
  "orchestra hit": "bit",
  "trumpet": "flute",
  "trombone": "flute",
  "tuba": "didgeridoo",
  "muted trumpet": "flute",
  "french horn": "didgeridoo",
  "brass section": "flute",
  "synthbrass 1": "bit",
  "synthbrass 2": "bit",
  "soprano sax": "flute",
  "alto sax": "flute",
  "tenor sax": "flute",
  "baritone sax": "flute",
  "oboe": "flute",
  "english horn": "flute",
  "bassoon": "flute",
  "clarinet": "flute",
  "piccolo": "flute",
  "flute": "flute",
  "recorder": "flute",
  "pan flute": "flute",
  "blown bottle": "flute",
  "shakuhachi": "flute",
  "whistle": "flute",
  "ocarina": "flute",
  "lead 1 (square)": "bit",
  "lead 2 (sawtooth)": "bit",
  "lead 3 (calliope)": "bit",
  "lead 4 (chiff)": "bit",
  "lead 5 (charang)": "bit",
  "lead 6 (voice)": "bit",
  "lead 7 (fifths)": "bit",
  "lead 8 (bass + lead)": "bit",
  "pad 1 (new age)": "bit",
  "pad 2 (warm)": "bit",
  "pad 3 (polysynth)": "bit",
  "pad 4 (choir)": "flute",
  "pad 5 (bowed)": "harp",
  "pad 6 (metallic)": "cow_bell",
  "pad 7 (halo)": "bit",
  "pad 8 (sweep)": "bit",
  "fx 1 (rain)": "bell",
  "fx 2 (soundtrack)": "bit",
  "fx 3 (crystal)": "bell",
  "fx 4 (atmosphere)": "bit",
  "fx 5 (brightness)": "bell",
  "fx 6 (goblins)": "bit",
  "fx 7 (echoes)": "bit",
  "fx 8 (sci-fi)": "bit",
  "sitar": "guitar",
  "banjo": "banjo",
  "shamisen": "guitar",
  "koto": "harp",
  "kalimba": "xylophone",
  "bag pipe": "flute",
  "fiddle": "harp",
  "shanai": "flute",
  "tinkle bell": "bell",
  "agogo": "cow_bell",
  "steel drums": "cow_bell",
  "woodblock": "snare",
  "taiko drum": "basedrum",
  "melodic tom": "basedrum",
  "synth drum": "snare",
  "reverse cymbal": "hat",
  "guitar fret noise": "guitar",
  "breath noise": "flute",
  "seashore": "bell",
  "bird tweet": "flute",
  "telephone ring": "bell",
  "helicopter": "bit",
  "applause": "bell",
  "gunshot": "snare"
}
/**MC中乐器的音域 */
const mcInstrumentMap = {
  "bass": [54 - 24, 78 - 24],  // F#1 - F#3
  "bell": [54 + 24, 78 + 24],  // F#5 - F#7
  "flute": [54 + 12, 78 + 12], // F#4 - F#6
  "chime": [54 + 24, 78 + 24], // F#5 - F#7
  "guitar": [54 - 12, 78 - 12],// F#2 - F#4
  "xylophone": [54 + 24, 78 + 24], // F#5 - F#7
  "iron_xylophone": [54, 78],  // F#3 - F#5
  "cow_bell": [54 + 12, 78 + 12], // F#4 - F#6
  "didgeridoo": [54 - 24, 78 - 24], // F#1 - F#3
  "bit": [54, 78],  // F#3 - F#5
  "banjo": [54, 78],  // F#3 - F#5
  "pling": [54, 78],  // F#3 - F#5
  "harp": [54, 78],  // F#3 - F#5
  "snare": [54, 78],  // F#3 - F#5
  "hat": [54 + 24, 78 + 24],  // F#5 - F#7
  "basedrum": [54 - 24, 78 - 24]  // F#1 - F#3
}
/**MC中乐器的音域 */
export const instrumentNameMap = {
  "bass": '贝斯',
  "bell": '钟琴',
  "flute": '长笛',
  "chime": '管钟',
  "guitar": '吉他',
  "xylophone": '木琴',
  "iron_xylophone": '颤音琴',
  "cow_bell": '牛铃',
  "didgeridoo": '迪吉里杜管',
  "bit": '方波',
  "banjo": '班卓琴',
  "pling": '电钢琴',
  "harp": '钢琴',
  "snare": '小军鼓',
  "hat": '踩镲',
  "basedrum": '底鼓',
}
/**MC中乐器的方块 */
export const instrumentBlockMap = {
  "bass": '木头',
  "bell": '金块',
  "flute": '黏土',
  "chime": '浮冰',
  "guitar": '羊毛',
  "xylophone": '骨块',
  "iron_xylophone": '铁块',
  "cow_bell": '灵魂沙',
  "didgeridoo": '南瓜',
  "bit": '绿宝石块',
  "banjo": '干草捆',
  "pling": '萤石',
  "harp": '空气',
  "snare": '沙子',
  "hat": '玻璃',
  "basedrum": '石头',
}
// 音符到音色的映射
export function mapInstrumentToBlock(instrument) {
  return midi_mcMap[instrument] || 'harp'
}
/**一条音轨的音高调整 
 * @param {Note[]} notes 音轨
 * @param {string} method 方法
*/
export function mapNoteToRange(notes, method) {
  const calcMinMax = function (notes) {
    let minPitch = 0
    let maxPitch = 127
    for (const {pitch} of notes) {
      minPitch = Math.min(minPitch, pitch)
      maxPitch = Math.max(maxPitch, pitch)
    }
    return [minPitch, maxPitch]
  }
  // const MIN_NOTE = 43
  // const MAX_NOTE = 67
  const MIN_NOTE = 54
  const MAX_NOTE = 78
  switch (method) {
    case 'cut':
      return notes.map(note => {
        const note_ = structuredClone(note)
        while (note_.pitch < MIN_NOTE) note_.pitch += 12
        while (note_.pitch > MAX_NOTE) note_.pitch -= 12
        note_.pitch -= MIN_NOTE
        return note_
      })
    case 'linear':
      const [minPitch, maxPitch] = calcMinMax(notes)
      return notes.map(note => {
        const note_ = structuredClone(note)
        note_.pitch = Math.round((note_.pitch - minPitch) * (MAX_NOTE - MIN_NOTE) / (maxPitch - minPitch))
        if (note_.pitch < 0) note_.pitch = 0
        if (note_.pitch > MAX_NOTE - MIN_NOTE) note_.pitch = MAX_NOTE - MIN_NOTE
        return note_
      })
    case 'linearPlus':
      // 调整超出范围的音调刚好在范围外的第一个八度内
      const notes_ = notes.map(note => {
        const note_ = structuredClone(note)
        while (note_.pitch < MIN_NOTE - 12) note_.pitch += 12
        while (note_.pitch > MAX_NOTE + 12) note_.pitch -= 12
        return note_
      })
      return mapNoteToRange(notes_, 'linear')
  }
}
/**制作单条音轨 */
export function makeTrack(track) {
  const times = track.notes.map(note => note.time)
  // 获取最大时间
  const maxTime = Math.max(...times)

  // 生成步长为0.1秒的新时间数组
  const newTimeArray = []
  for (let t = 0; t <= maxTime; t = parseFloat((t + 0.1).toFixed(1))) {
    newTimeArray.push(t)
  }

  // 根据新时间数组生成目标数组
  const result = newTimeArray.map((t) => {
    // 检查 times 是否有接近 t 的时间点
    const index = times.findIndex(origTime => Math.abs(origTime - t) < 0.1)

    if (index !== -1) {
      return {
        play: true,
        pitch: track.notes[index].pitch // 如果有多个重复 pitch，任意取一个
      }
    } else {
      return {
        play: false
      }
    }
  })

  return {
    name: track.name,
    arr: result
  }
}
/**调整时间细粒度为一红石刻=0.1s */
export function make(tracks) {
  return tracks.map(track => makeTrack(track))
}
/**整体调整音轨 */
export function adjustTracks(tracks, method) {
  switch (method) {
    case 'pitch':
      return pitchFirst(tracks)
    case 'instrument':
      return instrumentFirst(tracks)
    case 'cut':
      return tracks.map(track => ({ name: mapInstrumentToBlock(track.name), notes: mapNoteToRange(track.notes, 'cut') }))
  }
}
/**上下移动八度直至落入范围 */
function adjustPitchRange(pitch, min, max) {
  while (pitch < min) pitch += 12
  while (pitch > max) pitch -= 12
  return pitch
}
/**根据音高查找合适的乐器 */
function findInstruments(pitch) {
  const instruments = []
  for (const [ins, [rangeL, rangeR]] of Object.entries(mcInstrumentMap)) {
    // 音高落在范围内则添加乐器
    if (pitch <= rangeR && pitch >= rangeL) {
      instruments.push(ins)
    }
  }
  return instruments
}
/**音高优先 */
function pitchFirst(tracks) {
  // 音符盒覆盖F#1-F#7的音域
  const MIN = 30
  const MAX = 102
  // 重构整个音乐
  const music = {}
  tracks.forEach(track => {
    track.notes.forEach(note => {
      const pitch = adjustPitchRange(note.pitch, MIN, MAX)
      const instruments = findInstruments(pitch)
      // midi乐器直接映射到的mc乐器名
      const directMappedName = mapInstrumentToBlock(track.name)
      // 最终采用的mc乐器名
      let instrument
      if (instruments.includes(directMappedName)) {
        // 该mc乐器本来就覆盖这个音高 直接采用
        instrument = directMappedName
      } else {
        // 该mc乐器本来不覆盖这个音高 采用其他的乐器
        instrument = instruments[0]
      }
      
      const note_ = structuredClone(note)
      // 变换到0~24
      note_.pitch = pitch - mcInstrumentMap[instrument][0]
      if (music[instrument]) {
        music[instrument].push(note_)
      } else {
        music[instrument] = [note_]
      }
    })
  })
  // 将music对象还原成本来的tracks数组格式
  const res = []
  for (const [instrument, notes] of Object.entries(music)) {
    res.push({
      name: instrument,
      notes,
    })
  }
  return res
}
/**乐器优先 */
function instrumentFirst(tracks) {
  const tracks_ = structuredClone(tracks)
  tracks_.forEach(track => {
    // 先将乐器定下来
    track.name = mapInstrumentToBlock(track.name)
    // 该乐器的音域
    const [min, max] = mcInstrumentMap[track.name]
    // 调整该音轨的音和该乐器匹配
    track.notes.forEach(note => {
      note.pitch = adjustPitchRange(note.pitch, min, max) - min
    })
  })
  return tracks_
}