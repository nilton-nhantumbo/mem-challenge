<template>
  <div class="ramRegionz"></div>
</template>

<script>
    export default {
        data: function () {
            return {
                mounted: false
            }
        },

        props: {
            tipo: {
                default: 'sucesso'
            }
        },

        mounted() {
            this.mounted = true;
        },

        computed: {
            typeModal() {
                if (this.tipo == 'aviso') {
                    return 'modal-header warning-header';
                }
                if (this.tipo == 'erro') {
                    return 'modal-header error-header';
                }

                return 'modal-header success-header'
            }
        }

    }
</script>