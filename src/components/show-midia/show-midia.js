export default {
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
    watch: {
        show: function(data) {
            if (data) {
                let tipo = this.url.split('.');

                this.load = false;
    
                tipo = tipo[tipo.length - 1];
    
                if (tipo == 'jpeg') {
                    this.tipo = 'imagem';
                } else if (tipo == 'mp4') {
                    this.tipo = 'video';
                } else if (tipo == 'mp3') {
                    this.tipo = 'audio';
                }
    
                this.axios({
                    method: 'GET',
                    url: '/api/especie/multimidia/abrir-midia/' + this.url,
                    responseType: 'blob',
                }).then((response) => {
                    this.fullPath = window.URL.createObjectURL(response.data);

                    window.removeEventListener('resize', this.resizeListener, true);
    
                    if (this.tipo == 'video') {
                        this.$refs.video.load();

                        this.$refs.midia.style.maxWidth = '100%';    
                        this.$refs.midia.style.height = 'auto';

                        this.load = true;
                    }  else if (this.tipo == 'audio') {
                        this.$refs.audio.load();

                        this.$refs.midia.style.maxWidth = '100%';    
                        this.$refs.midia.style.height = 'auto';

                        this.load = true;
                    } else if (this.tipo == 'imagem') {
                        this.$refs.imagem.onload = () => {
                            this.$refs.midia.style.transition = 'width 0.5s, height 0.5s';
                            this.scaleImage();

                            this.resizeListener = () => {
                                this.$refs.midia.style.transition = 'none';

                                this.scaleImage();
                            };

                            this.resizeListener = window.addEventListener('resize', this.resizeListener, true);
    
                            setTimeout(() => {
                                this.load = true;
                            }, 500);  
                        }
                    }
                }).catch((error) => {
                    // error
                });
            }
        },
        dados: function(dados) {
            this.dados.titulo = dados.titulo;
            this.dados.descricao = dados.descricao;
        },
    },
    data: function() {
        return {
            tipo: null,
            fullPath: null,
            load: false,
            resizeListener: null,
        }
    },
    methods: {
        close: function() {
            this.$emit('close');
        },
        scaleImage: function() {
            if (window.innerWidth >= 700) {
                if (this.$refs.imagem.naturalWidth >= 700) {
                    let newHeight = 700 * this.$refs.imagem.naturalHeight / this.$refs.imagem.naturalWidth;
                    
                    this.$refs.midia.style.width = '700px';    
                    this.$refs.midia.style.height = newHeight + 'px';
                } else {
                    this.$refs.midia.style.width = this.$refs.imagem.naturalWidth + 'px';
                    this.$refs.midia.style.height = this.$refs.imagem.height + 'px';
                }
            } else {
                let newHeight = this.$refs.midia.clientWidth * this.$refs.imagem.naturalHeight / this.$refs.imagem.naturalWidth;
 
                this.$refs.midia.style.height = newHeight + 'px';
            }
        },
    }
}