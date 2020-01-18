import Vue from 'vue'
import { Button, Tree } from 'element-ui'
import { Form, FormItem, Card, Row, Col } from 'element-ui'
import { Input, Container, Aside, Main, Header, Menu, MenuItem, Submenu } from 'element-ui'
import { Breadcrumb, BreadcrumbItem, Table, TableColumn, Switch, Tooltip } from 'element-ui'
// 导入弹框提示
import { Message, Dialog, Pagination, MessageBox, Tag, Select, Option, Cascader } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm