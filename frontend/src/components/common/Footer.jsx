import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Decants del Puerto</h3>
            <p>Las mejores fragancias en pequeñas muestras</p>
          </div>

          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/terminos">Términos y Condiciones</a></li>
              <li><a href="/privacidad">Política de Privacidad</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <p>Email: decantsdelpuerto@gmail.com</p>
            <p>Teléfono: +56 9 7317 8412</p>
            <p className="social-link">
              <a 
                href="https://instagram.com/decantsdelpuerto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-link"
              >
                Instagram: @decantsdelpuerto
              </a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Decants del Puerto. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
