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
          <md-button @click="showRightSidepanel = true">
            <md-avatar><img :src="user.avatar" :alt="user.email"></md-avatar>
            {{ user.email }}
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

      <md-empty-state class="md-primary" v-if="feed.length === 0 && !user" md-icon="bookmarks" md-label="Nothing in Feed" md-description="Login to bookmark headlines">
        <md-button to='/login' class="md-primary md-raised">Login</md-button>
      </md-empty-state>
      <md-empty-state class="md-accent" v-else-if="feed.length === 0" md-icon="bookmark_outline" md-label="Nothing in Feed" md-description="Anything you bookmark will be safely stored here">
      </md-empty-state>

      <md-list class="md-triple-line" v-else v-for="screen in feed" :key="screen.id">
        <md-list-item>
          <md-avatar><img :src="screen.image_url" :alt="screen.id"></md-avatar>
          <div class="md-list-item-text">
            <span><a :href="screen.url">{{ screen.id }}</a></span>
            <span>View Comments</span>
          </div>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </md-list>
    </md-drawer>

    <!-- User menu -->
    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidepanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">User menu</span>
      </md-toolbar>

      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>

      <md-list>
        <md-subheader class="md-primary">User menu</md-subheader>
        <md-list-item to="/home-screen/new">
          <md-icon>send</md-icon>
          Post Home Screen
        </md-list-item>
        <md-list-item @click="logoutUser">
          <md-icon>exit_to_app</md-icon>
          Logout
        </md-list-item>
      </md-list>
    </md-drawer>

    <!-- Content -->
    <div class="md-layout md-alignment-center">
      <div class="md-layout-item md-size-95">
        <md-content class="md-layout md-gutter" style="background: #007998; padding: 1em;">
          <ul
            v-for="screen in homeScreens"
            :key="screen.id"
            class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
            <md-ripple>
              <md-card style="margin-top: 1em;" md-width-hover>
                <md-card-media>
                  <img :src="screen.image_url" alt="">
                </md-card-media>
                <md-card-actions>
                  <md-button @click="addHomeScreenToFeed(screen)" class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button @click="saveHomeScreen(screen)" class="md-icon-button">
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
    showLeftSidepanel: false,
    showRightSidepanel: false
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
    },
    homeScreens() {
      return this.$store.getters.homeScreens
    },
    feed() {
      return this.$store.getters.feed
    }
  },

  async fetch({ store }) {
    await store.dispatch('loadHomeScreens')
    await store.dispatch('loadUserFeed')
  },

  methods: {
    changeCategory(category) {
      this.$store.commit('setCategory', category)
    },
    logoutUser() {
      this.showRightSidepanel = false
      this.$store.dispatch('logoutUser')
    },
    saveHomeScreen(screen) {
      this.$router.push(`/home-screen/${screen.id}`)
    },
    async addHomeScreenToFeed(homeScreen) {
      if (this.user) {
        await this.$store.dispatch('addHomeScreenToFeed', homeScreen)
      }
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
