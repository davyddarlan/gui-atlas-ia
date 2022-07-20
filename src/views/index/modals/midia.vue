<template>
    <show-midia :show="show" v-on:close="$emit('close')" :url="url" :dados="dados"></show-midia>
</template>

<script>
    import ShowMidia from '../../../components/show-midia/show-midia.vue';

    export default {
        components: {
            'show-midia': ShowMidia,
        },
        props: {
            show: {
                type: Boolean,
                default: false,
            },
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