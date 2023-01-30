<template>
    <modal noPadding class="pg-aves-paraty" class-name="pg-aves-paraty" :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <h1>Aves de Paraty</h1>
        </template>
        <template v-slot:body>
            <div class="banner">
                <div class="text-area">
                    <h1 class="titulo">EXPOSIÇÃO ABERTA INTERATIVA</h1>
                    <h1 class="titulo">AVES DE PARATY 2022</h1>
                    <p class="descricao">
                        A mostra celebra a exuberância da natureza local em painéis fotográficos.
                    </p>
                    <ul class="detalhes">
                        <li><i class="fa-sharp fa-solid fa-location-dot"></i> Local: <a href="https://www.google.com/maps/place/Restaurante+Galeria+Do+Engenho/@-23.2196716,-44.7147566,19z/data=!4m5!3m4!1s0x9d6d26ab1ee35f:0x6899a44f5463d44f!8m2!3d-23.2196617!4d-44.7147565?shorturl=1" target="__blank">Rua da Lapa 374 (Restaurante Galeria do Engenho no Centro Histórico)</a></li>
                        <li><i class="fa-regular fa-clock"></i> Horário: seg/seg 12h às 23h.</li>
                    </ul>
                </div>
            </div>
            <ul class="list">
                <div class="load" v-if="load">
                    <div class="ui active inline loader"></div>
                    <p>Carregando lista de aves de Paraty...</p>
                </div>
                <li v-for="list in list" v-on:click="openCard(list)">
                    <img class="capa" :src="$store.state.baseURL + '/capas/' + list.capa" />
                    <div class="descricao">
                        <p class="titulo">{{ list.nome_cientifico }}</p>
                        <p class="sub_titulo">{{ list.nome_popular }}</p>
                    </div>
                </li>
            </ul>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';

    export default {
        components: {
            'modal': ModalComponent,
        },
        props: {
            show: false,
        },
        data: function() {
            return {
                list: null,
                load: false,
            }
        },
        mounted: function() {
            this.loadData();
        },
        methods: {
            loadData: function() {
                this.load = true;

                this.axios({
                    method: 'GET',
                    url: '/api/especie/public/listar-especie-marcador?nome=Paraty',
                }).then((response) => {
                    this.list = response.data;

                    setTimeout(() => {
                        this.load = false;
                    }, 2000);
                }).catch((error) => {
                    this.load = false;
                });
            },
            openCard: function(data) {
                this.$emit('close');

                this.$emit('open', {
                    uuid: data.uuid,
                    title: data.nome_cientifico,
                })
            }
        }
    }
</script>

<style>
    .pg-aves-paraty .banner {
        position: relative;
        width: 100%;
        height: 220px;
        background: #ece1cd;
        background-size: cover;
        margin-bottom: 30px;
    }

    .pg-aves-paraty .banner > .text-area {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        padding: 30px;
    }

    .pg-aves-paraty .banner > .text-area > .titulo {
        font-family: "Alegreya";
        font-size: 1.3em;
        color: #ece1cd;
        background: #c01003;
        display: inline-block;
        padding: 5px;
    }

    .pg-aves-paraty .banner > .text-area > .descricao {
        font-size: 0.85em;
        line-height: 1.2em;
        margin-top: 10px;
    }

    .pg-aves-paraty .banner > .text-area > .detalhes { margin-top: 20px; }

    .pg-aves-paraty .banner > .text-area > .detalhes li {
        font-size: 0.75em;
        font-weight: bold;
        padding-bottom: 8px;
    }

    .pg-aves-paraty .banner > .text-area > .detalhes li a { color: #57b6ec; }

    .pg-aves-paraty .list .capa {
        width: 150px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    
    .pg-aves-paraty .list {
        position: relative;
        max-height: 290.19px;
        overflow-y: auto;
        margin-right: 5px;
        padding: 0 30px 30px 30px;
    }

    .pg-aves-paraty .list .load {
        position: absolute;
        top: 0;
        left: 0;
        background: #ffffff;
        width: 100%;
        height: 100%;
        min-height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .pg-aves-paraty .list .load div { margin-bottom: 20px; }

    .pg-aves-paraty .list .load p { 
        width: 150px;
        text-align: center;
        line-height: 1.3em;
        font-size: 0.95em;
    }

    .pg-aves-paraty .list::-webkit-scrollbar-track { background: #ffffff; }   

    .pg-aves-paraty .list::-webkit-scrollbar-thumb {
        background-color: #9e9e9e;  
        border-radius: 20px;     
        border: 3px solid #ffffff; 
    }

    .pg-aves-paraty .list li { 
        width: 100%; 
        display: table;
        margin-bottom: 20px;
        background: #ececec;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
    }

    .pg-aves-paraty .list li:last-child { margin-bottom: 0; }

    .pg-aves-paraty .list li:hover { background: #f5f5f5; }

    .pg-aves-paraty .list .capa,
    .pg-aves-paraty .list .descricao { float: left; }

    .pg-aves-paraty .list .descricao { 
        width: calc(100% - (20px + 150px));
        margin-left: 20px; 
    }

    .pg-aves-paraty .list .descricao > .titulo {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 5px;
    }

    .pg-aves-paraty .list .descricao > .sub_titulo { font-size: 1.2em; }

    .pg-aves-paraty .list .descricao > .titulo,
    .pg-aves-paraty .list .descricao > .sub_titulo
    {
        display: inline-block;
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media only screen and (max-width: 490px) {
        .pg-aves-paraty .list .descricao > .titulo { font-size: 1em; }

        .pg-aves-paraty .list .descricao > .sub_titulo { font-size: 0.85em; }
    }

    @media only screen and (max-width: 430px) {
        .pg-aves-paraty .list .capa {
            width: 100%;
            height: auto;
        }

        .pg-aves-paraty .list .capa,
        .pg-aves-paraty .list .descricao { clear: both; }

        .pg-aves-paraty .list .descricao {
            width: calc(100% - 40px);
            margin-right: 20px;
        }

        .pg-aves-paraty .list .descricao > .titulo,
        .pg-aves-paraty .list .descricao > .sub_titulo
        { width: 100%; }

        .pg-aves-paraty .list li { 
            border-top-right-radius: 0;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            padding-bottom: 20px;
        }

        .pg-aves-paraty .list .capa {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            border-bottom-left-radius: 0;
        }
    }

    @media only screen and (max-width: 590px) {
        .pg-aves-paraty .banner > .text-area > .titulo {
            font-size: 1.1em;
            display: block;
            padding: 2px;
        }
    }
</style> 