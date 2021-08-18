<template>
  <div class="wrapper">
    <div class="nav">
      <h1>Onlybands</h1>
      <div class="login" v-on:click="login()">
        <h1>Login</h1>
      </div>
    </div>
    <div class="spinner-wrapper">
      <div class="spinner">

      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'home',
  data(){
    return {

    }
  },

  methods: {
    login() {
      this.$router.push({ path: '/login'});
    }
  }


}
</script>

<style>
.v-application--wrap {
  background-color: #000;
}
</style>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}

.nav {
  width: 100%;

  padding: 20px 40px 20px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login {
  width: 120px;
  height: 60px;

  border: 3px solid #fff;
  border-radius: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-wrapper {
  width: 100%;
  height: 900px;

  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes rotate {
  from {
      transform: rotate(0deg);
  }
  to { 
      transform: rotate(360deg);
  }
}
 

@-webkit-keyframes rotate {
  from {
      -webkit-transform: rotate(0deg);
  }
  to { 
      -webkit-transform: rotate(360deg);
  }
}

.spinner {
	width: 450px;
	height: 450px;
	border:solid 3px #fff;
	border-radius: 50%;
	border-right-color: transparent;
	border-bottom-color: transparent;
	 -webkit-transition: all 0.5s ease-in;
    -webkit-animation-name:             rotate; 
    -webkit-animation-duration:         1.0s; 
    -webkit-animation-iteration-count:  infinite;
    -webkit-animation-timing-function: linear;
    	
    	 transition: all 0.5s ease-in;
    animation-name:             rotate; 
    animation-duration:         1.0s; 
    animation-iteration-count:  infinite;
    animation-timing-function: linear; 
}
</style>