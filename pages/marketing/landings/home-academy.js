// import node module libraries
import { Fragment } from 'react';

// import sub components 
import { HeroAcademy, AcademyStats, MostPopularCourses, BecomeAnInstructor, WhatCustomersSay } from 'sub-components';

// import your layout to override default layout 
import AcademyLayout from 'layouts/marketing/AcademyLayout';

const HomeAcademy = () => {
    return (
        <Fragment>

            {/* Hero Academy banner section */}
            <HeroAcademy />

            {/* Various acedamy statistics  */}
            <AcademyStats />

            {/* Most Popular Courses */}
            <MostPopularCourses />

            {/* Become an instructor */}
            <BecomeAnInstructor />

            {/* What our customers say */}
            <WhatCustomersSay />

        </Fragment>
    )
}


HomeAcademy.Layout = AcademyLayout;

export default HomeAcademy