<template>

  <v-container class="px-10 pb-10">
    <v-row>
      <v-col cols="12" sm="7">

        <popupNuevo :toEdit="toEdit" @actualizar="actualizarDatos"/>
      </v-col>

      <v-col cols="12" sm="5" class="text-right">
        <h3>
          <v-icon color="grey darken-4">mdi-domain</v-icon> &nbsp; Lista de Departamentos
        </h3>
        <h5
          class="text--secondary"
        >Aquí se encuentran todos los departamentos. Además puedes añadir uno nuevo o modificar alguno existente.</h5>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card >
          <v-app-bar flat class="py-3">
            <v-toolbar-title class="pb-6">Listado de departamentos</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="filterText"
              class="filter-input custom-in"
              solo flat
              rounded append-icon="mdi-magnify"
              label="Filtrar departamentos"
              id="id"
              autocomplete="off"
            ></v-text-field>

          </v-app-bar>

          <v-card-text>
            <v-data-table :headers="headers" :items="filteredDepartamentos" :loading="isLoading">
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" class="puntero" :key="item.departamentoId">
                      <td>{{ item.departamentoId }}</td>
                      <td>{{ item.nombre }}</td>
                      <td align="center">
                        <v-btn class="elevation-0" color="primary" icon small @click="editDepartamento(item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                        <v-btn class="elevation-0" color="error" icon small @click="deleteDepartamento(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
                        <v-btn class="elevation-0" color="teal" icon small @click="dialogExtra = true; infoExtra = item"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                      </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogExtra" width="400px">
      <v-card v-if="infoExtra">
        <v-toolbar
          dark flat
          color="transparent"
        >
          <v-card-title class="text--secondary">Informacion de Registro</v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark color="grey"
            @click="dialogExtra = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-8 py-5">
          <p><b>Creado Por:</b> {{infoExtra.creador.nombre}} {{infoExtra.creador.apellido}}</p>
          <p><b>Fecha de Registro:</b> {{formatTimeOff(infoExtra.fechaRegistro)}}</p>
          <slot v-if="infoExtra.modificador">
            <v-divider></v-divider><br>
            <p><b>Modificado Por:</b> {{infoExtra.modificador.nombre}} {{infoExtra.modificador.apellido}}</p>
            <p><b>Fecha de Modificacion:</b> {{formatTimeOff(infoExtra.fechaModificacion)}}</p>
          </slot>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import popupNuevo from "~/components/departamento/popupNuevo";
import Swal from 'sweetalert2';
import axios from 'axios';

export default {

  components: {
    popupNuevo
  },

  async mounted(){
    this.host = await this.$config.host;
    this.user = await this.$cookies.get('user');
    this.getAll();
    this.isLoading = false;
  },

  data() {
    return {
      isLoading: true,
      listaDepartamentos: [],
      filterText: '',
      host: null,
      user: null,
      headers: [
        { text: "Código", value: 'idDepartamento' },
        {
          text: "Nombre",
          align: "start",
          value: "nombre"
        },
        { text: "Acciones", align:'center', sortable: false }
      ],
      toEdit: null,
      dialogExtra: false,
      infoExtra: null,
    };
  },

  methods: {
    async getAll() {
        try{
            let token = this.user.token
            let departamentos = await axios.get(this.host+"api/Departamento/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
            this.listaDepartamentos = departamentos.data;
            console.log(this.listaDepartamentos)

        }catch(error){
            console.log(error.response)
        }
        
    },

    editDepartamento(item){
      this.toEdit = item;
    },

    actualizarDatos( update ){
        if(update){
          this.getAll();
        }
        this.toEdit = null;
    },

    async deleteDepartamento(item){
      try{
        let result = await Swal.fire({
        title: 'Va a eliminar un departamento...',
        text: 'Está seguro que desea eliminar el departamento '+item.nombre+"?",
        showCancelButton: true,
        confirmButtonColor: '#1976D2',
        cancelButtonColor: '#FF6060',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cerrar'
        })

        if(result.value){
            let token = this.user.token;
            let deleted = await axios.delete(this.host+"api/Departamento/Delete/"+item.departamentoId, { 'headers': { 'Authorization': `Bearer ${token}` } });
            
            if(deleted){
                await this.getAll();
            }
        }
        
      }catch(error){
        console.log(error);

        let text = "Ocurrió un error al eliminar el departamento"
        if(error.response.data.error){
          text = error.response.data.error;
        }

        Swal.fire({
            position: 'top',
            icon: 'error',
            title: text,
            showConfirmButton: false,
            timer: 2500
        })
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

    filtroDepartamentos(departamentos,textoFiltro){
      try{
        if(!departamentos) return [];

        return departamentos
        .filter(
            e => e.nombre.toLowerCase().includes(textoFiltro.toLowerCase())
        )
      }catch(error){
        console.log(error);
      }

    },

  },

  computed: {

    filteredDepartamentos(){
      return this.filtroDepartamentos(this.listaDepartamentos, this.filterText)
    }

  }
};
</script>

<style lang='scss' scoped>
.custom-in {
  .v-text-field__details {
    display: none;
  }
}

.v-input__slot {
  margin-bottom: 0px;
}

.filter-input {
  max-width: 400px;
}

</style>