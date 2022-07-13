<template>
    <div class="app artigo-conteudo">
        <div class="__logo"></div>
        <p class="__message">
            Ainda não há qualquer conteúdo 
            para esta área temática
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            uuid: {
                type: String,
                default: null,
            }
        },
        mounted: function() {
            this.$emit('loaded');
        },
    }
</script>

<style> 
    .app.artigo-conteudo {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100% !important;
    }

    .app.artigo-conteudo > .__logo {
        width: 100px;
        height: 100px;
        background: url(../../../assets/images/151585.png);
        background-size: 100px;
        margin: 0 0 10px 0;
    }

    .app.artigo-conteudo > .__message {
        width: 250px;
        text-align: center; 
        font-size: 0.9em;
        margin: 10px 0 15px 0;
        line-height: 1.3em;
    }
</style>