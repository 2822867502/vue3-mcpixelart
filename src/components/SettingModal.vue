<script setup>
import { useSettingStore } from '../store/setting'
const settingStore = useSettingStore()
</script>

<template>
<Teleport to="body">
  <div class="modal fade" id="settingModal" tabindex="-1" aria-labelledby="settingModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <nav>
          <div class="nav nav-tabs" role="tablist">
            <button class="nav-link active" id="nav-setting-direction" data-bs-toggle="tab" data-bs-target="#nav-setting-direction-panel" type="button" role="tab" aria-controls="nav-setting-direction-panel" aria-selected="true">方位</button>
            <button class="nav-link" id="nav-setting-block" data-bs-toggle="tab" data-bs-target="#nav-setting-block-panel" type="button" role="tab" aria-controls="nav-setting-block-panel" aria-selected="false">方块</button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-setting-direction-panel" role="tabpanel" aria-labelledby="nav-setting-direction" tabindex="0">
            <!-- 方位 -->
            <span>朝向</span>
            <select class="form-select" v-model="settingStore.Options.direction">
              <option value="z" selected>上->下</option>
              <option value="y">东->西</option>
              <option value="x">南->北</option>
              <option value="z-">下->上</option>
              <option value="y-">西->东</option>
              <option value="x-">北->南</option>
            </select>
            <span>旋转(顺时针)</span>
            <select class="form-select" v-model="settingStore.Options.rotate">
              <option value="0" selected>0°</option>
              <option value="90">90°</option>
              <option value="180">180°</option>
              <option value="270">270°</option>
            </select>
          </div>
          <div class="tab-pane fade" id="nav-setting-block-panel" role="tabpanel" aria-labelledby="nav-setting-block" tabindex="0">
            <!-- 方块 -->
            <div class="accordion" id="accordionBlocks">
            <!-- 同一类的方块 -->
              <div class="accordion-item" v-for="block in settingStore.blocksSetting" :key="block.bid">
                <h2 class="accordion-header">
                  <!-- 种类名 -->
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#'+block.bname_eng" aria-expanded="false" :aria-controls="block.bname_eng">
                    {{ block.bname }}
                  </button>
                </h2>
                <div :id="block.bname_eng" class="accordion-collapse collapse" data-bs-parent="#accordionBlocks">
                  <div class="accordion-body">
                    <!-- 全选和全不选 -->
                    <span class="btn btn-outline-success btn-sm" @click="settingStore.selectType(block.bname, true)">全选</span>
                    |
                    <span class="btn btn-outline-danger btn-sm" @click="settingStore.selectType(block.bname, false)">全不选</span>
                    <ul class="list-group">
                      <li class="list-group-item" v-for="c in block.bclass" :key="`${block.bname_eng}-${c.name_eng}`">
                        <input class="form-check-input me-1" type="checkbox" v-model="c.select" :id="`${block.bname_eng}-${c.name_eng}`">
                        <!-- 方块图标和名称 -->
                        <label class="form-check-label" :for="`${block.bname_eng}-${c.name_eng}`">
                          <div class="colorShow" :style="`background-position: ${c.offset};`"></div>
                          {{ c.name }}
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  </div>
</Teleport>
</template>

<style lang="less" scoped>
.colorShow {
  background-image: url('/src/assets/img/BlockCSS.png');
  width: 16px;
  height: 16px;
  display: inline-block;
}

.modal-content {
  padding: 10px;
}
</style>