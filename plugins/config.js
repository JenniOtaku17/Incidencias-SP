import Vue from 'vue';

const config = {
    host: "https://localhost:44317/"
}

Vue.prototype.$config = config;

export const zconfig = config;