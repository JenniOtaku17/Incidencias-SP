<template>

  <v-container class="px-10 pb-10">
    <v-row class="px-2">
      <v-col cols="12" sm="6">

        <popupNuevo @actualizar="actualizarDatos()"/>
      </v-col>

      <v-col cols="12" sm="6" class="text-right">
        <h3>
          <v-icon >mdi-clipboard-alert-outline</v-icon> &nbsp; Lista de Incidentes
        </h3>
        <h5
          class="text--secondary"
        >Aquí se encuentran todos los incidentes, incidentes asignados por ti e incidentes asignados a ti. Además puedes añadir uno nuevo.</h5>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card flat color="transparent">
            <v-app-bar flat color="transparent" class="px-3">
                <v-tabs v-model="tab" background-color="transparent" dark slider-color="primary">
                    <v-tab v-for="item in items" :key="item.tab" class="primary--text">{{ item.tab }}</v-tab>
                </v-tabs>
            </v-app-bar>
            <v-card-text class="px-0" >
                <v-tabs-items v-model="tab" color="transparent" >
                    <v-tab-item class="px-3 py-2">
                            <v-card>
                                <v-app-bar flat class="py-3">
                                    <v-toolbar-title>Listado de Incidentes</v-toolbar-title>

                                    <v-spacer></v-spacer>

                                    <v-text-field
                                    v-model="filterTextIncidente"
                                    class="filter-input custom-in"
                                    solo flat
                                    rounded append-icon="mdi-magnify"
                                    label="Filtrar incidentes"
                                    id="id"
                                    autocomplete="off"
                                    ></v-text-field>

                                </v-app-bar>
                                <v-card-text>
                                <v-data-table :headers="headers" :items="filteredIncidentes" :loading="isLoading">
                                <template v-slot:body="{ items }">
                                    <tbody>
                                    <tr v-for="item in items" class="clickableRow" :key="item.incidenteId">
                                        <td @click="verDetalle(item.incidenteId)">{{ item.titulo }}</td>
                                        <td @click="verDetalle(item.incidenteId)">{{ item.prioridad.nombre }}</td>
                                        <td @click="verDetalle(item.incidenteId)">{{ item.departamento.nombre }}</td>
                                        <td @click="verDetalle(item.incidenteId)">
                                          <span v-if="item.usuarioAsignado" > {{item.usuarioAsignado.nombre}} {{item.usuarioAsignado.apellido}} </span>
                                          <span v-else >Sin asignar <v-icon color="warning">mdi-exclamation</v-icon></span>
                                        </td>
                                        <td align="center">
                                          <span v-if="item.estatus == 'I'"> Cerrado </span>
                                          <span v-else>
                                            <v-btn class="elevation-0" color="pink" icon small @click="incidente = item; dialogAsignar = true;"><v-icon>mdi-account-circle-outline</v-icon></v-btn>
                                            <v-btn class="elevation-0" color="teal" icon small @click="setExtra(item)"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                          </span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </template>
                                </v-data-table>
                                </v-card-text>
                            </v-card>
                    </v-tab-item>
                    <v-tab-item class="px-3 py-2">
                            <v-card>
                                <v-app-bar flat class="py-3">
                                    <v-toolbar-title>Incidentes asignados a mi</v-toolbar-title>

                                    <v-spacer></v-spacer>

                                    <v-text-field
                                    v-model="filterTextIncidenteForMe"
                                    class="filter-input custom-in"
                                    solo flat
                                    rounded append-icon="mdi-magnify"
                                    label="Filtrar incidentes"
                                    id="id"
                                    autocomplete="off"
                                    ></v-text-field>

                                </v-app-bar>
                                <v-card-text>
                                <v-data-table :headers="headers" :items="filteredIncidentesForMe" :loading="isLoading">
                                <template v-slot:body="{ items }">
                                    <tbody>
                                    <tr v-for="item in items" class="clickableRow" :key="item.incidenteId">
                                        <td @click="verDetalle(item.incidenteId)">{{ item.titulo }}</td>
                                        <td @click="verDetalle(item.incidenteId)">{{ item.prioridad.nombre }}</td>
                                        <td @click="verDetalle(item.incidenteId)">{{ item.departamento.nombre }}</td>
                                        <td @click="verDetalle(item.incidenteId)">
                                          <span v-if="item.usuarioAsignado" > {{item.usuarioAsignado.nombre}} {{item.usuarioAsignado.apellido}} </span>
                                          <span v-else >Sin asignar <v-icon color="warning">mdi-exclamation</v-icon></span>
                                        </td>
                                        <td align="center">
                                          <span v-if="item.estatus == 'I'"> Cerrado </span>
                                          <span v-else>
                                            <v-btn class="elevation-0" color="success" icon small @click="incidente = item; dialogCerrar = true;"><v-icon>mdi-check-circle-outline</v-icon></v-btn>
                                            <v-btn class="elevation-0" color="teal" icon small @click="setExtra(item)"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                          </span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </template>
                                </v-data-table>
                              </v-card-text>
                            </v-card>
                    </v-tab-item>
                    <v-tab-item class="px-3 py-2">
                            <v-card>
                                <v-app-bar flat class="py-3">
                                    <v-toolbar-title>Incidentes reportados por mi</v-toolbar-title>

                                    <v-spacer></v-spacer>

                                    <v-text-field
                                    v-model="filterTextIncidenteFromMe"
                                    class="filter-input custom-in"
                                    solo flat
                                    rounded append-icon="mdi-magnify"
                                    label="Filtrar incidentes"
                                    id="id"
                                    autocomplete="off"
                                    ></v-text-field>

                                </v-app-bar>
                                <v-card-text>
                                <v-data-table :headers="headers" :items="filteredIncidentesFromMe" :loading="isLoading">
                                <template v-slot:body="{ items }">
                                    <tbody>
                                    <tr v-for="item in items" class="clickableRow" :key="item.incidenteId">
                                        <td @click="verDetalle(item.incidenteId)">{{ item.titulo }}</td>
                                        <td @click="verDetalle(item.incidenteId)">{{ item.prioridad.nombre }}</td>
                                        <td @click="verDetalle(item.incidenteId)">{{ item.departamento.nombre }}</td>
                                        <td @click="verDetalle(item.incidenteId)">
                                          <span v-if="item.usuarioAsignado" > {{item.usuarioAsignado.nombre}} {{item.usuarioAsignado.apellido}} </span>
                                          <span v-else >Sin asignar <v-icon color="warning">mdi-exclamation</v-icon></span>
                                        </td>
                                        <td align="center">
                                          <span v-if="item.estatus == 'I'"> Cerrado </span>
                                          <span v-else>
                                            <v-btn class="elevation-0" color="pink" icon small @click="incidente = item; dialogAsignar = true;"><v-icon>mdi-account-circle-outline</v-icon></v-btn>
                                            <v-btn class="elevation-0" color="teal" icon small @click="setExtra(item)"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                          </span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </template>
                                </v-data-table>
                                </v-card-text>
                            </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para Asignar Usuario a incidente -->
    <v-dialog v-model="dialogAsignar" max-width="600px" v-if="incidente">
      <v-card class="mx-auto">
        <v-toolbar
          flat dark
          color="primary"
        >
          <v-card-title class="headline" style="color:white;"  primary-title>Asignar Usuario</v-card-title>
        </v-toolbar>
        <v-card-text class="px-7">
          <h1 class="display-1 font-weight-thin mb-4 text-center my-7">Código de Incidente: {{incidente.incidenteId}}</h1>
          <p class="font-weight-regular my-5"><b>Incidente:</b> {{incidente.titulo}} </p>
          <v-select
            prepend-icon="mdi-clipboard-account-outline"
            :items="listaUsuarios"
            v-model="incidente.usuarioAsignadoId"
            item-text="nombre"
            item-value="usuarioId"
            label="Usuario Asignado"
            outlined
            dense
          ></v-select>
        </v-card-text>
        <v-card-actions class="py-5 px-7">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialogAsignar = false">Cancelar</v-btn>
            <v-btn color="primary" v-on:click="asignarIncidente('asignar')">Asignar</v-btn>
        </v-card-actions>            
      </v-card>
    </v-dialog>
    <!-- Dialog para Asignar Usuario a incidente -->

    <!-- Dialog para Cerrar Incidente -->
    <v-dialog v-model="dialogCerrar" max-width="600px" v-if="incidente">
      <v-card class="mx-auto">
        <v-toolbar
          dark flat
          color="primary"
        >
          <v-card-title class="headline" style="color:white;"  primary-title>Cerrar Incidente</v-card-title>
        </v-toolbar>
        <v-card-text class="px-7">
          <h1 class="display-1 font-weight-thin mb-4 text-center my-7">Código de Incidente: {{incidente.incidenteId}}</h1>
          <p class="font-weight-regular my-5"><b>Incidente:</b> {{incidente.titulo}} </p>
          <p class="font-weight-regular my-5"><b>Descripción:</b> {{incidente.descripcion}} </p>
          <v-textarea prepend-icon="mdi-text-box-multiple" label="Comentario de cierre"  outlined v-model="incidente.comentarioCierre"></v-textarea>
        </v-card-text>
        <v-card-actions class="py-5 px-7">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialogCerrar = false">Cancelar</v-btn>
            <v-btn color="primary" v-on:click="cerrarIncidente('cerrar')">Cerrar</v-btn>
        </v-card-actions>            
      </v-card>
    </v-dialog>
    <!-- Dialog para Cerrar Incidente -->

    <!-- Dialog para informacion extra -->
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
        <v-card-text class="px8 py-5">
          <p><b>Creado Por:</b> {{infoExtra.creador.nombre}} {{infoExtra.creador.apellido}}</p>
          <p><b>Fecha de Registro:</b> {{formatTimeOff(infoExtra.fechaRegistro)}}</p>
          <p><b>SLA:</b> {{infoExtra.prioridad.sla.cantidadHoras}} horas</p>
          <p v-if="infoExtra.retraso"><b>Tiempo de Retraso:</b> {{infoExtra.retraso}}</p>
          <slot v-if="infoExtra.modificador">
            <v-divider></v-divider><br>
            <p><b>Modificado Por:</b> {{infoExtra.modificador.nombre}} {{infoExtra.modificador.apellido}}</p>
            <p><b>Fecha de Modificacion:</b> {{formatTimeOff(infoExtra.fechaModificacion)}}</p>
          </slot>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Dialog para informacion extra -->

  </v-container>
