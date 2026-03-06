import styled, { keyframes, createGlobalStyle } from 'styled-components';

const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  bodyBg: '#ffffff',
  card: '#ffffff',
  border: 'rgba(66,168,161,0.14)',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  footerBg: '#0a2220',
  footerText: 'rgba(255,255,255,0.75)',
  white: '#ffffff',
};

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', 'Segoe UI', sans-serif; background: #fff; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* PAGE */
export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${colors.bodyBg};
  color: ${colors.textPrimary};
  font-family: 'Nunito', 'Segoe UI', sans-serif;
`;

/* NAVBAR */
export const Navbar = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid rgba(66,168,161,0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 16px rgba(66,168,161,0.08);
`;

export const NavInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

export const NavLeft = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

export const LogoWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 18px;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  display: grid;
  place-items: center;
  box-shadow: 0 4px 16px rgba(66,168,161,0.28);
  flex-shrink: 0;
  padding: 4px;
`;

export const LogoImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
`;

export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const BrandName = styled.div`
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 2.5px;
  color: ${colors.primary};
`;

export const BrandTagline = styled.div`
  font-size: 11.5px;
  color: ${colors.textSecondary};
  font-weight: 500;
`;

export const NavRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const NavBtnSecondary = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  background: transparent;
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  transition: all 0.2s;
  &:hover { background: rgba(66,168,161,0.08); }
`;

export const NavBtnPrimary = styled.button`
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: #fff;
  border: none;
  box-shadow: 0 6px 20px rgba(66,168,161,0.28);
  transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(66,168,161,0.36); }
`;

/* HERO FULL-WIDTH */
export const HeroSection = styled.section`
  width: 100%;
  min-height: 560px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const HeroBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
`;

export const HeroOverlayGrad = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10,34,32,0.88) 0%,
    rgba(66,168,161,0.62) 55%,
    rgba(138,224,219,0.08) 100%
  );
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1240px;
  margin: 0 auto;
  padding: 90px 28px;
  width: 100%;
  animation: ${fadeUp} 0.7s ease both;
`;

export const HeroKicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${colors.accent};
  margin-bottom: 18px;
`;

export const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 900;
  line-height: 1.07;
  letter-spacing: -1px;
  color: #fff;
  max-width: 620px;
  text-shadow: 0 4px 24px rgba(0,0,0,0.22);
  span { color: ${colors.accent}; }
  @media (max-width: 640px) { font-size: 34px; }
`;

export const HeroText = styled.p`
  margin-top: 18px;
  color: rgba(255,255,255,0.84);
  font-size: 16px;
  line-height: 1.80;
  max-width: 500px;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 34px;
  flex-wrap: wrap;
`;

export const PrimaryCTA = styled.button`
  padding: 15px 30px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 14.5px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: #fff;
  box-shadow: 0 10px 30px rgba(66,168,161,0.42);
  transition: all 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 18px 42px rgba(66,168,161,0.52); }
`;

export const MiniBadges = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 26px;
`;

export const Badge = styled.span`
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.28);
  color: #fff;
  backdrop-filter: blur(6px);
`;

/* CARDS SECTION */
export const Section = styled.section`
  width: 100%;
`;

export const SectionInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 28px;
`;

export const SectionTitle = styled.h2`
  font-size: 34px;
  font-weight: 900;
  color: ${colors.textPrimary};
  letter-spacing: -0.3px;
  text-align: center;
`;

export const SectionSubTitle = styled.p`
  margin: 12px auto 0;
  color: ${colors.textSecondary};
  font-size: 15.5px;
  line-height: 1.78;
  text-align: center;
  max-width: 620px;
`;

export const CardRow = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const InfoCard = styled.div`
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 8px 28px rgba(66,168,161,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-6px); box-shadow: 0 20px 44px rgba(66,168,161,0.16); }
`;

