<script>
export default {
    name: 'App',
    data() {
      return{
        refreshComp: 0
      }
    },
    methods:{
      change(){
        this.refreshComp += 1
      }
    }
}
</script>