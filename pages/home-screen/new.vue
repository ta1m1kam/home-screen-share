<template>
  <div>
    <md-field>
      <label>Multiple</label>
      <md-file @change="detectFiles($event)" />
    </md-field>
  </div>
</template>

<script>
import uuid from 'uuid'

export default {
  data: () => ({
    fileName: '',
    imageUrl: ''
  }),
  methods: {
    detectFiles(e) {
      // アップロード対象は1件のみとする
      const file = (e.target.files || e.dataTransfer.files)[0]
      if (file) {
        const fileName = uuid()

        this.$store
          .dispatch('uploadImage', {
            name: fileName,
            file: file
          })
          .then((url) => {
            // アップロード完了処理 (ローカルメンバに保存したり)
            this.fileName = fileName
            this.imageUrl = url
          })
      }
    }
  }
}
</script>
