<template lang="html">
  <div class="row toolbar">
  <div class="col-md-12">
    <p class="pull-right">
      <span class="badge badge">{{unredMsg}}</span>
      unread messages
    </p>

    <a class="btn btn-danger" v-on:click="toggleCompose">
      <i v-if="compose == false" class="fa fa-plus"></i>
      <i v-if="compose == true" class="fa fa-minus"></i>
    </a>
    <button v-if="selectBox === 'all'" class="btn btn-default" v-on:click="removeSelectAll()">
      <i v-if="selectBox === 'all'" class="fa fa-check-square-o"></i>
    </button>

    <button v-if="selectBox != 'all'" class="btn btn-default" v-on:click="selectAll()">
      <i v-if="selectBox === 'some'" class="fa fa-minus-square-o"></i>
      <i v-if="selectBox === 'none'" class="fa fa-square-o"></i>
    </button>

    <button class="btn btn-default" v-on:click="markRead(emails)">Mark As Read</button>

    <button class="btn btn-default" v-on:click="markUnread(emails)">Mark As Unread</button>

    <select class="form-control label-select" v-on:change="applyLabels(emails)">
      <option>Apply label</option>
      <option value="dev">dev</option>
      <option value="personal">personal</option>
      <option value="gschool">gschool</option>
    </select>

    <select class="form-control label-select" v-on:change="removeLabel(emails)">
      <option>Remove label</option>
      <option value="dev">dev</option>
      <option value="personal">personal</option>
      <option value="gschool">gschool</option>
    </select>

    <button class="btn btn-default" v-on:click="deleteEmail(emails)">
      <i class="fa fa-trash-o"></i>
    </button>
  </div>
</div>
</template>

<script>
export default {
  props:[
    'emails',
    'unredMsg',
    'selectBox',
    'selectAll',
    'removeSelectAll',
    'markRead',
    'markUnread',
    'deleteEmail',
    'findIndex',
    'applyLabels',
    'removeLabel',
    'toggleCompose',
    'compose',
    'getData'
  ]
}
</script>

<style lang="css">
</style>
