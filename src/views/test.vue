<template>
    <div>
        12345
    </div>
</template>
<script>
import api from '@/apis/test.js';

export default {
    data() {
        return {
            es: null
        }
    },
    async mounted() {
        // await api.test();
        this.es = new EventSource('http://localhost:3000/eventSource');
        this.es.onopen = (e) => {
            console.log('open---', e);
        }
        this.es.onmessage = (e) => {
            console.log('message---', e);
        }
        this.es.onerror = (e) => {
            console.log('error---', e);
        }
        /* es.addEventListener('message', (e) => {
            console.log('message---', e.data);
        })
        es.addEventListener('foo', (e) => {
            console.log('foo---', e);
        })
        es.addEventListener('event', (e) => {
            console.log('event---', e);
        })
        es.addEventListener('error', (e) => {
            console.log('error---', e);
        }) */
    },
    destroyed() {
        this.es.close();
    }
}
</script>