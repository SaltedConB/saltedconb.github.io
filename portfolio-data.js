const portfolioData = [
    {
        id: 1,
        title: "The Typoster",
        category: "graphic-design",
        thumbnail: "./img/work1-thumb.jpeg",
        shortDesc: "아무런 말과 닉네임으로 지어낸 레터링 콜렉션.",
        content: {
            description: `우리가 평소에 흘리는 아무 말들과
                익명의 공간에 모인 낯선 사람들에게 보여주는 닉네임들을 모으고 모아
                레터링 컬렉션으로 제작했습니다.
                글자를 읽으면 바로 떠오르는 느낌과 분위기, 리듬감을 살려내
                사람들에게 소소한 재미를 주자 라는 취지로 제작한 프로젝트입니다.`,
            images: [
                "./img/work1/1.png",
                "./img/work1/2.png",
                "./img/work1/3.png",
                "./img/work1/4.png",
                "./img/work1/5.png",
                "./img/work1/6.png",
                "./img/work1/7.png",
                "./img/work1/8.png",
                "./img/work1/9.png",
                "./img/work1/10.png"
            ],
            behance: "https://www.behance.net/embed/project/150002949?ilo0=1"
        }
    },
    {
        id: 2,
        title: "상상해봐! 판타지움",
        category: "motion-graphics",
        thumbnail: "./img/work2-thumb.webp",
        shortDesc: "쇼핑몰 판타지움의 홍보영상 콘테스트 출품작. 우수상.",
        content: {
            description: `수인분당선 망포역에 있는 지역쇼핑몰,
                판타지움에서 주최한 판타지움 유튜브 영상 공모전에 출품한 작품입니다.
                4명으로 구성된 팀에서 영상편집과 모션그래픽을 담당했으며,
                우수상을 받았습니다.`,
            youtube: "https://www.youtube.com/embed/wu7JVh8kazE?si=psrVA52OhGyt_CeD"
        }
    },
    {
        id: 3,
        title: "소래의 풍차",
        category: "motion-graphics",
        thumbnail: "./img/work3-thumb.webp",
        shortDesc: "Web3 Creator Festival 2023 공모전에 출품한 작품. 우수상.",
        content: {
            description: `NFT플랫폼 LM NOVA와 인천시 남동구에서 주최한
                Web3 Creator Festival 2023 공모전에 출품한 작품입니다.
                1인제작으로, 우수상을 받았습니다.`,
            youtube: "https://www.youtube.com/embed/r6_-gQYWXlk"
        }
    },
    {
        id: 4,
        title: "브랜딩 프로젝트 : 엠게임",
        category: "branding",
        thumbnail: "./img/work4-thumb.png",
        shortDesc: "[귀혼], [열혈강호 온라인]을 제작한 게임회사 \n 엠게임의 BI 프로젝트.",
        content: {
            description: `한국의 게임제작, 배급사 엠게임의 로고와 브랜드 정체성을 리부트 한다는 느낌으로
                처음부터 직접 기획 및 제작을 진행한 프로젝트입니다.
                다양한 바리에이션과 응용 어플들을 제작했습니다.`,
            mainImage: "./img/work4-full.webp",
            youtube: "https://www.youtube.com/embed/6fy777GGphk?si=GcAzzbh3ON2gkdCw",
            behance: "https://www.behance.net/embed/project/208362783?ilo0=1"
        }
    },
    {
        id: 5,
        title: "신데렐라",
        category: "motion-graphics",
        thumbnail: "./img/work5-thumb.png",
        shortDesc: "동화 신데렐라를 오프닝 타이틀 시퀀스로 만든 영상.",
        content: {
            description: `동화 신데렐라를 오프닝 타이틀 시퀀스로 만든 영상입니다.
                Blender와 After Effects를 같이 활용해 제작했으며,
                신데렐라 라고 하는 유명한 동화의 이야기를 저만의 특색있는 스타일로 재해석해 보았습니다.`,
            youtube: "https://www.youtube.com/embed/i0FSq5MgT4o?si=cHyMZDWN_50C2-1l"
        }
    },
    {
        id: 6,
        title: "게임 타이틀 한글화 #1",
        category: "graphic-design",
        thumbnail: "./img/work6-thumb.png",
        shortDesc: "말그대로 게임 타이틀을 한글로 만들어본 콜렉션.",
        content: {
            description: `평소 즐기던 비디오게임의 타이틀들을 현지화해 보았습니다.
                '영어로 되어있는 텍스트심볼들을 한국어로 번역하면 어떨까?'
                라는 생각으로 제작한 프로젝트입니다.`,
            images: [
                "./img/work6/1.png",
                "./img/work6/2.png",
                "./img/work6/3.png",
                "./img/work6/4.png",
                "./img/work6/5.png"
            ]
        }
    },
    {
        id: 7,
        title: "The Typoster Remake",
        category: "graphic-design",
        thumbnail: "./img/work7-thumb.png",
        shortDesc: "이전에 제작한 레터링 콜렉션을 리메이크한 것.",
        content: {
            description: `이전에 제작했던 아무말 프로젝트를
                3D 그래픽 포스터로 다시 제작했습니다.
                레터링을 3D로 구현해서 보는 이들에게 신선함을 던져주고자
                노력한 결과물입니다.`,
            images: [
                "./img/work7/1.png",
                "./img/work7/2.png",
                "./img/work7/3.png",
                "./img/work7/4.png",
                "./img/work7/5.png",
                "./img/work7/6.png"
            ]
        }
    },
    {
        id: 8,
        title: "무에서 유기로",
        category: "graphic-design",
        thumbnail: "./img/work8-thumb.jpg",
        shortDesc: "'만약 내가 예술가였다면?'에서 시작된 가상전시회 포스터.",
        content: {
            description: `만약 내가 예술가로 활동했다면 어땠을까?
                라는 생각으로 만들어온 가상전시회 프로젝트 입니다.
                인공지능의 힘을 빌려 가상전시용 작품이 들어있는 카탈로그를 제작했습니다.`,
            images: [
                "./img/work8/work8-1.png",
                "./img/work8/work8-2.png",
                "./img/work8/work8-3.png",
                "./img/work8/work8-4.png",
                "./img/work8/work8-5.png",
                "./img/work8/work8-6.png",
                "./img/work8/work8-7.png",
                "./img/work8/work8-8.png"
            ],
            pdf: "./img/work8/work8.pdf"
        }
    }
];