export const CardIconCircle = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(66,168,161,0.12), rgba(138,224,219,0.24));
  border: 2px solid rgba(66,168,161,0.20);
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  font-size: 32px;
`;

export const CardImgCircle = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  border: 3px solid rgba(66,168,161,0.28);
  box-shadow: 0 6px 20px rgba(66,168,161,0.18);
  margin: 0 auto 18px;
  display: block;
`;

export const CardTitle = styled.div`
  font-weight: 900;
  font-size: 15px;
  color: ${colors.textPrimary};
  margin-bottom: 10px;
`;

export const CardText = styled.p`
  color: ${colors.textSecondary};
  font-size: 13.5px;
  line-height: 1.78;
`;

/* TEAL CTA SECTION */
export const TealSection = styled.section`
  width: 100%;
  background: linear-gradient(135deg, #3a9e97 0%, ${colors.secondary} 60%, ${colors.accent} 100%);
  padding: 80px 28px;
  text-align: center;
`;

export const TealTitle = styled.h2`
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.3px;
  max-width: 680px;
  margin: 0 auto;
  text-shadow: 0 2px 12px rgba(0,0,0,0.12);
`;

export const TealText = styled.p`
  color: rgba(255,255,255,0.88);
  font-size: 16px;
  line-height: 1.78;
  max-width: 560px;
  margin: 16px auto 0;
`;

export const TealCTA = styled.button`
  margin-top: 34px;
  padding: 16px 38px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  background: #fff;
  color: ${colors.primary};
  border: none;
  box-shadow: 0 10px 32px rgba(0,0,0,0.16);
  transition: all 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 18px 42px rgba(0,0,0,0.22); }
`;

/* LIGHT SPLIT SECTION */
export const LightSection = styled.section`
  width: 100%;
  background: #f4fbfa;
  border-top: 1px solid rgba(66,168,161,0.10);
  border-bottom: 1px solid rgba(66,168,161,0.10);
`;

export const Split = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

export const SplitBox = styled.div``;

export const SplitBoxTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: ${colors.textPrimary};
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SplitBoxIcon = styled.span`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

export const List = styled.ul`
  padding-left: 20px;
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.95;
`;

export const ListItem = styled.li`margin-bottom: 4px;`;

export const SmallNote = styled.p`
  font-size: 13px;
  line-height: 1.72;
  color: ${colors.textSecondary};
  border-top: 1px solid rgba(66,168,161,0.14);
  padding-top: 14px;
  margin-top: 14px;
`;

export const CardTextSplit = styled.p`
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.80;
  margin-top: 6px;
`;

/* DARK BOTTOM SECTION */
export const DarkSection = styled.section`
  width: 100%;
  min-height: 380px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const DarkBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
`;

export const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(8, 28, 26, 0.80);
`;

export const DarkContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1240px;
  margin: 0 auto;
  padding: 80px 28px;
  width: 100%;
  text-align: center;
`;

export const DarkTitle = styled.h2`
  font-size: 42px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.5px;
  max-width: 680px;
  margin: 0 auto;
  span { color: ${colors.accent}; }
  @media (max-width: 640px) { font-size: 28px; }
`;

export const DarkText = styled.p`
  color: rgba(255,255,255,0.80);
  font-size: 16px;
  line-height: 1.78;
  max-width: 520px;
  margin: 18px auto 0;
`;

export const DarkCTA = styled.button`
  margin-top: 34px;
  padding: 15px 34px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 14.5px;
  cursor: pointer;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: #fff;
  border: none;
  box-shadow: 0 10px 32px rgba(66,168,161,0.40);
  transition: all 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 18px 44px rgba(66,168,161,0.52); }
`;

/* FOOTER */
export const Footer = styled.footer`background: ${colors.footerBg};`;

export const FooterInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 28px;
  color: ${colors.footerText};
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const FooterLeft = styled.div`font-weight: 600;`;
export const FooterRight = styled.div`font-weight: 500;`;