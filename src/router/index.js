import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
/* view */
import Face from '../views/Face.vue'
import Login from '../views/Login.vue'
import Manage from '../views/Manage.vue'
import Questionnaire from '../views/Questionnaire.vue'
/* manage children page */
import UserPage from '../components/manage/UserPage.vue'
import QuestionnairePage from '../components/manage/QuestionnairePage.vue'
import StatisticsPage from '../components/manage/StatisticsPage.vue'
import SettingPage from '../components/manage/SettingPage.vue'
import FeedbackPage from '../components/manage/FeedbackPage.vue'
import HelpPage from '../components/manage/HelpPage.vue'
import CoursePage from '../components/manage/CoursePage.vue'
/* questionnaire children page */
import QuestionnaireCreatePage from '../components/questionnaire/CreatePage.vue'
import MainQuestionList from '../components/questionnaire/MainQuestionList.vue'
import FillIn from "../components/questionnaire/FillIn";
import Analysis from "../components/Analysis/Analysis";
import CreatedDonePage from "../components/questionnaire/CreatedDonePage";

Vue.use(VueRouter);

/* 解决Element ui重复点击会报错的问题 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [{
        path: '/',
        component: Face
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/manage',
        component: Manage,
        redirect: '/manage/user',
        children: [
            { path: '/manage/user', name: 'manage_user_page', component: UserPage },
            { path: '/manage/questionnaire', name: 'manage_questionnaire_page', component: QuestionnairePage },
            { path: '/manage/statistics', name: 'manage_statistics_page', component: StatisticsPage },
            { path: '/manage/course', name: 'manage_course_page', component: CoursePage },
            { path: '/manage/setting', name: 'manage_setting_page', component: SettingPage },
            { path: '/manage/feedback', name: 'manage_feedback_page', component: FeedbackPage },
            { path: '/manage/help', name: 'manage_help_page', component: HelpPage }
        ]
    },
    {
        path: '/questionnaire',
        component: Questionnaire,
        redirect: '/questionnaire/create',
        children: [
            { path: '/questionnaire/create', name: 'questionnaire_create_page', component: QuestionnaireCreatePage },
            { path: '/questionnaire/edit/:qid', name: 'questionnaire_edit_page', component: MainQuestionList, props: true },
            { path: '/questionnaire/fillin/:qid', name: 'questionnaire_fillin_page', component: FillIn, props: true },
            { path: '/questionnaire/done', name: 'done_page', component: CreatedDonePage },
        ]
    },
    {
        name:'analyze_page',
        path: '/analyze/:qid/:type',
        component: Analysis,
        props: true
    }
]

const router = new VueRouter({
    routes: routes
})

router.beforeEach((to, Form, next) => {

    if (to.path.indexOf('/manage') != -1 || to.path.indexOf('/questionnaire') != -1) {
        let token = VueCookies.get('token');
        token = (token) ? token : window.localStorage.getItem('token');
        console.log(111);
        console.log(token)
        if (!token) {
            return next('/login');
        }
    } else if (to.path == '/logout') {
        return;
    }
    next();
});

export default router
