import React from 'react';
import Banner from '../../components/Banner/Banner';
import Tags from '../../components/Tags/Tags';
import Posts from '../../components/Posts/Posts';
import Announcements from '../../components/Announcements/Announcements';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Tags></Tags>
            <Announcements></Announcements>
            <Posts></Posts>
        </div>
    );
};

export default Home;