<template>
  <v-container class="full-height d-flex justify-center align-center" fluid>
    <ForgetPassword />
  </v-container>
</template>

<script>

import ForgetPassword from '@/components/ResetPassword';

export default {
  name: 'forget-password',
  components: { ForgetPassword }
}
</script>
