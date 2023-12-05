<template>
  <div>
    <v-dialog v-model="dialog" width="800" persistent>
      <template v-slot:activator="{  attrs }">
        <v-btn color="primary" elevation="0" rounded v-bind="attrs" v-on:click="openDialog()">
          <v-icon>mdi-plus</v-icon>&nbsp; Añadir
        </v-btn>
      </template>

      <v-card >
          <v-card-title class="headline text--secondary" primary-title>Nuevo Usuario</v-card-title>
            <br>

            <v-stepper v-model="e1">
            <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">Datos del Usuario</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">Información de Acceso</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 3" step="3">Confirmación</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
            </v-stepper-items>
                <v-stepper-content step="1">
                    <v-container class="mb-3 px-4" >
                        <validation-observer
                            ref="observer"
                            v-slot="{ invalid }"
                        >
                        <v-row>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Nombre"
                                    rules="required"
                                >
                                    <v-text-field prepend-icon="mdi-rename-box" :error-messages="errors" dense outlined label="Nombre" v-model="form.Nombre"></v-text-field>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Apellido"
                                    rules="required"
                                >
                                    <v-text-field prepend-icon="mdi-rename-box" :error-messages="errors" dense outlined label="Apellido" v-model="form.Apellido"></v-text-field>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Puesto"
                                    rules="required"
                                >
                                    <v-select
                                    prepend-icon="mdi-briefcase"
                                    :items="listaPuestos"
                                    v-model="form.PuestoId"
                                    item-text="nombre"
                                    item-value="puestoId"
                                    label="Puesto"
                                    outlined
                                    dense :error-messages="errors"
                                    ></v-select>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Cédula"
                                    rules="required|length:11"
                                >
                                    <v-text-field prepend-icon="mdi-card-account-details-outline" type="number" :error-messages="errors" dense outlined label="Cédula" v-model="form.Cedula"></v-text-field>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Teléfono"
                                    rules="required|length:10"
                                >
                                    <v-text-field prepend-icon="mdi-phone" type="number" :error-messages="errors" dense outlined label="Teléfono" v-model="form.Telefono"></v-text-field>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Fecha Nacimiento"
                                    rules="required"
                                >
                                    <v-menu
                                        ref="menu"
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        :return-value.sync="form.FechaNacimiento"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                            v-model="form.FechaNacimiento"
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
                                            v-model="form.FechaNacimiento"
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
                                            @click="$refs.menu.save(form.FechaNacimiento)"
                                            >Guardar</v-btn
                                            >
                                        </v-date-picker>
                                    </v-menu>
                                </validation-provider>
                            </v-col>
                        </v-row>
                        <v-row class="mt-5">

                            <v-spacer></v-spacer>

                            <v-btn color="error" elevation="0" @click="clean">Cancelar</v-btn>
                            <v-btn color="primary" elevation="0" class="ml-2 mr-3" :disabled="invalid" @click="e1 = 2">Continuar</v-btn>
                        </v-row>
                        </validation-observer>
                    </v-container>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-container class="mb-3 pa-md-10" >
                        <validation-observer
                            ref="observer"
                            v-slot="{ invalid }"
                        >
                        <v-row>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Correo"
                                    rules="required|email"
                                >
                                    <v-text-field prepend-icon="mdi-email" :error-messages="errors" dense outlined label="Correo" v-model="form.Correo"></v-text-field>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Nombre de Usuario"
                                    rules="required"
                                >
                                    <v-text-field prepend-icon="mdi-account-box-outline"  :error-messages="errors" dense outlined label="Nombre de Usuario" v-model="form.NombreUsuario"></v-text-field>
                                </validation-provider>
                            </v-col>
                            
                            <v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Contraseña"
                                    rules="required"
                                >
                                    <v-text-field prepend-icon="mdi-lock"  :error-messages="errors" dense outlined 
                                    label="Contraseña" v-model="form.Contrasena" :type="show ? 'text' : 'password'"
                                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                    hint="Almenos 6 caracteres"
                                    @click:append="show = !show"></v-text-field>
                                </validation-provider>
                            </v-col><v-col cols="12" sm="6" class="pb-0">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="Confirma Contraseña"
                                    rules="required"
                                >
                                    <v-text-field prepend-icon="mdi-lock-check"  :error-messages="errors" dense outlined
                                    :type="show1 ? 'text' : 'password'" label="Confirma Contraseña"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    hint="Almenos 6 caracteres"
                                    @click:append="show1 = !show1" v-model="confirm"></v-text-field>
                                </validation-provider>
                            </v-col>
                        </v-row>
                        <v-row class="mt-8">
                            <v-btn color="primary" class="ml-3" outlined @click="e1 = 1">
                                <v-icon>mdi-arrow-left</v-icon>volver
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-btn color="error" elevation="0" @click="clean">Cancelar</v-btn>
                            <v-btn color="primary" elevation="0" class="ml-2 mr-3" :disabled="invalid" @click="validarClave()">Continuar</v-btn>
                        </v-row>
                        </validation-observer>
                    </v-container>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <v-row class="mx-10 py-2">
                        <v-col cols="12" sm="6" >
                            <!--<v-icon>mdi-card-account-details-outline</v-icon>-->
                            <span><b>Nombre:</b> {{ form.Nombre }}</span>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <!--<v-icon>mdi-phone</v-icon>-->
                            <span><b>Apellido:</b> {{ form.Apellido }}</span>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <!--<v-icon>mdi-card-account-details-outline</v-icon>-->
                            <span><b>Cedula:</b> {{ form.Cedula }}</span>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <!--<v-icon>mdi-phone</v-icon>-->
                            <span><b>Nombre de Usuario:</b> {{ form.NombreUsuario }}</span>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <!--<v-icon>mdi-phone</v-icon>-->
                            <span><b>Telefono:</b> {{ form.Telefono }}</span>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <!--<v-icon>mdi-email</v-icon>-->
                            <span><b>Email:</b> {{ form.Correo }}</span>
                        </v-col>
                        <v-col cols="12" sm="6" v-if="listaPuestos.find(x=> x.puestoId === form.PuestoId)">
                            <!--<v-icon>mdi-certificate-outline</v-icon>-->
                            <span><b>Puesto:</b> {{ listaPuestos.find(x=> x.puestoId === form.PuestoId).nombre }}</span>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <!--<v-icon>mdi-calendar-month</v-icon>-->
                            <span><b>Fecha de Nacimiento:</b>{{ form.FechaNacimiento }}</span>
                        </v-col>
                    </v-row>
                    <v-row class="mt-5 px-5 py-5">
                        <v-btn color="primary" class="ml-3" outlined @click="e1 = 2">
                            <v-icon>mdi-arrow-left</v-icon>volver
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn color="error" @click="clean">Cancelar</v-btn>
                        <v-btn color="primary" class="ml-2 mr-3"  @click="guardar">Guardar</v-btn>
                    </v-row>
                </v-stepper-content>
            </v-stepper>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { required, email, length } from 'vee-validate/dist/rules';

