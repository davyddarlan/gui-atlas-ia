<template>
    <portal to="sidebar">
        <transition name="fade">
            <div class="cp side-bar wrapper" v-if="showSideBar">
                <div class="cp content-bar">
                    <div class="head">
                        <div v-on:click="closeSideBarEvent" class="close-btn">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div class="content" ref="content">
                        <div class="without-data" v-show="!load && !metadados.length && !marcadores.length">
                            <p class="text">A imagem não possui qualquer marcador ou 
                            metadados associado.</p>
                        </div>
                        <div class="load" v-show="load">
                            <div class="ui active inverted inline loader indeterminate"></div>
                            <p class="text">Carregando metadados e marcadores...</p>
                        </div>
                        <div class="section" v-show="marcadores.length">
                            <h2 class="title">Marcadores</h2>
                            <p class="text">Abaixo é apresentado um conjunto
                            de marcadores associados a fotografia. Cada
                            marcação representa uma característica que pôde
                            ser observada durante o registro e posterior análise.</p>
                            <div class="label" v-for="marcador in marcadores">{{ marcador.nome }}</div>
                        </div>
                        <div class="section" v-show="metadados.length">
                            <h2 class="title">METADADOS</h2>
                            <p class="text">Os metadados são informações produzidas e armazenadas 
                            pelo equipamento fotográfico e extraídas durante o upload das imagens no sistema. Algumas 
                            informações podem uteis para futuros registros, pois são atríbutos
                            que podem ser utilizados para configuração do equipamento, na tentativa de obter registros
                            semelhates a imagem atualmente apresentada.</p>
                            <div class="card">
                                <div class="section" v-for="metadado in metadados">
                                    <div class="head">{{ metadado.nome}}</div>
                                    <div class="data">{{ metadado.valor }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </portal>
</template>

<script>
    export default {
        props: {
            showSideBar: {
                type: Boolean,
                default: false,
            },
            id: {
                type: Number,
                default: null,
            }
        },
        data: function() {
            return {
                marcadores: [],
                metadados: [],
                load: false,
                loadData: false,
            }
        },  
        watch: {
            showSideBar: function(data) {
                if (data) {
                    this.loadMetaDados();
                }
            }
        },
        methods: {
            closeSideBarEvent: function() {
                this.$emit('close-side-bar');
                this.show = false;
            },
            loadMetaDados: function() {
                let params = new URLSearchParams();
                
                this.load = true;

                params.append('multimidia_id', this.id);

                this.axios({
                    method: 'POST',
                    url: '/api/especie/multimidia/exibir-metadados',
                    data: params,
                }).then((response) => {
                    this.marcadores = response.data.marcadores;
                    this.metadados = response.data.metadados;

                    this.load = false;

                    this.$refs.content.style.overflowY = 'scroll';
                }).catch((error) => {
                    
                });
            },
        }
    }
</script>

<style>
    /* starting animation */

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    /* ending animation */

    .cp.side-bar.wrapper {
        position: absolute;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
    }

    .cp.content-bar {
        position: fixed;
        top: 0; 
        right: 0;
        width: 350px;
        height: 100%;
        padding: 0;
        background: #464646;
        transition: transform 0.5s;
    }

    .cp.content-bar > .head { 
        height: 80px;     
        border-bottom: 1px solid #e4e4e4;
    }

    .cp.content-bar > .head .close-btn {
        position: absolute;
        top: 25px;
        left: 20px;
        width: 30px;
        height: 30px;
        background: #f5f5f5;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
        cursor: pointer;
        color: #464646;
    }

    .cp.content-bar > .content {
        position: relative;
        height: calc(100% - 85px);
        padding: 15px 25px 15px 30px;
        overflow-y: hidden;
        margin-top: 15px;
    }

    .cp.content-bar > .content > .load,
    .cp.content-bar > .content > .without-data {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #464646;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .cp.content-bar > .content > .load p,
    .cp.content-bar > .content > .without-data p {
        width: 150px;
        margin-top: 20px;
        text-align: center;
    }

    .cp.content-bar > .content > .section { margin-bottom: 20px; }

    .cp.content-bar > .content::-webkit-scrollbar {  width: 12px; }

    .cp.content-bar > .content::-webkit-scrollbar-track { background: #464646; }   

    .cp.content-bar > .content::-webkit-scrollbar-thumb {
        background-color: #9e9e9e;  
        border-radius: 20px;     
        border: 3px solid #464646; 
    }

    /* elementos do conteúdo */

    .cp.content-bar > .content .title {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 1em;
        margin-bottom: 15px;
        letter-spacing: 0.05em;
        color: #ffffff;
    }

    .cp.content-bar > .content .text {
        font-size: 0.85em;
        line-height: 1.8em;
        margin-bottom: 20px;
    }

    .cp.content-bar > .content .text { color: #e4e4e4; }

    /* labels */

    .cp.content-bar > .content .label {
        background: #afccff;
        display: inline-block;
        max-width: 270px;
        padding: 9px 15px 9px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9em;
        margin: 0 0.3em 0.8em 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    /* card */

    .cp.content-bar > .content .card {
        width: 100%;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        border-radius: 5px;
        display: table;
        background: #f5f5f5;
    }

    .cp.content-bar > .content .card > .section {
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }

    .cp.content-bar > .content .card > .section > .head {
        font-size: 0.75em;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 10px;
        color: #464646;
    }

    .cp.content-bar > .content .card > .section > .data {
        font-size: 0.9em;
        color: #727272;
        line-height: 1.3em;
    }
</style>