export default {
  data() {
    return {
      contextMenu: {
        currentIndex: 0,
        currentTarget: null,
        isOpenContextMenu: false,
        clientX: 0,
        clientY: 0
      }
    };
  },
  methods: {
    handleContextMenu(e, item, index) {
      e.preventDefault();
      let cm = this.contextMenu;
      cm.isOpenContextMenu = true;
      cm.clientY = e.clientX;
      cm.clientX = e.clientY;
      cm.currentTarget = item;
      cm.currentIndex = index;
    }
  }
};
