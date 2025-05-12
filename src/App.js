import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';
import styled, { createGlobalStyle } from 'styled-components';
import bgImage from './assets/background.svg';
import kaistLogo from './assets/ct_logo.svg';
import posterImage from './assets/poster.svg'

// 전역 스타일: 폰트 및 기본 리셋
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', sans-serif; }
    /* fade 클래스 전역 정의 (optional) */
  .fade-enter { opacity: 0; }
  .fade-enter-active { opacity: 1; transition: opacity 1000ms ease-in; }
  .fade-exit { opacity: 1; }
  .fade-exit-active { opacity: 0; transition: opacity 1000ms ease-in; }
`;

const FadeContainer = styled.div`
&.fade-enter {
opacity: 0;
}
&.fade-enter-active {
opacity: 1;
transition: opacity 300ms ease-in;
}
&.fade-exit {
opacity: 1;
}
&.fade-exit-active {
opacity: 0;
transition: opacity 300ms ease-in;
}
`

// 최상위 컨테이너
const Container = styled.div`
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;
  color: #fff;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`;

const LightContainer = styled.div`
background: #f8f8f8;
color: #1E3050;
min-height: 100vh;

`;

// 헤더 & 네비게이션
const Header = styled.header`
  background: rgba(0, 0, 0, 0.0);
  position: sticky;
  top: 0;
  z-index: 100;
`;
const Nav = styled.nav`
  display: flex;
  gap: 10rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 90%px;
  margin: 0 auto;
  padding: 1rem 2rem;
`;
const NavLink = styled(Link)`
color: ${({light}) => (light ? '#1E3050' : '#fff')};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.4rem;
  &:hover { text-decoration: underline; }
`;

// Hero 섹션 (첫 화면 영역)
const Hero = styled.section`
  min-height: 100vh;
  padding: 1rem 6rem;
  display: flex;
  flex-direction: column;

  height: 100vh;
  scroll-snap-align: start;
  padding-top: 8rem;
  @media (max-width: 80%) { align-items: center; text-align: center; }
`;
const HeroTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 13rem;
  font-weight: 2000;
  line-height: 0.9;
  margin-bottom: 2rem;
  @media (max-width: 80%) { font-size: 3rem; }
`;
const HeroYear = styled.span`
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-size: 13rem;
  margin-bottom: 1rem;
  @media (max-width: 80%) { font-size: 3rem; }
`;
const HeroSectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 4rem;
  margin: 2rem 0;
`;
const HeroText = styled.p`
  font-size: 1.6rem;
  max-width: 100rem;
  margin-bottom: 3rem;
  font-weight: 500;
  text-align: left;
`;
const HeroButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

// 일반 버튼
const Button = styled.a`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  border: 5px solid #fff;
  border-radius: 24px;
  font-size: 1.6rem;
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  transition: background 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.2); }
`;

// 일반 섹션 스타일
const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;      /* 수직 중앙 정렬 */
  padding: 4rem 6rem;
  background: rgba(0, 0, 0, 0.0);
  height: 100vh;
  scroll-snap-align: start;
`;
const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 4rem;
  font-weight: 2000;
  line-height: 0.9;
  margin-bottom: 4rem;
  @media (max-width: 80%) { font-size: 3rem; }
`;
const InfoList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
`;
const InfoItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;
const InfoLabel = styled.span`
  font-weight: 900;
  font-size: 1.6rem;
  width: 10rem;
`;
const InfoValue = styled.span`
  flex: 1;
  font-weight: 500;
  font-size: 1.6rem;
`;

// 조직 리스트
const OrgList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
`;
const OrgItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;
const OrgLabel = styled.span`
  font-weight: 900;
  font-size: 1.6rem;
  flex: 1;
`;
const OrgValue = styled.span`
  flex: 1;
  text-align: right;
  font-weight: 500;
  font-size: 1.6rem;
`;

// Footer 스타일
const Footer = styled.footer`
  background: #1E3050;
  color: #fff;
  padding: 2rem 2.4rem;
  scroll-snap-align: start;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #fff;
  width: 100%;
  margin: 0 auto 2rem;
`;
const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
`;
const Copy = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;
const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
const ContactItem = styled.div`
  display: flex;
`;
const ContactLabel = styled.span`
  font-weight: 600;
  width: 4rem;
`;
const ContactValue = styled.span`
  margin-left: 1rem;
`;
const LogoGroup = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-top: 1.6rem;
`;
const Logo = styled.img`
  height: 1rem;
`;

// Scroll-to-top 버튼
const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Apple SD Gothic Neo', sans-serif;
  font-weight: bold;
  z-index: 100;
  &:hover { background: rgba(255, 255, 255, 1); }
