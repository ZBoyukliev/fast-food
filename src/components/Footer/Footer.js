import styles from './Footer.module.css';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <section className={styles['footer']}>
      <div className={styles['footer-shell']}>
        <div className={styles['footer-text']}>
          <p>2023©Aladinfoods.Всички права запазени</p>
          <p>Снимките са с илюстративна цел</p>
        </div>
      </div>
      <div className={styles['soc-media']}>
        <ul className={styles['soc-media-ul']}>
          <li><Link to='https://www.facebook.com/AladinFoods' title='facebook'><i className="fa-brands fa-facebook"></i></Link></li>
          <li><Link to='https://www.tiktok.com/@aladin_foods' title='tiktok'><i className="fa-brands fa-tiktok"></i></Link></li>
          <li><Link to='https://www.instagram.com/aladinfoods' title='instagram'><i className="fa-brands fa-instagram"></i></Link></li>
          <li><Link to='https://www.youtube.com/user/AladinFoods' title='youtube'><i className="fa-brands fa-youtube"></i></Link></li>
        </ul>
      </div>
    </section>
  );
};

export default Footer;