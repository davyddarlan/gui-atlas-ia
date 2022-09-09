<template>
    <modal class-name="pg-compartilhar-especie" mini :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Compartilhar espécie</p>
        </template>
        <template v-slot:body>
            <canvas class="__qr-code" ref="qrCode"></canvas>
            <div class="ui fluid action input">
                <input ref="inputLink" type="text" v-bind:value="url">
                <button class="ui primary right labeled icon button" v-on:click="copiarLink">
                    <i class="copy icon"></i>
                    Copiar
                </button>
            </div>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';
    import QRCode from 'qrcode';

    export default {
        components: {
            'modal': ModalComponent,
        },
        props: {
            show: false,
            uuid: {
                type: String,
                default: '',
            },
        },
        data: function() {
            return {
                url: 'https://atlas-ia.com' + '/' + this.uuid,
            }
        },
        watch: {
            show: function(data) {
                if (data) {
                    setTimeout(() => {
                        this.criarQRCode();
                    }, 100);
                }
            },
        },
        methods: {
            criarQRCode: function() {
                QRCode.toCanvas(this.$refs.qrCode, this.url, {
                    width: 250,
                    margin: 2,
                });
            },
            copiarLink: function() {
                let input = this.$refs.inputLink; 

                input.select();
                input.setSelectionRange(0, 9999);
                document.execCommand('copy');
            },
        }
    }
</script>

<style>
    .pg-compartilhar-especie .__qr-code {
        display: block;
        margin: 0 auto 30px auto;
    }
</style> 