<template>
  <div class="md-layout md-alignment-center" style="margin: 5em 0">
    <div class="md-layout-item md-size-75 md-small-size-80 md-xsmall-size-100">
      <md-card>
        <md-card-media style="height: 300px" md-ratio="16:9">
          <img :src="homeScreen.image_url" alt="" />
        </md-card-media>
        <md-card-header>
          <div>
            <md-icon>book</md-icon>
          </div>
          <span class="md-subhead">
            <md-icon>face</md-icon>
          </span>
        </md-card-header>
      </md-card>
      <md-button @click="$router.go(-1)" class="md-fab md-fab-bottom-right md-fixed md-primary">
        <md-icon>arrow_back</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({

  }),
  async fetch({ store, params }) {
    console.log(params)
    await store.dispatch('loadHomeScreen', params.id)
  },
  computed: {
    homeScreen() {
      return this.$store.getters.homeScreen
    }
  }
}
</script>
