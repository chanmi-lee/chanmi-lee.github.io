// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-cookie-vs-session-vs-webstorage",
        
          title: "cookie vs session vs webStorage",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2022-04/cookie-session-webstorage/";
          
        },
      },{id: "post-react-controlled-vs-uncontrolled-component",
        
          title: "[React] Controlled vs Uncontrolled Component",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2021-08/react-controlled-uncontrolled-component/";
          
        },
      },{id: "post-리뷰-quot-learning-react-quot-를-읽고",
        
          title: "[리뷰] &quot;Learning React&quot;를 읽고",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2021-07/review-of-learning-react/";
          
        },
      },{id: "post-번역-lodash를-대체하는-순수-자바스크립트-함수",
        
          title: "[번역] Lodash를 대체하는 순수 자바스크립트 함수",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2021-03/Pure-JavaScript-Functions-as-a-Replacement-for-Lodash/";
          
        },
      },{id: "post-리뷰-quot-컨테이너-보안-quot-을-읽고",
        
          title: "[리뷰] &quot;컨테이너 보안&quot;을 읽고",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2021-02/review-of-container-security/";
          
        },
      },{id: "post-웹-성능-분석-및-최적화-기법-with-chrome-developer-tools",
        
          title: "웹 성능 분석 및 최적화 기법 (with Chrome Developer Tools)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2021-01/website-spped-and-performance-optimization/";
          
        },
      },{id: "post-2020년-하반기-회고",
        
          title: "2020년 하반기 회고",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-12/retrospective-of-2020/";
          
        },
      },{id: "post-closure-in-javascript",
        
          title: "Closure in JavaScript",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-11/Closure-in-JavaScript/";
          
        },
      },{id: "post-usememo-in-react",
        
          title: "useMemo in React",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-11/useMemo-in-React/";
          
        },
      },{id: "post-글또-4기를-마치며",
        
          title: "글또 4기를 마치며",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-08/Wrap-up-geultto-4/";
          
        },
      },{id: "post-hooks-in-react",
        
          title: "Hooks in React",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-07/Hooks-of-React/";
          
        },
      },{id: "post-2020년-상반기-회고",
        
          title: "2020년 상반기 회고",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-07/the-first-half-of-2020/";
          
        },
      },{id: "post-번역-자바스크립트-이벤트-루프",
        
          title: "[번역] 자바스크립트 이벤트 루프",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-06/JavaScript-Visualized-Event-Loop/";
          
        },
      },{id: "post-javascript-function",
        
          title: "JavaScript Function",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-05/JavaScript-Function/";
          
        },
      },{id: "post-hoc-in-react",
        
          title: "HOC in React",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-04/what-is-hoc-and-how-to-use-it-in-react/";
          
        },
      },{id: "post-refs-in-react",
        
          title: "Refs in React",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-04/refs-in-react/";
          
        },
      },{id: "post-웹-표준과-크로스-브라우징-이슈",
        
          title: "웹 표준과 크로스 브라우징 이슈",
        
        description: "Web Standard and Cross Browsing issue",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-03/web-standard-and-cross-browsing-issue/";
          
        },
      },{id: "post-글또-4기로-블로그-되살리기",
        
          title: "글또 4기로 블로그 되살리기",
        
        description: "Why I start writing with Geultto?",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2020-03/why-geultto/";
          
        },
      },{id: "post-bls-report-automation",
        
          title: "BLS Report Automation",
        
        description: "Generating YouTube campaign reporting tool automation",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/articles/2017-05/bls-report-automation/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Resume_ChanmiLee_FE.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%63%68%61%6E%6D%69.%6B%61%74%65.%6C%65%65@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/chanmilee-fe", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/chanmi-kate-lee", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