</template>

<script>
import popupNuevo from "~/components/incidencia/popupNuevo";
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
    this.getUsuarios();
    this.isLoading = false;
  },

  data() {
    return {
      isLoading: true,
      listaIncidentes: [],
      incidentesForMe: [],
      incidentesFromMe: [],
      filterTextIncidente: '',
      filterTextIncidenteForMe: '',
      filterTextIncidenteFromMe: '',
      host: null,
      user: null,
      headers: [
        { text: "Título", value: 'Titulo' },
        { text: "Prioridad", value: 'PrioridadId' },
        { text: "Departamento", value: 'DepartamentoId' },
        { text: "Usuario Asignado", sortable: false },
        { text: "Acciones", align: "center", sortable: false }
      ],
      tab: null,
       items: [{ tab: "Listado de Incidentes" },
               { tab: "Asignados a Mi" },
               { tab: "Reportados Por Mi" }],
      dialogAsignar: false,
      dialogCerrar: false,
      dialogExtra: false,
      infoExtra: null,
      incidente: null,
      listaUsuarios: []
    };
  },

  methods: {
    async getAll() {
        try{
            let token = this.user.token
            let incidentes = await axios.get(this.host+"api/Incidente/ListAll", { 'headers': { 'Authorization': `Bearer ${token}` } });
            this.listaIncidentes = incidentes.data;

            let incidentesForMe = await axios.get(this.host+"api/Incidente/ListForMe/"+this.user.usuarioId, { 'headers': { 'Authorization': `Bearer ${token}` } });
            this.incidentesForMe = incidentesForMe.data;

            let incidentesFromMe = await axios.get(this.host+"api/Incidente/ListFromMe/"+this.user.usuarioId, { 'headers': { 'Authorization': `Bearer ${token}` } });
            this.incidentesFromMe = incidentesFromMe.data;

            console.log('iniciamos')
            console.log(this.listaIncidentes)
            console.log(this.incidentesForMe)
            console.log(this.incidentesFromMe)

        }catch(error){
            console.log(error.response)
        }
        
    },

    async getUsuarios(){
      try{
        let token = this.user.token;
        let usuarios = await axios.get(this.host+"api/Usuario/List", { 'headers': { 'Authorization': `Bearer ${token}` } });
        this.listaUsuarios = usuarios.data;

      }catch(error){
        console.log(error.response)
      }
    },

    verDetalle(id){
      this.$router.push({ path: '/incidencia/detalle', query: { id } })
    },

    async asignarIncidente(){
      try{
        let token = this.user.token;
        this.incidente.modificadoPor = this.user.usuarioId;
        console.log(this.incidente);
        let result = await axios.put(this.host+"api/Incidente/Asign", this.incidente, { 'headers': { 'Authorization': `Bearer ${token}` } });

        if(result){
          await this.getAll();
          this.dialogAsignar = false;
        }

      }catch(error){
        console.log(error);
      }
    },

    async cerrarIncidente(){
      try{
        let token = this.user.token;
        this.incidente.modificadoPor = this.user.usuarioId;
        let result = await axios.put(this.host+"api/Incidente/Close", this.incidente, { 'headers': { 'Authorization': `Bearer ${token}` } });

        if(result){
          await this.getAll();
          this.dialogCerrar = false;
        }

      }catch(error){
        console.log(error);
      }
    },

    actualizarDatos(){
        this.getAll();
    },

    async deleteSla(item){
      try{
        let result = await Swal.fire({
        title: 'Va a eliminar un incidente...',
        text: 'Está seguro que desea eliminar el incidente '+item.nombre+"?",
        showCancelButton: true,
        confirmButtonColor: '#1976D2',
        cancelButtonColor: '#FF6060',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cerrar'
        })

        if(result.value){
            let token = this.user.Token;
            let deleted = await axios.delete(this.host+"api/Incidente/Delete/"+item.incidenteId, { 'headers': { 'Authorization': `Bearer ${token}` } });
            
            if(deleted){
                await this.getAll();
            }
        }

        
        
      }catch(error){
        console.log(error);

        let text = "Ocurrió un error al eliminar el Sla"
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

    setExtra(item){
      let fecha = new Date().getTime();
      let fechaRegistro = new Date(item.fechaRegistro);
      let diff = (fecha - new Date(fechaRegistro).getTime())-(3600000*item.prioridad.sla.cantidadHoras);
      
      if(diff > 0){
        let days = Math.floor(diff / (24*60*60*1000));
        let daysms=diff % (24*60*60*1000);
        let hours = Math.floor((daysms)/(60*60*1000));
        let hoursms=diff % (60*60*1000);
        let minutes = Math.floor((hoursms)/(60*1000));
        let minutesms=diff % (60*1000);
        let sec = Math.floor((minutesms)/(1000));

        this.infoExtra = item;
        this.infoExtra.retraso = days+":"+hours+":"+minutes+":"+sec;
        this.dialogExtra = true;
        
      }else{
        this.infoExtra = item;
        this.dialogExtra = true;
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

    filtroIncidentes(incidentes,textoFiltro){
      try{
        if(!incidentes) return [];

        return incidentes
        .filter(
            e => e.titulo.toLowerCase().includes(textoFiltro.toLowerCase())
        )
      }catch(error){
        console.log(error);
      }
    }

  },

  computed: {

    filteredIncidentes(){
      return this.filtroIncidentes(this.listaIncidentes, this.filterTextIncidente)
    },
    
    filteredIncidentesForMe(){
      return this.filtroIncidentes(this.incidentesForMe, this.filterTextIncidenteForMe)
    },
    
    filteredIncidentesFromMe(){
      return this.filtroIncidentes(this.incidentesFromMe, this.filterTextIncidenteFromMe)
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

.v-tabs{
  border-bottom: 2px solid rgb(221, 219, 219);
  height: 44px!important;
  .v-tabs-slider-wrapper{
    bottom:2px;
  }

  .v-tab{
    text-transform: none;
  }
}

.v-item-group{
  background-color: transparent;
}

.clickableRow{
  cursor: pointer;
}

</style>