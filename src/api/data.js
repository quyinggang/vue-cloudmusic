import lyric from './lyric';
export default {
  sls: [
    {
      imgUrl: require('../assets/images/sl0.jpg'),
      title: '每日歌曲推荐',
      isShowNote: false,
      note: '根据你的个人口味每日更新'
    },
    {
      imgUrl: require('../assets/images/sl1.jpg'),
      title: '百首华语 ：连歌词都能写到一个人的心里',
      isShowPlay: false,
      note: '编辑推荐：精选华语歌曲'
    },
    {
      imgUrl: require('../assets/images/sl2.jpg'),
      title: '华语速爆新歌',
      isShowNote: false,
      isShowPlay: false,
      note: '编辑推荐：华语新歌，总有那么一首歌'
    },
    {
      imgUrl: require('../assets/images/sl3.jpg'),
      title: '百部动画原声｜百首治愈良药',
      isShowNote: false,
      isShowPlay: false,
      note: '编辑推荐：动漫原声，寻找二次元的"毒药"'
    },
    {
      imgUrl: require('../assets/images/sl4.jpg'),
      title: '【Magic】完全覆盖双耳的泡沫声',
      isShowNote: false,
      isShowPlay: false,
      note: '编辑推荐：根据你喜欢的单曲推荐'
    }
  ],
  mvs: [
    {
      id: '000001',
      src: require('../assets/data/mvs/yz.mp4'),
      imgUrl: require('../assets/images/yeziMV.jpg'),
      name: '野子',
      author: '沙宝亮',
      note: '编辑推荐：细腻的狂野',
      published: '2015-12-31',
      counts: 0,
      isShowNote: false
    },
    {
      id: '000002',
      src: require('../assets/data/mvs/pa.mp4'),
      imgUrl: require('../assets/images/pianaiMV.jpg'),
      name: '偏爱',
      author: '张芸京',
      note: '编辑推荐：仙剑奇侠传插曲',
      published: '2014-11-06',
      counts: 0,
      isShowNote: false
    },
    {
      src: '',
      imgUrl: require('../assets/images/yuanzhouMV.jpg'),
      name: '远走高飞',
      author: '金志文',
      note: '编辑推荐：追逐梦想，远走高飞',
      isShowNote: false
    },
    {
      src: '',
      imgUrl: require('../assets/images/kexiMV.jpg'),
      name: '可惜没如果',
      author: '林俊杰',
      note: '编辑推荐：可惜没如果...',
      isShowNote: false
    }
  ],
  fmSongs: [
    {
      id: '000001',
      src: require('../assets/data/musics/ax.mp3'),
      imgUrl: require('../assets/images/axian.jpg'),
      name: '暗香',
      author: '沙宝亮',
      lyric: lyric['ax'],
      album: '跨年演唱会',
      duration: '04:35',
      isActive: false
    },
    {
      id: '000002',
      src: require('../assets/data/musics/nl.mp3'),
      imgUrl: require('../assets/images/nianlun.jpg'),
      name: '年轮',
      author: '张碧晨',
      lyric: lyric['nl'],
      album: '花千骨 电视原声带',
      duration: '04:34',
      isActive: false
    },
    {
      id: '000003',
      src: require('../assets/data/musics/pa.mp3'),
      imgUrl: require('../assets/images/pianai.jpg'),
      name: '偏爱',
      author: '张芸京',
      lyric: lyric['pa'],
      album: '仙剑奇侠传三 电视原声带',
      duration: '03:32',
      isActive: false
    },
    {
      id: '000004',
      src: require('../assets/data/musics/lxsx.mp3'),
      imgUrl: require('../assets/images/sanxun.jpg'),
      name: '理想三旬',
      author: '陈鸿宇',
      lyric: lyric['lxsx'],
      album: '浓烟下的诗歌电台',
      duration: '03:30',
      isActive: false
    },
    {
      id: '000005',
      src: require('../assets/data/musics/yz.mp3'),
      imgUrl: require('../assets/images/yezi.jpg'),
      name: '野子',
      author: '沙宝亮',
      lyric: lyric['yz'],
      album: '江苏卫视 2016跨年演唱会',
      duration: '03:35',
      isActive: false
    }
  ],
  lastLeftSongs: [
    {
      id: '000001',
      src: require('../assets/data/musics/ax.mp3'),
      imgUrl: require('../assets/images/axian.jpg'),
      name: '暗香',
      author: '沙宝亮',
      lyric: lyric['ax'],
      album: '跨年演唱会',
      duration: '04:35',
      isActive: false
    },
    {
      id: '000002',
      src: require('../assets/data/musics/nl.mp3'),
      imgUrl: require('../assets/images/nianlun.jpg'),
      name: '年轮',
      author: '张碧晨',
      lyric: lyric['nl'],
      album: '花千骨 电视原声带',
      duration: '04:34',
      isActive: false
    },
    {
      id: '000003',
      src: require('../assets/data/musics/pa.mp3'),
      imgUrl: require('../assets/images/pianai.jpg'),
      name: '偏爱',
      author: '张芸京',
      lyric: lyric['pa'],
      album: '仙剑奇侠传三 电视原声带',
      duration: '03:32',
      isActive: false
    },
    {
      id: '000004',
      src: require('../assets/data/musics/lxsx.mp3'),
      imgUrl: require('../assets/images/sanxun.jpg'),
      name: '理想三旬',
      author: '陈鸿宇',
      lyric: lyric['lxsx'],
      album: '浓烟下的诗歌电台',
      duration: '03:30',
      isActive: false
    },
    {
      id: '000005',
      src: require('../assets/data/musics/yz.mp3'),
      imgUrl: require('../assets/images/yezi.jpg'),
      name: '野子',
      author: '沙宝亮',
      lyric: lyric['yz'],
      album: '江苏卫视 2016跨年演唱会',
      duration: '03:35',
      isActive: false
    }
  ],
  lastRightSongs: [
    {
      src: require('../assets/data/musics/ax.mp3'),
      imgUrl: require('../assets/images/axian.jpg'),
      name: '暗香',
      author: '沙宝亮',
      isActive: false
    },
    {
      src: require('../assets/data/musics/nl.mp3'),
      imgUrl: require('../assets/images/nianlun.jpg'),
      name: '年轮',
      author: '张碧晨',
      isActive: false
    },
    {
      src: require('../assets/data/musics/pa.mp3'),
      imgUrl: require('../assets/images/pianai.jpg'),
      name: '偏爱',
      author: '张芸京',
      isActive: false
    },
    {
      src: require('../assets/data/musics/lxsx.mp3'),
      imgUrl: require('../assets/images/sanxun.jpg'),
      name: '理想三旬',
      author: '陈鸿宇',
      isActive: false
    },
    {
      src: require('../assets/data/musics/yz.mp3'),
      imgUrl: require('../assets/images/yezi.jpg'),
      name: '野子',
      author: '沙宝亮',
      isActive: false
    }
  ]
};
