<template lang="html">
  <div>
    <app-message v-for="email in emails" v-bind:email="email" v-bind:toggleStar="toggleStar" v-bind:selections="selections" key="">
    </app-message>
  </div>
</template>

<script>
import Message from './Message.vue'
export default {
  components: {
    'app-message': Message
  },
  props:[
    'emails',
    'toggleStar',
    'selections',
    'emailSelection'
  ]
}
</script>

<style lang="css">
</style>
