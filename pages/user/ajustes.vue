<template>
<div>

  <v-container class="mb-5">
    <v-row class="flex-center">
      <v-col cols="12" sm="9">
        <v-card v-if="usuario"  > 
          <v-app-bar flat>

            <v-spacer></v-spacer>

            <v-btn text color="pink" fab>
                <v-icon v-on:click="editing = !editing">mdi-account-edit</v-icon>
            </v-btn>
          </v-app-bar>
                <v-row>
                    <div class="flex-center overlap-avatar">
                        <v-avatar size="150px" class="border-white">
                        <img style="background-color: #fff;"
                            src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                            alt="alt"
                        />
                        </v-avatar>
                    </div>
                    </v-row>
                    <v-row>
                    <div class="flex-center flex-col">
                        <h1 class="display-1 font-weight-thin mb-4">{{usuario.nombre}} {{usuario.apellido}}</h1>
                        <h4 class="text--secondary"> Usuario: {{usuario.nombreUsuario}}</h4>
                        <br>
                    </div>
                </v-row>
                <v-row class="mx-5 py-2">
                    <v-col cols="12" sm="6">
                        <!--<v-icon>mdi-card-account-details-outline</v-icon>-->
                        <span><b>Cédula:</b> {{ formatCedula(usuario.cedula) }}</span>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <!--<v-icon>mdi-phone</v-icon>-->
                        <span><b>Teléfono:</b> {{ formatPhoneNumber(usuario.telefono) }}</span>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <!--<v-icon>mdi-email</v-icon>-->
                        <span><b>Correo:</b> {{ usuario.correo }}</span>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="usuario.puesto">
                        <!--<v-icon>mdi-certificate-outline</v-icon>-->
                        <span><b>Puesto:</b> {{ usuario.puesto.nombre }}</span>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <!--<v-icon>mdi-calendar-month</v-icon>-->
                        <span><b>Fecha de Registro:</b>{{ formatTimeOff(usuario.fechaRegistro)}}</span>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <!--<v-icon>mdi-calendar-month</v-icon>-->
                        <span><b>Fecha de Nacimiento:</b>{{ formatDate(usuario.fechaNacimiento) }}</span>
                    </v-col>
                </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-if="editing" class="retain-xl">
    <v-row class="flex-center">
      <v-col cols="12" sm="9">
        <v-card v-if="usuario">
          <v-app-bar flat>

            <v-spacer></v-spacer>
            <v-chip color="pink" class="white--text">Modo edición</v-chip>
          </v-app-bar>

          <v-container class="pb-8">
            <v-expansion-panels flat>

              <v-expansion-panel class="px-6">
                <v-expansion-panel-header class="px-0">
                  <span><v-icon>mdi-account</v-icon>
                  Actualizar Datos Personales</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <validation-observer
                  ref="observer"
                  v-slot="{ invalid }"
                  >
                    <br>
                      <v-row class="mx-5">
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Nombre"
                              rules="required"
                          >
                              <v-text-field prepend-icon="mdi-account-box-outline"  :error-messages="errors" dense outlined label="Nombre" v-model="usuario.nombre"></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Apellido"
                              rules="required"
                          >
                              <v-text-field prepend-icon="mdi-account-box-outline"  :error-messages="errors" dense outlined label="Apellido" v-model="usuario.apellido"></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Nombre de Usuario"
                              rules="required"
                          >
                              <v-text-field prepend-icon="mdi-rename-box"  :error-messages="errors" dense outlined label="Nombre de Usuario" v-model="usuario.nombreUsuario"></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Cédula"
                              rules="required|length:11"
                          >
                              <v-text-field prepend-icon="mdi-card-account-details-outline" type="number" :error-messages="errors" dense outlined label="Cédula" v-model="usuario.cedula"></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Teléfono"
                              rules="required|length:10"
                          >
                              <v-text-field prepend-icon="mdi-phone" type="number" :error-messages="errors" dense outlined label="Teléfono" v-model="usuario.telefono"></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Correo"
                              rules="required|email"
                          >
                              <v-text-field prepend-icon="mdi-email"  :error-messages="errors" dense outlined label="Correo" v-model="usuario.correo"></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                              <v-select
                              prepend-icon="mdi-briefcase"
                              :items="listaPuestos"
                              v-model="usuario.puestoId"
                              item-text="nombre"
                              item-value="puestoId"
                              label="Puesto"
                              outlined
                              dense
                              ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="Fecha Nacimiento"
                              rules="required"
                          >
                              <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="usuario.fechaNacimiento"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="usuario.fechaNacimiento"
                                    label="Fecha de Nacimiento"
                                    prepend-icon="mdi-cake"
                                    outlined
                                    dense :error-messages="errors"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="usuario.fechaNacimiento"
                                    no-title
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu = false"
                                    >Cancelar</v-btn
                                    >
                                    <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(usuario.fechaNacimiento)"
                                    >Guardar</v-btn
                                    >
                                </v-date-picker>
                            </v-menu>
                          </validation-provider>
                        </v-col>
                      </v-row>
                      <v-row>
                        <div class="flex-center  py-5">
                          <v-btn color="primary" class="ml-2" :disabled="invalid" @click="guardar">Guardar Cambios</v-btn>
                        </div>
                      </v-row>
                    </validation-observer>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel class="px-6">
                <v-expansion-panel-header class="px-0">
                  <span><v-icon>mdi-lock</v-icon>
                  Cambiar Clave de Acceso</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <validation-observer
                  ref="observer"
                  v-slot="{ invalid }"
                  >
                    <br>
                      <v-row class="mx-5">
                        <v-col cols="12" sm="6">
                          <validation-provider
                                v-slot="{ errors }"
                                name="Contraseña"
                                rules="required"
                            >
                                <v-text-field prepend-icon="mdi-lock"  :error-messages="errors" dense outlined 
                                label="Contraseña" v-model="form.clave" :type="show ? 'text' : 'password'"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                hint="Almenos 6 caracteres"
                                @click:append="show = !show"></v-text-field>
                            </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <validation-provider
                                v-slot="{ errors }"
                                name="Confirma Contraseña"
                                rules="required"
                            >
                                <v-text-field prepend-icon="mdi-lock-check"  :error-messages="errors" dense outlined
                                :type="show1 ? 'text' : 'password'" label="Confirma Contraseña"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                hint="Almenos 6 caracteres"
                                @click:append="show1 = !show1" v-model="form.claveConfirmacion"></v-text-field>
                            </validation-provider>
                        </v-col>
                      </v-row>
                      <v-row>
                        <div class="flex-center  py-5">
                          <v-btn color="primary" class="ml-2" :disabled="invalid" @click="changePassword">Cambiar Clave</v-btn>
                        </div>
                      </v-row>
                  </validation-observer>
                </v-expansion-panel-content>
              </v-expansion-panel>

            </v-expansion-panels>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { required, email, length } from 'vee-validate/dist/rules';

