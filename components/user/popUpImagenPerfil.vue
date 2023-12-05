<template>
  <div v-if="mounted">
    <v-dialog v-model="activador" persistent max-width="600px">
      <v-card>
        <v-card-title>
          Subir imagen.
        </v-card-title>
        <v-container>
          <v-col cols="12">
            <v-row justify="center">
              <template>
                <div
                  v-show="!fakeUrl"
                  class="div-subir-imagen"
                  @click="_openFileInput()"
                >
                  <v-icon size="200" class="icon-add-image">mdi-plus</v-icon>
                  <span>Seleccionar imagen</span>
                </div>
                <v-col v-show="fakeUrl" cols="12">
                  <div id="demo-basic"></div>
                </v-col>
              </template>
            </v-row>
          </v-col>
          <v-file-input
            id="image_input"
            ref="image_input"
            hide-details
            solo
            background-color="rgba(210,210,210,.7)"
            v-model="newImage"
            prepend-inner-icon="mdi-image-plus"
            prepend-icon=""
            accept="image/png, image/jpeg, image/bmp"
            color="red"
            @change="makePreview()"
            clear-icon="mdi-close-circle"
            @click:prepend-inner="_openFileInput()"
            @click:clear="fakeUrl = null"
            style="display:none"
          >
          </v-file-input>
        </v-container>
        <v-card-actions>
          <v-btn text color="error" @click="closeDialog(null)">
            Cerrar
          </v-btn>
          <v-spacer />
          <v-btn @click="clearImage()" color="error" v-if="fakeUrl">
            <v-icon>mdi-close</v-icon>
            Cambiar Imagen
          </v-btn>
          <v-btn
            color="success"
            @click="generateImage()"
            :disabled="canUpImage"
          >
            Subir Imagen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Croppie from "croppie";
import "croppie/croppie.css";
import { mapState } from 'vuex';
export default {
  props: {
    activador: Boolean
  },
  data: () => ({
    mounted: false,

    tempImagesCarousel: [],
    newImage: null,
    fakeUrl: null,

    croppier: null
  }),
  mounted() {
    this.mounted = true;
    setTimeout(() => {
      this.loadCroppie();
    }, 1);
  },
  methods: {
    closeDialog(data) {
      this.$emit("dialogUpImagenClosed", data);
    },
    loadCroppie() {
      let opts = {
        enableExif: true,
        viewport: {
          width: 200,
          height: 200,
          // type: 'circle',
        },
        boundary: {
          width: 500,
          height: 400
        },
        showZoomer: true,
        enableOrientation: true
      };
      var c = new Croppie(document.querySelector("#demo-basic"), opts);

      this.croppier = c;
    },
    _openFileInput() {
      document.getElementById("image_input").click();
    },
    makePreview() {
      if (!this.newImage) this.fakeUrl = null;
      else {
        this.fakeUrl = window.URL.createObjectURL(this.newImage);
        this.loadImageCroppie();
      }
    },
    loadImageCroppie() {
      this.croppier.bind({
        url: this.fakeUrl
      });
    },
    clearImage() {
      this.newImage = null;
      this.fakeUrl = null;
    },
    generateImage() {
      this.croppier
        .result({type: "blob", format: "png", quality: 1, circle: false})
        .then(blob => {
          this.addNewImageCropped(blob);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addNewImageCropped(fileImg) {
      let tempImage = {
        url: window.URL.createObjectURL(fileImg),
        nombre: `${this.newImage.name}-${Date.now()}`,
        tipo: fileImg.type,
        isTemp: true,
        file: fileImg
      };
      this.newImage = null;
      this.fakeUrl = null;
      this.closeDialog(tempImage);
    }
  },
  computed: {
    canUpImage() {
      if (!this.fakeUrl) return true;
      return false;
    },
    ...mapState({
      userLogged: state => state.userManager.userAccount
    })
  }
};
</script>

<style lang="scss" scoped>
.input-new-image {
  position: absolute;
  bottom: 0px;
  width: 100%;
  cursor: pointer;
  border-radius: 0px;
}
.div-subir-imagen {
  width: 300px;
  height: 300px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  position: relative;

  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  }

  span {
    color: grey;
    font-size: 18px;
    margin-left: 71.31px;
  }
}
.icon-add-image {
  position: relative;
  margin-top: 50px;
  margin-left: 50px;
}
</style>