<template>
    <modal :className="'modal-sobre'" :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            Sobre o Atlas iA
        </template>
        <template v-slot:body>
            <div class="__art"></div>
            <p>O Guia de Campo / The Field Guide</p>
            <p>Plataforma voltada para Naturalistas e Estudos Científicos</p>
            <p>Versão 1.0.0 - Disponível: O Guia de Aves do Brasil</p>
            <p>Copyright © Atlas iA inc. Todos os direitos reservados 2017 - 2022</p>
            <p>
                <a href="https://www.instagram.com/guiadeaves/" target="__blank">@guiadeaves</a> Birdwatching</a> - 
                <a href="https://www.instagram.com/Atlas.iaa/" target="__blank">@atlas.iaa</a> Atlas iA</a>
                <br> <span class="extra"><a href="mailto:contato@atlas-ia.com">Fale conosco</a> Paraty - RJ Brasil. CEP 24970-000</span>
            </p>
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
        }
    }
</script>

<style>
    .__modal.modal-sobre p {
        font-family: 'Alegreya';
        line-height: 1.2em;
        margin-bottom: 8px;
        text-align: center;
    }

    .__modal.modal-sobre p:last-child { margin-top: 30px; }

    .__modal.modal-sobre p a {
        color: #62aeea;
        text-decoration: none;
    }

    .__modal.modal-sobre p:nth-child(2) { 
        font-weight: 500; 
        text-align: center;
        margin-bottom: 10px;
    }

    .__modal.modal-sobre .__art { 
        margin: 0 auto 20px auto;
        width: 130px;
        height: 130px;
        background: url(../../../assets/images/985425.png);
        background-repeat: no-repeat;
        background-size: cover;
    }

    .__modal.modal-sobre .extra { font-size: 0.85em; }
</style>