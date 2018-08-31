<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
html,
body,
ul,
h4 {
  margin: 0;
  padding: 0;
}

html,
body {
  position: relative;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  min-width: 1024px;
  min-height: 600px;
  font-size: 14px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  user-select: none;
}
</style>
