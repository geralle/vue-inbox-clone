<template lang="html">
  <div>
    <app-compose v-if="this.compose === true" v-bind:compose="compose" v-bind:postData="postData"></app-compose>
    <app-toolbar v-bind:emails="emails" v-bind:selections="selections" v-bind:unredMsg="unredMsg" v-bind:markUnread="markUnread" v-bind:markRead="markRead" v-bind:selectBox="selectBox" v-bind:selectAll="selectAll" v-bind:deleteEmail="deleteEmail" v-bind:findIndex="findIndex" v-bind:removeSelectAll="removeSelectAll" v-bind:applyLabels="applyLabels" v-bind:removeLabel="removeLabel" v-bind:toggleCompose="toggleCompose" v-bind:compose="compose"></app-toolbar>
    <app-messages v-bind:emails="emails" v-bind:toggleStar="toggleStar" ></app-messages>
  </div>
</template>

<script>
import Compose from './Compose.vue'
import Toolbar from './Toolbar.vue'
import Messages from './Messages.vue'
// import emailData from './seeds.js'
import axios from 'axios';

export default {
  components: {
    'app-toolbar': Toolbar,
    'app-messages': Messages,
    'app-compose': Compose
  },
  data() {
    return{
      emails: [],
      compose: false,
      show: true,
      change: false,
      // url: "http://localhost:8082/api/messages"
      url: "https://geralle-inbox.herokuapp.com/api/messages"
    }
  },
  watch:{
    change: function(){
      this.getEmails()
      this.change = false
    }
  },
  mounted(){
    this.getEmails()
  },
  methods:{
    getEmails: function(){
      axios.get(this.url)
      .then(response => {
        var emails = response.data._embedded.messages
        for(var i=0; i < emails.length; i++){
          emails[i]['selected'] = false
        }
        this.emails = response.data._embedded.messages
      })
    },
    toggleStar: function(email){
      let starLocation = email.id
      let starEmail = false
      if(email.starred === true){
        starEmail = false
      }else if(email.starred === false){
        starEmail = true
      }

      let payload = {
        "messageIds": [starLocation],
        "command": "star",
        "star": starEmail
      }

      axios.patch(this.url, payload)
      .then(response =>{
        this.change = true
      })
    },
    selections: function(data){
      var selected = []
      for(var i=0;i<data.length;i++){
        if(data[i].selected === true){
          selected.push(data[i])
        }
      }
      return selected
    },
    selectedPayload: function(data){
      var selectedArr = []
      for(var i=0;i < data.length; i++){
        selectedArr.push(data[i].id)
      }
      return selectedArr
    },
    deleteEmail: function(data){
      var selectedDataArr = this.selections(data)
      let selected = this.selectedPayload(selectedDataArr)
      let payload = {
        "messageIds": selected,
        "command": "delete"
      }

      axios.patch(this.url, payload)
      .then(response =>{
        this.change = true
      })
    },
    selectAll: function(){
      for(var i=0;i<this.emails.length;i++){
        var selectedEmail = this.emails[i].selected
        if(selectedEmail === false || selectedEmail === undefined){
          this.emails[i]["selected"] = true;
        }
      }
    },
    removeSelectAll: function(){
      for(var i=0;i<this.emails.length;i++){
        var selectedEmail = this.emails[i].selected
        if(selectedEmail === true || selectedEmail === undefined){
          this.emails[i]["selected"] = false;
        }
      }
    },
    markUnread: function(data){
      let selectedUnread = this.selections(data)
      let selected = this.selectedPayload(selectedUnread)
      let payload = {
        "messageIds": selected,
        "command": "read",
        "read": false
      }
      axios.patch(this.url, payload)
      .then(response =>{
        this.change = true
      })
    },
    markRead: function(data){
      let selectedRead = this.selections(data)
      let selected = this.selectedPayload(selectedDataArr)
      let payload = {
        "messageIds": selected,
        "command": "read",
        "read": true
      }
      axios.patch(this.url, payload)
      .then(response =>{
        this.change = true
      })
    },
    findIndex: function(data, position, selectedDataArr){
      var index = 0
      for(var i=0;i<data.length;i++){
        if(selectedDataArr[position].id === data[i].id){
          index = i
        }
      }
      return index
    },
    applyLabels: function(data){
      let selectedDataArr = this.selections(data)
      let selectedLabel = event.target.value
      let selected = this.selectedPayload(selectedDataArr)
      let payload = {
        "messageIds": selected,
        "command": "addLabel",
        "label": selectedLabel
      }
      if(selectedLabel != "Apply label"){
        axios.patch(this.url, payload)
        .then(response =>{
          this.change = true
        })
      }
    },
    removeLabel: function(data){
      let selectedDataArr = this.selections(data)
      let selectedLabel = event.target.value
      let selected = this.selectedPayload(selectedDataArr)
      let payload = {
        "messageIds": selected,
        "command": "removeLabel",
        "label": selectedLabel
      }
      if(selectedLabel != "Remove label"){
        axios.patch(this.url, payload)
        .then(response =>{
          this.change = true
        })
      }
    },
    toggleCompose: function(){
      let newCompose = this.compose
      if(newCompose == true){
        newCompose = false
      }else{
        newCompose = true
      }
      this.compose = newCompose
    },
    postData: function(event){
      event.preventDefault()
      let subject = event.path[3]["0"].value
      let body = event.path[3]["1"].value
      let payload = {
        "subject": subject,
        "body": body
      }
      axios.post(this.url, payload)
      .then(response =>{
        this.change = true
      })
    }
  },
  computed:{
    unredMsg: function(){
      var unread = 0
      for(var i=0;i<this.emails.length;i++){
        if(this.emails[i].read === false){
          unread++
        }
      }
      return unread
    },
    selectBox: function(){
      var someMsgs = 0
      var allMsgs = 0
      var verdict = ""
      for(var i=0;i<this.emails.length;i++){
        if(this.emails[i].selected == true){
          someMsgs++
          allMsgs++
        }
      }

      if(allMsgs === this.emails.length){
        verdict = "all"
      }else if (someMsgs > 0 && someMsgs < this.emails.length) {
        verdict = "some"
      }else{
        verdict = "none"
      }
      return verdict
    }
  }
}
</script>

<style lang="css">
</style>
