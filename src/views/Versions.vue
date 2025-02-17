<script setup>
import versions from '@/assets/data/version.json'
</script>
<template>
  <main>
    <div class="version-item" v-for="item in versions" :key="`ver${item.version}`">
      <h2>v{{ item.version }}</h2>
      <ul>
        <li v-for="update in item.description" :key="update">
          {{ update }}
        </li>
      </ul>
      <div class="date">发布时间： {{ item.date }}</div>
    </div>
  </main>
</template>
<style scoped>
main {  
  font-family: Arial, sans-serif;  
  background-color: #00000087;  
  color: #252525;  
  padding: 20px;  
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  
}
.version-item {  
  background-color: #515151;  
  padding: 20px;  
  margin-bottom: 15px;  
  border-radius: 5px;  
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);  
}  
  
.version-item h2 {  
  margin: 0 0 10px;  
  font-size: 1.25em;  
  color: #6aea3b;  
}  
  
.version-item li {  
  margin: 5px 0;  
  font-size: 0.95em;  
  color: #d0d0d0;  
}  
  
.version-item .date {  
  font-size: 0.85em;  
  color: #3ea8b0;  
  margin-top: 5px;  
}
</style>