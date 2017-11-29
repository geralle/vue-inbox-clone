<template lang="html">
  <div>
    <app-compose v-if="this.compose === true" v-bind:compose="compose" v-bind:postData="postData"></app-compose>
    <app-toolbar v-bind:emails="emails" v-bind:selections="selections" v-bind:unredMsg="unredMsg" v-bind:markUnread="markUnread" v-bind:markRead="markRead" v-bind:selectBox="selectBox" v-bind:selectAll="selectAll" v-bind:deleteEmail="deleteEmail" v-bind:findIndex="findIndex" v-bind:removeSelectAll="removeSelectAll" v-bind:applyLabels="applyLabels" v-bind:removeLabel="removeLabel" v-bind:toggleCompose="toggleCompose" v-bind:compose="compose" ></app-toolbar>
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
      // url: "http://localhost:8082/api/messages"
      url: "https://geralle-inbox.herokuapp.com/api/messages"
    }
  },
  mounted(){
    axios.get(this.url)
    .then(response => {
      var emails = response.data._embedded.messages
      for(var i=0; i < emails.length; i++){
        emails[i]['selected'] = false
      }
      this.emails = response.data._embedded.messages
    })
  },
  methods:{
    toggleStar: function(email){
      if(email.starred === true){
        email.starred = false
      }else if(email.starred === false){
        email.starred = true
      }
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
    deleteEmail: function(data){
      var selectedDataArr = this.selections(data)
      var selectedIndex = 0
      for(var i=0; i<selectedDataArr.length; i++){
        selectedIndex = this.findIndex(data, i, selectedDataArr)
        data.splice(selectedIndex, 1)
      }
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
      var selectedUnread = this.selections(data)
      for(var i=0;i<selectedUnread.length;i++){
        if(selectedUnread[i].read === true){
          selectedUnread[i].read = false
        }
      }
    },
    markRead: function(data){
      var selectedRead = this.selections(data)
      for(var i=0;i<selectedRead.length;i++){
        if(selectedRead[i].read === false){
          selectedRead[i].read = true
        }
      }
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
      var selectedDataArr = this.selections(data)
      var selectedLabel = event.target.value
      var selectedIndex = 0
      for(var i=0; i<selectedDataArr.length; i++){
        selectedIndex = this.findIndex(data, i, selectedDataArr)
        var labelArr = data[selectedIndex].labels
        if(labelArr.length === 0){
          labelArr.push(selectedLabel)
        }else if(labelArr.length > 0){
          if(!labelArr.includes(selectedLabel)){
            labelArr.push(selectedLabel)
          }
        }
      }
    },
    removeLabel: function(data){
      var selectedDataArr = this.selections(data)
      var selectedLabel = event.target.value
      var selectedIndex = 0
      for(var i=0; i<selectedDataArr.length; i++){
        selectedIndex = this.findIndex(data, i, selectedDataArr)
        var labelArr = selectedDataArr[i].labels
        var selectedLabelIndex = labelArr.indexOf(selectedLabel)
        for(var x=0; x<labelArr.length; x++){
          if(selectedLabel === labelArr[x]){
            labelArr.splice(selectedLabelIndex, 1)
          }
        }
      }
    },
    toggleCompose: function(){
      var newCompose = this.compose
      if(newCompose == true){
        newCompose = false
      }else{
        newCompose = true
      }
      this.compose = newCompose
    },
    postData: function(event){
      event.preventDefault()
      var subject = event.path[3]["0"].value
      var body = event.path[3]["1"].value
      console.log(subject)
      console.log(body)
      console.log(event)
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
