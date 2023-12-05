<template>
  <div>
    <v-dialog v-model="dialog" width="500" persistent>
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
                                name="Nombre"
                                rules="required"
                            >
                                <v-text-field prepend-icon="mdi-rename-box" :error-messages="errors" dense outlined label="Nombre" v-model="form.Nombre"></v-text-field>
                            </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="12" class="pb-0">
                            <validation-provider
                                v-slot="{ errors }"
                                name="Sla"
                                rules="required"
                            >
                                <v-select
                                prepend-icon="mdi-check-decagram"
                                :items="listaSla"
                                v-model="form.SlaId"
                                item-text="descripcion"
                                item-value="slaId"
                                label="Sla"
                                outlined
                                dense :error-messages="errors"
                                ></v-select>
                            </validation-provider>
                        </v-col>
                    </v-row>
                    <v-row class="mt-5">
                        <v-spacer></v-spacer>
                        <v-btn color="error" elevation="0" @click="close">Cancelar</v-btn>
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
    props: [
        "toEdit"
    ],
    data: () => ({
        form: {
            Nombre: null,
            SlaId: null,
            Estatus: 'a',
            CreadoPor: null
        },
        dialog : false,
        isCreating: false,
        user: null,
        host: null,
        editing: false,
        title: 'Nueva Prioridad',
        listaSla: []

    }),
    watch:{
        toEdit : function (val) {
            if(val){
                this.form = {
                    PrioridadId: val.prioridadId,
                    Nombre: val.nombre,
                    SlaId: val.slaId,
                    Estatus: val.estatus,
                    CreadoPor: val.creadoPor
                }
                this.editing = true;
                this.title = 'Editar Prioridad';
                this.dialog = true;
            }
        }
    },
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
        this.getSla();

    },
    methods: {

        openDialog(){
            this.dialog = true;
        },

        clean(){
            this.form= {
                Nombre: null,
                SlaId: null,
                Estatus: 'a',
                CreadoPor: null
            }
            this.editing = false;
            this.dialog = false;
            this.title = 'Nueva Prioridad';
            this.isCreating = false;
            console.log("cleaning")
        },

        close(){
            this.clean();
            this.$emit("actualizar", false);
        },

        async getSla(){
            try{
                let token = this.user.token
                let sla = await axios.get(this.host+"api/Sla/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
                this.listaSla = sla.data;

            }catch(error){
                console.log(error.response)
            }
        },

        async guardar(){

            try{
                this.isCreating = true;
                let result;

                if(this.editing == true){
                    let token = this.user.token;
                    this.form.ModificadoPor = this.user.usuarioId;

                    result =  await axios.put(this.host+"api/Prioridad/Update", this.form , { 'headers': { 'Authorization': `Bearer ${token}` } });

                }else{
                    let token = this.user.token;
                    this.form.CreadoPor = this.user.usuarioId;

                    result =  await axios.post(this.host+"api/Prioridad/Add", this.form , { 'headers': { 'Authorization': `Bearer ${token}` } });
                }
                if(result){
                    this.clean();
                    this.$emit("actualizar", true);
                }

            }catch(error){
                console.log(error);

                let text = "Ocurrió un error al crear sla, por favor verifique los datos e intente nuevamente."
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