export default {
    props: {
        position: {
            type: Object,
            default(props) {
                return {
                    x: 20,
                    y: 20
                }
            }
        },
        title: {
            type: String,
            default: 'No Title',
        },
    },
    data: function() {
        return {
            start: false,
            bar: null,
            card: null,
            showCard: true,
            cursorPosition: {
                x: null,
                y: null,
            },
        }   
    },
    mounted: function() {
        this.bootstrap();
    },
    filters: {
        nomeCientifico: function(value) {
            let spliters = value.split(' '), text = '';

            spliters[spliters.length - 1] = (spliters[spliters.length - 1]).toLowerCase();

            spliters.forEach(function(data) {
                text += data + ' ';
            });

            return text;
        },
    },
    methods: {
        bootstrap: function() {
            this.bar = this.$refs.bar;
            this.card = this.$refs.card;

            /*this.orderCards();*/
            this.translate(this.position.x, this.position.y);

            this.startEvents();
        },
        translate: function(x, y) {
            this.card.style.transform = 'translate('+ x + 'px,' + y + 'px)';
        },
        orderCards: function() {
            var cardsLength = this.$parent.$children.length;

            for (var x = 0; x < cardsLength; x++) {
                if (this.$parent.$children[x].$el._prevClass == 'card') {
                    this.$parent.$children[x].$el.style.zIndex = x;
                }
            }
        },
        close: function() {
            this.showCard = false;
            this.$emit('closed');
            //this.$destroy();
            //this.card.parentNode.removeChild(this.card);
        },
        minimize: function() {
            this.showCard = false;
            this.$emit('minimized', {
                title: this.title,
                ref: this,
            });
        },
        moveCard: function(event) {
            if (this.start) {
                var x, y;

                if (event.type == 'mousemove') {
                    x = (event.clientX - this.cursorPosition.x - 75);
                    y = (event.clientY - this.cursorPosition.y);
                } else if (event.type == 'touchmove') {
                    x = (event.touches[0].clientX - this.cursorPosition.x - 75);
                    y = (event.touches[0].clientY - this.cursorPosition.y);
                }

                this.position.x = x;
                this.position.y = y;

                this.translate(x, y);

                this.$emit('initMove');
            }
        },
        startCard: function(event) {
            this.start = true;

            if (event.type == 'mousedown') {
                this.cursorPosition.x = event.offsetX;
                this.cursorPosition.y = event.offsetY; 
            } else if (event.type == 'touchstart') {
                this.cursorPosition.x = event.touches[0].clientX - (this.position.x + 75);
                this.cursorPosition.y = event.touches[0].clientY - (this.position.y);
            }
        },
        startEvents: function() {
            this.bar.addEventListener('mousedown', (event) => {
                this.startCard(event);
            });

            this.bar.addEventListener('touchstart', (event) => {
                this.startCard(event);
            });

            this.bar.addEventListener('mouseup', (event) => {
                this.start = false;
            });

            this.bar.addEventListener('touchend', (event) => {
                this.start = false;
            });

            document.addEventListener('mousemove', (event) => {
                this.moveCard(event);
            });

            document.addEventListener('touchmove', (event) => {
                this.moveCard(event);
            });
        }
    }
}