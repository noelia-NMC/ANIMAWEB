import { useNavigate } from 'react-router-dom';
import animaLogo from '../assets/ANIMA.png';

import {
  GlobalStyle, Page,
  Navbar, NavInner, NavLeft, LogoWrap, LogoImg, BrandBlock, BrandName, BrandTagline,
  NavRight, NavBtnPrimary, NavBtnSecondary,
  HeroSection, HeroBg, HeroOverlayGrad, HeroContent, HeroKicker,
  HeroTitle, HeroText, HeroActions, PrimaryCTA, MiniBadges, Badge,
  Section, SectionInner, SectionTitle, SectionSubTitle,
  CardRow, InfoCard, CardIconCircle, CardImgCircle, CardTitle, CardText,
  TealSection, TealTitle, TealText, TealCTA,
  LightSection, Split, SplitBox, SplitBoxTitle, SplitBoxIcon,
  List, ListItem, SmallNote, CardTextSplit,
  DarkSection, DarkBg, DarkOverlay, DarkContent, DarkTitle, DarkText, DarkCTA,
  Footer, FooterInner, FooterLeft, FooterRight,
} from '../styles/welcomeStyled';

const IMG = {
  hero: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1800&q=85',
  dogcat: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1800&q=85',
  // Cards — perro grande con collar, perro/gato, mapa con gato, veterinaria
  cardCollar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&h=400&q=85',
  cardApp: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&h=400&q=85',
  cardRescue: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&h=400&q=85',
  cardVet: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=400&h=400&q=85',
};

