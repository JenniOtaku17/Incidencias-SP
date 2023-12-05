<template>
  <v-app :dark="true">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed :color="$vuetify.theme.dark ? 'blue-grey darken-4' : 'light-blue lighten-4'"
      app
    >
      <v-list>
  
      <div @click="goHome" class="logo">
        <v-img v-if="miniVariant" class="mx-1 my-0" height="40px" src="/LogoMini.png"></v-img>
        <v-img v-else class="mx-4 my-2" width="200px" src="/Logo.png"></v-img>
      </div>

      <br>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="logOut">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>LogOut</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list-item class="px-2" @click="goToSettings()">
          <v-list-item-avatar>
            <v-img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"></v-img>
          </v-list-item-avatar>

          <v-list-item-title class="white--text">{{$cookies.get('user').nombreUsuario}}</v-list-item-title>

        </v-list-item>

      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed flat
      app color="transparent"
    >
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" :class="$vuetify.theme.dark? 'darkDrawer' : ''"/>
      <v-spacer />
      <div>
        <input type="checkbox" class="checkbox" id="checkbox" @click="$vuetify.theme.dark = !$vuetify.theme.dark" />
        <label for="checkbox" class="label">
          <v-icon color="light-blue accent-4">mdi-weather-night</v-icon>
          <v-icon color="yellow accent-4">mdi-white-balance-sunny</v-icon>
          <div class="ball"></div>
        </label>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import $ from "jquery";

export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-domain',
          title: 'Departamento',
          to: '/departamento'
        },
        {
          icon: 'mdi-account-tie',
          title: 'Puesto',
          to: '/puesto'
        },
        {
          icon: 'mdi-account-group',
          title: 'Usuarios',
          to: '/user'
        },
        {
          icon: 'mdi-check-decagram',
          title: 'SLA',
          to: '/sla'
        },
        {
          icon: 'mdi-star',
          title: 'Prioridad',
          to: '/prioridad'
        },
        {
          icon: 'mdi-clipboard-alert-outline',
          title: 'Incidente',
          to: '/incidencia'
        },
      ],
      miniVariant: false,
      title: 'Incidencias APP'
    }
  },
  mounted(){
    console.log(this.$cookies.get('user'))
  },
  methods: {

    async logOut(){
      this.$cookies.remove('user');
      this.$router.push({ path: '/user/login' })
    },

    toggle(){
      $('#container').toggleClass('darkmode')
    },

    goToSettings(){
      this.$router.push({ path: '/user/ajustes' })
    },

    goHome(){
      this.$router.push({ path: '/' })
    }
  
  }
}
</script>
<style>

.checkbox {
  opacity: 0;
  position: absolute;
}

.checkbox:checked + .label .ball {
  transform: translateX(26px);
}

.label {
  position: relative;
  background-color: #0C2C8C;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  padding: 5px;
  height: 30px;
  width: 60px;
  cursor: pointer;
}

.ball {
  position: absolute;
  top: 3px;
  left: 6px;
  background-color: #0C2C8C;
  border-radius: 50%;
  height: 23px;
  width: 23px;
  transition: transform .2s linear;
  cursor: pointer;
}

.v-navigation-drawer__border{
  display: none;
}

.v-app-bar__nav-icon{
  background-color: #B3E5FC;
  border-bottom-left-radius: 0px!important;
  left: -12px;
  height: 35px!important;
}

.darkDrawer{
  background-color: #263238!important;
}

.v-navigation-drawer__append{
  background-color: #0C2C8C;
  cursor: pointer;
}

.logo{
  cursor: pointer;
}

</style>