export default {
  
  middleware : 'auth-this',

  async mounted() {
    try {
      this.host = await this.$config.host;
      this.user = await this.$cookies.get('user');

      this.getAll();
      this.getPuestos();

      setInteractionMode('eager')

      extend('required', {
          ...required,
          message: '{_field_} no puede estar vacío.',
      })

      extend('email', {
          ...email,
          message: 'Debe ingregar un correo válido.',
      })

      extend('length', {
          ...length,
          message: 'Número de dígitos invalidos.',
      })

    } catch (error) {
      console.log("Ocurrió un problema buscando el incidente", error);
    }
  },

  data: () => ({
    host: null,
    user: null,
    usuario: null,
    listaPuestos: null,
    editing: false,
    menu: false,
    form : {
      clave: null,
      claveConfirmacion: null
    },
    show: false,
    show1: false
  }),

  components: {
    ValidationProvider,
    ValidationObserver,
  },

  methods: {

      async getAll(){
        try{
          let token = this.user.token;

          let usuario = await axios.get(this.host+"api/Usuario/Get/"+this.user.usuarioId, { 'headers': { 'Authorization': `Bearer ${token}` } });
          this.usuario = usuario.data;
          console.log(this.usuario);
        }
        catch(error){
          console.log(error);
        }
      },

      async getPuestos(){
        try{
            let token = this.user.token
            let puestos = await axios.get(this.host+"api/Puesto/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
            this.listaPuestos = puestos.data;

        }catch(error){
            console.log(error.response)
        }
      },

      async changePassword(){
        if(this.form.clave == this.form.claveConfirmacion){
          try{
            let token = this.user.token;
            this.usuario.Contrasena = this.form.clave;
            this.usuario.ModificadoPor = this.user.usuarioId;

            let result = await axios.put(this.host+"api/Usuario/Update", this.usuario , { 'headers': { 'Authorization': `Bearer ${token}` } });
            
            if(result){
              this.$cookies.remove('user');
              this.$router.push({ path: '/user/login' });
            }

          }catch(error){
            console.log(error);
          }

        }else{
          Swal.fire({
              text: 'Las contraseñas no coinciden',
              customClass: {
                  container: 'position-absolute'
              },
              toast: true,
              icon: 'error',
              position: 'top-right',
              showConfirmButton: false,
              timer: 2000
          });
        }
      },

      formatTimeOff( fecha ){
        let date = new Date( fecha );
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let str;
        if(month < 10 && day < 10){
            str = ` 0${day}-0${month}-${year} ${hours}:${minutes}:${seconds}`;
        }else if( month < 10){
            str = ` ${day}-0${month}-${year} ${hours}:${minutes}:${seconds}`;
        }else{
            str = ` ${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }
        return str;
      },

      formatPhoneNumber(str) {
        let cleaned = ('' + str).replace(/\D/g, '');
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        
        if (match) {
          let intlCode = (match[1] ? '+1 ' : '')
          return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
        
        return str;
      },

      formatCedula(str) {
        return `${ str.substr(0, 3)}-${str.substr(3, 7)}-${str.substr(10, 1)}`;
      },

      formatDate( fecha ){
        let date = new Date( fecha );
        let day = date.getDate();
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        if(month < 10 && day < 10){
            return `0${day}-0${month}-${year}`
        }else if( month < 10){
            return `${day}-0${month}-${year}`
        }
        else{
            return `${day}-${month}-${year}`
        }
      },

      async guardar(){
        try{
            let token = this.user.token;
            this.usuario.ModificadoPor = this.user.usuarioId;

            let result = await axios.put(this.host+"api/Usuario/Update", this.usuario , { 'headers': { 'Authorization': `Bearer ${token}` } });
            
            if(result){
              this.getAll();
              this.editing = false;
            }

        }catch(error){
            console.log(error);

            let text = "Ocurrió un error al actualizar usuario, por favor verifique los datos e intente nuevamente."
            if(error.response.data.error){
                text = error.response.data.error;
            }

            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: text,
                showConfirmButton: false,
                timer: 2500
            })
        }
        
      }

  }
};
</script>

<style lang="scss" scoped>

.error-message{
font-size: 12px;
color: rgb(221, 9, 9);
margin-left: 35px;
}

.retain-xl {
max-width: 1140px;
}

 .flex-center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-col {
    flex-direction: column;
  }
  .v-expansion-panel-header{
    border-bottom: 1px solid grey;
  }

</style>
