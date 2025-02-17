<script setup>
import { ref, inject, computed, shallowRef, watch } from 'vue'
import { Midi } from '@tonejs/midi'
import { make, adjustTracks } from '../utils/MIDI'
import MIDITrack from '../components/MIDITrack.vue'
import { apiMusic } from '../api/mcMusic'
import { downloadFile } from '../utils/autoDownload'

import constant from '../assets/data/constant.json'
import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()

const shareModal = inject('shareModal')
const globalModal = inject('globalModal')
const waitTask = inject('waitTask')
// 音高调整方案
const method = ref('cut')
// 原始音轨信息
const midiTracksOri = shallowRef([])
// 加工后的音轨信息
const midiTracksRes = computed(() => {
  let res = []
  midiTracksOri.value.forEach(track => {
    const notes = track.notes.map(note => {
      return {
        pitch: note.midi,
        name: note.name,
        time: note.time,
        duration: note.duration,
      }
    })

    res.push({
      notes: notes,
      name: track.instrument.name,
    })
  })
  res = adjustTracks(res, method.value)
  return res
})
// 裂轨处理后最终的音轨
const midiTracksFinal = ref([])
watch(midiTracksRes, () => {
  midiTracksFinal.value = structuredClone(midiTracksRes.value)
})

const handlerDivide = (track) => {
  const idx = midiTracksFinal.value.findIndex(v => v == track)
  if (idx > -1) {
    let n = prompt('输入拆分后的音轨数') || ''
    if (n.trim() === '') return
    if (/^\d+$/.test(n)) {
      n = parseInt(n)
      let newTracks = []
      for(let i = 0;i < n;i++) {
        newTracks.push({
          name: track.name,
          notes: [],
        })
      }

      let i = 0
      // 轮流平均分配
      track.notes.forEach(note => {
        newTracks[i].notes.push(note)
        i = (i + 1) % n
      })

      midiTracksFinal.value.splice(idx, 1, ...newTracks)
      globalModal('成功', '音轨已拆分')
    } else {
      globalModal('提示', '需输入正整数')
    }
  } else {
    globalModal('失败', '拆分失败 找不到对应音轨')
  }
}

const postMusic = () => {
  if (midiTracksFinal.value.length === 0) {
    globalModal('提示', '请先选择有效的midi音乐')
    return
  }
  if (midiTracksFinal.value.length > constant.midi.max_track) {
    globalModal('提示', `最多只能制作${constant.midi.max_track}条音轨`)
    return
  }
  const data = make(midiTracksFinal.value)
  waitTask(apiMusic(data))
  .then(({url}) => {
    shareModal('music', url)
  })
  .catch(error => {
    globalModal('失败', error)
  })
}

/**打开并读取midi文件 */
async function readFile(file) {
  const arrayBuffer = await file.arrayBuffer()
  const midi = new Midi(arrayBuffer)
  midiTracksOri.value = midi.tracks.filter(track => track.notes.length > 0)
}

function handlerOpenMidiFile(event) {
  const file = event.target.files[0]
  if (!file) return
  waitTask(readFile(file))
  .then(() => {
    globalModal('成功', '读取文件成功')
  })
  .catch(error => {
    globalModal('失败', error)
  })
}

const tracksInfo = computed(() => {
  let str = ''
  str += `共${midiTracksFinal.value ? midiTracksFinal.value.length : 0}条音轨`
  return str
})

function showMethodHelp() {
  const str = 
  `MIDI标准规定了128种乐器和128个音高,MC中只有16种乐器,每个乐器都只能演奏25个 半音 <br> 
  组合不同乐器最多获得F#1~F#7(72个半音)的音域,因此<span class="text-bg-danger rounded-1">红石音乐失真是不可避免的</span> <br> 
  以下是本站提供的三种折中方案:
  <hr>
  <span class="badge text-bg-primary">八度折叠</span>将音高移动若干个八度到F#3~F#5内,音域窄,容易发生失真 <br>
  <span class="badge text-bg-primary">音高优先</span>优先将音高落入F#1~F#7的音域,<span class="text-bg-success rounded-1">乐曲音高连贯性好</span>,但可能会改变乐器(音色) <br>
  <span class="badge text-bg-primary">乐器优先</span><span class="text-bg-success rounded-1">不改变乐器(音色)</span>,音高去匹配乐器的音域,高音和低音会损失`
  globalModal('帮助' , str)
}
</script>

<template>
  
  <div class="outer">
    <div class="alert alert-info" role="alert">
      请选择.mid音乐文件,可从 <a href="https://midishow.com" target="_blank" rel="noopener noreferrer">MidiShow</a> 等网站下载
    </div>
    <div class="mb-3">
      <input class="form-control bg-dark text-light" type="file" accept=".mid" @change="handlerOpenMidiFile">
    </div>
    <div class="input-group input-group-sm mb-3" >
      <label class="input-group-text bg-dark text-light" for="methodSelect">音高调整方案</label>
      <span class="input-group-text bg-dark text-light" @click="showMethodHelp">?</span>
      <select class="form-select bg-dark text-light" id="methodSelect" v-model="method">
        <option value = "cut" selected>八度折叠</option>
        <option value = "pitch">音高优先</option>
        <option value = "instrument">乐器优先</option>
      </select>
      <a class="btn btn-dark" href="https://mcpixelart.com/music/track20.litematic" style="border: 1px solid white;">点此下载布线</a>
    </div>
    <div class="flex frow" style="justify-content: right;gap: 16px;">
      <button class="btn btn-danger" @click="midiTracksOri = []">清除当前文件</button>
      <button class="btn btn-success" @click="postMusic">下载投影</button>
    </div>
    <div class="tracks flex fcol">
      <div class="info flex frow">
        <span style="color: bisque;">{{ tracksInfo }}</span>
        <span style="color: red;"><b>最多只能处理 {{ constant.midi.max_track }} 条音轨</b></span>
      </div>
      <MIDITrack 
        v-for="(track, trackIndex) in midiTracksFinal" 
        :key="`track-${track.name}-${trackIndex}-${track.notes.length}`" 
        :track="track"
        @divide="handlerDivide(track)"
      >
      </MIDITrack>
    </div>
  </div>
  
</template>

<style lang="less" scoped>
.outer {
  padding: 5px;
  background-color: #00000096;
  user-select: none;
}
.tracks {
  overflow: auto;
  gap: 10px;
  margin: 10px 0;
}
.info {
  padding: 4px 10px;
  border-radius: 10px;
  background-color: #2bab8fb5;
  gap: 10px;
  align-items: center;
}
</style>