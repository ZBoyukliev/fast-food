import Slideshow from '../Slideshow/Slideshow';
import Food from './Food/Food';
import styles from './Home.module.css'
import News from './News/News';
import Offers from './Offers/Offers';
import Thumbs from './Thumbs/Thumbs';

const Home = () => {
    return (
        <>
            <Food />
            <Thumbs />
            <Offers />
            <Slideshow />
            <News />
        </>
    );
}

export default Home;