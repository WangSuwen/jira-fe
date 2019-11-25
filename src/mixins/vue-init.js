export default {
    methods: {
        // 路由跳转
        go (path, query, isLoading) {
            path = path.trim();// eslint-disable-line
            if (isLoading) {
                this.$store.commit('toggleFullPageLoading', true);
            }
            this.$router.push({path: path, query: query || {}});
        },
        // 路由跳转
        replace (obj) {
            this.$store.commit('toggleFullPageLoading', true);
            this.$router.replace(obj);
        }
    }
};
