import Home from './pages/Home';
import Subscribe from './pages/Subscribe';
import Article from './pages/Article';
import Admin from './pages/Admin';
import AdminArticleEditor from './pages/AdminArticleEditor';
import Latest from './pages/Latest';
import Topics from './pages/Topics';
import Authors from './pages/Authors';
import Author from './pages/Author';
import Account from './pages/Account';
import Terms from './pages/Terms';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Subscribe": Subscribe,
    "Article": Article,
    "Admin": Admin,
    "AdminArticleEditor": AdminArticleEditor,
    "Latest": Latest,
    "Topics": Topics,
    "Authors": Authors,
    "Author": Author,
    "Account": Account,
    "Terms": Terms,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};