export default function WelcomeAnima() {
  const navigate = useNavigate();

  return (
    <>
      <GlobalStyle />
      <Page>

        {/* ── NAVBAR ── */}
        <Navbar>
          <NavInner>
            <NavLeft>
              <LogoWrap>
                <LogoImg src={animaLogo} alt="ANIMA logo" />
              </LogoWrap>
              <BrandBlock>
                <BrandName>ANIMA</BrandName>
                <BrandTagline>
                  Sistema híbrido para el monitoreo del bienestar animal y apoyo en la gestión de animales callejeros</BrandTagline>
              </BrandBlock>
            </NavLeft>

            <NavRight>
              <NavBtnSecondary onClick={() => navigate('/onboarding')}>
                Registrar clínica
              </NavBtnSecondary>
              <NavBtnPrimary onClick={() => navigate('/login')}>
                Iniciar sesión
              </NavBtnPrimary>
            </NavRight>
          </NavInner>
        </Navbar>

        {/* ── HERO ── */}
        <HeroSection>
          <HeroBg src={IMG.hero} alt="Perritos felices" />
          <HeroOverlayGrad />
          <HeroContent>
            <HeroKicker>🐾 Bienvenidos a ANIMA</HeroKicker>

            <HeroTitle>
              Sistema híbrido de <span>apoyo</span> para el bienestar animal
            </HeroTitle>

            <HeroText>
              ANIMA es una herramienta que combina un <b>collar inteligente</b> (para perros de gran tamaño),
              una <b>aplicación móvil</b> para dueños, mapas de comunidad para <b>reportes</b> de animalitos en calle
              y una <b>plataforma web</b> para clínicas veterinarias.
              Su objetivo es <b>facilitar</b> el seguimiento, la comunicación y la organización de información.
            </HeroText>

            <MiniBadges>
              <Badge>🐶 Collar inteligente</Badge>
              <Badge>📱 Aplicación móvil</Badge>
              <Badge>📍 Mapas comunitarios</Badge>
              <Badge>🧑‍⚕️ Plataforma web clínicas</Badge>
            </MiniBadges>

            <HeroActions>
              <PrimaryCTA onClick={() => navigate('/login')}>
                Ingresar al sistema WEB
              </PrimaryCTA>
            </HeroActions>
          </HeroContent>
        </HeroSection>

        {/* ── 4 CARDS ── */}
        <Section>
          <SectionInner>
            <SectionTitle>¿Qué ofrece ANIMA?</SectionTitle>
            <SectionSubTitle>
              ANIMA no reemplaza al veterinario ni garantiza resultados: es una <b> herramienta de apoyo </b>
               para visualizar información, orientar decisiones y facilitar la comunicación.
            </SectionSubTitle>

            <CardRow>
              <InfoCard>
                <CardImgCircle
                  src={IMG.cardCollar}
                  alt="Perro grande con collar"
                />
                <CardTitle>Collar inteligente</CardTitle>
                <CardText>
                  Diseñado para perros de gran tamaño. Permite <b>registrar</b> ciertos datos (según sensores)
                  para que el dueño pueda <b>observar tendencias</b> y recibir apoyo/orientación.
                </CardText>
              </InfoCard>

              <InfoCard>
                <CardImgCircle
                  src={IMG.cardApp}
                  alt="Perrito y gatito felices"
                />
                <CardTitle>Aplicación móvil</CardTitle>
                <CardText>
                  Los dueños visualizan datos y reportes de forma práctica (tablas/gráficos) y reciben
                  <b> notificaciones o alertas</b>. También sirve para dueños de gatos y perros (sin función de collar) visulizando otro tipo de información y apoyo.
                </CardText>
              </InfoCard>

              <InfoCard>
                <CardImgCircle
                  src={IMG.cardRescue}
                  alt="Gatito callejero"
                />
                <CardTitle>Mapas comunitarios</CardTitle>
                <CardText>
                  Permite <b>reportar</b> la ubicación de un animalito callejero en riesgo. Otras personas pueden ver
                  la publicación y decidir si pueden ayudar. ANIMA <b>no garantiza rescate</b>: solo facilita la conexión
                  y la visibilidad del caso.
                </CardText>
              </InfoCard>

              <InfoCard>
                <CardImgCircle
                  src={IMG.cardVet}
                  alt="Veterinaria atendiendo mascota"
                />
                <CardTitle>Plataforma web clínicas</CardTitle>
                <CardText>
                  Las clínicas gestionan historiales, roles, inventario, reportes, facturación y entre otras funcionalidades.
                  También pueden atender solicitudes de <b> tele-veterinaria </b> enviadas por dueños desde la aplicación móvil.
                </CardText>
              </InfoCard>
            </CardRow>
          </SectionInner>
        </Section>

        {/* ── TEAL CTA ── */}
        <TealSection>
          <TealTitle>
            Una herramienta más para apoyar el cuidado animal 🐾
          </TealTitle>
          <TealText>
            ANIMA busca facilitar el seguimiento de información, la organización y la comunicación
            entre dueños, clínicas y comunidad. No reemplaza atención veterinaria ni servicios de rescate.
          </TealText>
          <TealCTA onClick={() => navigate('/onboarding')}>
            Registrar mi clínica veterinaria →
          </TealCTA>
        </TealSection>

        {/* ── SPLIT INFO ── */}
        <LightSection>
          <Split>
            <SplitBox>
              <SplitBoxTitle>
                <SplitBoxIcon>📍</SplitBoxIcon> Mapas dentro de la aplicación
              </SplitBoxTitle>

              <CardTextSplit>
                La aplicación incluye mapas para <b>facilitar</b> apoyo comunitario y encontrar ayuda cercana:
              </CardTextSplit>

              <List style={{ marginTop: 12 }}>
                <ListItem>
                  <strong>Mapa comunitario:</strong> una persona puede publicar un caso (animalito en riesgo) con ubicación y descripción.
                  Otros usuarios pueden ver el reporte y, si pueden, coordinar ayuda. <b>ANIMA no garantiza</b> que alguien acepte o pueda asistir.
                </ListItem>

                <ListItem>
                  <strong>Mapa de veterinarias/refugios:</strong> muestra opciones cercanas para facilitar contacto y ubicación
                  cuando se necesita atención o apoyo.
                </ListItem>
              </List>

              <SplitBoxTitle style={{ marginTop: 32 }}>
                <SplitBoxIcon>📹</SplitBoxIcon> Tele-veterinaria (apoyo remoto)
              </SplitBoxTitle>

              <CardTextSplit>
                Si ya tienes una clínica registrada en ANIMA, puedes enviar una solicitud desde la app describiendo lo que observas.
                La clínica recibe la solicitud en la web, decide si la acepta y puede enviar un enlace de videollamada (Meet) para orientar la consulta.
              </CardTextSplit>
            </SplitBox>

            <SplitBox>
              <SplitBoxTitle>
                <SplitBoxIcon>🎯</SplitBoxIcon> ¿Para quién es ANIMA?
              </SplitBoxTitle>

              <List>
                <ListItem>
                  <strong>Dueños de perros grandes:</strong> registro/visualización de datos del collar + reportes y mensajes de apoyo.
                </ListItem>
                <ListItem>
                  <strong>Dueños de gatos y perros pequeños:</strong> acceso a mapas, veterinarias/refugios cercanos y tele-veterinaria (sin collar).
                </ListItem>
                <ListItem>
                  <strong>Personas de la comunidad:</strong> publicación/visualización de reportes de animalitos en calle para coordinar ayuda.
                </ListItem>
                <ListItem>
                  <strong>Clínicas veterinarias:</strong> gestión de pacientes y servicios, y atención remota según criterio profesional.
                </ListItem>
              </List>

              <SmallNote>
                <strong>Importante:</strong> El collar NO envía datos directamente a la plataforma web de la clínica.
                Los datos se visualizan en la aplicación del dueño. Si el dueño desea compartirlos con su veterinario,
                puede enviar reportes (tablas/gráficos/PDF) desde la app.
                <br /><br />
                <strong>ANIMA no diagnostica ni previene enfermedades:</strong> ayuda a registrar, visualizar y orientar,
                pero la evaluación final siempre debe ser realizada por un profesional veterinario.
              </SmallNote>
            </SplitBox>
          </Split>
        </LightSection>

        {/* ── DARK BOTTOM ── */}
        <DarkSection>
          <DarkBg src={IMG.dogcat} alt="Perro y gato juntos" />
          <DarkOverlay />
          <DarkContent>
            <DarkTitle>
              Una plataforma para <span>apoyar</span> a dueños, clínicas y comunidad
            </DarkTitle>
            <DarkText>
              ANIMA facilita información y conexión: dueños con reportes y orientación,
              clínicas con gestión y tele-consulta, y comunidad con mapas de reportes callejeros.
              No reemplaza la atención veterinaria ni garantiza rescates.
            </DarkText>
            <DarkCTA onClick={() => navigate('/login')}>
              Entrar al sistema →
            </DarkCTA>
          </DarkContent>
        </DarkSection>

        {/* ── FOOTER ── */}
        <Footer>
          <FooterInner>
            <FooterLeft>
              © {new Date().getFullYear()} ANIMA — Herramienta de apoyo para el bienestar animal
            </FooterLeft>
            <FooterRight>
              Plataforma para clínicas veterinarias 🐾
            </FooterRight>
          </FooterInner>
        </Footer>

      </Page>
    </>
  );
}