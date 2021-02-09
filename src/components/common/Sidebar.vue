  <template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>


<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-copy',
                    index: 'tabs',
                    title: '设备基础资料',
                    subs: [
                        {
                            index: 'b1',
                            title: '安卓PAD'
                        },
                        {
                            index: 'b2',
                            title: '电子秤'
                        },
                        {
                            index: 'b3',
                            title: '条码打印机'
                        },
                        {
                            index: 'b4',
                            title: '红外对射枪'
                        },
                        {
                            index: 'b5',
                            title: '读卡器'
                        }
                    ]
                },{
                    icon: 'el-icon-lx-copy',
                    index: 'jczl',
                    title: '资源基础资料',
                  subs: [
                    {
                      index: 'qiye',
                      title: '企业'
                    },
                    {
                      index: 'gongchang',
                      title: '工厂'
                    },
                    {
                      index: 'chejian',
                      title: '车间'
                    }, {
                      index: 'chanxian',
                      title: '产线'
                    },
                    {
                      index: 'gongzhan',
                      title: '工站'
                    },
                    {
                      index: 'gongwei',
                      title: '工位'
                    },{
                      index: 'yuangong',
                      title: '员工'
                    },
                    {
                      index: 'gongweiyuangong',
                      title: '工位与员工信息'
                    }
                  ]
                },
              {
                    icon: 'el-icon-lx-copy',
                    index: 'Bom',
                    title: 'BOM基础资料',
                    subs: [
                        {
                            index: 'SourceList',
                            title: '原料库存清单'
                        },{
                            index: 'BOM_Product',
                            title: '产品'
                        },
                        {
                            index: 'BOM_Bom',
                            title: 'BOM物料'
                        },
                        {
                            index: 'BOM_Details',
                            title: 'BOM物料详情'
                        }
                    ]
              },


              {
                icon: 'el-icon-lx-copy',
                index: 'achievement',
                title: '绩效管理',
                subs: [

                  {
                    index: 'Performance report',
                    title: '绩效报表',
                    subs: [
                      {
                        index: 'cuthead_workStation',
                        title: '去头工站',
                      },
                      {
                        index: 'cutpiece_workStation',
                        title: '切片工站',
                      },
                      {
                        index:"prick_workStation",
                        title: "挑刺工站",
                      }
                    ]
                  },
                  {
                    index: 'performance',
                    title: '绩效参数配置'
                  },
                  {
                    index: 'Relationship',
                    title: '绩效参数与工站的关系'
                  },

                ]

                  },

                {
                    icon: 'el-icon-lx-copy',
                    index: 'shengchanguanli',
                    title: '生产管理',
                subs: [
                  {
                    index: 'gongzuoxinxi',
                    title: '员工工作信息',
                    subs: [
                      {
                        index: 'shanggangjilu',
                        title: '上岗记录',
                      },

                    ]
                  },
                  {
                    index: 'gongdanguanli',
                    title: '工单管理',
                    subs: [
                      {
                        index: 'dingdanxinxi',
                        title: '订单信息',
                      },
                      {
                        index:"gongdanweihu" ,
                        title: "工单维护",
                      }
                    ]
                  }
                ]
                }




                ,
              {
                    icon: 'el-icon-lx-copy',
                    index: 'gygl',
                    title: '工艺管理',
                    subs:[
                        {
                            index:'tec_process',
                            title:'工序维护'
                        },{
                            index:'tec_flow',
                            title:'工艺流程维护'
                        },{
                            index:'tec_flow_process',
                            title:'工艺流程与工序关系'
                        },{
                            index:'tec_process_station',
                            title:'工序与工站关系'
                        }
                    ]
                },{
                    icon: 'el-icon-lx-copy',
                    index: 'zlgl',
                    title: '质量管理',
                    subs:[
                        {
                            index:'qc_violaction',
                            title:'违规管理'
                        },{
                            index:'qc_inperfections',
                            title:'残次品上报管理'
                        },{
                            index:'qc_abnormal_process',
                            title:'异常工序检测'
                        },{
                            index:'log_cutpiecequalitytestingrecords',
                            title:'切片质量检测'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    title: '设备管理',
                    subs: [
                        {
                            index: 'equipReport',
                            title: '设备台账'
                        },{
                            index: 'equipMaintenancePlan',
                            title: '设备保养计划'
                        },{
                            index: 'equipRepairPerson',
                            title: '设备报修派工记录'
                        },{
                            index: 'equipError',
                            title: '设备故障上报'
                        },
                        {
                            index: 'equipRepair',
                            title: '设备维修记录'
                        }
                    ]
                }
                // ,{
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: '-----------------------'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: '3',
                //     title: '设备相关',
                //     subs: [
                //         {
                //             index: 'form',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '3-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             index: 'upload',
                //             title: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: 'icon',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     index: 'charts',
                //     title: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: '6',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: 'drag',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: 'dialog',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     index: '7',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: 'permission',
                //             title: '权限测试'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
