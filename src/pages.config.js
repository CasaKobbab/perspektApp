import About from './pages/About';
import Account from './pages/Account';
import Admin from './pages/Admin';
import AdminArticleEditor from './pages/AdminArticleEditor';
import Article from './pages/Article';
import Author from './pages/Author';
import Authors from './pages/Authors';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Latest from './pages/Latest';
import PaymentCancel from './pages/PaymentCancel';
import PaymentSuccess from './pages/PaymentSuccess';
import Search from './pages/Search';
import Subscribe from './pages/Subscribe';
import Terms from './pages/Terms';
import Topics from './pages/Topics';
import VideoPage from './pages/VideoPage';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Account": Account,
    "Admin": Admin,
    "AdminArticleEditor": AdminArticleEditor,
    "Article": Article,
    "Author": Author,
    "Authors": Authors,
    "Contact": Contact,
    "Home": Home,
    "Latest": Latest,
    "PaymentCancel": PaymentCancel,
    "PaymentSuccess": PaymentSuccess,
    "Search": Search,
    "Subscribe": Subscribe,
    "Terms": Terms,
    "Topics": Topics,
    "VideoPage": VideoPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};