export default {
    data: () => ({
        form: {
            PuestoId: null,
            Nombre: null,
            Apellido: null,
            Cedula: null,
            Correo: null,
            Telefono: null,
            FechaNacimiento: null,
            NombreUsuario: null,
            Contrasena: null,
            CreadoPor: null
        },
        e1: 1,
        show: false,
        show1: false,
        confirm: null,
        dialog : false,
        isCreating: false,
        user: null,
        host: null,
        listaPuestos: [],
        menu: false

    }),
    components: {
      ValidationProvider,
      ValidationObserver,
    },

    async mounted(){
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

        this.host = await this.$config.host;
        this.user = await this.$cookies.get('user');
        this.getPuesto();

    },
    methods: {

        openDialog(){
            this.dialog = true;
        },

        clean(){
            this.form= {
                PuestoId: null,
                Nombre: null,
                Apellido: null,
                Cedula: null,
                Correo: null,
                Telefono: null,
                FechaNacimiento: null,
                NombreUsuario: null,
                Contrasena: null,
                CreadoPor: null,
            }
            this.dialog = false;
            this.e1 = 1;
            this.isCreating = false;
            console.log("cleaning")
        },

        async getPuesto(){
            try{
                let token = this.user.token
                let puestos = await axios.get(this.host+"api/Puesto/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
                this.listaPuestos = puestos.data;

            }catch(error){
                console.log(error.response)
            }
        },

        async validarClave(){
            if(this.form.Contrasena == this.confirm){
                this.e1 = 3
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

        async guardar(){

            try{
                this.isCreating = true;
                let token = this.user.token;
                this.form.CreadoPor = this.user.usuarioId;

                let result = await axios.post(this.host+"api/Usuario/Add", this.form , { 'headers': { 'Authorization': `Bearer ${token}` } });
                
                if(result){
                    this.clean();
                    this.$emit("actualizar");
                }

            }catch(error){
                console.log(error);

                let text = "Ocurrió un error al crear incidente, por favor verifique los datos e intente nuevamente."
                if(error.response.data.error){
                    text = error.response.data.error;
                }

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: text,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            
        }
    }
}
</script>
<style lang="scss">

.v-dialog{
    border-radius: 15px!important;
}

</style>