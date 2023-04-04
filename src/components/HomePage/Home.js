import Slideshow from '../Slideshow/Slideshow';
import Food from './Food/Food';
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
};

export default Home;