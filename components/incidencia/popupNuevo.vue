<template>
  <div>
    <v-dialog v-model="dialog" width="800" persistent>
      <template v-slot:activator="{  attrs }">
        <v-btn color="primary" elevation="0" v-bind="attrs" v-on:click="openDialog()">
          <v-icon>mdi-plus</v-icon>&nbsp; Añadir
        </v-btn>
      </template>

      <v-card >
        <v-app-bar color="transparent" flat>
            <v-card-title class="headline text--secondary">{{title}}</v-card-title>
        </v-app-bar>
            <v-container class="pb-8 pt-4 px-8" >
                <validation-observer
                    ref="observer"
                    v-slot="{ invalid }"
                >
                    <v-row>
                        <v-col cols="12" sm="12" class="pb-0">
                            <validation-provider
                                v-slot="{ errors }"
                                name="Titulo"
                                rules="required"
                            >
                                <v-text-field prepend-icon="mdi-rename-box" :error-messages="errors" dense outlined label="Titulo" v-model="form.Titulo"></v-text-field>
                            </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-0">
                            <validation-provider
                                v-slot="{ errors }"
                                name="Prioridad"
                                rules="required"
                            >
                                <v-select
                                prepend-icon="mdi-star"
                                :items="listaPrioridades"
                                v-model="form.PrioridadId"
                                item-text="nombre"
                                item-value="prioridadId"
                                label="Prioridad"
                                outlined
                                dense :error-messages="errors"
                                ></v-select>
                            </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-0">
                            <validation-provider
                                v-slot="{ errors }"
                                name="Departamento"
                                rules="required"
                            >
                                <v-select
                                prepend-icon="mdi-office-building"
                                :items="listaDepartamentos"
                                v-model="form.DepartamentoId"
                                item-text="nombre"
                                item-value="departamentoId"
                                label="Departamento"
                                outlined
                                dense :error-messages="errors"
                                ></v-select>
                            </validation-provider>
                        </v-col>
                        
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea prepend-icon="mdi-text-box-multiple" label="Descripción (opcional)"  outlined v-model="form.Descripcion"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="mt-3">
                        <v-spacer></v-spacer>
                        <v-btn color="error" elevation="0" @click="clean">Cancelar</v-btn>
                        <v-btn color="primary" elevation="0" class="ml-2 mr-3" :disabled="invalid" @click="guardar">Guardar</v-btn>
                    </v-row>
                </validation-observer>
            </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { required } from 'vee-validate/dist/rules';

export default {
    data: () => ({
        form: {
            Titulo: null,
            PrioridadId: null,
            DepartamentoId: null,
            UsuarioReportaId: null,
            Descripcion: null,
            CreadoPor: null,
            Estatus: 'a',
            UsuarioReportaId: null
        },
        dialog : false,
        isCreating: false,
        user: null,
        host: null,
        title: 'Nuevo Incidente',
        listaDepartamentos: [],
        listaPrioridades: [],

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

        this.host = await this.$config.host;
        this.user = await this.$cookies.get('user');

        this.getDepartamentos();
        this.getPrioridades();

    },
    methods: {

        openDialog(){
            this.dialog = true;
        },

        clean(){
            this.form= {
                Titulo: null,
                PrioridadId: null,
                DepartamentoId: null,
                UsuarioReportaId: null,
                Descripcion: null,
                CreadoPor: null,
                Estatus: 'a',
                UsuarioReportaId: null
            }
            this.dialog = false;
            this.isCreating = false;
            console.log("cleaning")
        },

        async getDepartamentos(){
            try{
                let token = this.user.token
                let departamentos = await axios.get(this.host+"api/Departamento/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
                this.listaDepartamentos = departamentos.data;

            }catch(error){
                console.log(error.response)
            }
        },

        async getPrioridades(){
            try{
                let token = this.user.token
                let prioridades = await axios.get(this.host+"api/Prioridad/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
                this.listaPrioridades = prioridades.data;

            }catch(error){
                console.log(error.response)
            }
        },

        async guardar(){

            try{
                this.isCreating = true;
                let token = this.user.token;
                this.form.CreadoPor = this.user.usuarioId;
                this.form.UsuarioReportaId = this.user.usuarioId;
                let result = await axios.post(this.host+"api/Incidente/Add", this.form , { 'headers': { 'Authorization': `Bearer ${token}` } });

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
<style scoped>
</style>