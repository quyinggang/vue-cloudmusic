import { mapGetters } from 'vuex';
import themes from '@/api/theme';
export default {
  computed: {
    getCurrentTheme() {
      return this.$store.state.currentSkin;
    }
  },
  watch: {
    getCurrentTheme: function(val) {
      this.getTheme(val);
    }
  },
  created() {
    this.getTheme(this.getCurrentSkin());
  },
  methods: {
    ...mapGetters([
      'getCurrentSkin'
    ]),
    getTheme(val) {
      let skin = themes[val];
      this.theme = typeof skin === 'object' ? skin : (function() {
        let theme = themes['other'];
        theme.header = theme.aside.borderActive = theme.audio = val;
        return theme;
      }());
    }
  }
};