`;

const ImageWrapper = styled.div`
display: flex;
padding: 3.2rem;
background: rgba(0, 0, 0, 0.0);
margin-bottom: 2rem;
`;

const FullImage = styled.img`
max-width: 30%;
height: auto;
display: block;
margin: 0 auto;
`;

const PageTitle = styled.h1`
font-family: 'Montserrat', sans-serif;
text-align: center;
font-size: 13rem;
font-weight: 900;
margin: 1rem 0;
color: #1E3050;
  padding: 1rem 6rem;
`

const Spacer = styled.div`
  height: 0.5rem; /* 원하는 크기 */
`;

const Placeholder = styled.div`
   max-width: 30%;
   /* 이미지 높이에 맞춰 vh 단위로 지정하거나, 비율(aspect-ratio)로 설정해도 됩니다 */
   height: 60vh;
   margin: 0 auto;
   background: linear-gradient(
     90deg,
     #e0e0e0 25%,
     #f0f0f0 37%,
     #e0e0e0 63%
   );
   background-size: 400% 100%;
   animation: shimmer 1.4s ease infinite;
   @keyframes shimmer {
     0% { background-position: -400% 0; }
     100% { background-position: 400% 0; }
   }
 `;


// Placeholder Pages
function HomePage() {
  const containerRef = useRef(null);
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Container ref={containerRef}>
      <Header>
        <Nav>
          <NavLink to="/">MAIN</NavLink>
          <NavLink to="/poster">POSTER</NavLink>
          <NavLink to="/program">PROGRAM</NavLink>
        </Nav>
      </Header>

      {/* Hero */}
      <Hero>
        <HeroTitle>
          CTSCAPE <HeroYear>2025</HeroYear>
        </HeroTitle>
        <HeroSectionTitle>About CTSCAPE</HeroSectionTitle>
        <HeroText>
          Hosted by KAIST Graduate School of Culture Technology,<br /> the CTSCAPE is an interdisciplinary forum for the researchers,<br /> practitioners, and those who are interested in culture technology.
        </HeroText>
        <HeroButtonGroup>
          <Button href="https://ct.kaist.ac.kr" target="_blank" rel="noopener noreferrer">
            CT WEBSITE
          </Button>
          <Button as={Link} to="/poster">
            CTSCAPE 2025 POSTER
          </Button>
        </HeroButtonGroup>
      </Hero>

      {/* Registration */}
      <Section>
        <SectionTitle>Registration</SectionTitle>
        <InfoList>
          <InfoItem>
            <InfoLabel>Date</InfoLabel><InfoValue>2025.05.30 (Fri) 09:30 - 16:30 (KST)</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Venue</InfoLabel><InfoValue>Chung Kunmo Conference Hall<br />John Hannah Hall (E9 5F, KAIST)</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Program</InfoLabel><InfoValue>To Be Announced</InfoValue>
          </InfoItem>
        </InfoList>
        <HeroButtonGroup>
          <Button href="https://docs.google.com/forms/d/1_wEE4juQYq2gGkSU4EEZmJUje3FktAtTcOTBdZfqslA/edit" target="_blank" rel="noopener noreferrer">
            REGISTER FORM
          </Button>
          <Button as={Link} to="/program">
            CTSCAPE 2025 PROGRAM
          </Button>
        </HeroButtonGroup>
      </Section>

      {/* Organizers */}
      <Section>
        <SectionTitle>Organizers</SectionTitle>
        <OrgList>
          <OrgItem><OrgLabel>Organizing Committee</OrgLabel><OrgValue>Seung Hyun Cha</OrgValue></OrgItem>
          <OrgItem><OrgLabel>Communication Committee</OrgLabel><OrgValue>이진준 교수님, 김예원</OrgValue></OrgItem>
          <OrgItem><OrgLabel>Steering Committee</OrgLabel><OrgValue>Jiho Kang</OrgValue></OrgItem>
          <OrgItem><OrgLabel>Promotion Committee</OrgLabel><OrgValue>Jisoo Kang, Hyeokjin Choi</OrgValue></OrgItem>
          <OrgItem><OrgLabel>동문회 준비</OrgLabel><OrgValue>Jisoo Kang, Hyeokjin Choi</OrgValue></OrgItem>
        </OrgList>
      </Section>

      {/* Footer */}
      <Footer>
        <Divider />
        <Copy>©2025 KAIST Graduate School of Culture Technology. all rights reserved.</Copy>
        <FooterContent>
          <ContactList>
            <ContactItem><ContactLabel>Tel.</ContactLabel><ContactValue>042)350.2902-4</ContactValue></ContactItem>
            <ContactItem><ContactLabel>Email</ContactLabel><ContactValue>ctscape@kaist.ac.kr</ContactValue></ContactItem>
          </ContactList>
          <LogoGroup>
            <Logo src={kaistLogo} alt="KAIST Logo" />
          </LogoGroup>
        </FooterContent>
      </Footer>

      <ScrollTopButton onClick={scrollToTop}>TOP</ScrollTopButton>
    </Container>
  );
}

function PosterPage() {
    const containerRef = useRef(null);
  const scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'});
  // 로딩 상태 관리
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <LightContainer ref={containerRef}>
      <Header>
        <Nav>
          <NavLink light to="/">MAIN</NavLink>
          <NavLink light to="/poster">POSTER</NavLink>
          <NavLink light to="/program">PROGRAM</NavLink>
        </Nav>
      </Header>
      <PageTitle>POSTER</PageTitle>
        
      <ImageWrapper>
       {/** 로딩 전엔 Placeholder, 로딩 완료 후엔 실제 이미지 표시 **/}
        {!imgLoaded && <Placeholder />}
        <FullImage
          src={posterImage}
          alt="CTSCAPE 2025 Poster"
          style={{ display: imgLoaded ? 'block' : 'none' }}
          onLoad={() => setImgLoaded(true)}
        />
      </ImageWrapper>
        <Spacer />
      <HeroText style={{ color: '#1E3050', maxWidth: '60rem', margin: '2rem auto', textalign: 'center'}}>
        Hosted by KAIST Graduate School of Culture Technology, the CTSCAPE is an interdisciplinary
        forum for the researchers, practitioners, and those who are interested in culture technology.
      </HeroText>
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer /><Spacer />
      <Spacer />
      <Spacer />
      <Spacer /><Spacer />
            <Footer>
        <Divider />
        <Copy>©2025 KAIST Graduate School of Culture Technology. all rights reserved.</Copy>
        <FooterContent>
          <ContactList>
            <ContactItem><ContactLabel>Tel.</ContactLabel><ContactValue>042)350.2902-4</ContactValue></ContactItem>
            <ContactItem><ContactLabel>Email</ContactLabel><ContactValue>ctscape@kaist.ac.kr</ContactValue></ContactItem>
          </ContactList>
          <LogoGroup>
            <Logo src={kaistLogo} alt="KAIST Logo" />
          </LogoGroup>
        </FooterContent>
      </Footer>

      <ScrollTopButton onClick={scrollToTop}>TOP</ScrollTopButton>
    </LightContainer>
    
  );
}

function ProgramPage() {
        const containerRef = useRef(null);
  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  };
  return (
    <LightContainer ref={containerRef}>
      <Header>
        <Nav>
          <NavLink light to="/">MAIN</NavLink>
          <NavLink light to="/poster">POSTER</NavLink>
          <NavLink light to="/program">PROGRAM</NavLink>
        </Nav>
      </Header>
      <PageTitle>PROGRAM</PageTitle>
        
      <ImageWrapper>
        <FullImage src={posterImage} alt="CTSCAPE 2025 Poster" />
      </ImageWrapper>
        <Spacer />
      <HeroText style={{ color: '#1E3050', maxWidth: '60rem', margin: '2rem auto', textalign: 'center'}}>
        Hosted by KAIST Graduate School of Culture Technology, the CTSCAPE is an interdisciplinary
        forum for the researchers, practitioners, and those who are interested in culture technology.
      </HeroText>
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer /><Spacer />
      <Spacer />
      <Spacer />
      <Spacer /><Spacer />
            <Footer>
        <Divider />
        <Copy>©2025 KAIST Graduate School of Culture Technology. all rights reserved.</Copy>
        <FooterContent>
          <ContactList>
            <ContactItem><ContactLabel>Tel.</ContactLabel><ContactValue>042)350.2902-4</ContactValue></ContactItem>
            <ContactItem><ContactLabel>Email</ContactLabel><ContactValue>ctscape@kaist.ac.kr</ContactValue></ContactItem>
          </ContactList>
          <LogoGroup>
            <Logo src={kaistLogo} alt="KAIST Logo" />
          </LogoGroup>
        </FooterContent>
      </Footer>

      <ScrollTopButton onClick={scrollToTop}>TOP</ScrollTopButton>
    </LightContainer>
    
  );

}

// 애니메이션 적용한 Routes 래퍼
function AnimatedRoutes() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        nodeRef={nodeRef}
        classNames="fade"
        timeout={{ enter: 500, exit: 0 }}
        unmountOnExit
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/poster" element={<PosterPage />} />
            <Route path="/program" element={<ProgramPage />} />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default function App() {
  return (
    <Router basename='/ctscape-2025'>
      <GlobalStyle/>
      <AnimatedRoutes/>
    </Router>
  );
}