// 포트폴리오 아이템 렌더링 함수
function renderPortfolioItems() {
    const gridContainer = document.querySelector('.portfolio-grid');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    
    portfolioData.forEach(item => {
        // 포트폴리오 그리드 아이템 생성
        const portfolioItem = createPortfolioItem(item);
        gridContainer.appendChild(portfolioItem);
        
        // 모달 생성
        const modal = createModal(item);
        modalContainer.appendChild(modal);
    });
    
    document.querySelector('.portfolio').appendChild(modalContainer);
}

// 포트폴리오 아이템 생성 함수
function createPortfolioItem(item) {
    const div = document.createElement('div');
    div.className = `portfolio-item ${item.category}`;
    div.onclick = () => openModal(`modal${item.id}`);
    
    div.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}">
        <div class="portfolio-caption">
            <h3>${item.title}</h3>
            <p>${item.shortDesc}</p>
        </div>
    `;
    
    return div;
}

// 모달 생성 함수
function createModal(item) {
    const modal = document.createElement('div');
    modal.id = `modal${item.id}`;
    modal.className = 'modal';
    
    let contentHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('modal${item.id}')">&times;</span>
            <h1>${item.title}</h1>
            <p>${item.content.description}</p>
    `;
    
    // 이미지 갤러리가 있는 경우
    if (item.content.images) {
        contentHTML += `
            <div class="image-gallery">
                ${item.content.images.map(img => `<img src="${img}" alt="${item.title}">`).join('')}
            </div>
        `;
    }
    
    // YouTube 영상이 있는 경우
    if (item.content.youtube) {
        contentHTML += `
            <iframe width="640" height="480" src="${item.content.youtube}" 
                title="YouTube video player" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        `;
    }
    
    // Behance 임베드가 있는 경우
    if (item.content.behance) {
        contentHTML += `
            <h3>Behance</h3>
            <iframe src="${item.content.behance}" height="316" width="404" 
                allowfullscreen lazyload frameborder="0" 
                allow="clipboard-write" refererPolicy="strict-origin-when-cross-origin">
            </iframe>
        `;
    }
    
    contentHTML += `</div>`;
    modal.innerHTML = contentHTML;
    
    return modal;
}

// 페이지 로드 시 포트폴리오 렌더링
document.addEventListener('DOMContentLoaded', renderPortfolioItems);
export default portfolioData;