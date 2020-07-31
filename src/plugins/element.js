import 'element-ui/lib/theme-chalk/display.css';
import Vue from 'vue'
import {
    Container,
    Button,
    Card,
    Tabs,
    TabPane,
    Form,
    FormItem,
    Row,
    Col,
    Input,
    RadioGroup,
    Radio,
    Select,
    Option,
    Header,
    Main,
    Aside,
    Footer,
    Link,
    Loading,
    Message,
    MessageBox,
    Menu,
    MenuItem,
    MenuItemGroup,
    Submenu,
    Popconfirm,
    Tooltip,
    Avatar,
    Table,
    TableColumn,
    Tag,
    Steps,
    Step,
    Timeline,
    TimelineItem,
    Checkbox,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Divider,
    Breadcrumb,
    BreadcrumbItem,
    DatePicker,
    Dialog,
    Alert
} from 'element-ui'

Vue.use(Alert)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Container)
Vue.use(Button)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Option)
Vue.use(Col)
Vue.use(Row)
Vue.use(Link)
Vue.use(Loading)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Aside)
Vue.use(Popconfirm)
Vue.use(Tooltip)
Vue.use(Avatar)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Checkbox)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Divider)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.component(Message) //使用use页面一打开就会显示信息框
Vue.component(MessageBox) //使用use页面一打开就会显示信息框

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
