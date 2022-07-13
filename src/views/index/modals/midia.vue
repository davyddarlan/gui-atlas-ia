<template>
    <!--<modal class-name="midia" :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Mídia</p>
        </template>
        <template v-slot:body>
            <h1 class="__titulo">{{ dados.titulo }}</h1>
            <template v-if="tipo == 'imagem'">
                <img v-bind:src="fullPath" class="__format" />
            </template>
            <template v-if="tipo == 'video'">
                <video controls class="__format" ref="video">
                    <source v-bind:src="fullPath" type="video/mp4">
                </video>
            </template>
            <template v-if="tipo == 'audio'" class="__format">
                <audio controls ref="audio" style="width:100%;">
                    <source v-bind:src="fullPath" type="audio/mpeg">
                </audio>
            </template>
            <p class="__descricao">{{ dados.descricao }}</p>
        </template>
    </modal>-->
    <show-midia :show="show" v-on:close="$emit('close')" :url="url" :dados="dados"></show-midia>
</template>

<script>
    import ShowMidia from '../../../components/show-midia/show-midia.vue';

    export default {
        components: {
            'show-midia': ShowMidia,
        },
        props: {
            show: false,
            url: null,
            dados: {
                type: Object,
                default: function() {
                    return {
                        titulo: '',
                        descricao: '',
                    }
                }
            },
        },
    }
</script>

<style>
    .midia .__format {
        width: 100%;
        height: auto;
        border-radius: 5px;
    }

    .midia .__titulo {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .midia .__descricao { 
        margin-top: 20px;
        font-size: 1em;
        line-height: 1.3em;
    }
</style>