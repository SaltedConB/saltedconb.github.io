const SITE_DATA = {
    landing: {
        title: "Seamless Creativity.",
        subtitle: "끊기지 않는 창의력, monoton입니다.",
        contactEmail: "Contact: monotonsub@gmail.com"
    },
    works: [
        {
            id: "modal1",
            category: "graphic-design",
            title: "The Typoster",
            subtitle: "아무런 말과 닉네임으로 지어낸 레터링 콜렉션.",
            thumb: "./img/work1-thumb.jpeg",
            thumbAlt: "아무말",
            descTitle: "The Typoster",
            desc: "우리가 평소에 흘리는 아무 말들과 <br />익명의 공간에 모인 낯선 사람들에게 보여주는 닉네임들을 모으고 모아 <br />레터링 컬렉션으로 제작했습니다. <br />글자를 읽으면 바로 떠오르는 느낌과 분위기, 리듬감을 살려내 <br />사람들에게 소소한 재미를 주자 라는 취지로 제작한 프로젝트입니다.",
            images: [
                "./img/work1/1.png", "./img/work1/2.png", "./img/work1/3.png", "./img/work1/4.png", "./img/work1/5.png",
                "./img/work1/6.png", "./img/work1/7.png", "./img/work1/8.png", "./img/work1/9.png", "./img/work1/10.png"
            ],
            behance: "https://www.behance.net/embed/project/150002949?ilo0=1",
            youtube: "",
            pdf: ""
        },
        {
            id: "modal2",
            category: "motion-graphics",
            title: "상상해봐! 판타지움",
            subtitle: "쇼핑몰 판타지움의 홍보영상 콘테스트 출품작. 우수상.",
            thumb: "./img/work2-thumb.webp",
            thumbAlt: "판타지움",
            descTitle: "상상해봐! 판타지움",
            desc: "수인분당선 망포역에 있는 지역쇼핑몰, <br />판타지움에서 주최한 판타지움 유튜브 영상 공모전에 출품한 작품입니다. <br />4명으로 구성된 팀에서 영상편집과 모션그래픽을 담당했으며, <br />우수상을 받았습니다.",
            images: [],
            behance: "",
            youtube: "https://www.youtube.com/embed/wu7JVh8kazE?si=psrVA52OhGyt_CeD",
            pdf: ""
        },
        {
            id: "modal3",
            category: "motion-graphics",
            title: "소래의 풍차",
            subtitle: "Web3 Creator Festival 2023 공모전에 출품한 작품. 우수상.",
            thumb: "./img/work3-thumb.webp",
            thumbAlt: "소래",
            descTitle: "소래의 풍차",
            desc: "NFT플랫폼 LM NOVA와 인천시 남동구에서 주최한 <br />Web3 Creator Festival 2023 공모전에 출품한 작품입니다. <br />1인제작으로, 우수상을 받았습니다.",
            images: [],
            behance: "",
            youtube: "https://www.youtube.com/embed/r6_-gQYWXlk",
            youtubeOptions: "portrait",
            pdf: ""
        },
        {
            id: "modal4",
            category: "branding",
            title: "브랜딩 프로젝트 - 엠게임",
            subtitle: "[귀혼], [열혈강호 온라인]을 제작한 게임회사 <br /> 엠게임의 BI 프로젝트.",
            thumb: "./img/work4-thumb.png",
            thumbAlt: "mgame",
            descTitle: "브랜딩 프로젝트 - 엠게임",
            desc: "한국의 게임제작, 배급사 엠게임의 로고와 브랜드 정체성을 리부트 한다는 느낌으로 <br />처음부터 직접 기획 및 제작을 진행한 프로젝트입니다. <br />다양한 바리에이션과 응용 어플들을 제작했습니다.",
            images: ["./img/work4-full.webp"],
            behance: "https://www.behance.net/embed/project/208362783?ilo0=1",
            youtube: "https://www.youtube.com/embed/6fy777GGphk?si=GcAzzbh3ON2gkdCw",
            pdf: ""
        },
        {
            id: "modal5",
            category: "motion-graphics",
            title: "신데렐라",
            subtitle: "동화 신데렐라를 오프닝 타이틀 시퀀스로 만든 영상.",
            thumb: "./img/work5-thumb.png",
            thumbAlt: "신데렐라",
            descTitle: "신데렐라",
            desc: "동화 신데렐라를 오프닝 타이틀 시퀀스로 만든 영상입니다. <br />Blender와 After Effects를 같이 활용해 제작했으며, <br />신데렐라 라고 하는 유명한 동화의 이야기를 저만의 특색있는 스타일로 재해석해 보았습니다.",
            images: [],
            behance: "",
            youtube: "https://www.youtube.com/embed/i0FSq5MgT4o?si=cHyMZDWN_50C2-1l",
            pdf: ""
        },
        {
            id: "modal6",
            category: "graphic-design",
            title: "게임 타이틀 한글화 #1",
            subtitle: "말그대로 게임 타이틀을 한글로 만들어본 콜렉션.",
            thumb: "./img/work6-thumb.png",
            thumbAlt: "아무말",
            descTitle: "게임 타이틀 한글화 #1",
            desc: "평소 즐기던 비디오게임의 타이틀들을 현지화해 보았습니다. <br />'영어로 되어있는 텍스트심볼들을 한국어로 번역하면 어떨까?' <br />라는 생각으로 제작한 프로젝트입니다.",
            images: ["./img/work6/1.png", "./img/work6/2.png", "./img/work6/3.png", "./img/work6/4.png", "./img/work6/5.png"],
            behance: "",
            youtube: "",
            pdf: ""
        },
        {
            id: "modal7",
            category: "graphic-design",
            title: "The Typoster Remake",
            subtitle: "이전에 제작한 레터링 콜렉션을 리메이크한 것.",
            thumb: "./img/work7-thumb.png",
            thumbAlt: "아무말_re",
            descTitle: "The Typoster Remake",
            desc: "이전에 제작했던 아무말 프로젝트를 <br />3D 그래픽 포스터로 다시 제작했습니다. <br />레터링을 3D로 구현해서 보는 이들에게 신선함을 던져주고자 <br />노력한 결과물입니다.",
            images: ["./img/work7/1.png", "./img/work7/2.png", "./img/work7/3.png", "./img/work7/4.png", "./img/work7/5.png", "./img/work7/6.png"],
            behance: "",
            youtube: "",
            pdf: ""
        },
        {
            id: "modal8",
            category: "graphic-design",
            title: "무에서 유기로",
            subtitle: "'만약 내가 예술가였다면?'에서 시작된 가상전시회 포스터.",
            thumb: "./img/work8-thumb.jpg",
            thumbAlt: "개인전 카탈로그",
            descTitle: "무에서 유기로",
            desc: "만약 내가 예술가로 활동했다면 어땠을까? 라는 생각으로 만들어온 가상전시회 프로젝트 입니다. <br />인공지능의 힘을 빌려 가상전시용 작품이 들어있는 카탈로그를 제작했습니다.",
            images: ["./img/work8/work8-1.png", "./img/work8/work8-2.png", "./img/work8/work8-3.png", "./img/work8/work8-4.png", "./img/work8/work8-5.png", "./img/work8/work8-6.png", "./img/work8/work8-7.png", "./img/work8/work8-8.png"],
            behance: "",
            youtube: "",
            pdf: "./img/work8/work8.pdf"
        }
    ],
    skills: [
        {
            id: "modal1",
            name: "Adobe Photoshop",
            level: 5,
            icon: "https://cdn.simpleicons.org/adobephotoshop",
            descTitle: "Adobe Photoshop",
            desc: "툴과 기능을 상당량 숙지함 및 응용기술 소지. <br>GTQ 1급, 컴퓨터그래픽스운용기능사 소지."
        },
        {
            id: "modal2",
            name: "Adobe Illustrator",
            level: 5,
            icon: "https://cdn.simpleicons.org/adobeillustrator",
            descTitle: "Adobe Illustrator",
            desc: "툴과 기능을 상당량 숙지함 및 응용기술 소지. <br>컴퓨터그래픽스운용기능사 소지."
        },
        {
            id: "modal3",
            name: "Adobe After Effects",
            level: 4,
            icon: "https://cdn.simpleicons.org/adobeaftereffects",
            descTitle: "Adobe After Effects",
            desc: "키프레임 조절, 효과기능, 컷편집 기술, 템플릿 제작기술 소지."
        },
        {
            id: "modal4",
            name: "Adobe Premiere Pro",
            level: 4,
            icon: "https://cdn.simpleicons.org/adobepremierepro",
            descTitle: "Adobe Premiere Pro",
            desc: "컷편집 기술, 자막 템플릿 제작기술 소지."
        },
        {
            id: "modal5",
            name: "Maxon Cinema 4D",
            level: 4,
            icon: "https://cdn.simpleicons.org/cinema4d",
            descTitle: "Maxon Cinema 4D",
            desc: "모델링, 애니메이션 기술 소지. <br>Octane, Redshift 렌더러 사용 가능"
        },
        {
            id: "modal6",
            name: "Blender",
            level: 3,
            icon: "https://cdn.simpleicons.org/blender",
            descTitle: "Blender",
            desc: "중급 모델링, 기본 키프레임 애니메이션 기술 소지."
        },
        {
            id: "modal7",
            name: "Figma",
            level: 4,
            icon: "https://cdn.simpleicons.org/figma",
            descTitle: "Figma",
            desc: "레이아웃 기획, 디자인기술 소지."
        },
        {
            id: "modal8",
            name: "Adobe Xd",
            level: 4,
            icon: "https://cdn.simpleicons.org/adobexd",
            descTitle: "Adobe Xd",
            desc: "레이아웃 기획, 디자인기술 소지."
        },
        {
            id: "modal9",
            name: "Adobe Firefly",
            level: 3,
            icon: "https://cdn.simpleicons.org/adobe",
            descTitle: "Adobe Firefly",
            desc: "프롬프트 작성, 응용이미지 제작기술 소지."
        },
        {
            id: "modal10",
            name: "Adobe Dimension",
            level: 3,
            icon: "https://cdn.simpleicons.org/adobe",
            descTitle: "Adobe Dimension",
            desc: "오브젝트, 라이트를 이용한 배치 및 목업 제작기술 소지."
        }
    ]
};
