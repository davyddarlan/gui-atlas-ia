export default {
    data: function() {
        return {
            adminRole: false,
        }
    },
    mounted: function() {
        this.adminRole = this.isThereRole('ROLE_ADMIN');
    },
    watch: {
        '$store.state.user.role': function(data) {
            this.adminRole = this.isThereRole('ROLE_ADMIN');
        },
    },
    methods: {
        includes: function(element, start) {
            for (let i = 0; i < element.length; i++) {
                if (element[i] == start) {
                    return true;
                }
            }

            return false;
        },
        isThereRole: function(role) {
            return this.includes(this.$store.state.user.role, role);
        },
    }
}