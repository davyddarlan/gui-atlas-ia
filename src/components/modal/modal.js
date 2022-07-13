export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        hide: {
            type: Boolean,
            default: true,
        },
        mini: {
            type: Boolean,
            default: false,
        },
        className: {
            type: String,
            default: ''
        },
        closeButton: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        close: function() {
            this.$emit('close');
        }
    }
}