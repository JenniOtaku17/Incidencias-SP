<template>
  <div>
    <v-app style="background:transparent!important;">  
      <v-row>
            <v-col class="text-align:center; py-10">
                <v-card class="formContainer mx-auto my-10" elevation="10" max-width="70%">
                    <v-row>
                        <v-col cols="12" sm="7">
                            <img src="/task.svg" width="100%" class="imgLogin"/>
                        </v-col>
                        <v-col cols="12" sm="5" style="padding-left:50px">
                            <h3 class="font-weight-medium" style="font-size:50px">Login</h3>
                            <div v-if="error" style="color:red; font-size:12px; margin-bottom:5%; margin-top:5%; text-align:left;">
                                <span >*{{ error }}</span>
                            </div>
                            <v-text-field
                                color="primary" v-model="form.email" label="Correo electrónico" required>
                            </v-text-field>
                            <v-text-field
                                v-model="form.password" label="Contraseña" required
                                    :type="show ? 'text' : 'password'" color="primary"
                                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                    hint="Almenos 6 caracteres"
                                    @click:append="show = !show">
                            </v-text-field>
                            <br>
                            <v-btn
                                block depressed color="primary" elevation="0" v-on:click="login()"><span style="color:#fff!important;">Acceder</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
      </v-row>
    </v-app>
   </div>
</template> 

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {

    layout: "login",
    
    middleware: 'notauth',
    
    data: () => ({
        form : {
            email : '',
            password: ''
        },
        show: false,
        error: null,
        dialogPassword: false,
        email: null,
        host: null,
    }),
    mounted(){
        this.host = this.$config.host;
        this.$vuetify.theme.dark = false;
    },
    methods: {
        async login(){
            try{
                let data = {
                    NombreUsuario: this.form.email,
                    Contrasena: this.form.password
                }
                let result = await axios.post(this.host+"api/Auth/Login", data);
                console.log(result);
                
                if(result.data && result.data.token){
                    this.$cookies.set('user', JSON.stringify(result.data));
                    this.$router.push({ path: '/' })
                }else{
                    this.error = "El correo y la contraseña no coinciden";
                }

            }catch(error){
                console.log(error);
            }
        }
    }

}
</script>
<style scoped>

    .formContainer{
        margin-top:5%!important;
        padding:5%;
        text-align:center;
        z-index: 2;
    }

    .imgLogin{
        border-right: 2px solid rgb(209, 208, 208);
    }

</style>