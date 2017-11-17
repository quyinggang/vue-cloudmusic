import collectMessage from '@/components/collectMessage';
export default {
  components: {
    collectMessage
  },
  data() {
    return {
      message: {
        isShow: false,
        status: null
      }
    };
  }
};
