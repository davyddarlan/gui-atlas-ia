/* libs */
import VueRouter from 'vue-router';
import Vue from 'vue';
import PortalVue from 'portal-vue'
import routesList from './routes/routes';
import axios from 'axios';
import VueAxios from 'vue-axios';
import $ from 'jquery';
import Vuex from 'vuex';

/* semantic standalone */
import 'fomantic-ui/dist/components/dimmer.js';
import 'fomantic-ui/dist/components/dimmer.css';
import 'fomantic-ui/dist/components/transition.js';
import 'fomantic-ui/dist/components/transition.css';
import 'fomantic-ui/dist/components/checkbox.js';
import 'fomantic-ui/dist/components/checkbox.css';
import 'fomantic-ui/dist/components/dropdown.js';
import 'fomantic-ui/dist/components/dropdown.css';
import 'fomantic-ui/dist/components/form.js';
import 'fomantic-ui/dist/components/form.css';
import 'fomantic-ui/dist/components/modal.js';
import 'fomantic-ui/dist/components/modal.css';
import 'fomantic-ui/dist/components/button.css';
import 'fomantic-ui/dist/components/popup.js';
import 'fomantic-ui/dist/components/popup.css';
import 'fomantic-ui/dist/components/label.css';
import 'fomantic-ui/dist/components/grid.css';
import 'fomantic-ui/dist/components/icon.css';
import 'fomantic-ui/dist/components/loader.css';
import 'fomantic-ui/dist/components/search.js'; 
import 'fomantic-ui/dist/components/search.css'; 
import 'fomantic-ui/dist/components/toast.js'; 
import 'fomantic-ui/dist/components/toast.css'; 
import 'fomantic-ui/dist/components/input.css'; 
import 'fomantic-ui/dist/components/api.js'; 
import 'fomantic-ui/dist/components/divider.css'; 
import 'fomantic-ui/dist/components/card.css'; 

import '@splidejs/splide/dist/js/splide.js';
import '@splidejs/splide/dist/css/splide.min.css';

/* style */
import './assets/styles/app.css';

Vue.use(PortalVue);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        baseURL: 'http://test.com',
        user: {
            status: false,
            role: '',
            token: '',
            primeiroNome: '',
            sobrenome: '',
            sexo: '',
            dataNascimento: '',
        },
    },
    mutations: {
        setStatus: function(state, value) {
            state.user.status = value;
        },
        setRole: function(state, value) {
            state.user.role = value;
        },
        setToken: function(state, value) {
            state.user.token = value;

            localStorage.setItem('__token', value);
        },
        setSobrenome: function(state, value) {
            state.user.sobrenome = value;
        },
        setPrimeiroNome: function(state, value) {
            state.user.primeiroNome = value;
        },
        setSexo: function(state, value) {
            state.user.sexo = value;
        },
        setDataNascimento: function(state, value) {
            state.user.dataNascimento = value;
        },
    }
});

axios.defaults.baseURL = store.state.baseURL;

// list of routes
const routes = routesList();

// starting
const router = new VueRouter({
    mode: 'history',
    routes
});

const app = new Vue({
    el: '#app',
    router,
    store,
    mounted: function() {
        let token = localStorage.getItem('__token');

        this.interceptorRequest();

        if (token) {
            this.$store.commit('setToken', token);

            this.loadUserProfile();
        }
    },
    methods: {
        loadUserProfile: function() {
            this.axios({
                method: 'GET',
                url: '/api/especie/user/ler-perfil',
            }).then((response) => {
                this.$store.commit('setRole', response.data.roles);
                this.$store.commit('setSobrenome', response.data.sobrenome);
                this.$store.commit('setPrimeiroNome', response.data.primeiro_nome);
                this.$store.commit('setSexo', response.data.sexo);
                this.$store.commit('setDataNascimento', response.data.data_nascimento);
                this.$store.commit('setStatus', true);
            }).catch((error) => {
                // ERROR
                localStorage.removeItem('__token');
            });
        },
        interceptorRequest: function() {
            this.axios.interceptors.request.use((config) => {
                // Do something before request is sent
                config.headers['X-AUTH-TOKEN'] = this.$store.state.user.token;

                return config;
            }, (error) => {
                // Do something with request error
                return Promise.reject(error);
            });
        }
    }
});