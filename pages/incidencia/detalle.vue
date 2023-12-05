<template>
<div>
  <v-container >
    <v-row class="flex-center">
      <v-col cols="12" sm="9" class="flex-col">
        <v-card v-if="incidente"  > 
          <v-app-bar flat>
            <v-btn color="primary" text fab @click="goBack()">
              <v-icon>mdi-arrow-left-top-bold</v-icon>
            </v-btn>

            <v-spacer></v-spacer>
            
            <slot v-if="incidente.estatus == 'I'">
              <v-chip color="secondary" class="px-5 py-3">CERRADO</v-chip>
            </slot>
            <slot v-else>
              <v-chip v-if="retraso" color="red accent-4" class="px-5 py-3" style="color:#fff;">SLA: Retrasado</v-chip>
              <v-chip v-else color="green accent-4" class="px-5 py-3" style="color:#fff;">SLA: En tiempo</v-chip>
            </slot>

          </v-app-bar>
            <v-row class="mx-5 my-5 pb-10">
                  <v-col cols="12" sm="12">
                    <div class="flex-center flex-col">
                      <h1 class="display-1 font-weight-thin mb-4">
                        {{incidente.titulo}}
                      </h1>
                    </div>
                  </v-col>
                  <br>
                  <v-col cols="12" sm="6">
                      <span v-if="incidente.prioridad"><b>Prioridad:</b> {{incidente.prioridad.nombre}}</span>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <span v-if="incidente.departamento"><b>Departamento Asignado:</b> {{incidente.departamento.nombre}}</span>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <b>Usuario Asignado:</b>
                      <span v-if="incidente.usuarioAsignado"> {{incidente.usuarioAsignado.nombre}} {{incidente.usuarioAsignado.apellido}}</span>
                      <span v-else>
                        Sin asignar
                        <v-icon color="warning"
                          >mdi-exclamation</v-icon
                        >
                      </span>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <span v-if="incidente.usuarioReporta"><b>Reportado por:</b> {{incidente.usuarioReporta.nombre}} {{incidente.usuarioReporta.apellido}}</span>
                  </v-col>
                  <v-col cols="12" sm="12">
                      <span><b>Descripcion:</b> {{incidente.descripcion}}</span>
                  </v-col>

                  <slot v-if="incidente.fechaCierre">
                      <v-col cols="12" sm="6">
                          <span><b>Fecha de Cierre:</b> {{formatTimeOff(incidente.fechaCierre)}}</span>
                      </v-col>
                      <v-col cols="12" sm="6">
                          <span><b>Comentario de cierre:</b> {{incidente.comentarioCierre}}</span>
                      </v-col>
                  </slot>

                  <slot v-if="incidente.fechaModificacion">
                      <v-col cols="12" sm="6">
                          <span><b>Fecha de Modificacion:</b> {{formatTimeOff(incidente.fechaModificacion)}}</span>
                      </v-col>
                      <v-col cols="12" sm="6">
                          <span v-if="incidente.modificador"><b>Modificado Por:</b> {{incidente.modificador.nombre}} {{incidente.modificador.apellido}}</span>
                      </v-col>
                  </slot>
            </v-row>
            <v-divider></v-divider>
            <v-row class="py-10 justify-center">
                <div class="flex-center flex-col">
                    <h1 class="display-1 font-weight-thin mb-4">
                      Historial del Incidente
                    </h1>
                </div>
                <v-timeline>
                    <v-timeline-item
                      fill-dot
                      class="white--text mb-12"
                      color="secondary" large 
                      v-if="incidente.fechaCierre == null && (incidente.usuarioAsignadoId== user.usuarioId || incidente.usuarioReportaId== user.usuarioId || incidente.modificadoPor== user.usuarioId)"
                      >
                      <template v-slot:icon>
                      <v-icon color="white">mdi-comment-text-outline</v-icon>
                      </template>
                        <v-text-field
                        v-model="comentario"
                        hide-details
                        flat
                        label="Dejar Comentario"
                        solo
                        >
                        <template v-slot:append>
                            <v-btn
                            class="mx-0"
                            depressed text fab
                            @click="Comentar()"
                            >
                            <v-icon>mdi-send</v-icon>
                            </v-btn>
                        </template>
                        </v-text-field>
                  </v-timeline-item>
                  <slot v-if="historial.length">
                    <v-timeline-item
                    v-for="(his, i) in historial"
                    :key="i"
                    :color="his.color" small
                    >
                      <template v-slot:opposite>
                          <span
                          :class="`font-weight-bold ${his.color}--text`"
                          v-text="formatTimeOff(his.fechaRegistro)"
                          ></span>
                      </template>
                      <div class="py-4">
                          <h2 :class="`headline font-weight-light mb-4 ${his.color}--text`">
                          {{his.creador.nombre}}
                          </h2>
                          <div>
                          {{his.comentario}}
                          </div>
                      </div>
                    </v-timeline-item>
                  </slot>
                  <slot v-else>
                    <v-chip color="secondary">Todavía no hay acciones sobre este incidente</v-chip>
                  </slot>
                </v-timeline>
          
            </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  
  middleware : 'auth-this',

  async mounted() {
    try {
      this.host = await this.$config.host;
      this.user = await this.$cookies.get('user');
      let id = this.$route.query.id;

      let token = this.user.token
      let incidente = await axios.get(this.host+"api/Incidente/Get/"+ id, { 'headers': { 'Authorization': `Bearer ${token}` } });
      this.incidente = incidente.data;
      console.log(this.incidente);

      await this.getHistorial();
      await this.verifySLA();
      this.isLoading = false;

    } catch (error) {
      console.log("Ocurrió un problema buscando el incidente", error);
    }
  },

  data: () => ({
    isLoading: true,
    host: null,
    user: null,
    incidente: null,
    historial: [],
    comentario: null,
    retraso: null
  }),

  methods: {

      async getHistorial(){
          let token = this.user.token;
          let historial = await axios.get(this.host+"api/HistorialIncidente/List/"+this.$route.query.id, { 'headers': { 'Authorization': `Bearer ${token}` } });
          this.historial = historial.data;
          console.log(this.historial);
      },

      async Comentar(){
        try{
          let token = this.user.token;
          let data = {
              IncidenteId: this.$route.query.id,
              Comentario: this.comentario,
              Color: 'pink',
              CreadoPor: this.user.usuarioId
          }
          console.log(data)
          let result = await axios.post(this.host+"api/HistorialIncidente/Add", data, { 'headers': { 'Authorization': `Bearer ${token}` } });

          if(result){
              this.getHistorial();
              this.comentario = null;
          }

        }catch(error){
            console.log(error)
        }
      },

      verifySLA(){
        let fecha = new Date().getTime();
        let fechaRegistro = new Date(this.incidente.fechaRegistro);
        let diff = (fecha - new Date(fechaRegistro).getTime())-(3600000*this.incidente.prioridad.sla.cantidadHoras);
      
        if(diff > 0){
          this.retraso = true
        }else{
          this.retraso = false;
        }
      },

      goBack(){
        this.$router.go(-1);
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

  .v-timeline{
    text-align: center;
  }

</style>
