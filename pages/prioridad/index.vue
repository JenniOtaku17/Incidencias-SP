<template>

  <v-container class="px-10 pb-10">
    <v-row>
      <v-col cols="12" sm="7">

        <popupNuevo :toEdit="toEdit" @actualizar="actualizarDatos"/>
      </v-col>

      <v-col cols="12" sm="5" class="text-right">
        <h3>
          <v-icon >mdi-star</v-icon> &nbsp; Lista de Prioridades
        </h3>
        <h5
          class="text--secondary"
        >Aquí se encuentran todas las prioridades. Además puedes añadir uno nuevo o modificar alguna existente.</h5>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-app-bar flat class="py-3">
            <v-toolbar-title class="pb-6">Listado de prioridades</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="filterText"
              class="filter-input custom-in"
              solo append-icon="mdi-magnify"
              rounded flat
              label="Filtrar prioridades"
              id="id"
              autocomplete="off"
            ></v-text-field>

          </v-app-bar>

          <v-card-text>
            <v-data-table :headers="headers" :items="filteredPrioridades" :loading="isLoading">
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" class="puntero" :key="item.prioridadId">
                      <td>{{ item.prioridadId }}</td>
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.sla.descripcion }}</td>
                      <td align="center">
                        <v-btn class="elevation-0" color="primary" icon small @click="editPrioridad(item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                        <v-btn class="elevation-0" color="error" icon small @click="deletePrioridad(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
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
import popupNuevo from "~/components/prioridad/popupNuevo";
import Swal from 'sweetalert2';
import axios from 'axios';

export default {

  components: {
    popupNuevo
  },

  async mounted(){
    this.host = await this.$config.host;
    this.user = await this.$cookies.get('user')
    this.getAll();
    this.isLoading = false;
  },

  data() {
    return {
      isLoading: true,
      listaPrioridades: [],
      filterText: '',
      host: null,
      user: null,
      headers: [
        { text: "Código", value: 'prioridadId' },
        {
          text: "Nombre",
          align: "start",
          value: "nombre"
        },
        { text: "Sla", value: "sla.descripcion" },
        { text: "Acciones", align: 'center', sortable: false }
      ],
      toEdit: null,
      dialogExtra: false,
      infoExtra: null
    };
  },

  methods: {
    async getAll() {
        try{
            let token = this.user.token
            let prioridades = await axios.get(this.host+"api/Prioridad/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
            this.listaPrioridades = prioridades.data;

            console.log(this.listaPrioridades);

        }catch(error){
            console.log(error.response)
        }
        
    },

    editPrioridad(item){
      this.toEdit = item;
    },

    actualizarDatos( update ){
        if(update){
          this.getAll();
        }
        this.toEdit = null;
    },

    async deletePrioridad(item){
      try{
        let result = await Swal.fire({
        title: 'Va a eliminar una prioridad...',
        text: 'Está seguro que desea eliminar la prioridad '+item.nombre+"?",
        showCancelButton: true,
        confirmButtonColor: '#1976D2',
        cancelButtonColor: '#FF6060',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cerrar'
        })

        if(result.value){
            let token = this.user.token;
            let deleted = await axios.delete(this.host+"api/Prioridad/Delete/"+item.prioridadId, { 'headers': { 'Authorization': `Bearer ${token}` } });
            
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
            position: 'top-end',
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

    filtroPrioridades(prioridades,textoFiltro){
      try{
        if(!prioridades) return [];

        return prioridades
        .filter(
            e => e.nombre.toLowerCase().includes(textoFiltro.toLowerCase())
        )
      }catch(error){
        console.log(error);
      }

    },

  },

  computed: {

    filteredPrioridades(){
      return this.filtroPrioridades(this.listaPrioridades, this.filterText)
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