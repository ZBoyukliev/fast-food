import styles from './Footer.module.css'

const Footer = () => {
  return (
    <section className={styles[`footer`]}>
      <div className={styles[`footer-shell`]}>
        <div className={styles[`footer-text`]}>
          <p>2023©Aladinfoods.Всички права запазени</p>
          <p>Снимките са с илюстративна цел</p>
        </div>

      </div>
    </section>
  );
};

export default Footer;