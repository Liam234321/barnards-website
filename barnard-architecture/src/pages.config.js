/**
 * pages.config.js - Page routing configuration
 *
 * mainPage controls which page is the landing page.
 */
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Contact": Contact,
    "Home": Home,
    "Portfolio": Portfolio,
    "ProjectDetail": ProjectDetail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
