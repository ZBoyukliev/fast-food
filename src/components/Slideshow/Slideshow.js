import { Slide } from 'react-slideshow-image';
import styles from './Slideshow.module.css';
import 'react-slideshow-image/dist/styles.css';

const slideImages = [
    {
        url: 'images/slide-picture-burger.jpg',
    },
    {
        url: 'images/slide-picture-chicken.jpg',
    },
    {
        url: 'images/slide-picture-pizza.jpg',
    },

];

const Slideshow = () => {
    return (
        <section className={styles['slide-container']}>
            <div className={styles['offers-title']}>
                <h3>НОВИ ПРЕДЛОЖЕНИЯ</h3>
            </div>
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div className="each-slide" key={index}>
                        <div style={{ 'backgroundImage': `url(${slideImage.url})` }}>
                        <div className='each-slide1'>
                          BMB
                        </div>
                            <span>{slideImage.caption}</span>
                        </div>
                    </div>
                ))}
            </Slide>
        </section>
    );
};

export default Slideshow;
