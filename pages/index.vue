<template>
  <div class="md-layout md-alignment-center" style="margin: 4em 0">
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button class="md-icon-button" @click="showLeftSidepanel = true">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/">
        HomeScreenShare
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <template v-if="isAuthenticated">
          <md-button>
            <md-avatar><img :src="user.avatar" :alt="user.email"></md-avatar>
            {{ user.email }}
          </md-button>

          <md-button @click="logoutUser">
            Logout
          </md-button>
        </template>
        <template v-else>
          <md-button to="/login">
            Login
          </md-button>

          <md-button to="/register">
            Register
          </md-button>
        </template>
      </div>
    </md-toolbar>

    <!-- Personal Content -->
    <md-drawer md-fixed :md-active.sync="showLeftSidepanel">
      <md-toolbar md-elevation="1">
        <span class="md-title">Personal Feed</span>
      </md-toolbar>

      <md-progress-bar v-if="loading" md-mode="indeterminate" />

      <md-field>
        <label for="category">Category</label>
        <md-select
          id="category"
          :value="category"
          name="category"
          @input="changeCategory"
        >
          <md-option value="jiei">
            自営業
          </md-option>
          <md-option value="syakai">
            社会人
          </md-option>
          <md-option value="daigaku">
            大学生
          </md-option>
          <md-option value="koukou">
            高校生
          </md-option>
          <md-option value="chugaku">
            中学生
          </md-option>
          <md-option value="syougaku">
            小学生
          </md-option>
        </md-select>
      </md-field>
    </md-drawer>

    <!-- Content -->
    <div class="md-layout md-alignment-center">
      <div class="md-layout-item md-size-95">
        <md-content class="md-layout md-gutter" style="background: #007998; padding: 1em;">
          <ul class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
            <md-ripple>
              <md-card style="margin-top: 1em;" md-width-hover>
                <md-card-media>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg" alt="">
                </md-card-media>
                <md-card-actions>
                  <md-button class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button class="md-icon-button">
                    <md-icon>message</md-icon>
                  </md-button>
                </md-card-actions>
              </md-card>
            </md-ripple>
          </ul>

          <ul class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
            <md-ripple>
              <md-card style="margin-top: 1em;" md-width-hover>
                <md-card-media>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg" alt="">
                </md-card-media>
                <md-card-actions>
                  <md-button class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button class="md-icon-button">
                    <md-icon>message</md-icon>
                  </md-button>
                </md-card-actions>
              </md-card>
            </md-ripple>
          </ul>

          <ul class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
            <md-ripple>
              <md-card style="margin-top: 1em;" md-width-hover>
                <md-card-media>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg" alt="">
                </md-card-media>
                <md-card-actions>
                  <md-button class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button class="md-icon-button">
                    <md-icon>message</md-icon>
                  </md-button>
                </md-card-actions>
              </md-card>
            </md-ripple>
          </ul>

          <ul class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
            <md-ripple>
              <md-card style="margin-top: 1em;" md-width-hover>
                <md-card-media>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg" alt="">
                </md-card-media>
                <md-card-actions>
                  <md-button class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button class="md-icon-button">
                    <md-icon>message</md-icon>
                  </md-button>
                </md-card-actions>
              </md-card>
            </md-ripple>
          </ul>
        </md-content>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    showLeftSidepanel: false
  }),
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    category() {
      return this.$store.getters.category
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    changeCategory(category) {
      this.$store.commit('setCategory', category)
    },
    logoutUser() {
      this.$store.dispatch('logoutUser')
    }
  }
}
</script>

<style>
.small-icon {
  font-size: 18px !important;
}
.fixed-toolbar {
  position: fixed;
  top: 0;
  z-index: 100;
}
</style>
